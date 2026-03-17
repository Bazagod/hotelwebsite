<?php

namespace App\Modules\Room\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'max_occupancy' => $this->max_occupancy,
            'amenities' => $this->amenities,
            'images' => $this->images,
            'bed_type' => $this->bed_type,
            'size' => $this->size,
            'view' => $this->view,
            'is_active' => $this->is_active,
            'rooms_count' => $this->whenCounted('rooms'),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
