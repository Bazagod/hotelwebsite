<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Room\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $availableRooms = Room::where('status', 'available')->count();
        $maintenanceRooms = Room::where('status', 'maintenance')->count();

        $todayArrivals = Reservation::where('check_in_date', today())
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        $todayDepartures = Reservation::where('check_out_date', today())
            ->where('status', 'checked_in')
            ->count();

        $currentOccupancy = $totalRooms > 0
            ? round(($occupiedRooms / $totalRooms) * 100, 1)
            : 0;

        $monthlyRevenue = Reservation::where('status', 'checked_out')
            ->whereMonth('actual_check_out', now()->month)
            ->whereYear('actual_check_out', now()->year)
            ->sum('total_amount');

        $pendingReservations = Reservation::where('status', 'pending')->count();

        $recentReservations = Reservation::with(['guest', 'roomType'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'confirmation_number' => $r->confirmation_number,
                'guest_name' => $r->guest?->full_name,
                'room_type' => $r->roomType?->name,
                'check_in' => $r->check_in_date->toDateString(),
                'check_out' => $r->check_out_date->toDateString(),
                'status' => $r->status,
                'total' => (float) $r->total_amount,
            ]);

        $occupancyTrend = collect(range(6, 0, -1))->map(function ($daysAgo) use ($totalRooms) {
            $date = Carbon::today()->subDays($daysAgo);
            $occupiedOnDate = Reservation::whereIn('status', ['checked_in', 'checked_out'])
                ->where('check_in_date', '<=', $date)
                ->where('check_out_date', '>', $date)
                ->count();
            return [
                'date' => $date->format('M d'),
                'occupancy' => $totalRooms > 0 ? round(($occupiedOnDate / $totalRooms) * 100, 1) : 0,
                'occupied' => min($occupiedOnDate, $totalRooms),
            ];
        })->values();

        return response()->json([
            'rooms' => [
                'total' => $totalRooms,
                'occupied' => $occupiedRooms,
                'available' => $availableRooms,
                'maintenance' => $maintenanceRooms,
                'occupancy_rate' => $currentOccupancy,
            ],
            'reservations' => [
                'today_arrivals' => $todayArrivals,
                'today_departures' => $todayDepartures,
                'pending' => $pendingReservations,
            ],
            'revenue' => [
                'monthly' => (float) $monthlyRevenue,
            ],
            'occupancy_trend' => $occupancyTrend,
            'recent_reservations' => $recentReservations,
        ]);
    }
}
