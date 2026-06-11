<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\BillingPeriod;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\PaymentMethod;
use App\Models\Tariff;
use App\Models\User;
use App\Services\BillingService;
use App\Services\PaymentService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = collect(['admin', 'officer', 'cashier'])
            ->mapWithKeys(fn ($name) => [$name => Role::firstOrCreate(['name' => $name])]);

        $admin = User::firstOrCreate(['email' => 'admin@example.com'], ['name' => 'Admin PAM', 'password' => Hash::make('password')]);
        $officer = User::firstOrCreate(['email' => 'petugas@example.com'], ['name' => 'Petugas Lapangan', 'password' => Hash::make('password')]);
        $cashier = User::firstOrCreate(['email' => 'kasir@example.com'], ['name' => 'Kasir', 'password' => Hash::make('password')]);

        $admin->assignRole($roles['admin']);
        $officer->assignRole($roles['officer']);
        $cashier->assignRole($roles['cashier']);

        $areas = collect(['Blok A', 'Blok B', 'Jalur Utara', 'Jalur Selatan'])
            ->mapWithKeys(fn ($name) => [$name => Area::firstOrCreate(['name' => $name], ['description' => 'Area '.$name])]);

        Tariff::query()->update(['is_active' => false]);
        Tariff::updateOrCreate(['name' => 'Tarif Rumah Tangga 2026'], [
            'price_per_m3' => 3000,
            'fixed_charge' => 10000,
            'late_fee' => 5000,
            'admin_fee' => 0,
            'is_active' => true,
        ]);

        $may = BillingPeriod::updateOrCreate(['month' => 5, 'year' => 2026], [
            'name' => 'Mei 2026',
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-31',
            'due_date' => '2026-06-10',
            'status' => 'closed',
        ]);

        $june = BillingPeriod::updateOrCreate(['month' => 6, 'year' => 2026], [
            'name' => 'Juni 2026',
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'due_date' => '2026-07-10',
            'status' => 'open',
        ]);

        $cash = PaymentMethod::updateOrCreate(['code' => 'cash'], ['name' => 'Tunai', 'is_active' => true]);
        $transfer = PaymentMethod::updateOrCreate(['code' => 'transfer'], ['name' => 'Transfer Bank', 'is_active' => true]);
        PaymentMethod::updateOrCreate(['code' => 'qris'], ['name' => 'QRIS', 'is_active' => true]);

        $customerRows = [
            ['Pak Ahmad', '081234567801', 'Jl. Melati No. 10', 'Blok A', 'active', 1200],
            ['Bu Siti', '081234567802', 'Jl. Kenanga No. 7', 'Blok A', 'active', 980],
            ['Pak Budi', '081234567803', 'Jl. Mawar No. 2', 'Blok B', 'active', 1450],
            ['Bu Rina', '081234567804', 'Jl. Anggrek No. 12', 'Blok B', 'active', 760],
            ['Pak Dedi', '081234567805', 'Jl. Cempaka No. 5', 'Jalur Utara', 'active', 1325],
            ['Bu Lestari', '081234567806', 'Jl. Teratai No. 18', 'Jalur Utara', 'active', 1110],
            ['Pak Hendra', '081234567807', 'Jl. Dahlia No. 4', 'Jalur Selatan', 'active', 890],
            ['Bu Nia', '081234567808', 'Jl. Flamboyan No. 9', 'Jalur Selatan', 'active', 1015],
            ['Pak Yusuf', '081234567809', 'Jl. Wijaya Kusuma No. 3', 'Blok A', 'active', 670],
            ['Bu Maya', '081234567810', 'Jl. Kamboja No. 14', 'Blok B', 'active', 1540],
            ['Pak Rahmat', '081234567811', 'Jl. Soka No. 6', 'Jalur Utara', 'inactive', 430],
            ['Bu Tini', '081234567812', 'Jl. Nusa Indah No. 11', 'Jalur Selatan', 'active', 1230],
        ];

        $customers = collect($customerRows)->map(function (array $row, int $index) use ($areas) {
            [$name, $phone, $address, $area, $status, $initialReading] = $row;
            $number = 'CUST-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);

            $customer = Customer::updateOrCreate(['customer_number' => $number], [
                'name' => $name,
                'phone' => $phone,
                'address' => $address.', Kelurahan Tirta Jaya',
                'area_id' => $areas[$area]->id,
                'status' => $status,
                'start_date' => '2026-01-01',
                'notes' => $status === 'inactive' ? 'Nonaktif sementara' : null,
            ]);

            $customer->meter()->updateOrCreate(['customer_id' => $customer->id], [
                'meter_number' => 'MTR-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
                'initial_reading' => $initialReading,
            ]);

            return $customer->fresh(['meter']);
        });

        $billingService = app(BillingService::class);
        $paymentService = app(PaymentService::class);

        $mayUsages = [22, 18, 35, 12, 26, 31, 15, 19, 24, 28, 0, 17];
        $juneUsages = [35, 21, 40, 16, 29, 0, 18, 23];

        foreach ($customers as $index => $customer) {
            if ($customer->status !== 'active') {
                continue;
            }

            $mayReading = $this->seedReading($customer, $may, $officer, $customer->meter->initial_reading, $mayUsages[$index]);
            $mayBill = $mayReading->bill ?: $billingService->generateBill($mayReading->load('billingPeriod'));

            if ($index <= 2 && $mayBill->payments()->doesntExist()) {
                $paymentService->record($mayBill, [
                    'payment_method_id' => $index % 2 === 0 ? $cash->id : $transfer->id,
                    'user_id' => $cashier->id,
                    'amount' => $mayBill->total_amount,
                    'paid_at' => '2026-06-05 10:00:00',
                    'notes' => 'Pembayaran seed lunas',
                ]);
            } elseif ($index === 3 && $mayBill->payments()->doesntExist()) {
                $paymentService->record($mayBill, [
                    'payment_method_id' => $cash->id,
                    'user_id' => $cashier->id,
                    'amount' => 30000,
                    'paid_at' => '2026-06-06 09:30:00',
                    'notes' => 'Pembayaran seed sebagian',
                ]);
            } elseif ($mayBill->status === 'unpaid') {
                $mayBill->update(['status' => 'overdue']);
            }

            if ($index < count($juneUsages) && $juneUsages[$index] > 0) {
                $juneReading = $this->seedReading($customer, $june, $officer, $mayReading->current_reading, $juneUsages[$index]);
                $juneBill = $juneReading->bill ?: $billingService->generateBill($juneReading->load('billingPeriod'));

                if ($index === 0 && $juneBill->payments()->doesntExist()) {
                    $paymentService->record($juneBill, [
                        'payment_method_id' => $cash->id,
                        'user_id' => $cashier->id,
                        'amount' => $juneBill->total_amount,
                        'paid_at' => '2026-06-11 14:15:00',
                        'notes' => 'Pembayaran seed periode berjalan',
                    ]);
                }
            }
        }
    }

    private function seedReading(Customer $customer, BillingPeriod $period, User $officer, int $previousReading, int $usage): MeterReading
    {
        return MeterReading::firstOrCreate(
            [
                'customer_id' => $customer->id,
                'billing_period_id' => $period->id,
            ],
            [
                'meter_id' => $customer->meter->id,
                'user_id' => $officer->id,
                'previous_reading' => $previousReading,
                'current_reading' => $previousReading + $usage,
                'usage_m3' => $usage,
                'ocr_text' => (string) ($previousReading + $usage),
                'ocr_value' => $previousReading + $usage,
                'ocr_confidence' => 82.5,
                'is_manual_corrected' => false,
                'notes' => 'Data contoh dari seeder',
                'read_at' => $period->end_date->setTime(9, 0),
            ],
        )->load(['billingPeriod', 'bill']);
    }
}
