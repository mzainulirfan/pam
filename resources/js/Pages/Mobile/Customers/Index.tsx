import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function SummaryCard({ label, value, meta }: { label: string; value: number; meta: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
            <p className="mt-2 text-2xl font-bold leading-none text-gray-900">{number(value)}</p>
            <p className="mt-2 text-xs text-gray-400">{meta}</p>
        </div>
    );
}

function ReadingBadge({ done }: { done: boolean }) {
    return (
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${done ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {done ? 'Sudah Dicatat' : 'Belum Dicatat'}
        </span>
    );
}

export default function Index({ customers, areas, activePeriod, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [area, setArea] = useState(filters.area_id || '');
    const rows = customers.data ?? [];
    const readCount = rows.filter((customer: any) => customer.has_reading).length;
    const unreadCount = rows.length - readCount;

    const apply = () => router.get(route('mobile.customers.index'), { search, area_id: area }, { preserveState: true, replace: true });
    const reset = () => {
        setSearch('');
        setArea('');
        router.get(route('mobile.customers.index'), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mobile Petugas" />

            <div className="space-y-4 p-4 pb-8 sm:p-6">
                <section className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900">Mobile Petugas</h1>
                    <p className="text-sm text-gray-500">
                        {activePeriod ? `Pencatatan meter periode ${activePeriod.name}` : 'Belum ada periode terbuka.'}
                    </p>
                </section>

                <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <SummaryCard label="Target" value={rows.length} meta="Halaman ini" />
                    <SummaryCard label="Selesai" value={readCount} meta="Sudah dicatat" />
                    <div className="col-span-2 md:col-span-1">
                        <SummaryCard label="Belum" value={unreadCount} meta="Perlu dikunjungi" />
                    </div>
                </section>

                <section className="sticky top-16 z-20 rounded-xl border border-gray-100 bg-white/95 p-3 shadow-sm backdrop-blur">
                    <div className="grid gap-2">
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
                                className="h-11 w-full border-gray-200 pl-9 text-base"
                            />
                        </div>
                        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                            <select value={area} onChange={(event) => setArea(event.target.value)} className="h-11 rounded-lg border-gray-200 text-base text-gray-600">
                                <option value="">Semua area</option>
                                {areas.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={apply} className="h-11 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800">
                                Filter
                            </button>
                            <button type="button" onClick={reset} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                Reset
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    {rows.map((customer: any) => (
                        <Link key={customer.id} href={route('mobile.meter-readings.create', customer.id)} className="block rounded-xl border border-gray-100 bg-white p-4 transition active:scale-[0.99]">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-lg font-semibold text-gray-900">{customer.name}</div>
                                    <div className="mt-0.5 text-sm text-gray-500">{customer.customer_number} - {customer.area?.name ?? 'Tanpa area'}</div>
                                </div>
                                <ReadingBadge done={customer.has_reading} />
                            </div>

                            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                <div className="line-clamp-2">{customer.address || '-'}</div>
                                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-400">
                                    <span>Meter {customer.meter?.meter_number ?? '-'}</span>
                                    <span>{customer.has_reading ? 'Sudah dicatat' : 'Tap untuk catat meter'}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {rows.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
                            Tidak ada pelanggan sesuai filter.
                        </div>
                    )}
                </section>

                <section className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
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
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
