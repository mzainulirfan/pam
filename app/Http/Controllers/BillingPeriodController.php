<?php

namespace App\Http\Controllers;

use App\Models\BillingPeriod;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BillingPeriodController extends Controller
{
    public function __construct(private BillingService $billingService) {}

    public function index(): Response
    {
        return Inertia::render('BillingPeriods/Index', ['periods' => BillingPeriod::latest('year')->latest('month')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        DB::transaction(function () use ($data) {
            if ($data['status'] === 'open') {
                BillingPeriod::query()->update(['status' => 'closed']);
            }
            $period = BillingPeriod::create($data);
            $this->billingService->generateBillsForPeriod($period);
        });
        return back()->with('success', 'Periode ditambahkan.');
    }

    public function update(Request $request, BillingPeriod $billingPeriod): RedirectResponse
    {
        $data = $this->validated($request, $billingPeriod);
        DB::transaction(function () use ($billingPeriod, $data) {
            if ($data['status'] === 'open') {
                BillingPeriod::whereKeyNot($billingPeriod->id)->update(['status' => 'closed']);
            }
            $billingPeriod->update($data);
        });
        return back()->with('success', 'Periode diperbarui.');
    }

    private function validated(Request $request, ?BillingPeriod $period = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'month' => ['required', 'integer', 'between:1,12', Rule::unique('billing_periods')->where('year', $request->year)->ignore($period?->id)],
            'year' => ['required', 'integer', 'min:2020', 'max:2100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'due_date' => ['required', 'date', 'after:end_date'],
            'status' => ['required', Rule::in(['open', 'closed'])],
        ]);
    }
}

