<?php

namespace App\Modules\Staff\Services;

use App\Modules\Staff\Models\Department;
use App\Modules\Staff\Models\Staff;
use App\Modules\Staff\Repositories\StaffRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffService
{
    public function __construct(
        private readonly StaffRepository $repository,
    ) {}

    public function listStaff(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getAllStaff($filters, $perPage);
    }

    public function getStaff(int $id): ?Staff
    {
        return $this->repository->findStaff($id);
    }

    public function createStaff(array $data): Staff
    {
        return $this->repository->createStaff($data);
    }

    public function updateStaff(int $id, array $data): ?Staff
    {
        $staff = $this->repository->findStaff($id);
        if (!$staff) {
            return null;
        }
        return $this->repository->updateStaff($staff, $data);
    }

    public function deleteStaff(int $id): bool
    {
        $staff = $this->repository->findStaff($id);
        if (!$staff) {
            return false;
        }
        return $this->repository->deleteStaff($staff);
    }

    public function listDepartments(): LengthAwarePaginator
    {
        return $this->repository->getAllDepartments();
    }

    public function createDepartment(array $data): Department
    {
        return $this->repository->createDepartment($data);
    }
}
