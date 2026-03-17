<?php

namespace App\Modules\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Staff\Requests\StoreStaffRequest;
use App\Modules\Staff\Resources\DepartmentResource;
use App\Modules\Staff\Resources\StaffResource;
use App\Modules\Staff\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StaffController extends Controller
{
    public function __construct(
        private readonly StaffService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return StaffResource::collection(
            $this->service->listStaff(
                $request->only(['department_id', 'is_active', 'search']),
                $request->integer('per_page', 15),
            )
        );
    }

    public function show(int $id): JsonResponse
    {
        $staff = $this->service->getStaff($id);
        if (!$staff) {
            return response()->json(['message' => 'Staff not found.'], 404);
        }

        return response()->json(new StaffResource($staff));
    }

    public function store(StoreStaffRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = $request->user()->tenant_id;

        $staff = $this->service->createStaff($data);
        return response()->json(new StaffResource($staff->load('department')), 201);
    }

    public function update(StoreStaffRequest $request, int $id): JsonResponse
    {
        $staff = $this->service->updateStaff($id, $request->validated());
        if (!$staff) {
            return response()->json(['message' => 'Staff not found.'], 404);
        }

        return response()->json(new StaffResource($staff));
    }

    public function destroy(int $id): JsonResponse
    {
        if (!$this->service->deleteStaff($id)) {
            return response()->json(['message' => 'Staff not found.'], 404);
        }

        return response()->json(['message' => 'Staff member deleted.']);
    }

    public function departments(): AnonymousResourceCollection
    {
        return DepartmentResource::collection($this->service->listDepartments());
    }

    public function storeDepartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:500',
        ]);
        $validated['tenant_id'] = $request->user()->tenant_id;

        $dept = $this->service->createDepartment($validated);
        return response()->json(new DepartmentResource($dept), 201);
    }
}
