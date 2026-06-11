<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\BillingPeriod;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MobileCustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $period = BillingPeriod::where('status', 'open')->first();

        return Inertia::render('Mobile/Customers/Index', [
            'activePeriod' => $period,
            'areas' => Area::orderBy('name')->get(),
            'customers' => Customer::with(['area', 'meter'])
                ->where('status', 'active')
                ->when($request->area_id, fn ($q, $v) => $q->where('area_id', $v))
                ->when($request->search, fn ($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('customer_number', 'like', "%{$v}%"))
                ->when($period, fn ($q) => $q->withExists(['meterReadings as has_reading' => fn ($qq) => $qq->where('billing_period_id', $period->id)]))
                ->orderBy('name')
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->only(['area_id', 'search']),
        ]);
    }
}
