import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function MiniSparkline({ tone = 'green' }: { tone?: 'green' | 'red' | 'gray' }) {
    const colors = {
        green: { stroke: '#10B981', fill: '#D1FAE5' },
        red: { stroke: '#EF4444', fill: '#FEE2E2' },
        gray: { stroke: '#374151', fill: '#F3F4F6' },
    };
    const color = colors[tone];

    return (
        <svg width="82" height="42" viewBox="0 0 82 42" className="shrink-0">
            <path d="M2 38 L2 26 L14 30 L26 18 L38 23 L50 10 L62 17 L80 7 L80 38 Z" fill={color.fill} opacity="0.75" />
            <path d="M2 26 L14 30 L26 18 L38 23 L50 10 L62 17 L80 7" fill="none" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function KpiCard({
    label,
    value,
    delta,
    deltaTone = 'green',
    sparkTone = 'green',
}: {
    label: string;
    value: string | number;
    delta: string;
    deltaTone?: 'green' | 'red' | 'gray';
    sparkTone?: 'green' | 'red' | 'gray';
}) {
    const deltaClasses = {
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-500',
        gray: 'bg-gray-100 text-gray-500',
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <button type="button" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                </button>
            </div>
            <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-3xl font-bold leading-none text-gray-900">{value}</p>
                    <div className="mt-2 flex items-center gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${deltaClasses[deltaTone]}`}>{delta}</span>
                        <span className="text-xs text-gray-400">periode ini</span>
                    </div>
                </div>
                <MiniSparkline tone={sparkTone} />
            </div>
        </div>
    );
}

function BarChart({ usageChart }: { usageChart: any[] }) {
    const maxUsage = Math.max(1, ...usageChart.map((row) => Number(row.total_usage)));

    return (
        <div className="h-60">
            <div className="flex h-full items-end gap-3 border-b border-gray-100 pt-6">
                {usageChart.map((row, index) => {
                    const usage = Number(row.total_usage);
                    const height = Math.max(10, (usage / maxUsage) * 100);

                    return (
                        <div key={row.billing_period_id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                            <div className="text-xs font-semibold text-gray-500">{number(usage)}</div>
                            <div
                                className={`w-full max-w-12 rounded-t-md transition ${index === usageChart.length - 1 ? 'bg-gray-900' : 'bg-gray-200'}`}
                                style={{ height: `${height}%` }}
                            />
                            <div className="max-w-16 truncate text-xs text-gray-400">{row.billing_period?.name}</div>
                        </div>
                    );
                })}
                {usageChart.length === 0 && <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">Belum ada data pemakaian.</div>}
            </div>
        </div>
    );
}

function ProgressLine({ label, value, total, rate }: { label: string; value: number; total: number; rate: number }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{number(value)} dari {number(total)} pelanggan</p>
                </div>
                <span className="text-xs font-semibold text-gray-600">{rate}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-gray-900" style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} />
            </div>
        </div>
    );
}

export default function Dashboard({
    stats,
    activePeriod,
    periods,
    filters,
    usageChart,
    areaProgress,
    recentBills,
}: PageProps<{
    stats: any;
    activePeriod: any;
    periods: any[];
    filters: any;
    usageChart: any[];
    areaProgress: any[];
    recentBills: any[];
}>) {
    const [period, setPeriod] = useState(filters.billing_period_id ?? activePeriod?.id ?? '');
    const applyPeriod = (value: string) => {
        setPeriod(value);
        router.get(route('dashboard'), { billing_period_id: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex-1 space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard Operasional</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Ringkasan pelanggan, pencatatan meter, tagihan, dan pembayaran air sesuai periode.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                            value={period}
                            onChange={(event) => applyPeriod(event.target.value)}
                            className="h-10 rounded-lg border-gray-200 bg-white text-sm font-medium text-gray-600 focus:border-gray-400 focus:ring-gray-400"
                        >
                            {periods.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                    <KpiCard label="Pelanggan Aktif" value={number(stats.activeCustomers)} delta={`${stats.readingRate}% tercatat`} />
                    <KpiCard label="Tagihan Periode" value={money(stats.currentBills)} delta={`${stats.collectionRate}% terbayar`} sparkTone="gray" />
                    <KpiCard label="Total Tunggakan" value={money(stats.overdue)} delta={`${number(stats.unpaidBills)} belum lunas`} deltaTone={stats.overdue > 0 ? 'red' : 'green'} sparkTone={stats.overdue > 0 ? 'red' : 'green'} />
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-3">
                        <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                <h2 className="font-semibold text-gray-900">Tren Pemakaian Air</h2>
                            </div>
                            <Link href={route('reports.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900">Laporan</Link>
                        </div>
                        <p className="mb-4 text-sm text-gray-400">Total m3 dari pencatatan meter per periode.</p>
                        <BarChart usageChart={usageChart} />
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Update Terbaru</h2>
                            <span className="text-xs font-medium text-gray-400">{recentBills.length} tagihan</span>
                        </div>
                        <div className="space-y-3">
                            {recentBills.slice(0, 5).map((bill) => (
                                <Link key={bill.id} href={route('bills.show', bill.id)} className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-gray-50">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                        {bill.customer?.name?.slice(0, 2)?.toUpperCase() ?? 'TG'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-800">{bill.customer?.name}</p>
                                        <p className="truncate text-xs text-gray-400">{bill.bill_number} - {money(bill.remaining_amount)}</p>
                                    </div>
                                    <StatusBadge status={bill.status} />
                                </Link>
                            ))}
                            {recentBills.length === 0 && <p className="py-6 text-center text-sm text-gray-400">Belum ada tagihan periode ini.</p>}
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Progress Area</h2>
                            <Link href={route('customers.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900">Pelanggan</Link>
                        </div>
                        <div className="space-y-4">
                            {areaProgress.map((area) => (
                                <ProgressLine
                                    key={area.id}
                                    label={area.name}
                                    value={area.read_customers}
                                    total={area.total_customers}
                                    rate={area.rate}
                                />
                            ))}
                            {areaProgress.length === 0 && <p className="text-sm text-gray-400">Belum ada data area.</p>}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white xl:col-span-3">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Tagihan Periode</h2>
                                <p className="text-sm text-gray-400">Daftar tagihan terbaru yang perlu dipantau.</p>
                            </div>
                            <Link href={route('bills.index')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                Semua
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Nomor</th>
                                        <th className="px-3 py-3">Pelanggan</th>
                                        <th className="px-3 py-3">Periode</th>
                                        <th className="px-3 py-3">Sisa</th>
                                        <th className="px-3 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBills.map((bill) => (
                                        <tr key={bill.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                            <td className="px-5 py-3.5">
                                                <Link href={route('bills.show', bill.id)} className="font-medium text-gray-700 hover:text-gray-950">
                                                    {bill.bill_number}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-3.5 text-gray-600">{bill.customer?.name}</td>
                                            <td className="px-3 py-3.5 text-gray-500">{bill.billing_period?.name}</td>
                                            <td className="px-3 py-3.5 font-medium text-gray-700">{money(bill.remaining_amount)}</td>
                                            <td className="px-3 py-3.5"><StatusBadge status={bill.status} /></td>
                                        </tr>
                                    ))}
                                    {recentBills.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada tagihan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                            <span className="text-xs text-gray-400">Menampilkan {recentBills.length} tagihan terbaru</span>
                            <div className="flex items-center gap-1">
                                <span className="rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white">1</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
