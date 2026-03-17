<?php

namespace App\Modules\Room\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Room\Requests\StoreRoomRequest;
use App\Modules\Room\Resources\RoomResource;
use App\Modules\Room\Services\RoomService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoomController extends Controller
{
    public function __construct(
        private readonly RoomService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $rooms = $this->service->listRooms(
            $request->only(['status', 'room_type_id', 'floor', 'is_clean']),
            $request->integer('per_page', 15),
        );

        return RoomResource::collection($rooms);
    }

    public function show(int $id): JsonResponse
    {
        $room = $this->service->getRoom($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found.'], 404);
        }

        return response()->json(new RoomResource($room));
    }

    public function store(StoreRoomRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = $request->user()->tenant_id;

        $room = $this->service->createRoom($data);
        return response()->json(new RoomResource($room->load('roomType')), 201);
    }

    public function update(StoreRoomRequest $request, int $id): JsonResponse
    {
        $room = $this->service->updateRoom($id, $request->validated());
        if (!$room) {
            return response()->json(['message' => 'Room not found.'], 404);
        }

        return response()->json(new RoomResource($room));
    }

    public function destroy(int $id): JsonResponse
    {
        if (!$this->service->deleteRoom($id)) {
            return response()->json(['message' => 'Room not found.'], 404);
        }

        return response()->json(['message' => 'Room deleted.']);
    }

    public function availability(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'room_type_id' => 'nullable|exists:room_types,id',
        ]);

        $rooms = $this->service->checkAvailability(
            new \DateTime($request->check_in),
            new \DateTime($request->check_out),
            $request->room_type_id,
        );

        return RoomResource::collection($rooms);
    }
}
