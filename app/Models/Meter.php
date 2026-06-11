<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meter extends Model
{
    protected $fillable = ['customer_id', 'meter_number', 'initial_reading'];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
