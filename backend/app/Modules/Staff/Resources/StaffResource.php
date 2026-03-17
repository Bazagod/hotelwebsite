<?php

namespace App\Modules\Staff\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'position' => $this->position,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'salary' => $this->when($request->user()?->can('view-salaries'), (float) $this->salary),
            'salary_type' => $this->when($request->user()?->can('view-salaries'), $this->salary_type),
            'hire_date' => $this->hire_date?->toDateString(),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
