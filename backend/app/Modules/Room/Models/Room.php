<?php

namespace App\Modules\Room\Models;

use App\Enums\RoomStatus;
use App\Modules\Reservation\Models\Reservation;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'room_type_id', 'number', 'floor',
        'status', 'is_clean', 'notes', 'is_active',
    ];

    protected $casts = [
        'status' => RoomStatus::class,
        'is_clean' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function isAvailableFor(\DateTimeInterface $checkIn, \DateTimeInterface $checkOut): bool
    {
        if ($this->status !== RoomStatus::AVAILABLE) {
            return false;
        }

        return !$this->reservations()
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('check_in_date', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                    ->orWhere(function ($q2) use ($checkIn, $checkOut) {
                        $q2->where('check_in_date', '<=', $checkIn)
                            ->where('check_out_date', '>=', $checkOut);
                    });
            })
            ->exists();
    }
}
