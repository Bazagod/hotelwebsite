<?php

namespace App\Modules\Reservation\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'nationality' => $this->nationality,
            'vip_status' => $this->vip_status,
            'total_stays' => $this->total_stays,
            'total_spent' => (float) $this->total_spent,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
