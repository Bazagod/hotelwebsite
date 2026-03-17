<?php

namespace App\Modules\Room\Services;

use App\Modules\Room\Models\Room;
use App\Modules\Room\Models\RoomType;
use App\Modules\Room\Repositories\RoomRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class RoomService
{
    public function __construct(
        private readonly RoomRepository $repository,
    ) {}

    public function listRooms(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAllRooms($filters, $perPage);
    }

    public function getRoom(int $id): ?Room
    {
        return $this->repository->findRoom($id);
    }

    public function createRoom(array $data): Room
    {
        return $this->repository->createRoom($data);
    }

    public function updateRoom(int $id, array $data): ?Room
    {
        $room = $this->repository->findRoom($id);
        if (!$room) {
            return null;
        }
        return $this->repository->updateRoom($room, $data);
    }

    public function deleteRoom(int $id): bool
    {
        $room = $this->repository->findRoom($id);
        if (!$room) {
            return false;
        }
        return $this->repository->deleteRoom($room);
    }

    public function checkAvailability(\DateTimeInterface $checkIn, \DateTimeInterface $checkOut, ?int $roomTypeId = null): Collection
    {
        return $this->repository->getAvailableRooms($checkIn, $checkOut, $roomTypeId);
    }

    public function listRoomTypes(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAllRoomTypes($perPage);
    }

    public function getRoomType(int $id): ?RoomType
    {
        return $this->repository->findRoomType($id);
    }

    public function createRoomType(array $data): RoomType
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return $this->repository->createRoomType($data);
    }

    public function updateRoomType(int $id, array $data): ?RoomType
    {
        $roomType = $this->repository->findRoomType($id);
        if (!$roomType) {
            return null;
        }
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        return $this->repository->updateRoomType($roomType, $data);
    }
}
