import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const number = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default function Create({ customer, activePeriod, previousReading, existingReading, currentBill, tariff }: any) {
    const page = usePage();
    const flash = page.props.flash as any;
    const [preview, setPreview] = useState<string | null>(null);
    const [ocr, setOcr] = useState<any>(null);
    const [ocrLoading, setOcrLoading] = useState(false);
    const isPaid = currentBill?.status === 'paid';

    const form = useForm({
        current_reading: existingReading?.current_reading ?? previousReading,
        photo: null as File | null,
        ocr_text: '',
        ocr_value: '',
        ocr_confidence: '',
        is_manual_corrected: false as any,
        notes: existingReading?.notes ?? '',
    });

    const usage = Math.max(0, Number(form.data.current_reading || 0) - Number(previousReading));
    const estimate = useMemo(
        () => (tariff ? usage * Number(tariff.price_per_m3 || 0) + Number(tariff.fixed_charge || 0) + Number(tariff.late_fee || 0) + Number(tariff.admin_fee || 0) : 0),
        [usage, tariff],
    );

    const setPhoto = async (file: File | null) => {
        if (isPaid) {
            return;
        }

        form.setData('photo', file);
        setOcr(null);

        if (!file) {
            setPreview(null);
            return;
        }

        setPreview(URL.createObjectURL(file));
        setOcrLoading(true);

        try {
            const payload = new FormData();
            payload.append('photo', file);
            const response = await axios.post(route('mobile.meter-readings.ocr'), payload);
            setOcr(response.data);
            form.setData((data) => ({
                ...data,
                current_reading: response.data.value ?? data.current_reading,
                ocr_text: response.data.text,
                ocr_value: response.data.value ?? '',
                ocr_confidence: response.data.confidence ?? '',
            }));
        } finally {
            setOcrLoading(false);
        }
    };

    const submit = (event: any) => {
        event.preventDefault();
        if (isPaid) {
            return;
        }

        form.post(route('mobile.meter-readings.store', customer.id), { forceFormData: true });
    };

    const printReceipt = () => {
        if (!currentBill) {
            return;
        }

        const currentReading = Number(existingReading?.current_reading ?? form.data.current_reading ?? previousReading);
        const usageM3 = Math.max(0, currentReading - Number(previousReading));
        const printedAt = new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        const receipt = window.open('', '_blank', 'width=380,height=640');

        if (!receipt) {
            window.print();
            return;
        }

        receipt.document.write(`
            <html>
                <head>
                    <title>Struk ${currentBill.bill_number}</title>
                    <style>
                        @page { margin: 5mm; }
                        * { box-sizing: border-box; }
                        body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 8px; }
                        .receipt { max-width: 300px; margin: 0 auto; }
                        h1 { font-size: 17px; margin: 0; text-align: center; }
                        .muted { color: #6b7280; font-size: 11px; text-align: center; margin-top: 3px; }
                        .section { border-top: 1px dashed #d1d5db; margin-top: 9px; padding-top: 8px; }
                        .row { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; line-height: 1.35; margin: 5px 0; }
                        .row span:first-child { color: #6b7280; }
                        .row strong { text-align: right; }
                        .total { font-size: 14px; font-weight: 700; }
                        .footer { border-top: 1px dashed #d1d5db; margin-top: 9px; padding-top: 8px; text-align: center; font-size: 11px; color: #6b7280; }
                        @media print {
                            body { padding: 0; }
                            .receipt { max-width: none; width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <h1>Struk Tagihan Air</h1>
                        <div class="muted">Sistem Tagihan Air - ${printedAt}</div>

                        <div class="section">
                            <div class="row"><span>No Tagihan</span><strong>${currentBill.bill_number}</strong></div>
                            <div class="row"><span>Periode</span><strong>${activePeriod.name}</strong></div>
                        </div>

                        <div class="section">
                            <div class="row"><span>Pelanggan</span><strong>${customer.name}</strong></div>
                            <div class="row"><span>No Pelanggan</span><strong>${customer.customer_number}</strong></div>
                            <div class="row"><span>Area</span><strong>${customer.area?.name ?? '-'}</strong></div>
                            <div class="row"><span>No Meter</span><strong>${customer.meter?.meter_number ?? '-'}</strong></div>
                        </div>

                        <div class="section">
                            <div class="row"><span>Meter Lalu</span><strong>${number(Number(previousReading))} m3</strong></div>
                            <div class="row"><span>Meter Kini</span><strong>${number(currentReading)} m3</strong></div>
                            <div class="row"><span>Pemakaian</span><strong>${number(usageM3)} m3</strong></div>
                        </div>

                        <div class="section">
                            <div class="row total"><span>Total</span><strong>${money(Number(currentBill.total_amount || 0))}</strong></div>
                            <div class="row"><span>Dibayar</span><strong>${money(Number(currentBill.paid_amount || 0))}</strong></div>
                            <div class="row"><span>Sisa</span><strong>${money(Number(currentBill.remaining_amount || 0))}</strong></div>
                            <div class="row"><span>Status</span><strong>${currentBill.status}</strong></div>
                        </div>

                        <div class="footer">Bukti informasi tagihan</div>
                    </div>
                    <script>
                        window.onload = function () {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `);
        receipt.document.close();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Catat Meter" />

            <form onSubmit={submit} className="space-y-4 p-4 pb-28 sm:p-6">
                <section className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Catat Meter</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            {customer.name} - {activePeriod.name}
                        </p>
                    </div>
                    <Link href={route('mobile.customers.index')} className="inline-flex h-10 w-fit items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Kembali
                    </Link>
                </section>

                {flash?.success && currentBill && (
                    <section className="rounded-xl border border-green-100 bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={printReceipt}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Cetak Struk
                            </button>
                            <Link
                                href={route('mobile.customers.index')}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-green-200 bg-white px-4 text-sm font-medium text-green-700 hover:bg-green-50"
                            >
                                Kembali ke Daftar
                            </Link>
                        </div>
                    </section>
                )}

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold text-gray-900">{customer.name}</h2>
                            <p className="mt-0.5 text-sm text-gray-500">{customer.customer_number} - {customer.area?.name ?? 'Tanpa area'}</p>
                        </div>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">{activePeriod.name}</span>
                    </div>
                    <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{customer.address || '-'}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <Metric label="No Meter" value={customer.meter?.meter_number ?? '-'} />
                        <Metric label="Meter Lalu" value={`${number(previousReading)} m3`} />
                    </div>
                    {isPaid && (
                        <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                            Tagihan {currentBill.bill_number} sudah lunas. Pencatatan meter untuk periode ini dikunci.
                        </div>
                    )}
                    {existingReading && !isPaid && (
                        <div className="mt-3 space-y-3 rounded-lg bg-amber-50 p-3">
                            <p className="text-sm font-medium text-amber-700">
                                Pencatatan periode ini sudah ada. Perubahan akan memperbarui data lama, bukan membuat data baru.
                            </p>
                            {currentBill && (
                                <button
                                    type="button"
                                    onClick={printReceipt}
                                    className="inline-flex h-9 items-center rounded-lg bg-white px-3 text-sm font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50"
                                >
                                    Cetak Struk
                                </button>
                            )}
                        </div>
                    )}
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="mb-3">
                        <h2 className="font-semibold text-gray-900">Foto Meteran</h2>
                        <p className="text-sm text-gray-400">Ambil foto langsung dari kamera belakang bila tersedia.</p>
                    </div>

                    {preview ? (
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <img src={preview} className="max-h-80 w-full object-cover" />
                        </div>
                    ) : existingReading?.photo_path ? (
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <img src={`/storage/${existingReading.photo_path}`} className="max-h-80 w-full object-cover" />
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                            Foto meter belum dipilih.
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        disabled={isPaid}
                        onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                        className="mt-3 block h-11 w-full rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-3 file:h-full file:border-0 file:bg-gray-100 file:px-3 file:text-sm file:font-semibold file:text-gray-600 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <InputError message={form.errors.photo} className="mt-1" />

                    {ocrLoading && <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600">Membaca angka meter...</div>}
                    {ocr && (
                        <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            OCR membaca {ocr.value ?? '-'} dengan confidence {ocr.confidence ?? 0}%.
                        </div>
                    )}
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <InputLabel value="Meter Saat Ini" />
                    <TextInput
                        type="number"
                        inputMode="numeric"
                        value={form.data.current_reading}
                        disabled={isPaid}
                        onChange={(event) => {
                            form.setData('current_reading', event.target.value);
                            form.setData('is_manual_corrected', Boolean(ocr));
                        }}
                        className="mt-2 h-14 w-full border-gray-200 text-3xl font-bold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <InputError message={form.errors.current_reading} className="mt-1" />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Metric label="Pemakaian" value={`${number(usage)} m3`} />
                        <Metric label="Estimasi" value={money(estimate)} />
                    </div>
                </section>

                <section className="rounded-xl border border-gray-100 bg-white p-4">
                    <InputLabel value="Catatan" />
                    <textarea
                        value={form.data.notes}
                        disabled={isPaid}
                        onChange={(event) => form.setData('notes', event.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-200 text-sm text-gray-600 focus:border-gray-400 focus:ring-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                        rows={4}
                        placeholder="Opsional, misalnya kondisi meter atau akses lokasi"
                    />
                    <InputError message={form.errors.notes} className="mt-1" />
                </section>

                <section className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                    <button
                        type="submit"
                        disabled={form.processing || isPaid}
                        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-gray-900 px-4 text-base font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        {isPaid ? 'Tagihan Sudah Lunas' : form.processing ? 'Menyimpan...' : existingReading ? 'Perbarui Pencatatan' : 'Simpan Pencatatan'}
                    </button>
                </section>
            </form>
        </AuthenticatedLayout>
    );
}
