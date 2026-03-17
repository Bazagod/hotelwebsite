<?php

namespace App\Modules\Room\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_type_id' => 'required|exists:room_types,id',
            'number' => 'required|string|max:20',
            'floor' => 'required|integer|min:0',
            'status' => 'sometimes|in:available,occupied,maintenance,reserved,cleaning',
            'is_clean' => 'sometimes|boolean',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
