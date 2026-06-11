import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function SummaryCard({ label, value, meta, tone = 'gray' }: { label: string; value: string | number; meta: string; tone?: 'gray' | 'green' | 'amber' }) {
    const tones = {
        gray: 'bg-gray-100 text-gray-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{meta}</span>
            </div>
            <p className="text-2xl font-bold leading-none text-gray-900">{value}</p>
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

export default function Show({ bill }: any) {
    const waText = encodeURIComponent(`Tagihan air ${bill.bill_number} atas nama ${bill.customer.name}: ${money(bill.total_amount)}. Sisa: ${money(bill.remaining_amount)}.`);
    const phone = String(bill.customer.phone || '').replace(/^0/, '62');
    const payments = [...(bill.payments ?? [])].sort((a: any, b: any) => String(b.paid_at).localeCompare(String(a.paid_at)));
    const usage = Number(bill.meter_reading?.usage_m3 ?? 0);

    return (
        <AuthenticatedLayout>
            <Head title={bill.bill_number} />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-semibold text-gray-900">{bill.bill_number}</h1>
                            <StatusBadge status={bill.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                            {bill.customer.name} - {bill.billing_period.name}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {bill.status !== 'paid' && (
                            <Link href={route('payments.create', bill.id)} className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                                Catat Pembayaran
                            </Link>
                        )}
                        <a
                            href={`https://wa.me/${phone}?text=${waText}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Kirim WhatsApp
                        </a>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard label="Total Tagihan" value={money(bill.total_amount)} meta="Invoice" />
                    <SummaryCard label="Sudah Dibayar" value={money(bill.paid_amount)} meta="Masuk" tone="green" />
                    <SummaryCard label="Sisa Tagihan" value={money(bill.remaining_amount)} meta="Outstanding" tone="amber" />
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Detail Tagihan</h2>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{bill.billing_period.name}</span>
                        </div>
                        <InfoRow label="Pelanggan" value={bill.customer.name} />
                        <InfoRow label="Nomor Pelanggan" value={bill.customer.customer_number} />
                        <InfoRow label="Area" value={bill.customer.area?.name} />
                        <InfoRow label="Nomor HP" value={bill.customer.phone} />
                        <InfoRow label="Periode" value={bill.billing_period.name} />
                        <InfoRow label="Status" value={<StatusBadge status={bill.status} />} />
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Pemakaian Meter</h2>
                            <span className="text-xs font-medium text-gray-400">{usage ? `${number(usage)} m3` : 'Tidak ada data'}</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Meter Awal</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">{number(bill.meter_reading?.previous_reading ?? 0)}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Meter Akhir</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">{number(bill.meter_reading?.current_reading ?? 0)}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Pemakaian</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">{number(usage)} m3</p>
                            </div>
                        </div>

                        {bill.meter_reading?.photo_path ? (
                            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                <img src={`/storage/${bill.meter_reading.photo_path}`} className="max-h-96 w-full object-contain" />
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                                Foto meter belum tersedia.
                            </div>
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Riwayat Pembayaran</h2>
                            <p className="text-sm text-gray-400">Transaksi yang sudah tercatat untuk tagihan ini.</p>
                        </div>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(payments.length)} transaksi</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Pembayaran</th>
                                    <th className="px-3 py-3">Metode</th>
                                    <th className="px-3 py-3">Jumlah</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment: any) => (
                                    <tr key={payment.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                        <td className="px-5 py-3.5">
                                            <div className="font-medium text-gray-800">{payment.payment_number}</div>
                                            <div className="mt-0.5 text-xs text-gray-400">ID #{payment.id}</div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{payment.payment_method?.name ?? '-'}</span>
                                        </td>
                                        <td className="px-3 py-3.5 font-medium text-gray-700">{money(payment.amount)}</td>
                                        <td className="px-5 py-3.5 text-gray-500">{payment.paid_at}</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                                            Belum ada pembayaran untuk tagihan ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
