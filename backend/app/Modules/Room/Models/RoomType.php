<?php

namespace App\Modules\Room\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'name', 'slug', 'description', 'base_price',
        'max_occupancy', 'amenities', 'images', 'bed_type', 'size',
        'view', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'amenities' => 'array',
        'images' => 'array',
        'is_active' => 'boolean',
    ];

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function rateOverrides(): HasMany
    {
        return $this->hasMany(RoomRateOverride::class);
    }

    public function getEffectivePrice(\DateTimeInterface $date): float
    {
        $override = $this->rateOverrides()
            ->where('is_active', true)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->orderByDesc('created_at')
            ->first();

        if (!$override) {
            return (float) $this->base_price;
        }

        return $override->rate_type === 'percentage'
            ? (float) $this->base_price * (1 + $override->price / 100)
            : (float) $override->price;
    }
}
