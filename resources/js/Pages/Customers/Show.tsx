import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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

export default function Show({ customer, summary }: any) {
    const readings = [...customer.meter_readings].sort((a: any, b: any) => String(b.read_at).localeCompare(String(a.read_at)));
    const bills = [...customer.bills].sort((a: any, b: any) => String(b.created_at).localeCompare(String(a.created_at)));

    return (
        <AuthenticatedLayout>
            <Head title={customer.name} />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold text-gray-900">{customer.name}</h1>
                            <StatusBadge status={customer.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{customer.customer_number} - {customer.area?.name ?? 'Tanpa area'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('mobile.meter-readings.create', customer.id)} className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                            Catat Meter
                        </Link>
                        <Link href={route('customers.edit', customer.id)} className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Edit
                        </Link>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Total Ditagihkan" value={money(summary.total_billed)} meta="Akumulasi seluruh tagihan" />
                    <SummaryCard label="Total Dibayar" value={money(summary.total_paid)} meta="Akumulasi pembayaran" />
                    <SummaryCard label="Sisa Tagihan" value={money(summary.total_due)} meta={`${number(summary.unpaid_count)} tagihan belum lunas`} />
                    <SummaryCard label="Rata-rata Pakai" value={`${number(summary.average_usage)} m3`} meta="Dari seluruh pencatatan" />
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Profil Pelanggan</h2>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{customer.area?.name ?? '-'}</span>
                        </div>
                        <InfoRow label="Nomor HP" value={customer.phone} />
                        <InfoRow label="Tanggal Mulai" value={customer.start_date} />
                        <InfoRow label="Nomor Meter" value={customer.meter?.meter_number} />
                        <InfoRow label="Meter Awal" value={`${number(customer.meter?.initial_reading ?? 0)} m3`} />
                        <InfoRow label="Alamat" value={customer.address} />
                        {customer.notes && <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{customer.notes}</div>}
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Riwayat Pemakaian</h2>
                            <span className="text-xs font-medium text-gray-400">{readings.length} data</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {readings.slice(0, 6).map((reading: any) => (
                                <div key={reading.id} className="flex items-center justify-between gap-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{reading.billing_period?.name}</p>
                                        <p className="text-xs text-gray-400">{number(reading.previous_reading)} ke {number(reading.current_reading)} m3</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{number(reading.usage_m3)} m3</p>
                                        <p className="text-xs text-gray-400">{reading.read_at}</p>
                                    </div>
                                </div>
                            ))}
                            {readings.length === 0 && <div className="py-8 text-center text-sm text-gray-400">Belum ada pencatatan meter.</div>}
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Riwayat Tagihan</h2>
                            <p className="text-sm text-gray-400">Tagihan dan status pembayaran pelanggan.</p>
                        </div>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{bills.length} tagihan</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Tagihan</th>
                                    <th className="px-3 py-3">Periode</th>
                                    <th className="px-3 py-3">Total</th>
                                    <th className="px-3 py-3">Sisa</th>
                                    <th className="px-3 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill: any) => (
                                    <tr className="border-b border-gray-100 transition hover:bg-gray-50" key={bill.id}>
                                        <td className="px-5 py-3.5">
                                            <Link href={route('bills.show', bill.id)} className="font-medium text-gray-700 hover:text-gray-950">{bill.bill_number}</Link>
                                        </td>
                                        <td className="px-3 py-3.5 text-gray-500">{bill.billing_period?.name}</td>
                                        <td className="px-3 py-3.5 text-gray-700">{money(bill.total_amount)}</td>
                                        <td className="px-3 py-3.5 font-medium text-gray-800">{money(bill.remaining_amount)}</td>
                                        <td className="px-3 py-3.5"><StatusBadge status={bill.status} /></td>
                                    </tr>
                                ))}
                                {bills.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">Belum ada tagihan.</td>
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
