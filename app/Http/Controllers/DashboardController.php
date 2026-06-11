<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillingPeriod;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $periods = BillingPeriod::latest('year')->latest('month')->get();
        $selectedPeriodId = $request->integer('billing_period_id') ?: null;
        $period = $selectedPeriodId
            ? BillingPeriod::find($selectedPeriodId)
            : BillingPeriod::where('status', 'open')->first();

        $period ??= $periods->first();
        $activeCustomers = Customer::where('status', 'active')->count();
        $readThisPeriod = $period ? MeterReading::where('billing_period_id', $period->id)->count() : 0;
        $currentBills = $period ? Bill::where('billing_period_id', $period->id)->sum('total_amount') : 0;
        $currentPaid = $period ? Bill::where('billing_period_id', $period->id)->sum('paid_amount') : 0;
        $monthPayments = $period
            ? Payment::whereHas('bill', fn (Builder $query) => $query->where('billing_period_id', $period->id))->sum('amount')
            : 0;
        $overdue = $period
            ? Bill::where('billing_period_id', $period->id)->where('status', 'overdue')->sum('remaining_amount')
            : 0;
        $unpaidBills = $period
            ? Bill::where('billing_period_id', $period->id)->whereIn('status', ['unpaid', 'partial', 'overdue'])->count()
            : 0;

        return Inertia::render('Dashboard', [
            'stats' => [
                'activeCustomers' => $activeCustomers,
                'inactiveCustomers' => Customer::where('status', 'inactive')->count(),
                'currentBills' => $currentBills,
                'currentPaid' => $currentPaid,
                'collectionRate' => $currentBills > 0 ? round(($currentPaid / $currentBills) * 100, 1) : 0,
                'monthPayments' => $monthPayments,
                'overdue' => $overdue,
                'unpaidBills' => $unpaidBills,
                'unread' => max(0, $activeCustomers - $readThisPeriod),
                'read' => $readThisPeriod,
                'readingRate' => $activeCustomers > 0 ? round(($readThisPeriod / $activeCustomers) * 100, 1) : 0,
            ],
            'activePeriod' => $period,
            'periods' => $periods,
            'filters' => [
                'billing_period_id' => $period?->id,
            ],
            'usageChart' => MeterReading::query()
                ->selectRaw('billing_period_id, sum(usage_m3) as total_usage')
                ->with('billingPeriod:id,name')
                ->groupBy('billing_period_id')
                ->latest('billing_period_id')
                ->limit(6)
                ->get()
                ->reverse()
                ->values(),
            'areaProgress' => Customer::query()
                ->select('areas.id', 'areas.name')
                ->selectRaw('count(customers.id) as total_customers')
                ->selectRaw('sum(case when meter_readings.id is null then 0 else 1 end) as read_customers')
                ->join('areas', 'areas.id', '=', 'customers.area_id')
                ->leftJoin('meter_readings', function ($join) use ($period) {
                    $join->on('meter_readings.customer_id', '=', 'customers.id');
                    if ($period) {
                        $join->where('meter_readings.billing_period_id', '=', $period->id);
                    }
                })
                ->where('customers.status', 'active')
                ->groupBy('areas.id', 'areas.name')
                ->orderBy('areas.name')
                ->get()
                ->map(fn ($area) => [
                    'id' => $area->id,
                    'name' => $area->name,
                    'total_customers' => (int) $area->total_customers,
                    'read_customers' => (int) $area->read_customers,
                    'rate' => $area->total_customers > 0 ? round(($area->read_customers / $area->total_customers) * 100, 1) : 0,
                ]),
            'recentBills' => Bill::with(['customer:id,name,customer_number', 'billingPeriod:id,name'])
                ->when($period, fn (Builder $query) => $query->where('billing_period_id', $period->id))
                ->latest()
                ->limit(6)
                ->get(),
        ]);
    }
}
