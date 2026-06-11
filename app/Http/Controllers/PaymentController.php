<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Payments/Index', [
            'payments' => Payment::with(['bill.customer', 'paymentMethod', 'user'])->latest()->paginate(20),
        ]);
    }

    public function create(Bill $bill): Response
    {
        return Inertia::render('Payments/Create', [
            'bill' => $bill->load(['customer', 'billingPeriod']),
            'methods' => PaymentMethod::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request, Bill $bill, PaymentService $service): RedirectResponse
    {
        $data = $request->validate([
            'payment_method_id' => ['required', 'exists:payment_methods,id'],
            'amount' => ['required', 'integer', 'min:1', 'max:'.$bill->remaining_amount],
            'paid_at' => ['required', 'date'],
            'proof' => ['nullable', 'image', 'max:5120'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);
        $data['user_id'] = $request->user()?->id;
        $data['proof_path'] = $request->file('proof')?->store('payment-proofs/'.now()->format('Y/m'), 'public');

        $service->record($bill, $data);

        return redirect()->route('bills.show', $bill)->with('success', 'Pembayaran tercatat.');
    }
}
