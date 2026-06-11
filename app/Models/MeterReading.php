<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MeterReading extends Model
{
    protected $fillable = [
        'customer_id', 'meter_id', 'billing_period_id', 'user_id',
        'previous_reading', 'current_reading', 'usage_m3', 'photo_path',
        'ocr_text', 'ocr_value', 'ocr_confidence', 'is_manual_corrected',
        'notes', 'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_manual_corrected' => 'boolean',
            'ocr_confidence' => 'decimal:2',
            'read_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function meter(): BelongsTo
    {
        return $this->belongsTo(Meter::class);
    }

    public function billingPeriod(): BelongsTo
    {
        return $this->belongsTo(BillingPeriod::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bill(): HasOne
    {
        return $this->hasOne(Bill::class);
    }
}
