<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Bills/Index', [
            'bills' => Bill::with(['customer.area', 'billingPeriod'])
                ->when($request->status, fn ($q, $v) => $q->where('status', $v))
                ->when($request->search, fn ($q, $v) => $q->whereHas('customer', fn ($qq) => $qq->where('name', 'like', "%{$v}%")->orWhere('customer_number', 'like', "%{$v}%")))
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Bill $bill): Response
    {
        return Inertia::render('Bills/Show', [
            'bill' => $bill->load(['customer.area', 'billingPeriod', 'meterReading', 'payments.paymentMethod']),
        ]);
    }
}
