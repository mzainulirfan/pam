<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tariff extends Model
{
    protected $fillable = ['name', 'price_per_m3', 'fixed_charge', 'late_fee', 'admin_fee', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function bills(): HasMany
    {
        return $this->hasMany(Bill::class);
    }
}
