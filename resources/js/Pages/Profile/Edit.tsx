import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function InfoRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="max-w-[65%] text-right text-sm font-medium text-gray-800">{value || '-'}</span>
        </div>
    );
}

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;
    const initials = user.name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Kelola informasi akun, password, dan akses pengguna.</p>
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
                    <div className="space-y-5">
                        <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900 text-lg font-bold text-white">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate font-semibold text-gray-900">{user.name}</h2>
                                    <p className="truncate text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <InfoRow label="Nama" value={user.name} />
                                <InfoRow label="Email" value={user.email} />
                                <InfoRow label="Status Email" value={user.email_verified_at ? 'Terverifikasi' : 'Belum diverifikasi'} />
                            </div>
                        </section>

                        <section className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                            <h2 className="font-semibold text-amber-900">Keamanan Akun</h2>
                            <p className="mt-2 text-sm text-amber-700">
                                Gunakan password yang kuat dan perbarui secara berkala, terutama untuk akun admin atau petugas lapangan.
                            </p>
                        </section>
                    </div>

                    <div className="space-y-5">
                        <section className="rounded-xl border border-gray-100 bg-white">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Informasi Profile</h2>
                                <p className="text-sm text-gray-400">Perbarui nama dan alamat email akun.</p>
                            </div>
                            <div className="p-5">
                                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-100 bg-white">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">Password</h2>
                                <p className="text-sm text-gray-400">Ubah password untuk menjaga keamanan akses.</p>
                            </div>
                            <div className="p-5">
                                <UpdatePasswordForm />
                            </div>
                        </section>

                        <section className="rounded-xl border border-red-100 bg-white">
                            <div className="border-b border-red-100 px-5 py-4">
                                <h2 className="font-semibold text-red-700">Hapus Akun</h2>
                                <p className="text-sm text-red-400">Tindakan ini permanen dan tidak bisa dibatalkan.</p>
                            </div>
                            <div className="p-5">
                                <DeleteUserForm />
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
