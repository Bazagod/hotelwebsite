<?php

namespace App\Modules\Room\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'floor' => $this->floor,
            'status' => $this->status,
            'is_clean' => $this->is_clean,
            'is_active' => $this->is_active,
            'notes' => $this->notes,
            'room_type' => new RoomTypeResource($this->whenLoaded('roomType')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
