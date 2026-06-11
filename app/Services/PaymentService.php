<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function record(Bill $bill, array $data): Payment
    {
        return DB::transaction(function () use ($bill, $data) {
            $payment = Payment::create([
                'payment_number' => $this->nextPaymentNumber(),
                'bill_id' => $bill->id,
                'payment_method_id' => $data['payment_method_id'],
                'user_id' => $data['user_id'] ?? null,
                'amount' => $data['amount'],
                'paid_at' => $data['paid_at'],
                'proof_path' => $data['proof_path'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $paid = $bill->payments()->sum('amount');
            $remaining = max(0, $bill->total_amount - $paid);

            $bill->update([
                'paid_amount' => $paid,
                'remaining_amount' => $remaining,
                'status' => $remaining === 0 ? 'paid' : 'partial',
                'paid_at' => $remaining === 0 ? $payment->paid_at : null,
            ]);

            return $payment;
        });
    }

    private function nextPaymentNumber(): string
    {
        return 'PAY-'.now()->format('Ymd').'-'.str_pad((string) (Payment::whereDate('created_at', today())->count() + 1), 4, '0', STR_PAD_LEFT);
    }
}
