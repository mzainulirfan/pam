import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const money = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function StatCard({ label, value, meta }: { label: string; value: string | number; meta: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">{meta}</span>
            </div>
            <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-bold leading-none text-gray-900">{value}</p>
                <svg width="74" height="38" viewBox="0 0 74 38" className="shrink-0">
                    <path d="M2 35 L2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7 L72 35 Z" fill="#F3F4F6" />
                    <path d="M2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

function Field({ label, error, ...props }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <TextInput {...props} className="mt-1 h-10 w-full border-gray-200 text-sm" />
            <InputError message={error} className="mt-1" />
        </div>
    );
}

export default function Index({ tariffs }: any) {
    const form = useForm({ name: '', price_per_m3: 0, fixed_charge: 0, late_fee: 0, admin_fee: 0, is_active: true as any });
    const activeTariffs = tariffs.filter((tariff: any) => tariff.is_active).length;
    const averageRate = tariffs.length
        ? Math.round(tariffs.reduce((sum: number, tariff: any) => sum + Number(tariff.price_per_m3 || 0), 0) / tariffs.length)
        : 0;

    const submit = (event: any) => {
        event.preventDefault();
        form.post(route('tariffs.store'), { onSuccess: () => form.reset() });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tarif" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Tarif</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Kelola paket biaya air, abonemen, denda, dan biaya administrasi.</p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Total Tarif" value={money(tariffs.length)} meta="Paket" />
                    <StatCard label="Tarif Aktif" value={money(activeTariffs)} meta="Digunakan" />
                    <StatCard label="Rata-rata /m3" value={`Rp ${money(averageRate)}`} meta="Harga air" />
                </section>

                <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
                    <form onSubmit={submit} className="rounded-xl border border-gray-100 bg-white p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Tambah Tarif</h2>
                            <p className="text-sm text-gray-400">Buat struktur biaya baru untuk periode penagihan berikutnya.</p>
                        </div>

                        <div className="space-y-4">
                            <Field
                                label="Nama Tarif"
                                value={form.data.name}
                                onChange={(event: any) => form.setData('name', event.target.value)}
                                placeholder="Contoh: Rumah Tangga"
                                error={form.errors.name}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Tarif / m3"
                                    type="number"
                                    value={form.data.price_per_m3}
                                    onChange={(event: any) => form.setData('price_per_m3', event.target.value)}
                                    error={form.errors.price_per_m3}
                                />
                                <Field
                                    label="Abonemen"
                                    type="number"
                                    value={form.data.fixed_charge}
                                    onChange={(event: any) => form.setData('fixed_charge', event.target.value)}
                                    error={form.errors.fixed_charge}
                                />
                                <Field
                                    label="Denda"
                                    type="number"
                                    value={form.data.late_fee}
                                    onChange={(event: any) => form.setData('late_fee', event.target.value)}
                                    error={form.errors.late_fee}
                                />
                                <Field
                                    label="Admin"
                                    type="number"
                                    value={form.data.admin_fee}
                                    onChange={(event: any) => form.setData('admin_fee', event.target.value)}
                                    error={form.errors.admin_fee}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {form.processing ? 'Menyimpan...' : 'Tambah Tarif'}
                            </button>
                        </div>
                    </form>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Daftar Tarif</h2>
                                <p className="text-sm text-gray-400">Biaya yang menjadi dasar perhitungan tagihan pelanggan.</p>
                            </div>
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{money(tariffs.length)} tarif</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Nama</th>
                                        <th className="px-3 py-3">Tarif / m3</th>
                                        <th className="px-3 py-3">Abonemen</th>
                                        <th className="px-3 py-3">Denda</th>
                                        <th className="px-3 py-3">Admin</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tariffs.map((tariff: any) => (
                                        <tr key={tariff.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                            <td className="px-5 py-3.5">
                                                <div className="font-medium text-gray-800">{tariff.name}</div>
                                                <div className="mt-0.5 text-xs text-gray-400">ID #{tariff.id}</div>
                                            </td>
                                            <td className="px-3 py-3.5 font-medium text-gray-700">Rp {money(tariff.price_per_m3)}</td>
                                            <td className="px-3 py-3.5 text-gray-500">Rp {money(tariff.fixed_charge)}</td>
                                            <td className="px-3 py-3.5 text-gray-500">Rp {money(tariff.late_fee)}</td>
                                            <td className="px-3 py-3.5 text-gray-500">Rp {money(tariff.admin_fee)}</td>
                                            <td className="px-5 py-3.5">
                                                {tariff.is_active ? <StatusBadge status="open" /> : <StatusBadge status="closed" />}
                                            </td>
                                        </tr>
                                    ))}
                                    {tariffs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                                                Belum ada tarif.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
