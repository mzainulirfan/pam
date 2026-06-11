<?php

namespace App\Http\Requests;

use App\Models\BillingPeriod;
use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class MeterReadingRequest extends FormRequest
{
    public function rules(): array
    {
        $routeCustomer = $this->route('customer');
        $customer = $routeCustomer instanceof Customer
            ? $routeCustomer->load('meter')
            : Customer::with('meter')->findOrFail($routeCustomer);
        $period = BillingPeriod::where('status', 'open')->first();

        $previous = $customer->meter?->initial_reading ?? 0;
        if ($period) {
            $previous = $customer->meterReadings()
                ->where('billing_period_id', '!=', $period->id)
                ->latest('read_at')
                ->value('current_reading') ?? $previous;
        }

        return [
            'current_reading' => ['required', 'integer', 'min:'.$previous],
            'photo' => ['nullable', 'image', 'max:5120'],
            'ocr_text' => ['nullable', 'string'],
            'ocr_value' => ['nullable', 'integer', 'min:0'],
            'ocr_confidence' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_manual_corrected' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
