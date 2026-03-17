<?php

namespace App\Modules\Room\Repositories;

use App\Modules\Room\Models\Room;
use App\Modules\Room\Models\RoomType;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RoomRepository
{
    public function __construct(
        private readonly Room $room,
        private readonly RoomType $roomType,
    ) {}

    public function getAllRooms(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->room->with('roomType');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['room_type_id'])) {
            $query->where('room_type_id', $filters['room_type_id']);
        }
        if (!empty($filters['floor'])) {
            $query->where('floor', $filters['floor']);
        }
        if (isset($filters['is_clean'])) {
            $query->where('is_clean', $filters['is_clean']);
        }

        return $query->orderBy('number')->paginate($perPage);
    }

    public function findRoom(int $id): ?Room
    {
        return $this->room->with('roomType')->find($id);
    }

    public function createRoom(array $data): Room
    {
        return $this->room->create($data);
    }

    public function updateRoom(Room $room, array $data): Room
    {
        $room->update($data);
        return $room->fresh('roomType');
    }

    public function deleteRoom(Room $room): bool
    {
        return $room->delete();
    }

    public function getAvailableRooms(\DateTimeInterface $checkIn, \DateTimeInterface $checkOut, ?int $roomTypeId = null): Collection
    {
        $query = $this->room->with('roomType')
            ->where('status', 'available')
            ->where('is_active', true)
            ->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
                $q->whereIn('status', ['confirmed', 'checked_in'])
                    ->where(function ($q2) use ($checkIn, $checkOut) {
                        $q2->whereBetween('check_in_date', [$checkIn, $checkOut])
                            ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                            ->orWhere(function ($q3) use ($checkIn, $checkOut) {
                                $q3->where('check_in_date', '<=', $checkIn)
                                    ->where('check_out_date', '>=', $checkOut);
                            });
                    });
            });

        if ($roomTypeId) {
            $query->where('room_type_id', $roomTypeId);
        }

        return $query->orderBy('number')->get();
    }

    public function getAllRoomTypes(int $perPage = 15): LengthAwarePaginator
    {
        return $this->roomType
            ->withCount('rooms')
            ->orderBy('sort_order')
            ->paginate($perPage);
    }

    public function findRoomType(int $id): ?RoomType
    {
        return $this->roomType->with('rooms')->find($id);
    }

    public function createRoomType(array $data): RoomType
    {
        return $this->roomType->create($data);
    }

    public function updateRoomType(RoomType $roomType, array $data): RoomType
    {
        $roomType->update($data);
        return $roomType->fresh();
    }
}
