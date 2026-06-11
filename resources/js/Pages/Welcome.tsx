import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-2xl font-bold text-gray-950">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>
    );
}

function ModuleCard({ title, description, code }: { title: string; description: string; code: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">{code}</div>
            <h3 className="font-semibold text-gray-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        </div>
    );
}

function Step({ index, title, detail }: { index: string; title: string; detail: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">{index}</div>
            <div>
                <h3 className="font-semibold text-gray-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">{detail}</p>
            </div>
        </div>
    );
}

function DashboardPreview() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-950">Dashboard Operasional</p>
                        <p className="text-xs text-gray-400">Periode berjalan</p>
                    </div>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Open</span>
                </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Tagihan</p>
                    <p className="mt-2 text-xl font-bold text-gray-950">{money(18450000)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Terbayar</p>
                    <p className="mt-2 text-xl font-bold text-gray-950">{money(15200000)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Tercatat</p>
                    <p className="mt-2 text-xl font-bold text-gray-950">86%</p>
                </div>
            </div>
            <div className="px-5 pb-5">
                {[
                    ['INV-2026-0612', 'Budi Santoso', 'paid', 'Rp 82.000'],
                    ['INV-2026-0611', 'Siti Aminah', 'partial', 'Rp 46.000'],
                    ['INV-2026-0610', 'Ahmad Fadli', 'overdue', 'Rp 93.000'],
                ].map(([invoice, name, status, amount]) => (
                    <div key={invoice} className="flex items-center justify-between border-t border-gray-100 py-3">
                        <div>
                            <p className="text-sm font-medium text-gray-800">{invoice}</p>
                            <p className="text-xs text-gray-400">{name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{amount}</p>
                            <p className="text-xs text-gray-400">{status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Welcome({
    auth,
    canLogin,
    canRegister,
}: PageProps<{ canLogin: boolean; canRegister: boolean }>) {
    const primaryHref = auth.user ? route('dashboard') : route('login');

    return (
        <>
            <Head title="Sistem Tagihan Air" />

            <main className="min-h-screen bg-white text-gray-900">
                <section className="relative min-h-[88vh] overflow-hidden bg-gray-950 text-white">
                    <img
                        src="/images/home-water-operations.svg"
                        alt="Ilustrasi operasional layanan air"
                        className="absolute inset-0 h-full w-full object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/55 to-gray-950/90" />

                    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-900">
                                <ApplicationLogo className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="font-semibold">Sistem Tagihan Air</p>
                                <p className="text-xs text-gray-300">PAM Operations</p>
                            </div>
                        </Link>

                        {canLogin && (
                            <nav className="flex items-center gap-2">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
                                            Masuk
                                        </Link>
                                        {canRegister && (
                                            <Link href={route('register')} className="hidden rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 sm:inline-flex">
                                                Daftar
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        )}
                    </header>

                    <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 lg:min-h-[calc(88vh-84px)]">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Water billing workspace</p>
                            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
                                Sistem Tagihan Air
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                                Aplikasi operasional untuk pelanggan, pencatatan meter, penagihan, pembayaran, dan laporan layanan air.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={primaryHref} className="inline-flex h-11 items-center rounded-lg bg-white px-5 text-sm font-semibold text-gray-950 hover:bg-gray-100">
                                    {auth.user ? 'Buka Dashboard' : 'Masuk ke Sistem'}
                                </Link>
                                <Link href={route('mobile.customers.index')} className="inline-flex h-11 items-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10">
                                    Mobile Petugas
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="-mt-10 relative z-20 mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-4">
                        <Stat label="Pencatatan meter lapangan" value="Mobile" />
                        <Stat label="Tagihan dari pemakaian" value="Otomatis" />
                        <Stat label="Pembayaran dan bukti" value="Tercatat" />
                        <Stat label="Laporan per periode" value="Realtime" />
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Alur kerja</p>
                        <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-gray-950">Dari baca meter sampai pembayaran dalam satu jalur kerja.</h2>
                        <div className="mt-8 space-y-6">
                            <Step index="01" title="Kelola pelanggan dan area" detail="Data pelanggan, meter, alamat, nomor telepon, dan area layanan menjadi dasar pencarian serta rute petugas." />
                            <Step index="02" title="Catat meter dari lapangan" detail="Petugas membuka daftar pelanggan mobile, mengunggah foto meter, lalu sistem menghitung pemakaian periode." />
                            <Step index="03" title="Terbitkan tagihan dan pembayaran" detail="Tagihan dihitung dari tarif aktif, pembayaran dicatat dengan metode dan bukti, lalu laporan langsung tersedia." />
                        </div>
                    </div>
                    <DashboardPreview />
                </section>

                <section className="border-t border-gray-100 bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="mb-8 max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Modul utama</p>
                            <h2 className="mt-3 text-3xl font-bold text-gray-950">Fokus pada kebutuhan operasional harian.</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <ModuleCard code="PL" title="Pelanggan" description="Kelola identitas, area, status layanan, meter, alamat, dan riwayat tagihan pelanggan." />
                            <ModuleCard code="MT" title="Catat Meter" description="Tampilan mobile untuk petugas dengan foto meter, OCR, estimasi tagihan, dan struk." />
                            <ModuleCard code="TG" title="Tagihan" description="Pantau status unpaid, partial, paid, dan overdue dengan sisa tagihan per pelanggan." />
                            <ModuleCard code="LP" title="Laporan" description="Lihat total tagihan, kas masuk, tunggakan, dan kolektibilitas berdasarkan periode." />
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-950">Siap mengelola operasional tagihan air?</h2>
                            <p className="mt-1 text-sm text-gray-500">Masuk ke dashboard untuk mulai memantau periode berjalan.</p>
                        </div>
                        <Link href={primaryHref} className="inline-flex h-11 w-fit items-center rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800">
                            {auth.user ? 'Buka Dashboard' : 'Masuk Sekarang'}
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
