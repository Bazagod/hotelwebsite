<?php

namespace App\Modules\Staff\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffSchedule extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'staff_id', 'date', 'start_time',
        'end_time', 'shift_type', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }
}
