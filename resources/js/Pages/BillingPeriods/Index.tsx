import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const getMonthName = (month: number): string => {
    return monthNames[month - 1] || '';
};

const getNextMonthName = (month: number, year: number): { name: string; month: number; year: number } => {
    let nextMonth = month + 1;
    let nextYear = year;

    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
    }

    const name = `${monthNames[nextMonth - 1]} ${nextYear}`;
    return { name, month: nextMonth, year: nextYear };
};

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getFirstDayOfMonth = (month: number, year: number): string => {
    const date = new Date(year, month - 1, 1);
    return formatDate(date);
};

const getLastDayOfMonth = (month: number, year: number): string => {
    const date = new Date(year, month, 0);
    return formatDate(date);
};

const getDueDate = (month: number, year: number): string => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const date = new Date(nextYear, nextMonth - 1, 10);
    return formatDate(date);
};

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

export default function Index({ periods }: any) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const nextMonthData = getNextMonthName(currentMonth, currentYear);

    const form = useForm({
        name: nextMonthData.name,
        month: nextMonthData.month,
        year: nextMonthData.year,
        start_date: getFirstDayOfMonth(nextMonthData.month, nextMonthData.year),
        end_date: getLastDayOfMonth(nextMonthData.month, nextMonthData.year),
        due_date: getDueDate(nextMonthData.month, nextMonthData.year),
        status: 'open'
    });

    const openPeriods = periods.filter((period: any) => period.status === 'open').length;
    const closedPeriods = periods.filter((period: any) => period.status === 'closed').length;

    const handleMonthChange = (month: number) => {
        const year = form.data.year;
        const monthName = getMonthName(month);
        const periodName = `${monthName} ${year}`;
        const startDate = getFirstDayOfMonth(month, year);
        const endDate = getLastDayOfMonth(month, year);
        const dueDate = getDueDate(month, year);

        form.setData('month', month);
        form.setData('name', periodName);
        form.setData('start_date', startDate);
        form.setData('end_date', endDate);
        form.setData('due_date', dueDate);
    };

    const handleYearChange = (year: number) => {
        const month = form.data.month;
        const monthName = getMonthName(month);
        const periodName = `${monthName} ${year}`;
        const startDate = getFirstDayOfMonth(month, year);
        const endDate = getLastDayOfMonth(month, year);
        const dueDate = getDueDate(month, year);

        form.setData('year', year);
        form.setData('name', periodName);
        form.setData('start_date', startDate);
        form.setData('end_date', endDate);
        form.setData('due_date', dueDate);
    };

    const isMonthDisabled = (month: number, year: number): boolean => {
        // Check if period already exists
        const periodExists = periods.some((p: any) => p.month === month && p.year === year);
        if (periodExists) return true;

        // Check if month/year is in the past
        if (year < currentYear) return true;
        if (year === currentYear && month < currentMonth) return true;

        return false;
    };

    const submit = (event: any) => {
        event.preventDefault();
        form.post(route('billing-periods.store'), {
            onSuccess: () => {
                const nextMonth = getNextMonthName(currentMonth, currentYear);
                form.reset();
                form.setData({
                    name: nextMonth.name,
                    month: nextMonth.month,
                    year: nextMonth.year,
                    start_date: getFirstDayOfMonth(nextMonth.month, nextMonth.year),
                    end_date: getLastDayOfMonth(nextMonth.month, nextMonth.year),
                    due_date: getDueDate(nextMonth.month, nextMonth.year),
                    status: 'open'
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Periode Tagihan" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Periode Tagihan</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Atur rentang baca meter, jatuh tempo, dan status siklus tagihan.</p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Total Periode" value={number(periods.length)} meta="Siklus" />
                    <StatCard label="Periode Terbuka" value={number(openPeriods)} meta="Aktif" />
                    <StatCard label="Periode Ditutup" value={number(closedPeriods)} meta="Selesai" />
                </section>

                <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
                    <form onSubmit={submit} className="rounded-xl border border-gray-100 bg-white p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Tambah Periode</h2>
                            <p className="text-sm text-gray-400">Buat siklus baru sebelum input pemakaian pelanggan.</p>
                        </div>

                        <div className="space-y-4">
                            <Field
                                label="Nama Periode"
                                value={form.data.name}
                                onChange={(event: any) => form.setData('name', event.target.value)}
                                placeholder="Contoh: Januari 2026"
                                error={form.errors.name}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Bulan</label>
                                    <select
                                        value={form.data.month}
                                        onChange={(event: any) => handleMonthChange(parseInt(event.target.value))}
                                        className="mt-1 h-10 w-full rounded-lg border-gray-200 text-sm text-gray-600"
                                    >
                                        {monthNames.map((name, index) => {
                                            const month = index + 1;
                                            const disabled = isMonthDisabled(month, form.data.year);
                                            return (
                                                <option key={month} value={month} disabled={disabled}>
                                                    {name}{disabled ? ' (Sudah dibuat/Lewat)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {form.errors.month && <div className="mt-1 text-sm text-red-600">{form.errors.month}</div>}
                                </div>
                                <Field
                                    label="Tahun"
                                    type="number"
                                    value={form.data.year}
                                    onChange={(event: any) => handleYearChange(parseInt(event.target.value))}
                                    error={form.errors.year}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Tanggal Mulai"
                                    type="date"
                                    value={form.data.start_date}
                                    onChange={(event: any) => form.setData('start_date', event.target.value)}
                                    error={form.errors.start_date}
                                />
                                <Field
                                    label="Tanggal Selesai"
                                    type="date"
                                    value={form.data.end_date}
                                    onChange={(event: any) => form.setData('end_date', event.target.value)}
                                    error={form.errors.end_date}
                                />
                            </div>

                            <Field
                                label="Jatuh Tempo"
                                type="date"
                                value={form.data.due_date}
                                onChange={(event: any) => form.setData('due_date', event.target.value)}
                                error={form.errors.due_date}
                            />

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {form.processing ? 'Menyimpan...' : 'Tambah Periode'}
                            </button>
                        </div>
                    </form>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Daftar Periode</h2>
                                <p className="text-sm text-gray-400">Gunakan satu periode terbuka untuk proses baca dan tagih.</p>
                            </div>
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{number(periods.length)} periode</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Periode</th>
                                        <th className="px-3 py-3">Bulan</th>
                                        <th className="px-3 py-3">Rentang Baca</th>
                                        <th className="px-3 py-3">Jatuh Tempo</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {periods.map((period: any) => (
                                        <tr key={period.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                                            <td className="px-5 py-3.5">
                                                <div className="font-medium text-gray-800">{period.name}</div>
                                                <div className="mt-0.5 text-xs text-gray-400">ID #{period.id}</div>
                                            </td>
                                            <td className="px-3 py-3.5 text-gray-500">
                                                {period.month}/{period.year}
                                            </td>
                                            <td className="px-3 py-3.5 text-gray-500">
                                                <div>{period.start_date}</div>
                                                <div className="text-xs text-gray-400">sampai {period.end_date}</div>
                                            </td>
                                            <td className="px-3 py-3.5 font-medium text-gray-700">{period.due_date}</td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status={period.status} />
                                            </td>
                                        </tr>
                                    ))}
                                    {periods.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                                                Belum ada periode tagihan.
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
