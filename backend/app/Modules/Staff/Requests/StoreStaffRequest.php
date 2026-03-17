<?php

namespace App\Modules\Staff\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => 'nullable|exists:departments,id',
            'employee_id' => 'nullable|string|max:50',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'position' => 'required|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'salary_type' => 'sometimes|in:monthly,hourly',
            'hire_date' => 'required|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:30',
        ];
    }
}
