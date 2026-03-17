<?php

namespace App\Modules\Room\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Room\Models\RoomType;
use App\Modules\Room\Requests\StoreRoomTypeRequest;
use App\Modules\Room\Resources\RoomTypeResource;
use App\Modules\Room\Services\RoomService;
use App\Modules\Tenant\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoomTypeController extends Controller
{
    public function __construct(
        private readonly RoomService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return RoomTypeResource::collection(
            $this->service->listRoomTypes($request->integer('per_page', 15))
        );
    }

    public function show(int $id): JsonResponse
    {
        $type = $this->service->getRoomType($id);
        if (!$type) {
            return response()->json(['message' => 'Room type not found.'], 404);
        }

        return response()->json(new RoomTypeResource($type));
    }

    public function store(StoreRoomTypeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = $request->user()->tenant_id;

        $type = $this->service->createRoomType($data);
        return response()->json(new RoomTypeResource($type), 201);
    }

    public function update(StoreRoomTypeRequest $request, int $id): JsonResponse
    {
        $type = $this->service->updateRoomType($id, $request->validated());
        if (!$type) {
            return response()->json(['message' => 'Room type not found.'], 404);
        }

        return response()->json(new RoomTypeResource($type));
    }

    public function publicList(): AnonymousResourceCollection
    {
        $tenant = Tenant::where('slug', 'bazagod-hotel')->firstOrFail();
        $types = RoomType::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return RoomTypeResource::collection($types);
    }
}
