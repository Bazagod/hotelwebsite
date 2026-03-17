<?php

namespace App\Modules\Reservation\Models;

use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Models\User;
use App\Modules\Reservation\Models\Guest;
use App\Modules\Room\Models\Room;
use App\Modules\Room\Models\RoomType;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'confirmation_number', 'guest_id', 'room_id', 'room_type_id',
        'check_in_date', 'check_out_date', 'actual_check_in', 'actual_check_out',
        'adults', 'children', 'rate_per_night', 'total_amount', 'discount_amount',
        'tax_amount', 'status', 'payment_status', 'source', 'special_requests',
        'internal_notes', 'created_by',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'actual_check_in' => 'datetime',
        'actual_check_out' => 'datetime',
        'rate_per_night' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'status' => ReservationStatus::class,
        'payment_status' => PaymentStatus::class,
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function extras(): HasMany
    {
        return $this->hasMany(ReservationExtra::class);
    }

    public function getNightsAttribute(): int
    {
        return $this->check_in_date->diffInDays($this->check_out_date);
    }

    public function getGrandTotalAttribute(): float
    {
        $extrasTotal = $this->extras()->sum('total_price');
        return (float) $this->total_amount + $extrasTotal;
    }

    public static function generateConfirmationNumber(): string
    {
        do {
            $number = 'BZG-' . strtoupper(substr(uniqid(), -8));
        } while (static::where('confirmation_number', $number)->exists());

        return $number;
    }
}
