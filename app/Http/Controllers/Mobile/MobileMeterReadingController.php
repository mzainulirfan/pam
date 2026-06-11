<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\MeterReadingRequest;
use App\Models\BillingPeriod;
use App\Models\Customer;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MobileMeterReadingController extends Controller
{
    public function create(Customer $customer): Response
    {
        $customer->load(['area', 'meter']);
        $period = BillingPeriod::where('status', 'open')->firstOrFail();
        $previous = $customer->meterReadings()
            ->where('billing_period_id', '!=', $period->id)
            ->latest('read_at')
            ->value('current_reading') ?? $customer->meter->initial_reading;
        $existingReading = $customer->meterReadings()
            ->where('billing_period_id', $period->id)
            ->first(['id', 'current_reading', 'usage_m3', 'photo_path', 'notes', 'read_at']);
        $currentBill = $customer->bills()
            ->where('billing_period_id', $period->id)
            ->first(['id', 'bill_number', 'status', 'total_amount', 'paid_amount', 'remaining_amount']);

        return Inertia::render('Mobile/MeterReadings/Create', [
            'customer' => $customer,
            'activePeriod' => $period,
            'previousReading' => $previous,
            'existingReading' => $existingReading,
            'currentBill' => $currentBill,
            'tariff' => \App\Models\Tariff::where('is_active', true)->first(),
        ]);
    }

    public function store(MeterReadingRequest $request, Customer $customer, BillingService $billingService): RedirectResponse
    {
        $period = BillingPeriod::where('status', 'open')->firstOrFail();
        abort_if($period->status !== 'open', 422, 'Periode tagihan sedang ditutup.');
        $customer->load('meter');
        $currentBill = $customer->bills()->where('billing_period_id', $period->id)->first();
        abort_if($currentBill?->status === 'paid', 422, 'Tagihan periode ini sudah lunas dan tidak dapat diubah.');

        $previous = $customer->meterReadings()
            ->where('billing_period_id', '!=', $period->id)
            ->latest('read_at')
            ->value('current_reading') ?? $customer->meter->initial_reading;
        $existingReading = $customer->meterReadings()
            ->where('billing_period_id', $period->id)
            ->first();
        $path = $request->file('photo')?->store('meter-readings/'.now()->format('Y/m'), 'public');

        DB::transaction(function () use ($request, $customer, $period, $previous, $existingReading, $path, $billingService) {
            $reading = $customer->meterReadings()->updateOrCreate([
                'billing_period_id' => $period->id,
            ], [
                'meter_id' => $customer->meter->id,
                'user_id' => $request->user()?->id,
                'previous_reading' => $previous,
                'current_reading' => $request->integer('current_reading'),
                'usage_m3' => $request->integer('current_reading') - $previous,
                'photo_path' => $path ?? $existingReading?->photo_path,
                'ocr_text' => $request->input('ocr_text'),
                'ocr_value' => $request->input('ocr_value'),
                'ocr_confidence' => $request->input('ocr_confidence'),
                'is_manual_corrected' => $request->boolean('is_manual_corrected'),
                'notes' => $request->input('notes'),
                'read_at' => now(),
            ]);

            $billingService->generateBill($reading->load('billingPeriod'));
        });

        return redirect()
            ->route('mobile.meter-readings.create', $customer)
            ->with('success', 'Pencatatan meter tersimpan dan tagihan dibuat.');
    }
}
