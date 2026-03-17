<?php

namespace App\Modules\Reservation\Services;

use App\Enums\ReservationStatus;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Reservation\Repositories\ReservationRepository;
use App\Modules\Room\Services\RoomService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Modules\Tenant\Models\Tenant;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepository $repository,
        private readonly RoomService $roomService,
    ) {}

    public function listReservations(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAllReservations($filters, $perPage);
    }

    public function getReservation(int $id): ?Reservation
    {
        return $this->repository->findReservation($id);
    }

    public function findByConfirmation(string $number): ?Reservation
    {
        return $this->repository->findByConfirmation($number);
    }

    public function createReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $guest = $this->repository->findOrCreateGuest([
                'tenant_id' => $data['tenant_id'] ?? auth()->user()->tenant_id,
                'first_name' => $data['guest_first_name'],
                'last_name' => $data['guest_last_name'],
                'email' => $data['guest_email'] ?? null,
                'phone' => $data['guest_phone'] ?? null,
            ]);

            $checkIn = new \DateTime($data['check_in_date']);
            $checkOut = new \DateTime($data['check_out_date']);
            $nights = $checkIn->diff($checkOut)->days;

            if ($nights < 1) {
                throw new InvalidArgumentException('Check-out must be after check-in.');
            }

            $roomType = $this->roomService->getRoomType($data['room_type_id']);
            if (!$roomType) {
                throw new InvalidArgumentException('Invalid room type.');
            }

            $ratePerNight = $data['rate_per_night'] ?? (float) $roomType->base_price;
            $subtotal = $ratePerNight * $nights;
            $discount = $data['discount_amount'] ?? 0;
            $taxRate = 0.18; // configurable per tenant
            $taxAmount = ($subtotal - $discount) * $taxRate;
            $totalAmount = $subtotal - $discount + $taxAmount;

            $reservation = $this->repository->createReservation([
                'tenant_id' => $data['tenant_id'] ?? auth()->user()->tenant_id,
                'confirmation_number' => Reservation::generateConfirmationNumber(),
                'guest_id' => $guest->id,
                'room_id' => $data['room_id'] ?? null,
                'room_type_id' => $data['room_type_id'],
                'check_in_date' => $data['check_in_date'],
                'check_out_date' => $data['check_out_date'],
                'adults' => $data['adults'] ?? 1,
                'children' => $data['children'] ?? 0,
                'rate_per_night' => $ratePerNight,
                'total_amount' => $totalAmount,
                'discount_amount' => $discount,
                'tax_amount' => $taxAmount,
                'status' => ReservationStatus::PENDING->value,
                'payment_status' => 'pending',
                'source' => $data['source'] ?? 'direct',
                'special_requests' => $data['special_requests'] ?? null,
                'created_by' => auth()->id(),
            ]);

            return $reservation->load(['guest', 'room.roomType', 'roomType']);
        });
    }

    public function confirmReservation(int $id): ?Reservation
    {
        $reservation = $this->repository->findReservation($id);
        if (!$reservation || $reservation->status !== ReservationStatus::PENDING) {
            return null;
        }

        return $this->repository->updateReservation($reservation, [
            'status' => ReservationStatus::CONFIRMED->value,
        ]);
    }

    public function checkIn(int $id, ?int $roomId = null): ?Reservation
    {
        $reservation = $this->repository->findReservation($id);
        if (!$reservation) {
            return null;
        }

        $updates = [
            'status' => ReservationStatus::CHECKED_IN->value,
            'actual_check_in' => now(),
        ];

        if ($roomId) {
            $updates['room_id'] = $roomId;
        }

        $room = $reservation->room;
        if ($room) {
            $room->update(['status' => 'occupied']);
        }

        return $this->repository->updateReservation($reservation, $updates);
    }

    public function checkOut(int $id): ?Reservation
    {
        $reservation = $this->repository->findReservation($id);
        if (!$reservation || $reservation->status !== ReservationStatus::CHECKED_IN) {
            return null;
        }

        $room = $reservation->room;
        if ($room) {
            $room->update(['status' => 'available', 'is_clean' => false]);
        }

        $guest = $reservation->guest;
        if ($guest) {
            $guest->increment('total_stays');
            $guest->increment('total_spent', (float) $reservation->total_amount);
        }

        return $this->repository->updateReservation($reservation, [
            'status' => ReservationStatus::CHECKED_OUT->value,
            'actual_check_out' => now(),
        ]);
    }

    public function cancelReservation(int $id): ?Reservation
    {
        $reservation = $this->repository->findReservation($id);
        if (!$reservation) {
            return null;
        }

        if (in_array($reservation->status, [ReservationStatus::CHECKED_IN, ReservationStatus::CHECKED_OUT])) {
            return null;
        }

        if ($reservation->room) {
            $reservation->room->update(['status' => 'available']);
        }

        return $this->repository->updateReservation($reservation, [
            'status' => ReservationStatus::CANCELLED->value,
        ]);
    }

    public function todayArrivals(): LengthAwarePaginator
    {
        return $this->repository->getTodayArrivals();
    }

    public function todayDepartures(): LengthAwarePaginator
    {
        return $this->repository->getTodayDepartures();
    }

    public function createPublicReservation(array $data, Tenant $tenant): Reservation
    {
        return DB::transaction(function () use ($data, $tenant) {
            $guest = $this->repository->findOrCreateGuest([
                'tenant_id' => $tenant->id,
                'first_name' => $data['guest_first_name'],
                'last_name' => $data['guest_last_name'],
                'email' => $data['guest_email'] ?? null,
                'phone' => $data['guest_phone'] ?? null,
            ]);

            $checkIn = new \DateTime($data['check_in_date']);
            $checkOut = new \DateTime($data['check_out_date']);
            $nights = $checkIn->diff($checkOut)->days;

            if ($nights < 1) {
                throw new InvalidArgumentException('Check-out must be after check-in.');
            }

            $roomType = $this->roomService->getRoomType($data['room_type_id']);
            if (!$roomType) {
                throw new InvalidArgumentException('Invalid room type.');
            }

            $ratePerNight = (float) $roomType->base_price;
            $subtotal = $ratePerNight * $nights;
            $taxRate = 0.18;
            $taxAmount = $subtotal * $taxRate;
            $totalAmount = $subtotal + $taxAmount;

            $reservation = $this->repository->createReservation([
                'tenant_id' => $tenant->id,
                'confirmation_number' => Reservation::generateConfirmationNumber(),
                'guest_id' => $guest->id,
                'room_type_id' => $data['room_type_id'],
                'check_in_date' => $data['check_in_date'],
                'check_out_date' => $data['check_out_date'],
                'adults' => $data['adults'] ?? 1,
                'children' => 0,
                'rate_per_night' => $ratePerNight,
                'total_amount' => $totalAmount,
                'discount_amount' => 0,
                'tax_amount' => $taxAmount,
                'status' => ReservationStatus::PENDING->value,
                'payment_status' => 'pending',
                'source' => $data['source'] ?? 'website',
                'special_requests' => $data['special_requests'] ?? null,
                'created_by' => null,
            ]);

            return $reservation->load(['guest', 'room.roomType', 'roomType']);
        });
    }
}
