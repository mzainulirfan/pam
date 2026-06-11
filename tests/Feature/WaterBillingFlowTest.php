<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Bill;
use App\Models\BillingPeriod;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Tariff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class WaterBillingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_meter_reading_generates_bill_and_payment_updates_status(): void
    {
        Role::create(['name' => 'admin']);
        $user = User::factory()->create();
        $user->assignRole('admin');

        $area = Area::create(['name' => 'Blok A']);
        $customer = Customer::create([
            'customer_number' => 'CUST-0001',
            'name' => 'Pak Ahmad',
            'phone' => '081234567890',
            'address' => 'Jl. Melati No. 10',
            'area_id' => $area->id,
            'status' => 'active',
            'start_date' => '2026-01-01',
        ]);
        $customer->meter()->create(['meter_number' => 'MTR-00001', 'initial_reading' => 1200]);
        Tariff::create(['name' => 'Tarif 2026', 'price_per_m3' => 3000, 'fixed_charge' => 10000, 'late_fee' => 0, 'admin_fee' => 0, 'is_active' => true]);
        BillingPeriod::create(['name' => 'Juni 2026', 'month' => 6, 'year' => 2026, 'start_date' => '2026-06-01', 'end_date' => '2026-06-30', 'due_date' => '2026-07-10', 'status' => 'open']);
        $method = PaymentMethod::create(['name' => 'Tunai', 'code' => 'cash', 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('mobile.meter-readings.store', $customer), [
                'current_reading' => 1235,
                'is_manual_corrected' => false,
            ])
            ->assertRedirect(route('mobile.meter-readings.create', $customer));

        $bill = Bill::firstOrFail();
        $this->assertSame(35, $bill->usage_m3);
        $this->assertSame(115000, $bill->total_amount);
        $this->assertSame('unpaid', $bill->status);

        $this->actingAs($user)
            ->post(route('payments.store', $bill), [
                'payment_method_id' => $method->id,
                'amount' => 115000,
                'paid_at' => '2026-06-11',
            ])
            ->assertRedirect(route('bills.show', $bill));

        $bill->refresh();
        $this->assertSame('paid', $bill->status);
        $this->assertSame(0, $bill->remaining_amount);
    }
}
