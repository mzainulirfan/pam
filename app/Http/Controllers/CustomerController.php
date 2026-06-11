<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Area;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = Customer::with(['area', 'meter'])
            ->when($request->search, fn ($q, $v) => $q->where(fn ($qq) => $qq->where('name', 'like', "%{$v}%")->orWhere('customer_number', 'like', "%{$v}%")))
            ->when($request->area_id, fn ($q, $v) => $q->where('area_id', $v))
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'areas' => Area::orderBy('name')->get(),
            'filters' => $request->only(['search', 'area_id', 'status']),
            'stats' => [
                'total' => Customer::count(),
                'active' => Customer::where('status', 'active')->count(),
                'inactive' => Customer::where('status', 'inactive')->count(),
                'withUnpaidBills' => Customer::whereHas('bills', fn ($query) => $query->whereIn('status', ['unpaid', 'partial', 'overdue']))->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customers/Form', [
            'customer' => null,
            'areas' => Area::orderBy('name')->get(),
            'nextNumber' => 'CUST-'.str_pad((string) (Customer::count() + 1), 4, '0', STR_PAD_LEFT),
        ]);
    }

    public function store(CustomerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $customer = Customer::create(collect($data)->except(['meter_number', 'initial_reading'])->all());
        $customer->meter()->create(collect($data)->only(['meter_number', 'initial_reading'])->all());

        return redirect()->route('customers.create')->with([
            'success' => 'Pelanggan ditambahkan. Silakan simpan atau cetak kartu member di bawah ini.',
            'customer' => [
                'id' => $customer->id,
                'customer_number' => $customer->customer_number,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'area_id' => $customer->area_id,
            ],
        ]);
    }

    public function show(Customer $customer): Response
    {
        $customer->load(['area', 'meter', 'bills.billingPeriod', 'bills.payments.paymentMethod', 'meterReadings.billingPeriod']);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'summary' => [
                'total_billed' => $customer->bills->sum('total_amount'),
                'total_paid' => $customer->bills->sum('paid_amount'),
                'total_due' => $customer->bills->sum('remaining_amount'),
                'last_reading' => $customer->meterReadings->sortByDesc('read_at')->first(),
                'unpaid_count' => $customer->bills->whereIn('status', ['unpaid', 'partial', 'overdue'])->count(),
                'average_usage' => round($customer->meterReadings->avg('usage_m3') ?? 0, 1),
            ],
        ]);
    }

    public function edit(Customer $customer): Response
    {
        $customer->load('meter');
        return Inertia::render('Customers/Form', [
            'customer' => $customer,
            'areas' => Area::orderBy('name')->get(),
            'nextNumber' => null,
        ]);
    }

    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        $data = $request->validated();
        $customer->update(collect($data)->except(['meter_number', 'initial_reading'])->all());
        $customer->meter()->updateOrCreate(['customer_id' => $customer->id], collect($data)->only(['meter_number', 'initial_reading'])->all());

        return redirect()->route('customers.show', $customer)->with('success', 'Pelanggan diperbarui.');
    }
}
