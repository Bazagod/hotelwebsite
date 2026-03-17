<?php

namespace App\Modules\Restaurant\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RestaurantOrder extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'order_number', 'table_number', 'guest_id',
        'reservation_id', 'subtotal', 'tax_amount', 'total_amount',
        'status', 'payment_status', 'served_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(RestaurantOrderItem::class, 'order_id');
    }

    public static function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-' . strtoupper(substr(uniqid(), -6));
        } while (static::where('order_number', $number)->exists());

        return $number;
    }
}
