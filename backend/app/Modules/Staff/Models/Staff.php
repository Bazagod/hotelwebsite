<?php

namespace App\Modules\Staff\Models;

use App\Models\User;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $table = 'staff';

    protected $fillable = [
        'tenant_id', 'user_id', 'department_id', 'employee_id',
        'first_name', 'last_name', 'email', 'phone', 'position',
        'salary', 'salary_type', 'hire_date', 'termination_date',
        'address', 'emergency_contact', 'emergency_phone', 'is_active',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(StaffSchedule::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
