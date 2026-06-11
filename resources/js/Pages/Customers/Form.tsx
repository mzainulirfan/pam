import FormField from '@/Components/FormField';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

function Section({ title, description, children }: any) {
    return (
        <section className="rounded-xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
        </section>
    );
}

export default function Form({ customer, areas, nextNumber }: any) {
    const page = usePage();
    const [showMemberCard, setShowMemberCard] = useState(false);
    const [newCustomer, setNewCustomer] = useState<any>(null);
    const [formDataToShow, setFormDataToShow] = useState<any>(null);
    const barcodeRef = useRef<any>(null);
    const cardRef = useRef<any>(null);

    const form = useForm({
        customer_number: customer?.customer_number ?? nextNumber ?? '',
        name: customer?.name ?? '',
        phone: customer?.phone ?? '',
        address: customer?.address ?? '',
        area_id: customer?.area_id ?? '',
        status: customer?.status ?? 'active',
        meter_number: customer?.meter?.meter_number ?? '',
        initial_reading: customer?.meter?.initial_reading ?? 0,
        start_date: customer?.start_date ?? '',
        notes: customer?.notes ?? '',
    });

    // Check if form was recently successful (just submitted)
    useEffect(() => {
        const flash = page.props.flash as any;
        console.log('Form recently successful:', form.recentlySuccessful);
        console.log('Flash data:', flash); // Debug

        // Check if form was just submitted and we have formDataToShow
        if (form.recentlySuccessful && formDataToShow && !customer) {
            console.log('Form recently successful - showing member card with formData:', formDataToShow);
            setNewCustomer(formDataToShow);
            setShowMemberCard(true);
        } else if (flash?.customer && !customer) {
            console.log('Setting newCustomer from flash:', flash.customer);
            setNewCustomer(flash.customer);
            setShowMemberCard(true);
        }
    }, [form.recentlySuccessful, page.props, customer, formDataToShow]);

    useEffect(() => {
        if (newCustomer && barcodeRef.current) {
            JsBarcode(barcodeRef.current, newCustomer.customer_number, {
                format: 'CODE128',
                width: 2,
                height: 50,
                displayValue: true,
            });
        }
    }, [newCustomer]);

    const submit = (event: any) => {
        event.preventDefault();
        if (customer) {
            form.put(route('customers.update', customer.id));
        } else {
            // Save form data before submission
            setFormDataToShow({
                customer_number: form.data.customer_number,
                name: form.data.name,
                phone: form.data.phone,
                area_id: form.data.area_id,
            });
            form.post(route('customers.store'));
        }
    };

    const handlePrint = () => {
        if (cardRef.current) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write(cardRef.current.innerHTML);
            printWindow?.document.close();
            setTimeout(() => printWindow?.print(), 250);
        }
    };

    const handleDownload = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `barcode-${newCustomer?.customer_number}.png`;
            link.click();
        }
    };

    const handleCloseModal = () => {
        setShowMemberCard(false);
        setNewCustomer(null);
        setFormDataToShow(null);
        // Navigate to customer index after a brief delay for visual feedback
        setTimeout(() => {
            router.visit(route('customers.index'));
        }, 300);
    };

    const handleCreateAnother = () => {
        setShowMemberCard(false);
        setNewCustomer(null);
        setFormDataToShow(null);
        form.reset();
    };

    const handleViewProfile = () => {
        if (newCustomer?.id) {
            router.visit(route('customers.show', newCustomer.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'} />

            <form onSubmit={submit} className="space-y-5 p-4 sm:p-6">
                <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Lengkapi identitas, lokasi layanan, dan data meter pelanggan.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={customer ? route('customers.show', customer.id) : route('customers.index')} className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Kembali
                        </Link>
                        <button type="submit" disabled={form.processing} className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </section>

                <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                    <div className="space-y-5">
                        <Section title="Identitas Pelanggan" description="Data utama untuk pencarian, struk, dan pengiriman tagihan.">
                            <FormField label="Nomor Pelanggan" value={form.data.customer_number} onChange={(e: any) => form.setData('customer_number', e.target.value)} error={form.errors.customer_number} />
                            <FormField label="Nama Lengkap" value={form.data.name} onChange={(e: any) => form.setData('name', e.target.value)} error={form.errors.name} />
                            <FormField label="Nomor HP" value={form.data.phone} onChange={(e: any) => form.setData('phone', e.target.value)} error={form.errors.phone} />
                            <FormField label="Tanggal Mulai" type="date" value={form.data.start_date} onChange={(e: any) => form.setData('start_date', e.target.value)} error={form.errors.start_date} />
                        </Section>

                        <Section title="Lokasi dan Status" description="Area dipakai untuk filter rute petugas dan laporan wilayah.">
                            <div>
                                <InputLabel value="Area" />
                                <select value={form.data.area_id} onChange={(e) => form.setData('area_id', e.target.value)} className="mt-1 h-10 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400">
                                    <option value="">Pilih area</option>
                                    {areas.map((area: any) => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                                <InputError message={form.errors.area_id} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Status Layanan" />
                                <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="mt-1 h-10 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400">
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <InputLabel value="Alamat" />
                                <textarea value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} className="mt-1 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400" rows={3} />
                                <InputError message={form.errors.address} className="mt-1" />
                            </div>
                        </Section>
                    </div>

                    <div className="space-y-5">
                        <Section title="Meter Air" description="Setiap pelanggan memiliki satu nomor meter aktif.">
                            <div className="md:col-span-2">
                                <FormField label="Nomor Meteran" value={form.data.meter_number} onChange={(e: any) => form.setData('meter_number', e.target.value)} error={form.errors.meter_number} />
                            </div>
                            <div className="md:col-span-2">
                                <FormField label="Angka Meter Awal" type="number" value={form.data.initial_reading} onChange={(e: any) => form.setData('initial_reading', e.target.value)} error={form.errors.initial_reading} />
                            </div>
                        </Section>

                        <section className="rounded-xl border border-gray-100 bg-white p-5">
                            <InputLabel value="Catatan Internal" />
                            <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="mt-1 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400" rows={5} />
                            <InputError message={form.errors.notes} className="mt-1" />
                        </section>
                    </div>
                </div>
            </form>

            {showMemberCard && newCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Kartu Member Pelanggan</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            ref={cardRef}
                            className="mb-6 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
                            style={{
                                width: '320px',
                                aspectRatio: '85.6 / 53.98',
                                margin: '0 auto',
                            }}
                        >
                            <div className="flex h-full flex-col justify-between">
                                <div>
                                    <div className="mb-3 text-center">
                                        <p className="text-[10px] font-semibold tracking-widest text-gray-600">KARTU MEMBER</p>
                                        <h4 className="text-lg font-bold text-gray-900">{newCustomer.customer_number}</h4>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <svg ref={barcodeRef} style={{ maxWidth: '100%', height: '45px' }}></svg>
                                </div>

                                <div className="space-y-1 text-[11px]">
                                    <div>
                                        <p className="text-[9px] font-semibold text-gray-600">NAMA</p>
                                        <p className="font-semibold text-gray-900">{newCustomer.name}</p>
                                    </div>
                                    {newCustomer.phone && (
                                        <div>
                                            <p className="text-[9px] font-semibold text-gray-600">HP</p>
                                            <p className="text-gray-700">{newCustomer.phone}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-300 pt-1 text-center text-[9px] text-gray-500">
                                    Berlaku hingga 31 Desember 2099
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Kartu
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Barcode
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handleCreateAnother}
                                className="rounded-lg border border-blue-600 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                            >
                                Buat Pelanggan Lain
                            </button>
                            {newCustomer?.id && (
                                <button
                                    onClick={handleViewProfile}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Lihat Profil Pelanggan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
