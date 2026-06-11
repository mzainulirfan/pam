import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function StatCard({ label, value, meta, tone = 'gray' }: { label: string; value: string | number; meta: string; tone?: 'gray' | 'green' | 'amber' }) {
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
                <p className="text-3xl font-bold leading-none text-gray-900">{value}</p>
                <svg width="74" height="38" viewBox="0 0 74 38" className="shrink-0">
                    <path d="M2 35 L2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7 L72 35 Z" fill={color.fill} />
                    <path d="M2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7" fill="none" stroke={color.spark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default function Index({ payments }: any) {
    const rows = payments.data ?? [];
    const totalAmount = rows.reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);
    const uniqueCustomers = new Set(rows.map((payment: any) => payment.bill?.customer?.id).filter(Boolean)).size;
    const uniqueMethods = new Set(rows.map((payment: any) => payment.payment_method?.name).filter(Boolean)).size;

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Pembayaran</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Riwayat transaksi pembayaran tagihan air pelanggan.</p>
                    </div>
                    <Link href={route('bills.index', { status: 'unpaid' })} className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                        Cari Tagihan
                    </Link>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Total Transaksi" value={number(payments.total ?? rows.length)} meta="Pembayaran" />
                    <StatCard label="Nominal Masuk" value={money(totalAmount)} meta="Halaman ini" tone="green" />
                    <StatCard label="Pelanggan Unik" value={number(uniqueCustomers)} meta={`${number(uniqueMethods)} metode`} tone="amber" />
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Daftar Pembayaran</h2>
                            <p className="text-sm text-gray-400">Transaksi terbaru ditampilkan paling atas.</p>
                        </div>
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(payments.total ?? 0)} data</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Pembayaran</th>
                                    <th className="px-3 py-3">Tagihan</th>
                                    <th className="px-3 py-3">Pelanggan</th>
                                    <th className="px-3 py-3">Metode</th>
                                    <th className="px-3 py-3">Jumlah</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((payment: any) => (
                                    <tr key={payment.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                        <td className="px-5 py-3.5">
                                            <div className="font-medium text-gray-800">{payment.payment_number}</div>
                                            <div className="mt-0.5 text-xs text-gray-400">ID #{payment.id}</div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <Link className="font-medium text-gray-700 hover:text-gray-950" href={route('bills.show', payment.bill.id)}>
                                                {payment.bill.bill_number}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="font-medium text-gray-700">{payment.bill.customer?.name ?? '-'}</div>
                                            <div className="mt-0.5 text-xs text-gray-400">{payment.bill.customer?.customer_number ?? '-'}</div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{payment.payment_method?.name ?? '-'}</span>
                                        </td>
                                        <td className="px-3 py-3.5 font-medium text-gray-700">{money(payment.amount)}</td>
                                        <td className="px-5 py-3.5 text-gray-500">{payment.paid_at}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                                            Belum ada pembayaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <span>Showing {payments.from ?? 0} of {payments.total ?? 0} payments</span>
                        <div className="flex flex-wrap gap-1">
                            {payments.links?.map((link: any, index: number) => (
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
