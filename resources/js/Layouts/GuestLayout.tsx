import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
                <section className="hidden bg-gray-900 p-8 text-white lg:flex lg:flex-col lg:justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-900">
                            <ApplicationLogo className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="font-semibold">Sistem Tagihan Air</p>
                            <p className="text-xs text-gray-400">PAM Operations</p>
                        </div>
                    </Link>

                    <div className="max-w-xl">
                        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Billing workspace</p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight">Kelola pelanggan, meter, tagihan, dan pembayaran dalam satu tempat.</h1>
                        <div className="mt-8 grid grid-cols-3 gap-3">
                            <div className="rounded-xl bg-white/10 p-4">
                                <p className="text-2xl font-bold">01</p>
                                <p className="mt-2 text-sm text-gray-300">Catat meter</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4">
                                <p className="text-2xl font-bold">02</p>
                                <p className="mt-2 text-sm text-gray-300">Terbitkan tagihan</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4">
                                <p className="text-2xl font-bold">03</p>
                                <p className="mt-2 text-sm text-gray-300">Pantau pembayaran</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">Dashboard operasional untuk layanan air skala lingkungan dan wilayah.</p>
                </section>

                <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
                    <div className="w-full max-w-md">
                        <div className="mb-6 flex items-center gap-3 lg:hidden">
                            <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                                <ApplicationLogo className="h-7 w-7" />
                            </Link>
                            <div>
                                <p className="font-semibold text-gray-900">Sistem Tagihan Air</p>
                                <p className="text-xs text-gray-400">PAM Operations</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
