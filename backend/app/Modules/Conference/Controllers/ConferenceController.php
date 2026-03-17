<?php

namespace App\Modules\Conference\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Conference\Models\ConferenceBooking;
use App\Modules\Conference\Models\ConferenceRoom;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConferenceController extends Controller
{
    public function rooms(): JsonResponse
    {
        $rooms = ConferenceRoom::withCount(['bookings' => function ($query) {
            $query->whereDate('date', Carbon::today());
        }])->get();

        return response()->json($rooms);
    }

    public function storeRoom(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'hourly_rate' => 'required|numeric|min:0',
            'daily_rate' => 'required|numeric|min:0',
            'equipment' => 'nullable|array',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;

        $room = ConferenceRoom::create($validated);

        return response()->json($room, 201);
    }

    public function updateRoom(Request $request, int $id): JsonResponse
    {
        $room = ConferenceRoom::find($id);

        if (!$room) {
            return response()->json(['message' => 'Conference room not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
            'hourly_rate' => 'sometimes|required|numeric|min:0',
            'daily_rate' => 'sometimes|required|numeric|min:0',
            'equipment' => 'nullable|array',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $room->update($validated);

        return response()->json($room);
    }

    public function bookings(Request $request): JsonResponse
    {
        $query = ConferenceBooking::with(['conferenceRoom', 'guest']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        $bookings = $query->orderByDesc('date')
            ->orderBy('start_time')
            ->paginate(15);

        return response()->json($bookings);
    }

    public function storeBooking(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'conference_room_id' => 'required|exists:conference_rooms,id',
            'guest_id' => 'nullable|exists:guests,id',
            'organizer_name' => 'required|string|max:255',
            'organizer_email' => 'nullable|email|max:255',
            'organizer_phone' => 'nullable|string|max:50',
            'event_name' => 'required|string|max:255',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'attendees' => 'required|integer|min:1',
            'requirements' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $room = ConferenceRoom::findOrFail($validated['conference_room_id']);

        $start = Carbon::createFromFormat('H:i', $validated['start_time']);
        $end = Carbon::createFromFormat('H:i', $validated['end_time']);
        $durationHours = $start->floatDiffInHours($end);

        $validated['total_amount'] = round($durationHours * (float) $room->hourly_rate, 2);
        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['status'] = $validated['status'] ?? 'pending';

        $booking = ConferenceBooking::create($validated);
        $booking->load(['conferenceRoom', 'guest']);

        return response()->json($booking, 201);
    }

    public function updateBookingStatus(Request $request, int $id): JsonResponse
    {
        $booking = ConferenceBooking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update($validated);
        $booking->load(['conferenceRoom', 'guest']);

        return response()->json($booking);
    }
}
