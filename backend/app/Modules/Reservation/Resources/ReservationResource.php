<?php

namespace App\Modules\Reservation\Resources;

use App\Modules\Room\Resources\RoomResource;
use App\Modules\Room\Resources\RoomTypeResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'confirmation_number' => $this->confirmation_number,
            'guest' => new GuestResource($this->whenLoaded('guest')),
            'room' => new RoomResource($this->whenLoaded('room')),
            'room_type' => new RoomTypeResource($this->whenLoaded('roomType')),
            'check_in_date' => $this->check_in_date?->toDateString(),
            'check_out_date' => $this->check_out_date?->toDateString(),
            'actual_check_in' => $this->actual_check_in?->toISOString(),
            'actual_check_out' => $this->actual_check_out?->toISOString(),
            'nights' => $this->nights,
            'adults' => $this->adults,
            'children' => $this->children,
            'rate_per_night' => (float) $this->rate_per_night,
            'total_amount' => (float) $this->total_amount,
            'discount_amount' => (float) $this->discount_amount,
            'tax_amount' => (float) $this->tax_amount,
            'grand_total' => $this->grand_total,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'source' => $this->source,
            'special_requests' => $this->special_requests,
            'extras' => ReservationExtraResource::collection($this->whenLoaded('extras')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
