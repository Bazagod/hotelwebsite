<?php

namespace App\Modules\Staff\Repositories;

use App\Modules\Staff\Models\Department;
use App\Modules\Staff\Models\Staff;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffRepository
{
    public function __construct(
        private readonly Staff $staff,
        private readonly Department $department,
    ) {}

    public function getAllStaff(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->staff->with('department');

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('last_name')->paginate($perPage);
    }

    public function findStaff(int $id): ?Staff
    {
        return $this->staff->with(['department', 'user'])->find($id);
    }

    public function createStaff(array $data): Staff
    {
        return $this->staff->create($data);
    }

    public function updateStaff(Staff $staff, array $data): Staff
    {
        $staff->update($data);
        return $staff->fresh(['department', 'user']);
    }

    public function deleteStaff(Staff $staff): bool
    {
        return $staff->delete();
    }

    public function getAllDepartments(): LengthAwarePaginator
    {
        return $this->department->withCount('staff')->paginate(50);
    }

    public function createDepartment(array $data): Department
    {
        return $this->department->create($data);
    }
}
