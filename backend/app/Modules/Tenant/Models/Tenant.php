<?php

namespace App\Modules\Tenant\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'domain', 'email', 'phone', 'address',
        'city', 'country', 'currency', 'timezone', 'logo',
        'settings', 'subscription_plan', 'subscription_expires_at', 'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'subscription_expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function isSubscriptionActive(): bool
    {
        if ($this->subscription_plan === 'free') {
            return true;
        }

        return $this->subscription_expires_at && $this->subscription_expires_at->isFuture();
    }
}
