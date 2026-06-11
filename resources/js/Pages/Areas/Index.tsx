import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function StatCard({ label, value, meta }: { label: string; value: number; meta: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">{meta}</span>
            </div>
            <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-bold leading-none text-gray-900">{number(value)}</p>
                <svg width="74" height="38" viewBox="0 0 74 38" className="shrink-0">
                    <path d="M2 35 L2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7 L72 35 Z" fill="#F3F4F6" />
                    <path d="M2 24 L13 27 L24 17 L35 21 L46 9 L58 15 L72 7" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default function Index({ areas }: any) {
    const form = useForm({ name: '', description: '' });
    const totalCustomers = areas.reduce((sum: number, area: any) => sum + Number(area.customers_count || 0), 0);
    const emptyAreas = areas.filter((area: any) => Number(area.customers_count || 0) === 0).length;

    const submit = (event: any) => {
        event.preventDefault();
        form.post(route('areas.store'), { onSuccess: () => form.reset() });
    };

    const destroy = (area: any) => {
        if (Number(area.customers_count || 0) > 0) {
            return;
        }

        router.delete(route('areas.destroy', area.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Area" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Area</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Kelola blok, rute, atau wilayah layanan pelanggan.</p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Total Area" value={areas.length} meta="Wilayah" />
                    <StatCard label="Total Pelanggan" value={totalCustomers} meta="Terdaftar" />
                    <StatCard label="Area Kosong" value={emptyAreas} meta="Bisa dihapus" />
                </section>

                <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
                    <form onSubmit={submit} className="rounded-xl border border-gray-100 bg-white p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Tambah Area</h2>
                            <p className="text-sm text-gray-400">Gunakan nama yang mudah dikenali petugas lapangan.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nama Area</label>
                                <TextInput
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder="Contoh: Blok A"
                                    className="mt-1 h-10 w-full border-gray-200 text-sm"
                                />
                                <InputError message={form.errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    value={form.data.description}
                                    onChange={(event) => form.setData('description', event.target.value)}
                                    placeholder="Keterangan rute atau cakupan area"
                                    className="mt-1 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400"
                                    rows={4}
                                />
                                <InputError message={form.errors.description} className="mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {form.processing ? 'Menyimpan...' : 'Tambah Area'}
                            </button>
                        </div>
                    </form>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Daftar Area</h2>
                                <p className="text-sm text-gray-400">Area dengan pelanggan tidak dapat dihapus.</p>
                            </div>
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(areas.length)} area</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Area</th>
                                        <th className="px-3 py-3">Deskripsi</th>
                                        <th className="px-3 py-3">Pelanggan</th>
                                        <th className="px-5 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {areas.map((area: any) => (
                                        <tr key={area.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                            <td className="px-5 py-3.5">
                                                <div className="font-medium text-gray-800">{area.name}</div>
                                                <div className="mt-0.5 text-xs text-gray-400">ID #{area.id}</div>
                                            </td>
                                            <td className="max-w-md px-3 py-3.5 text-gray-500">
                                                <div className="truncate">{area.description || '-'}</div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                    {number(area.customers_count)} pelanggan
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    disabled={Number(area.customers_count || 0) > 0}
                                                    onClick={() => destroy(area)}
                                                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {areas.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                                                Belum ada area.
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
