import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function StatCard({ label, value, meta, tone = 'gray' }: { label: string; value: string | number; meta: string; tone?: 'gray' | 'green' | 'amber' | 'red' }) {
    const tones = {
        gray: { badge: 'bg-gray-100 text-gray-600', spark: '#374151', fill: '#F3F4F6' },
        green: { badge: 'bg-green-50 text-green-600', spark: '#10B981', fill: '#D1FAE5' },
        amber: { badge: 'bg-amber-50 text-amber-600', spark: '#F59E0B', fill: '#FEF3C7' },
        red: { badge: 'bg-red-50 text-red-600', spark: '#EF4444', fill: '#FEE2E2' },
    };
    const color = tones[tone];

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color.badge}`}>{meta}</span>
            </div>
            <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-bold leading-none text-gray-900">{value}</p>
                <svg width="74" height="38" viewBox="0 0 74 38" className="shrink-0">
                    <path d="M2 35 L2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7 L72 35 Z" fill={color.fill} />
                    <path d="M2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7" fill="none" stroke={color.spark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default function Index({ periods, filters, bills, payments }: any) {
    const [period, setPeriod] = useState(filters.billing_period_id || '');
    const selectedPeriod = periods.find((item: any) => String(item.id) === String(period));
    const billTotal = bills.reduce((sum: number, bill: any) => sum + Number(bill.total_amount || 0), 0);
    const paidTotal = payments.reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);
    const remainingTotal = bills.reduce((sum: number, bill: any) => sum + Number(bill.remaining_amount || 0), 0);
    const unpaidCount = bills.filter((bill: any) => ['unpaid', 'partial', 'overdue'].includes(bill.status)).length;
    const paidCount = bills.filter((bill: any) => bill.status === 'paid').length;
    const collectionRate = billTotal > 0 ? Math.round((paidTotal / billTotal) * 100) : 0;

    const apply = () => router.get(route('reports.index'), { billing_period_id: period }, { preserveState: true, replace: true });
    const reset = () => {
        setPeriod('');
        router.get(route('reports.index'), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporan" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Laporan</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Ringkasan tagihan, penerimaan, dan tunggakan {selectedPeriod ? `periode ${selectedPeriod.name}` : 'semua periode'}.
                        </p>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-10 rounded-lg border-gray-200 text-sm text-gray-600">
                            <option value="">Semua periode</option>
                            {periods.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={apply} className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800">
                            Filter
                        </button>
                        <button type="button" onClick={reset} className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Reset
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Tagihan" value={money(billTotal)} meta={`${number(bills.length)} data`} />
                    <StatCard label="Total Bayar" value={money(paidTotal)} meta={`${number(collectionRate)}% tertagih`} tone="green" />
                    <StatCard label="Tunggakan" value={money(remainingTotal)} meta={`${number(unpaidCount)} belum lunas`} tone="amber" />
                    <StatCard label="Tagihan Lunas" value={number(paidCount)} meta="Paid" tone="green" />
                </section>

                <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Laporan Tagihan</h2>
                                <p className="text-sm text-gray-400">Tagihan pelanggan sesuai periode laporan.</p>
                            </div>
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(bills.length)} tagihan</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Tagihan</th>
                                        <th className="px-3 py-3">Pelanggan</th>
                                        <th className="px-3 py-3">Area</th>
                                        <th className="px-3 py-3">Total</th>
                                        <th className="px-3 py-3">Sisa</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.map((bill: any) => (
                                        <tr key={bill.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                            <td className="px-5 py-3.5">
                                                <Link href={route('bills.show', bill.id)} className="font-medium text-gray-800 hover:text-gray-950">
                                                    {bill.bill_number}
                                                </Link>
                                                <div className="mt-0.5 text-xs text-gray-400">{bill.billing_period?.name ?? '-'}</div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="font-medium text-gray-700">{bill.customer?.name ?? '-'}</div>
                                                <div className="mt-0.5 text-xs text-gray-400">{bill.customer?.customer_number ?? '-'}</div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{bill.customer?.area?.name ?? '-'}</span>
                                            </td>
                                            <td className="px-3 py-3.5 font-medium text-gray-700">{money(bill.total_amount)}</td>
                                            <td className="px-3 py-3.5 text-gray-500">{money(bill.remaining_amount)}</td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status={bill.status} />
                                            </td>
                                        </tr>
                                    ))}
                                    {bills.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                                                Tidak ada tagihan untuk filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Kolektibilitas</h2>
                                <span className="text-xs font-semibold text-gray-400">{number(collectionRate)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full rounded-full bg-gray-900" style={{ width: `${Math.min(collectionRate, 100)}%` }} />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-gray-400">Lunas</p>
                                    <p className="mt-1 font-semibold text-gray-900">{number(paidCount)}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-gray-400">Belum lunas</p>
                                    <p className="mt-1 font-semibold text-gray-900">{number(unpaidCount)}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-100 bg-white">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Pembayaran Terbaru</h2>
                                <p className="text-sm text-gray-400">{number(payments.length)} transaksi pada laporan ini.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {payments.slice(0, 8).map((payment: any) => (
                                    <div key={payment.id} className="px-5 py-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{payment.payment_number}</p>
                                                <p className="text-xs text-gray-400">{payment.bill?.customer?.name ?? '-'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">{money(payment.amount)}</p>
                                                <p className="text-xs text-gray-400">{payment.paid_at}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {payments.length === 0 && <div className="px-5 py-10 text-center text-sm text-gray-400">Belum ada pembayaran.</div>}
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
