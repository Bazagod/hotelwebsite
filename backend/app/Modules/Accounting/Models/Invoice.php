<?php

namespace App\Modules\Accounting\Models;

use App\Modules\Reservation\Models\Guest;
use App\Modules\Reservation\Models\Reservation;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'invoice_number', 'reservation_id', 'guest_id',
        'subtotal', 'tax_amount', 'discount_amount', 'total_amount',
        'status', 'issue_date', 'due_date', 'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public static function generateInvoiceNumber(): string
    {
        do {
            $number = 'INV-' . strtoupper(substr(uniqid(), -8));
        } while (static::where('invoice_number', $number)->exists());

        return $number;
    }
}
