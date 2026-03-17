<?php

namespace App\Modules\Room\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'base_price' => 'required|numeric|min:0',
            'max_occupancy' => 'required|integer|min:1|max:20',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'string|url|max:500',
            'bed_type' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:50',
            'view' => 'nullable|string|max:100',
        ];
    }
}
