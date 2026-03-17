<?php

namespace App\Modules\Room\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomRateOverride extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'room_type_id', 'name', 'price',
        'start_date', 'end_date', 'rate_type', 'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }
}
