import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function StatCard({ label, value, meta, tone = 'gray' }: { label: string; value: number; meta: string; tone?: 'gray' | 'green' | 'amber' }) {
    const tones = {
        gray: { badge: 'bg-gray-100 text-gray-600', spark: '#374151', fill: '#F3F4F6' },
        green: { badge: 'bg-green-50 text-green-600', spark: '#10B981', fill: '#D1FAE5' },
        amber: { badge: 'bg-amber-50 text-amber-600', spark: '#F59E0B', fill: '#FEF3C7' },
    };
    const color = tones[tone];

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color.badge}`}>{meta}</span>
            </div>
            <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-bold leading-none text-gray-900">{number(value)}</p>
                <svg width="74" height="38" viewBox="0 0 74 38" className="shrink-0">
                    <path d="M2 35 L2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7 L72 35 Z" fill={color.fill} />
                    <path d="M2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7" fill="none" stroke={color.spark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default function Index({ customers, areas, filters, stats }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [area, setArea] = useState(filters.area_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const apply = () =>
        router.get(route('customers.index'), { search, area_id: area, status }, { preserveState: true, replace: true });

    const reset = () => {
        setSearch('');
        setArea('');
        setStatus('');
        router.get(route('customers.index'), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pelanggan" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Pelanggan</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Kelola data pelanggan, meteran, area, dan status layanan.</p>
                    </div>
                    <Link href={route('customers.create')} className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                        Tambah Pelanggan
                    </Link>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Pelanggan" value={stats.total} meta="Semua" />
                    <StatCard label="Aktif" value={stats.active} meta="Berjalan" tone="green" />
                    <StatCard label="Nonaktif" value={stats.inactive} meta="Ditahan" />
                    <StatCard label="Punya Tagihan" value={stats.withUnpaidBills} meta="Belum lunas" tone="amber" />
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto_auto]">
                        <div className="relative">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') apply();
                                }}
                                placeholder="Cari nama atau nomor pelanggan"
                                className="h-10 w-full border-gray-200 pl-9 text-sm"
                            />
                        </div>
                        <select value={area} onChange={(e) => setArea(e.target.value)} className="h-10 rounded-lg border-gray-200 text-sm text-gray-600">
                            <option value="">Semua area</option>
                            {areas.map((item: any) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border-gray-200 text-sm text-gray-600">
                            <option value="">Semua status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                        <button type="button" onClick={apply} className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800">Filter</button>
                        <button type="button" onClick={reset} className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 hover:bg-gray-50">Reset</button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Daftar Pelanggan</h2>
                            <p className="text-sm text-gray-400">Menampilkan data pelanggan berdasarkan filter aktif.</p>
                        </div>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(customers.total ?? 0)} data</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Pelanggan</th>
                                    <th className="px-3 py-3">Kontak</th>
                                    <th className="px-3 py-3">Area</th>
                                    <th className="px-3 py-3">Meter</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.map((customer: any) => (
                                    <tr key={customer.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                        <td className="px-5 py-3.5">
                                            <div className="font-medium text-gray-800">{customer.name}</div>
                                            <div className="mt-0.5 text-xs text-gray-400">{customer.customer_number}</div>
                                            <div className="mt-1 max-w-md truncate text-xs text-gray-400">{customer.address}</div>
                                        </td>
                                        <td className="px-3 py-3.5 text-gray-600">{customer.phone}</td>
                                        <td className="px-3 py-3.5">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{customer.area?.name ?? '-'}</span>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="font-medium text-gray-700">{customer.meter?.meter_number ?? '-'}</div>
                                            <div className="text-xs text-gray-400">Awal {number(customer.meter?.initial_reading ?? 0)} m3</div>
                                        </td>
                                        <td className="px-3 py-3.5"><StatusBadge status={customer.status} /></td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('customers.show', customer.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">Detail</Link>
                                                <Link href={route('customers.edit', customer.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">Edit</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Tidak ada pelanggan sesuai filter.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <span>Showing {customers.from ?? 0} of {customers.total ?? 0} customers</span>
                        <div className="flex flex-wrap gap-1">
                            {customers.links?.map((link: any, index: number) => (
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
