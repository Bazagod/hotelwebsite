<?php

namespace App\Modules\Reservation\Repositories;

use App\Modules\Reservation\Models\Guest;
use App\Modules\Reservation\Models\Reservation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReservationRepository
{
    public function __construct(
        private readonly Reservation $reservation,
        private readonly Guest $guest,
    ) {}

    public function getAllReservations(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->reservation->with(['guest', 'room.roomType', 'roomType']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('check_in_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('check_out_date', '<=', $filters['date_to']);
        }
        if (!empty($filters['guest_id'])) {
            $query->where('guest_id', $filters['guest_id']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('confirmation_number', 'like', "%{$search}%")
                    ->orWhereHas('guest', function ($gq) use ($search) {
                        $gq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderByDesc('check_in_date')->paginate($perPage);
    }

    public function findReservation(int $id): ?Reservation
    {
        return $this->reservation->with(['guest', 'room.roomType', 'roomType', 'extras'])->find($id);
    }

    public function findByConfirmation(string $number): ?Reservation
    {
        return $this->reservation
            ->with(['guest', 'room.roomType', 'roomType', 'extras'])
            ->where('confirmation_number', $number)
            ->first();
    }

    public function createReservation(array $data): Reservation
    {
        if (!auth()->check() && !empty($data['tenant_id'])) {
            return $this->reservation->withoutGlobalScope('tenant')->create($data);
        }
        return $this->reservation->create($data);
    }

    public function updateReservation(Reservation $reservation, array $data): Reservation
    {
        $reservation->update($data);
        return $reservation->fresh(['guest', 'room.roomType', 'roomType', 'extras']);
    }

    public function getTodayArrivals(): LengthAwarePaginator
    {
        return $this->reservation
            ->with(['guest', 'room.roomType'])
            ->where('check_in_date', today())
            ->whereIn('status', ['confirmed', 'pending'])
            ->orderBy('created_at')
            ->paginate(20);
    }

    public function getTodayDepartures(): LengthAwarePaginator
    {
        return $this->reservation
            ->with(['guest', 'room.roomType'])
            ->where('check_out_date', today())
            ->where('status', 'checked_in')
            ->orderBy('created_at')
            ->paginate(20);
    }

    public function findOrCreateGuest(array $data): Guest
    {
        if (!empty($data['email'])) {
            $query = $this->guest->where('email', $data['email']);
            if (!empty($data['tenant_id'])) {
                $query->withoutGlobalScope('tenant')->where('tenant_id', $data['tenant_id']);
            }
            $guest = $query->first();
            if ($guest) {
                $guest->update($data);
                return $guest;
            }
        }
        return $this->guest->withoutGlobalScope('tenant')->create($data);
    }

    public function getGuestReservations(int $guestId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->reservation
            ->with(['room.roomType', 'roomType'])
            ->where('guest_id', $guestId)
            ->orderByDesc('check_in_date')
            ->paginate($perPage);
    }
}
