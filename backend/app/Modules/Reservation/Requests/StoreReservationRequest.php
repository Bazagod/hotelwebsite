<?php

namespace App\Modules\Reservation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest_first_name' => 'required|string|max:255',
            'guest_last_name' => 'required|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'guest_phone' => 'nullable|string|max:30',
            'room_type_id' => 'required|exists:room_types,id',
            'room_id' => 'nullable|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'adults' => 'required|integer|min:1|max:10',
            'children' => 'sometimes|integer|min:0|max:10',
            'rate_per_night' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'source' => 'sometimes|in:direct,website,ota,phone',
            'special_requests' => 'nullable|string|max:2000',
        ];
    }
}
