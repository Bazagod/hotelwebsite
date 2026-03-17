<?php

namespace App\Modules\Conference\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConferenceRoom extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'name', 'capacity', 'hourly_rate',
        'daily_rate', 'equipment', 'description', 'is_active',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'equipment' => 'array',
        'is_active' => 'boolean',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(ConferenceBooking::class);
    }
}
