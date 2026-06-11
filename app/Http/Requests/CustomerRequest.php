<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function rules(): array
    {
        $customer = $this->route('customer');
        $meterId = $customer?->meter?->id;

        return [
            'customer_number' => ['required', 'string', 'max:50', Rule::unique('customers', 'customer_number')->ignore($customer?->id)],
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^(\+62|08)[0-9]{8,12}$/'],
            'address' => ['required', 'string', 'min:10'],
            'area_id' => ['required', 'exists:areas,id'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'meter_number' => ['required', 'string', 'max:50', Rule::unique('meters', 'meter_number')->ignore($meterId)],
            'initial_reading' => ['required', 'integer', 'min:0'],
            'start_date' => ['required', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
