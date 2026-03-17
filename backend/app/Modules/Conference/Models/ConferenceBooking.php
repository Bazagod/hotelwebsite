<?php

namespace App\Modules\Conference\Models;

use App\Modules\Reservation\Models\Guest;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConferenceBooking extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'conference_room_id', 'guest_id',
        'organizer_name', 'organizer_email', 'organizer_phone',
        'event_name', 'date', 'start_time', 'end_time',
        'attendees', 'total_amount', 'status',
        'requirements', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'requirements' => 'array',
        'total_amount' => 'decimal:2',
    ];

    public function conferenceRoom(): BelongsTo
    {
        return $this->belongsTo(ConferenceRoom::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }
}
