import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Verifikasi Email</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Klik link verifikasi yang sudah dikirim ke email. Jika belum menerima, kirim ulang link verifikasi.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                    Link verifikasi baru sudah dikirim ke email terdaftar.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Ulang'}
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
