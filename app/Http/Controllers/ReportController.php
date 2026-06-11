<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillingPeriod;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $periodId = $request->integer('billing_period_id') ?: null;

        return Inertia::render('Reports/Index', [
            'periods' => BillingPeriod::latest('year')->latest('month')->get(),
            'filters' => ['billing_period_id' => $periodId],
            'bills' => Bill::with(['customer.area', 'billingPeriod'])
                ->when($periodId, fn ($q) => $q->where('billing_period_id', $periodId))
                ->latest()
                ->get(),
            'payments' => Payment::with(['bill.customer', 'paymentMethod'])
                ->when($periodId, fn ($q) => $q->whereHas('bill', fn ($qq) => $qq->where('billing_period_id', $periodId)))
                ->latest()
                ->get(),
        ]);
    }
}
