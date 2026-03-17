<?php

namespace App\Modules\Reservation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reservation\Requests\StoreReservationRequest;
use App\Modules\Reservation\Resources\ReservationResource;
use App\Modules\Reservation\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use App\Modules\Room\Models\RoomType;
use App\Modules\Tenant\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return ReservationResource::collection(
            $this->service->listReservations(
                $request->only(['status', 'date_from', 'date_to', 'guest_id', 'search']),
                $request->integer('per_page', 15),
            )
        );
    }

    public function show(int $id): JsonResponse
    {
        $reservation = $this->service->getReservation($id);
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found.'], 404);
        }

        return response()->json(new ReservationResource($reservation));
    }

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $this->service->createReservation($request->validated());
        return response()->json(new ReservationResource($reservation), 201);
    }

    public function confirm(int $id): JsonResponse
    {
        $reservation = $this->service->confirmReservation($id);
        if (!$reservation) {
            return response()->json(['message' => 'Cannot confirm this reservation.'], 422);
        }

        return response()->json(new ReservationResource($reservation));
    }

    public function checkIn(Request $request, int $id): JsonResponse
    {
        $request->validate(['room_id' => 'nullable|exists:rooms,id']);

        $reservation = $this->service->checkIn($id, $request->room_id);
        if (!$reservation) {
            return response()->json(['message' => 'Cannot check in this reservation.'], 422);
        }

        return response()->json(new ReservationResource($reservation));
    }

    public function checkOut(int $id): JsonResponse
    {
        $reservation = $this->service->checkOut($id);
        if (!$reservation) {
            return response()->json(['message' => 'Cannot check out this reservation.'], 422);
        }

        return response()->json(new ReservationResource($reservation));
    }

    public function cancel(int $id): JsonResponse
    {
        $reservation = $this->service->cancelReservation($id);
        if (!$reservation) {
            return response()->json(['message' => 'Cannot cancel this reservation.'], 422);
        }

        return response()->json(new ReservationResource($reservation));
    }

    public function arrivals(): AnonymousResourceCollection
    {
        return ReservationResource::collection($this->service->todayArrivals());
    }

    public function departures(): AnonymousResourceCollection
    {
        return ReservationResource::collection($this->service->todayDepartures());
    }

    public function publicBooking(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_first_name' => 'required|string|max:100',
            'guest_last_name' => 'required|string|max:100',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:30',
            'room_type_name' => 'required|string',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'adults' => 'required|integer|min:1|max:10',
            'special_requests' => 'nullable|string|max:1000',
            'source' => 'nullable|string|in:website,ota,direct',
        ]);

        $tenant = Tenant::where('slug', 'bazagod-hotel')->first();
        if (!$tenant) {
            return response()->json(['message' => 'Hotel not found.'], 404);
        }

        $roomType = RoomType::where('tenant_id', $tenant->id)
            ->where('name', $validated['room_type_name'])
            ->first();

        if (!$roomType) {
            return response()->json(['message' => 'Room type not found.'], 422);
        }

        $data = [
            'guest_first_name' => $validated['guest_first_name'],
            'guest_last_name' => $validated['guest_last_name'],
            'guest_email' => $validated['guest_email'],
            'guest_phone' => $validated['guest_phone'] ?? null,
            'room_type_id' => $roomType->id,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'adults' => $validated['adults'],
            'source' => $validated['source'] ?? 'website',
            'special_requests' => $validated['special_requests'] ?? null,
        ];

        $reservation = $this->service->createPublicReservation($data, $tenant);

        return response()->json([
            'message' => 'Reservation created successfully.',
            'data' => new ReservationResource($reservation),
        ], 201);
    }
}
