import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function SummaryCard({ label, value, meta }: { label: string; value: string | number; meta: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <p className="mt-2 text-2xl font-bold leading-none text-gray-900">{value}</p>
            <p className="mt-2 text-xs text-gray-400">{meta}</p>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="max-w-[65%] text-right text-sm font-medium text-gray-800">{value || '-'}</span>
        </div>
    );
}

export default function Create({ bill, methods }: any) {
    const form = useForm({
        payment_method_id: methods[0]?.id ?? '',
        amount: bill.remaining_amount,
        paid_at: new Date().toISOString().slice(0, 10),
        proof: null as File | null,
        notes: '',
    });

    const submit = (event: any) => {
        event.preventDefault();
        form.post(route('payments.store', bill.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Catat Pembayaran" />

            <form onSubmit={submit} className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Catat Pembayaran</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            {bill.bill_number} - {bill.customer.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('bills.show', bill.id)} className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Kembali
                        </Link>
                        <button type="submit" disabled={form.processing} className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                            {form.processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard label="Total Tagihan" value={money(bill.total_amount)} meta="Nilai invoice" />
                    <SummaryCard label="Sudah Dibayar" value={money(bill.paid_amount)} meta="Pembayaran tercatat" />
                    <SummaryCard label="Sisa Tagihan" value={money(bill.remaining_amount)} meta="Maksimal pembayaran" />
                </section>

                <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
                    <div className="space-y-5">
                        <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Ringkasan Tagihan</h2>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{bill.billing_period?.name ?? '-'}</span>
                            </div>
                            <InfoRow label="Nomor Tagihan" value={bill.bill_number} />
                            <InfoRow label="Pelanggan" value={bill.customer.name} />
                            <InfoRow label="Nomor Pelanggan" value={bill.customer.customer_number} />
                            <InfoRow label="Periode" value={bill.billing_period?.name} />
                            <InfoRow label="Pemakaian" value={`${number(bill.meter_reading?.usage_m3 ?? 0)} m3`} />
                        </section>

                        <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <h2 className="font-semibold text-gray-900">Batas Pembayaran</h2>
                            <p className="mt-2 text-sm text-gray-500">Nominal pembayaran tidak boleh melebihi sisa tagihan.</p>
                            <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                                Maksimal {money(bill.remaining_amount)}
                            </div>
                        </section>
                    </div>

                    <section className="rounded-xl border border-gray-100 bg-white">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h2 className="font-semibold text-gray-900">Form Pembayaran</h2>
                            <p className="text-sm text-gray-400">Lengkapi metode, nominal, tanggal, dan bukti bila tersedia.</p>
                        </div>

                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            <div>
                                <InputLabel value="Metode Pembayaran" />
                                <select
                                    value={form.data.payment_method_id}
                                    onChange={(event) => form.setData('payment_method_id', event.target.value)}
                                    className="mt-1 h-10 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400"
                                >
                                    {methods.map((method: any) => (
                                        <option value={method.id} key={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.payment_method_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value="Tanggal Bayar" />
                                <TextInput
                                    type="date"
                                    value={form.data.paid_at}
                                    onChange={(event) => form.setData('paid_at', event.target.value)}
                                    className="mt-1 h-10 w-full border-gray-200 text-sm"
                                />
                                <InputError message={form.errors.paid_at} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value="Jumlah Pembayaran" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    max={bill.remaining_amount}
                                    value={form.data.amount}
                                    onChange={(event) => form.setData('amount', event.target.value)}
                                    className="mt-1 h-10 w-full border-gray-200 text-sm"
                                />
                                <InputError message={form.errors.amount} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value="Bukti Pembayaran" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => form.setData('proof', event.target.files?.[0] ?? null)}
                                    className="mt-1 block h-10 w-full rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-3 file:h-full file:border-0 file:bg-gray-100 file:px-3 file:text-sm file:font-semibold file:text-gray-600 hover:file:bg-gray-200"
                                />
                                <InputError message={form.errors.proof} className="mt-1" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Catatan" />
                                <textarea
                                    value={form.data.notes}
                                    onChange={(event) => form.setData('notes', event.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400"
                                    rows={4}
                                    placeholder="Opsional, misalnya nomor referensi atau keterangan pembayaran"
                                />
                                <InputError message={form.errors.notes} className="mt-1" />
                            </div>
                        </div>
                    </section>
                </section>
            </form>
        </AuthenticatedLayout>
    );
}
