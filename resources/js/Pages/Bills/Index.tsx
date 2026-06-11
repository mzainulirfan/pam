import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
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

export default function Index({ bills, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const rows = bills.data ?? [];
    const totalRemaining = rows.reduce((sum: number, bill: any) => sum + Number(bill.remaining_amount || 0), 0);
    const paidCount = rows.filter((bill: any) => bill.status === 'paid').length;
    const overdueCount = rows.filter((bill: any) => bill.status === 'overdue').length;

    const apply = () => router.get(route('bills.index'), { search, status }, { preserveState: true, replace: true });
    const reset = () => {
        setSearch('');
        setStatus('');
        router.get(route('bills.index'), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tagihan" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Tagihan</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Pantau tagihan pelanggan, sisa pembayaran, dan status penagihan.</p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Data" value={number(bills.total ?? rows.length)} meta="Tagihan" />
                    <StatCard label="Lunas di Halaman Ini" value={number(paidCount)} meta="Paid" tone="green" />
                    <StatCard label="Lewat Tempo" value={number(overdueCount)} meta="Overdue" tone="red" />
                    <StatCard label="Sisa Tagihan" value={money(totalRemaining)} meta="Halaman ini" tone="amber" />
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]">
                        <div className="relative">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <TextInput
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') apply();
                                }}
                                placeholder="Cari nama atau nomor pelanggan"
                                className="h-10 w-full border-gray-200 pl-9 text-sm"
                            />
                        </div>
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border-gray-200 text-sm text-gray-600">
                            <option value="">Semua status</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button type="button" onClick={apply} className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800">
                            Filter
                        </button>
                        <button type="button" onClick={reset} className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Reset
                        </button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Daftar Tagihan</h2>
                            <p className="text-sm text-gray-400">Menampilkan tagihan berdasarkan filter aktif.</p>
                        </div>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(bills.total ?? 0)} data</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Tagihan</th>
                                    <th className="px-3 py-3">Pelanggan</th>
                                    <th className="px-3 py-3">Periode</th>
                                    <th className="px-3 py-3">Total</th>
                                    <th className="px-3 py-3">Sisa</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((bill: any) => (
                                    <tr key={bill.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                        <td className="px-5 py-3.5">
                                            <Link href={route('bills.show', bill.id)} className="font-medium text-gray-800 hover:text-gray-950">
                                                {bill.bill_number}
                                            </Link>
                                            <div className="mt-0.5 text-xs text-gray-400">ID #{bill.id}</div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="font-medium text-gray-700">{bill.customer?.name ?? '-'}</div>
                                            <div className="mt-0.5 text-xs text-gray-400">{bill.customer?.customer_number ?? bill.customer?.area?.name ?? '-'}</div>
                                        </td>
                                        <td className="px-3 py-3.5 text-gray-500">{bill.billing_period?.name ?? '-'}</td>
                                        <td className="px-3 py-3.5 font-medium text-gray-700">{money(bill.total_amount)}</td>
                                        <td className="px-3 py-3.5 text-gray-500">{money(bill.remaining_amount)}</td>
                                        <td className="px-3 py-3.5">
                                            <StatusBadge status={bill.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('bills.show', bill.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                                                    Detail
                                                </Link>
                                                {bill.status !== 'paid' && (
                                                    <Link href={route('payments.create', bill.id)} className="rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-gray-800">
                                                        Bayar
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                                            Tidak ada tagihan sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <span>Showing {bills.from ?? 0} of {bills.total ?? 0} bills</span>
                        <div className="flex flex-wrap gap-1">
                            {bills.links?.map((link: any, index: number) => (
                                <button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                    className={`rounded-lg px-2.5 py-1.5 text-xs ${link.active ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'} disabled:cursor-not-allowed disabled:opacity-40`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
