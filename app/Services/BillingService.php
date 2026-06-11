<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\BillingPeriod;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Tariff;
use Illuminate\Support\Facades\DB;

class BillingService
{
    public function generateBill(MeterReading $reading): Bill
    {
        return DB::transaction(function () use ($reading) {
            $tariff = Tariff::where('is_active', true)->firstOrFail();
            $waterCharge = $reading->usage_m3 * $tariff->price_per_m3;
            $total = $waterCharge + $tariff->fixed_charge + $tariff->late_fee + $tariff->admin_fee;

            $bill = Bill::firstOrCreate(
                ['customer_id' => $reading->customer_id, 'billing_period_id' => $reading->billing_period_id],
                [
                    'bill_number' => $this->nextBillNumber($reading),
                    'tariff_id' => $tariff->id,
                    'usage_m3' => 0,
                    'price_per_m3' => $tariff->price_per_m3,
                    'water_charge' => 0,
                    'fixed_charge' => $tariff->fixed_charge,
                    'late_fee' => $tariff->late_fee,
                    'admin_fee' => $tariff->admin_fee,
                    'total_amount' => $tariff->fixed_charge + $tariff->late_fee + $tariff->admin_fee,
                    'paid_amount' => 0,
                    'remaining_amount' => $tariff->fixed_charge + $tariff->late_fee + $tariff->admin_fee,
                    'status' => 'unpaid',
                    'due_date' => $reading->billingPeriod->due_date,
                ],
            );

            // Update bill with meter reading data
            $bill->update([
                'meter_reading_id' => $reading->id,
                'usage_m3' => $reading->usage_m3,
                'water_charge' => $waterCharge,
                'total_amount' => $total,
                'remaining_amount' => $bill->paid_amount > 0 ? max(0, $total - $bill->paid_amount) : $total,
            ]);

            return $bill;
        });
    }

    public function generateBillsForPeriod(BillingPeriod $period): void
    {
        DB::transaction(function () use ($period) {
            $tariff = Tariff::where('is_active', true)->firstOrFail();
            $customers = Customer::where('status', 'active')->get();

            foreach ($customers as $customer) {
                $bill = Bill::where('customer_id', $customer->id)
                    ->where('billing_period_id', $period->id)
                    ->first();

                if (!$bill) {
                    Bill::create([
                        'bill_number' => $this->nextBillNumberForPeriod($period),
                        'customer_id' => $customer->id,
                        'billing_period_id' => $period->id,
                        'tariff_id' => $tariff->id,
                        'usage_m3' => 0,
                        'price_per_m3' => $tariff->price_per_m3,
                        'water_charge' => 0,
                        'fixed_charge' => $tariff->fixed_charge,
                        'late_fee' => 0,
                        'admin_fee' => $tariff->admin_fee,
                        'total_amount' => $tariff->fixed_charge + $tariff->admin_fee,
                        'paid_amount' => 0,
                        'remaining_amount' => $tariff->fixed_charge + $tariff->admin_fee,
                        'status' => 'unpaid',
                        'due_date' => $period->due_date,
                    ]);
                }
            }
        });
    }

    private function nextBillNumber(MeterReading $reading): string
    {
        $prefix = sprintf('INV-%d-%02d-', $reading->billingPeriod->year, $reading->billingPeriod->month);
        $next = Bill::where('bill_number', 'like', $prefix.'%')->count() + 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    private function nextBillNumberForPeriod(BillingPeriod $period): string
    {
        $prefix = sprintf('INV-%d-%02d-', $period->year, $period->month);
        $next = Bill::where('bill_number', 'like', $prefix.'%')->count() + 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }
}

