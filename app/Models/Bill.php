<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    protected $fillable = [
        'bill_number', 'customer_id', 'meter_reading_id', 'billing_period_id',
        'tariff_id', 'usage_m3', 'price_per_m3', 'water_charge',
        'fixed_charge', 'late_fee', 'admin_fee', 'total_amount',
        'paid_amount', 'remaining_amount', 'status', 'due_date', 'paid_at',
    ];

    protected function casts(): array
    {
        return ['due_date' => 'date', 'paid_at' => 'datetime'];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function meterReading(): BelongsTo
    {
        return $this->belongsTo(MeterReading::class);
    }

    public function billingPeriod(): BelongsTo
    {
        return $this->belongsTo(BillingPeriod::class);
    }

    public function tariff(): BelongsTo
    {
        return $this->belongsTo(Tariff::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
