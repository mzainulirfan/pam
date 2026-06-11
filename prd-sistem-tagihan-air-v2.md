# PRD — Sistem Tagihan Air Berlangganan Berbasis Web
**Versi:** 2.0 (Revisi Detail untuk Junior Developer)
**Tech Stack:** Laravel + Inertia React + shadcn/ui + Tailwind CSS + MySQL

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Masalah Saat Ini](#2-masalah-saat-ini)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Target Pengguna & Role](#4-target-pengguna--role)
5. [Teknologi yang Digunakan](#5-teknologi-yang-digunakan)
6. [Alur Sistem Utama](#6-alur-sistem-utama)
7. [Fitur Detail per Halaman](#7-fitur-detail-per-halaman)
8. [Skema Database Lengkap](#8-skema-database-lengkap)
9. [API & Route Laravel](#9-api--route-laravel)
10. [Business Rules](#10-business-rules)
11. [Validasi & Error Handling](#11-validasi--error-handling)
12. [Desain UI & Komponen](#12-desain-ui--komponen)
13. [Struktur Folder Project](#13-struktur-folder-project)
14. [Acceptance Criteria MVP](#14-acceptance-criteria-mvp)
15. [Sprint Plan & Task Breakdown](#15-sprint-plan--task-breakdown)
16. [Risiko & Antisipasi](#16-risiko--antisipasi)
17. [Roadmap Tahap 2 & 3](#17-roadmap-tahap-2--3)

---

## 1. Ringkasan Produk

Sistem ini adalah **aplikasi web** untuk mengelola tagihan air pelanggan berlangganan bulanan. Diakses via browser (desktop & mobile/HP).

### Apa yang dilakukan sistem ini?

```
Pencatatan meter → Hitung pemakaian air → Generate tagihan → Catat pembayaran → Laporan
```

### Fitur unggulan: OCR Meteran

Petugas lapangan bisa **foto meteran via HP** → sistem otomatis membaca angka pakai OCR → angka masuk ke form → petugas cek & simpan. Ini menggantikan pencatatan manual yang rawan salah tulis.

### Siapa penggunanya?

| Role | Akses Utama |
|---|---|
| Admin | Kelola semua data, lihat semua laporan |
| Petugas Lapangan | Catat meter, upload foto, catat pembayaran |
| Kasir | Catat & verifikasi pembayaran |

---

## 2. Masalah Saat Ini

Pencatatan masih **manual (buku/kertas)**. Masalah yang terjadi:

| No | Masalah | Dampak |
|---|---|---|
| 1 | Data pelanggan dan tagihan tercecer | Data hilang, susah dicari |
| 2 | Salah tulis angka meteran | Tagihan salah, komplain pelanggan |
| 3 | Salah hitung penggunaan air | Pendapatan tidak akurat |
| 4 | Sulit pantau pelanggan yang belum bayar | Piutang menumpuk |
| 5 | Tidak ada bukti foto meteran | Sengketa angka tidak bisa diselesaikan |
| 6 | Riwayat pemakaian sulit dilacak | Tidak bisa deteksi kebocoran/anomali |
| 7 | Laporan bulanan direkap manual | Makan waktu berjam-jam |
| 8 | Petugas tulis angka satu per satu | Lambat, boros waktu |

---

## 3. Tujuan Produk

1. Digitalisasi data pelanggan.
2. Pencatatan angka meteran bulanan via HP dengan bantuan OCR.
3. Hitung penggunaan air secara otomatis.
4. Generate tagihan bulanan secara otomatis.
5. Catat pembayaran dengan bukti yang tersimpan.
6. Simpan foto meteran sebagai bukti.
7. Tampilkan laporan tagihan, pembayaran, dan tunggakan.
8. Kirim tagihan ke WhatsApp pelanggan (tahap 2).

---

## 4. Target Pengguna & Role

### 4.1 Admin / Pemilik

**Siapa:** Pemilik atau pengelola sistem air.

**Akses halaman:**

| Halaman | Bisa apa saja |
|---|---|
| Dashboard | Lihat ringkasan statistik |
| Pelanggan | Tambah, edit, nonaktifkan, lihat riwayat |
| Area | Kelola area/blok/rute |
| Meteran | Kelola data meteran per pelanggan |
| Tarif | Atur harga per m³, abonemen, denda |
| Periode Tagihan | Buat & kelola periode bulanan |
| Pencatatan Meter | Lihat semua hasil pencatatan |
| Tagihan | Lihat, edit, generate tagihan |
| Pembayaran | Lihat semua pembayaran |
| Petugas/User | Kelola akun petugas & kasir |
| Laporan | Semua jenis laporan |

### 4.2 Petugas Lapangan

**Siapa:** Petugas yang turun ke lapangan cek meteran.

**Alur kerja petugas:**
```
Login → Buka daftar pelanggan hari ini → Pilih pelanggan → 
Foto meteran → OCR otomatis baca angka → Cek/koreksi → 
Simpan → Lihat tagihan → Terima pembayaran → Kirim ke WA
```

**Akses halaman (mobile-friendly):**
- Daftar pelanggan per area/rute
- Detail pelanggan
- Form input meter + upload foto
- Hasil OCR + koreksi
- Detail tagihan
- Form catat pembayaran

### 4.3 Kasir / Operator

**Siapa:** Staff kantor yang terima pembayaran.

**Akses halaman:**
- Cari tagihan pelanggan
- Catat pembayaran
- Riwayat pembayaran
- Struk/bukti pembayaran
- Laporan pembayaran harian

---

## 5. Teknologi yang Digunakan

### 5.1 Stack Utama

| Layer | Teknologi | Keterangan |
|---|---|---|
| Backend | Laravel 11 | Framework PHP, routing, auth, business logic |
| Frontend | Inertia.js + React | SPA tanpa API terpisah, data lewat Inertia |
| UI | shadcn/ui | Komponen React siap pakai |
| CSS | Tailwind CSS | Utility-first styling |
| Database | MySQL / MariaDB | Penyimpanan data utama |
| Auth & Role | Laravel Breeze + Spatie Permission | Login, role, permission |
| File Storage | Laravel Storage (local/S3) | Simpan foto meteran |
| OCR | Google Cloud Vision API | Baca angka dari foto (utama) |
| OCR Alternatif | Tesseract OCR (via PHP/CLI) | Backup jika tanpa Google Vision |
| Export | Laravel Excel + Dompdf | Export Excel & PDF laporan |
| Mobile | Responsive Web / PWA | Petugas pakai HP |
| Deployment | VPS / Shared Hosting Laravel | Server produksi |

### 5.2 Versi yang Direkomendasikan

```
PHP         : 8.2+
Laravel     : 11.x
Node.js     : 20.x (untuk build Vite)
React       : 18.x
Inertia.js  : 1.x
shadcn/ui   : latest
Tailwind    : 3.x
MySQL       : 8.0+ / MariaDB 10.6+
```

### 5.3 Package Composer Tambahan

```bash
composer require spatie/laravel-permission    # Role & permission
composer require maatwebsite/excel            # Export Excel
composer require barryvdh/laravel-dompdf      # Export PDF
composer require intervention/image           # Resize/compress foto meteran
```

### 5.4 Cara Install Project (untuk Junior)

```bash
# 1. Clone & masuk folder
git clone <repo-url> water-billing
cd water-billing

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Setup database di .env
DB_DATABASE=water_billing
DB_USERNAME=root
DB_PASSWORD=

# 5. Jalankan migrasi & seeder
php artisan migrate --seed

# 6. Link storage publik
php artisan storage:link

# 7. Jalankan server dev
php artisan serve
npm run dev
```

---

## 6. Alur Sistem Utama

### 6.1 Alur Lengkap Sistem

```
[ADMIN]
  ↓ Setup: tambah pelanggan, area, tarif, periode tagihan
  
[PETUGAS LAPANGAN]
  ↓ Login di HP
  ↓ Buka daftar pelanggan yang belum dicatat bulan ini
  ↓ Pilih pelanggan
  ↓ Foto meteran
  ↓ OCR otomatis baca angka → masuk ke form
  ↓ Cek & koreksi angka jika perlu
  ↓ Simpan pencatatan meter
  ↓ Sistem otomatis hitung pemakaian
  ↓ Sistem otomatis generate tagihan
  ↓ Petugas terima pembayaran (opsional di lapangan)
  
[KASIR - jika pelanggan bayar di kantor]
  ↓ Cari tagihan pelanggan
  ↓ Catat pembayaran
  ↓ Cetak/kirim struk
  
[ADMIN]
  ↓ Pantau dashboard
  ↓ Lihat laporan tagihan & pembayaran
  ↓ Lihat tunggakan
```

### 6.2 Alur Perhitungan Tagihan

```
meter_sekarang - meter_bulan_lalu = pemakaian_m3

pemakaian_m3 × tarif_per_m3 = biaya_air

biaya_air + abonemen + denda + biaya_admin = total_tagihan
```

**Contoh konkret:**
```
Meter bulan lalu  : 1200
Meter bulan ini   : 1235
Pemakaian         : 35 m³
Tarif per m³      : Rp 3.000
Biaya air         : 35 × Rp 3.000 = Rp 105.000
Abonemen          : Rp 10.000
Biaya admin       : Rp 0
Denda             : Rp 0 (belum lewat jatuh tempo)
─────────────────────────────────────────
Total Tagihan     : Rp 115.000
```

---

## 7. Fitur Detail per Halaman

### 7.1 Halaman Login

**URL:** `/login`

**Elemen UI:**
- Form email + password
- Tombol Login
- Pesan error jika salah

**Logika:**
- Redirect setelah login:
  - Admin → `/dashboard`
  - Petugas → `/mobile/dashboard`
  - Kasir → `/payments`
- Gunakan Laravel Auth (Breeze)

**Validasi:**
- Email wajib, format email valid
- Password wajib, minimal 8 karakter

---

### 7.2 Dashboard Admin

**URL:** `/dashboard`

**Informasi yang ditampilkan (card/stat):**

| Kartu | Data |
|---|---|
| Pelanggan Aktif | COUNT dari tabel customers WHERE status = 'active' |
| Pelanggan Nonaktif | COUNT WHERE status = 'inactive' |
| Total Tagihan Bulan Ini | SUM total_amount dari bills periode aktif |
| Total Pembayaran Bulan Ini | SUM amount dari payments bulan ini |
| Total Tunggakan | SUM remaining_amount WHERE status = 'overdue' |
| Belum Dicatat | Pelanggan aktif yang meter_readings bulan ini belum ada |
| Sudah Dicatat | Pelanggan aktif yang sudah ada meter_readings bulan ini |

**Grafik:**
- Bar chart: Pemakaian air 6 bulan terakhir (x-axis = bulan, y-axis = total m³)
- Line chart: Total pembayaran vs tagihan 6 bulan terakhir

**Komponen React yang dipakai:**
- `shadcn/ui Card` untuk stat cards
- `recharts` atau `shadcn/ui Chart` untuk grafik

---

### 7.3 Manajemen Pelanggan

**URL:** `/customers`

#### 7.3.1 Halaman List Pelanggan

**Tabel dengan kolom:**

| Kolom | Sumber Data |
|---|---|
| No. Pelanggan | customers.customer_number |
| Nama | customers.name |
| Telepon | customers.phone |
| Area | areas.name |
| Status | customers.status (badge warna) |
| Meter | meters.meter_number |
| Aksi | Tombol Detail, Edit |

**Filter & Search:**
- Search by nama atau nomor pelanggan
- Filter by area (dropdown)
- Filter by status (aktif/nonaktif)

**Tombol:**
- "+ Tambah Pelanggan" → buka form

#### 7.3.2 Form Tambah/Edit Pelanggan

**URL:** `/customers/create` dan `/customers/{id}/edit`

**Field form:**

| Field | Tipe Input | Wajib | Keterangan |
|---|---|---|---|
| Nomor Pelanggan | Text | Ya | Auto-generate atau manual (unik) |
| Nama | Text | Ya | Min 2 karakter |
| Nomor HP | Text | Ya | Format Indonesia (08xx atau +62xx) |
| Alamat | Textarea | Ya | Min 10 karakter |
| Area | Select | Ya | Dropdown dari tabel areas |
| Status | Select | Ya | Aktif / Nonaktif |
| Nomor Meteran | Text | Ya | Unik per pelanggan |
| Angka Meter Awal | Number | Ya | Default 0, tidak boleh negatif |
| Tanggal Mulai Berlangganan | Date | Ya | Tidak boleh di masa depan |
| Catatan | Textarea | Tidak | Maks 500 karakter |

**Validasi di backend (Laravel Form Request):**

```php
// app/Http/Requests/CustomerRequest.php
public function rules(): array
{
    return [
        'customer_number' => ['required', 'unique:customers,customer_number,' . $this->customer?->id],
        'name'            => ['required', 'string', 'min:2', 'max:100'],
        'phone'           => ['required', 'string', 'regex:/^(\+62|08)[0-9]{8,12}$/'],
        'address'         => ['required', 'string', 'min:10'],
        'area_id'         => ['required', 'exists:areas,id'],
        'status'          => ['required', 'in:active,inactive'],
        'meter_number'    => ['required', 'unique:meters,meter_number,' . optional($this->customer?->meter)->id],
        'initial_reading' => ['required', 'integer', 'min:0'],
        'start_date'      => ['required', 'date', 'before_or_equal:today'],
        'notes'           => ['nullable', 'string', 'max:500'],
    ];
}
```

#### 7.3.3 Halaman Detail Pelanggan

**URL:** `/customers/{id}`

**Tampilkan:**
- Data lengkap pelanggan
- Data meteran
- Tab Riwayat Tagihan (tabel 12 bulan terakhir)
- Tab Riwayat Pembayaran
- Tab Riwayat Pemakaian (grafik)

---

### 7.4 Manajemen Area

**URL:** `/areas`

**Data Area:**

| Field | Tipe | Keterangan |
|---|---|---|
| Nama Area | Text | Contoh: "Blok A", "RT 01", "Jalur Utara" |
| Deskripsi | Text | Keterangan tambahan |
| Jumlah Pelanggan | (computed) | COUNT dari customers |

**Fitur:**
- Tambah, edit, hapus area
- Hapus hanya jika tidak ada pelanggan di area tersebut

---

### 7.5 Manajemen Tarif

**URL:** `/tariffs`

**Form Tarif:**

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| Nama Tarif | Text | Ya | Contoh: "Tarif Rumah Tangga 2026" |
| Tarif per m³ | Number (Rupiah) | Ya | Min Rp 0 |
| Abonemen/Biaya Tetap | Number (Rupiah) | Ya | Biaya bulanan tetap |
| Denda Keterlambatan | Number (Rupiah) | Tidak | Denda jika lewat jatuh tempo |
| Biaya Admin | Number (Rupiah) | Tidak | Default 0 |
| Status Aktif | Toggle | Ya | Hanya 1 tarif aktif di waktu yang sama |

**Business Rule:**
- Ketika tarif baru diaktifkan, tarif lama otomatis dinonaktifkan.
- Tarif yang sudah digunakan di tagihan tidak bisa dihapus.

**Validasi backend:**
```php
'name'         => ['required', 'string', 'max:100'],
'price_per_m3' => ['required', 'integer', 'min:0'],
'fixed_charge' => ['required', 'integer', 'min:0'],
'late_fee'     => ['nullable', 'integer', 'min:0'],
'admin_fee'    => ['nullable', 'integer', 'min:0'],
'is_active'    => ['boolean'],
```

---

### 7.6 Manajemen Periode Tagihan

**URL:** `/billing-periods`

**Data Periode:**

| Field | Tipe | Keterangan |
|---|---|---|
| Nama Periode | Text | Contoh: "Juni 2026" |
| Bulan | Number (1-12) | |
| Tahun | Number | |
| Tanggal Mulai | Date | Awal periode pencatatan meter |
| Tanggal Selesai | Date | Akhir periode pencatatan meter |
| Tanggal Jatuh Tempo | Date | Deadline pembayaran |
| Status | Select | `open` / `closed` |

**Status periode:**
- `open`: Masih bisa dilakukan pencatatan meter
- `closed`: Periode dikunci, tidak bisa dicatat lagi

**Business Rule:**
- Hanya ada 1 periode `open` di waktu yang sama.
- Periode tidak bisa dihapus jika sudah ada pencatatan meter.
- Tanggal jatuh tempo wajib setelah tanggal selesai.

---

### 7.7 Pencatatan Meteran (Petugas)

Ini adalah fitur inti yang paling sering dipakai petugas.

#### 7.7.1 Daftar Pelanggan Petugas

**URL:** `/mobile/customers`

**Tampilkan list pelanggan dengan:**
- Nama pelanggan
- Alamat
- Area
- Badge status: `Belum Dicatat` (merah) / `Sudah Dicatat` (hijau)
- Filter by area

**Query database:**
```php
// Pelanggan aktif + status pencatatan bulan ini
Customer::with(['area', 'meter'])
    ->where('status', 'active')
    ->withExists([
        'meterReadings' => fn($q) => $q->where('billing_period_id', $activePeriod->id)
    ])
    ->paginate(20);
```

#### 7.7.2 Form Input Meter

**URL:** `/mobile/meter-readings/create/{customer_id}`

**Tampilan form (wireframe teks):**
```
┌────────────────────────────────────────────┐
│  ← Kembali        Catat Meter              │
├────────────────────────────────────────────┤
│  DATA PELANGGAN                            │
│  Nama    : PAK AHMAD (font besar)          │
│  Alamat  : Jl. Melati No. 10              │
│  No. Meter: 00123                          │
│  Periode : Juni 2026                       │
│  Meter Lalu: 1.200                         │
├────────────────────────────────────────────┤
│  FOTO METERAN                              │
│  ┌──────────────────────────────┐          │
│  │                              │          │
│  │     [Preview Foto / Area]    │          │
│  │                              │          │
│  └──────────────────────────────┘          │
│  [ 📷 Ambil Foto ]  [ 📁 Pilih File ]     │
├────────────────────────────────────────────┤
│  HASIL OCR                                 │
│  Angka terbaca : 1.235  ✅ Confidence 87% │
├────────────────────────────────────────────┤
│  METER SAAT INI                            │
│  ┌──────────────────────────────┐          │
│  │  1235                        │          │
│  └──────────────────────────────┘          │
│                                            │
│  Pemakaian     : 35 m³                     │
│  Estimasi      : Rp 115.000                │
├────────────────────────────────────────────┤
│  Catatan petugas (opsional)                │
│  ┌──────────────────────────────┐          │
│  │                              │          │
│  └──────────────────────────────┘          │
│                                            │
│  ☐ Saya sudah cek angka meter sesuai foto  │
│                                            │
│  [        SIMPAN PENCATATAN        ]       │
└────────────────────────────────────────────┘
```

**Field yang dikirim ke server:**

| Field | Tipe | Keterangan |
|---|---|---|
| customer_id | Integer | ID pelanggan |
| billing_period_id | Integer | ID periode aktif |
| meter_id | Integer | ID meteran |
| current_reading | Integer | Angka meter saat ini |
| photo | File (jpeg/png) | Foto meteran, wajib |
| notes | String | Catatan petugas |
| confirmed | Boolean | Checkbox konfirmasi |

**Data yang disimpan sistem:**

| Field | Sumber |
|---|---|
| previous_reading | Diambil otomatis dari meter_readings bulan lalu |
| usage_m3 | current_reading - previous_reading |
| officer_id | Auth user id |
| reading_date | Tanggal sekarang |
| ocr_* fields | Dari hasil OCR sebelum form submit |

#### 7.7.3 Alur OCR Step by Step

```
1. Petugas klik "Ambil Foto" → browser minta akses kamera
2. Petugas foto meteran
3. File foto di-upload ke endpoint POST /api/meter-readings/ocr
4. Server:
   a. Simpan foto ke storage/meter-readings/YYYY/MM/
   b. Kirim foto ke Google Vision API
   c. Parse response: ambil angka dari hasil OCR
   d. Hitung confidence
   e. Return response JSON
5. Frontend:
   a. Tampilkan preview foto
   b. Isi field "Meter Saat Ini" dengan angka hasil OCR
   c. Tampilkan confidence (contoh: "87%")
   d. Jika confidence < 70% → tampilkan warning kuning
   e. Jika OCR gagal → tampilkan pesan error, minta input manual
6. Petugas cek angka, koreksi jika perlu
7. Petugas centang konfirmasi
8. Petugas klik Simpan
```

**OCR Service (contoh kode):**

```php
// app/Services/OcrService.php
class OcrService
{
    public function readMeterFromImage(string $imagePath): array
    {
        $imageContent = base64_encode(file_get_contents($imagePath));
        
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post('https://vision.googleapis.com/v1/images:annotate?key=' . config('services.google_vision.key'), [
            'requests' => [[
                'image' => ['content' => $imageContent],
                'features' => [['type' => 'TEXT_DETECTION']],
            ]]
        ]);
        
        $rawText = $response->json('responses.0.fullTextAnnotation.text', '');
        
        // Ambil angka dari teks
        preg_match_all('/\d+/', $rawText, $matches);
        $numbers = $matches[0];
        
        // Ambil angka terpanjang (kemungkinan angka meteran)
        $detectedValue = null;
        if (!empty($numbers)) {
            usort($numbers, fn($a, $b) => strlen($b) - strlen($a));
            $detectedValue = (int) $numbers[0];
        }
        
        $confidence = $response->json('responses.0.textAnnotations.0.confidence', 0);
        
        return [
            'raw_text'       => $rawText,
            'detected_value' => $detectedValue,
            'confidence'     => $confidence,
            'status'         => $detectedValue ? 
                ($confidence >= 0.7 ? 'success' : 'low_confidence') : 
                'failed',
        ];
    }
}
```

---

### 7.8 Tagihan Bulanan

**URL:** `/bills`

#### 7.8.1 Generate Tagihan

Tagihan dibuat **otomatis** saat pencatatan meter berhasil disimpan.

```php
// Dipanggil di MeterReadingController setelah simpan
// app/Services/BillingService.php

class BillingService
{
    public function generateBill(MeterReading $reading): Bill
    {
        $tariff = Tariff::where('is_active', true)->firstOrFail();
        $usageM3 = $reading->usage_m3;
        
        $waterCharge = $usageM3 * $tariff->price_per_m3;
        $totalAmount = $waterCharge + $tariff->fixed_charge + $tariff->admin_fee;
        
        return Bill::create([
            'customer_id'       => $reading->customer_id,
            'billing_period_id' => $reading->billing_period_id,
            'meter_reading_id'  => $reading->id,
            'usage_m3'          => $usageM3,
            'water_charge'      => $waterCharge,
            'fixed_charge'      => $tariff->fixed_charge,
            'late_fee'          => 0,
            'admin_fee'         => $tariff->admin_fee,
            'total_amount'      => $totalAmount,
            'paid_amount'       => 0,
            'remaining_amount'  => $totalAmount,
            'status'            => 'unpaid',
            'due_date'          => $reading->billingPeriod->due_date,
        ]);
    }
}
```

#### 7.8.2 Status Tagihan

| Status | Kondisi | Warna Badge |
|---|---|---|
| `unpaid` | Belum ada pembayaran, belum jatuh tempo | Abu-abu |
| `partial` | Ada pembayaran tapi kurang dari total | Kuning |
| `paid` | Total dibayar = total tagihan | Hijau |
| `overdue` | Belum lunas + sudah lewat jatuh tempo | Merah |
| `cancelled` | Dibatalkan admin | Abu-abu tua |

**Update status otomatis:** Jalankan command scheduler Laravel setiap hari untuk update status `overdue`.

```php
// app/Console/Commands/UpdateOverdueBills.php
Bill::where('status', '!=', 'paid')
    ->where('due_date', '<', today())
    ->update(['status' => 'overdue']);
```

---

### 7.9 Pembayaran

**URL:** `/payments/create/{bill_id}`

**Form Pembayaran:**

| Field | Tipe | Keterangan |
|---|---|---|
| Tagihan | (readonly) | Nama pelanggan + bulan |
| Total Tagihan | (readonly) | Rp xxx.xxx |
| Sudah Dibayar | (readonly) | Jika ada cicilan |
| Sisa Tagihan | (readonly) | |
| Jumlah Dibayar | Number | Input nominal pembayaran |
| Metode Pembayaran | Select | Tunai / Transfer / QRIS / Lainnya |
| Tanggal Bayar | Date | Default hari ini |
| Catatan | Text | Opsional |

**Validasi:**
- Jumlah dibayar harus > 0
- Jumlah dibayar tidak boleh melebihi sisa tagihan (kecuali admin)
- Metode pembayaran wajib dipilih

**Setelah simpan:**
1. Simpan record ke tabel `payments`
2. Update `bills.paid_amount` += jumlah dibayar
3. Update `bills.remaining_amount` = total - paid
4. Update `bills.status`:
   - Jika remaining = 0 → `paid`
   - Jika remaining > 0 → `partial`

---

### 7.10 Struk Pembayaran

**Tampilan struk (cetak/PDF):**

```
╔══════════════════════════════════════╗
║        TAGIHAN AIR BERSIH           ║
║           [Nama Pengelola]          ║
╠══════════════════════════════════════╣
║ Periode : Juni 2026                 ║
║ No. Tagihan : INV-2026-06-0001      ║
╠══════════════════════════════════════╣
║ Pelanggan  : Pak Ahmad              ║
║ No. Pelanggan: 001                  ║
║ Alamat     : Jl. Melati No. 10     ║
╠══════════════════════════════════════╣
║ Meter Lalu  : 1.200                 ║
║ Meter Ini   : 1.235                 ║
║ Pemakaian   : 35 m³                 ║
╠══════════════════════════════════════╣
║ Biaya Air   : Rp 105.000            ║
║ Abonemen    : Rp  10.000            ║
║ Denda       : Rp       0            ║
║ ──────────────────────────────────  ║
║ TOTAL       : Rp 115.000            ║
╠══════════════════════════════════════╣
║ Dibayar     : Rp 115.000            ║
║ Status      : LUNAS ✓               ║
║ Tanggal     : 11 Juni 2026          ║
║ Diterima    : Budi (Petugas)        ║
╚══════════════════════════════════════╝
```

**Kirim ke WhatsApp (tahap awal):**

```
Format link:
https://wa.me/628xxxxxxxxxx?text=PESAN

Contoh pesan:
Yth. Bapak/Ibu Ahmad,

Tagihan Air - Juni 2026
Pemakaian: 35 m³
Total: Rp 115.000
Status: LUNAS ✓
Tanggal Bayar: 11 Juni 2026

Terima kasih telah membayar.
[Nama Pengelola]
```

---

### 7.11 Laporan

**URL:** `/reports`

| Laporan | Filter | Kolom Utama |
|---|---|---|
| Tagihan Bulanan | Periode, Area | No, Pelanggan, Pemakaian, Total, Status |
| Pembayaran | Bulan, Metode, Petugas | No, Pelanggan, Nominal, Tanggal, Petugas |
| Tunggakan | Periode, Area | No, Pelanggan, Total, Sisa, Jatuh Tempo |
| Pemakaian Air | Periode, Area | No, Pelanggan, Meter Lalu, Meter Ini, Pemakaian |
| Pelanggan Aktif | Area | No, Nama, Area, No. Meter, Tgl Mulai |

**Export:**
- Export Excel: via Laravel Excel (`maatwebsite/excel`)
- Export PDF: via Dompdf

---

## 8. Skema Database Lengkap

### 8.1 Tabel `users`

```sql
CREATE TABLE users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    phone         VARCHAR(20) NULL,
    status        ENUM('active', 'inactive') DEFAULT 'active',
    remember_token VARCHAR(100) NULL,
    created_at    TIMESTAMP NULL,
    updated_at    TIMESTAMP NULL
);
```

**Relasi role (via Spatie):**
- Tabel `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` dibuat otomatis oleh Spatie.
- Role yang dibuat: `admin`, `officer` (petugas), `cashier` (kasir)

### 8.2 Tabel `customers`

```sql
CREATE TABLE customers (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_number VARCHAR(20) NOT NULL UNIQUE,  -- contoh: "C-0001"
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address         TEXT NOT NULL,
    area_id         BIGINT UNSIGNED NOT NULL,
    status          ENUM('active', 'inactive') DEFAULT 'active',
    start_date      DATE NOT NULL,
    notes           TEXT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,

    FOREIGN KEY (area_id) REFERENCES areas(id)
);
```

### 8.3 Tabel `areas`

```sql
CREATE TABLE areas (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL
);
```

### 8.4 Tabel `meters`

```sql
CREATE TABLE meters (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT UNSIGNED NOT NULL,
    meter_number    VARCHAR(50) NOT NULL UNIQUE,
    initial_reading INT UNSIGNED DEFAULT 0,  -- angka awal saat pasang
    status          ENUM('active', 'inactive') DEFAULT 'active',
    installed_at    DATE NOT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### 8.5 Tabel `tariffs`

```sql
CREATE TABLE tariffs (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    price_per_m3 INT UNSIGNED NOT NULL,   -- dalam Rupiah, tidak pakai desimal
    fixed_charge INT UNSIGNED DEFAULT 0,  -- abonemen
    late_fee     INT UNSIGNED DEFAULT 0,  -- denda terlambat
    admin_fee    INT UNSIGNED DEFAULT 0,
    is_active    TINYINT(1) DEFAULT 0,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL
);
```

> **Catatan untuk Junior:** Simpan uang dalam **integer Rupiah**, bukan desimal. Ini menghindari masalah floating point. Contoh: Rp 115.000 disimpan sebagai `115000`.

### 8.6 Tabel `billing_periods`

```sql
CREATE TABLE billing_periods (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,   -- "Juni 2026"
    month      TINYINT NOT NULL,       -- 1-12
    year       SMALLINT NOT NULL,      -- 2026
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    due_date   DATE NOT NULL,
    status     ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    UNIQUE KEY unique_period (month, year)
);
```

### 8.7 Tabel `meter_readings`

```sql
CREATE TABLE meter_readings (
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id        BIGINT UNSIGNED NOT NULL,
    meter_id           BIGINT UNSIGNED NOT NULL,
    billing_period_id  BIGINT UNSIGNED NOT NULL,
    previous_reading   INT UNSIGNED NOT NULL,   -- meter bulan lalu
    current_reading    INT UNSIGNED NOT NULL,   -- meter bulan ini
    usage_m3           INT UNSIGNED NOT NULL,   -- selisih = pemakaian
    photo_path         VARCHAR(255) NULL,       -- path foto di storage
    ocr_raw_text       TEXT NULL,               -- teks mentah dari OCR
    ocr_detected_value INT NULL,                -- angka yang terdeteksi OCR
    ocr_confidence     DECIMAL(4,2) NULL,       -- 0.00 - 1.00
    ocr_status         ENUM('pending','success','failed','low_confidence','manual_override') DEFAULT 'pending',
    is_manual_corrected TINYINT(1) DEFAULT 0,  -- apakah petugas koreksi angka OCR
    officer_id         BIGINT UNSIGNED NOT NULL, -- siapa yang catat
    reading_date       DATE NOT NULL,
    notes              TEXT NULL,
    created_at         TIMESTAMP NULL,
    updated_at         TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (meter_id) REFERENCES meters(id),
    FOREIGN KEY (billing_period_id) REFERENCES billing_periods(id),
    FOREIGN KEY (officer_id) REFERENCES users(id),
    UNIQUE KEY unique_reading (customer_id, billing_period_id)  -- 1 catatan per pelanggan per periode
);
```

### 8.8 Tabel `bills`

```sql
CREATE TABLE bills (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bill_number       VARCHAR(30) NOT NULL UNIQUE,  -- "INV-2026-06-0001"
    customer_id       BIGINT UNSIGNED NOT NULL,
    billing_period_id BIGINT UNSIGNED NOT NULL,
    meter_reading_id  BIGINT UNSIGNED NOT NULL,
    usage_m3          INT UNSIGNED NOT NULL,
    water_charge      INT UNSIGNED NOT NULL,
    fixed_charge      INT UNSIGNED DEFAULT 0,
    late_fee          INT UNSIGNED DEFAULT 0,
    admin_fee         INT UNSIGNED DEFAULT 0,
    total_amount      INT UNSIGNED NOT NULL,
    paid_amount       INT UNSIGNED DEFAULT 0,
    remaining_amount  INT UNSIGNED NOT NULL,
    status            ENUM('unpaid','partial','paid','overdue','cancelled') DEFAULT 'unpaid',
    due_date          DATE NOT NULL,
    created_at        TIMESTAMP NULL,
    updated_at        TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (billing_period_id) REFERENCES billing_periods(id),
    FOREIGN KEY (meter_reading_id) REFERENCES meter_readings(id)
);
```

### 8.9 Tabel `payments`

```sql
CREATE TABLE payments (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bill_id           BIGINT UNSIGNED NOT NULL,
    customer_id       BIGINT UNSIGNED NOT NULL,
    payment_method_id BIGINT UNSIGNED NOT NULL,
    amount            INT UNSIGNED NOT NULL,       -- nominal dibayar
    payment_date      DATE NOT NULL,
    received_by       BIGINT UNSIGNED NOT NULL,    -- user id kasir/petugas
    notes             TEXT NULL,
    created_at        TIMESTAMP NULL,
    updated_at        TIMESTAMP NULL,

    FOREIGN KEY (bill_id) REFERENCES bills(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (received_by) REFERENCES users(id)
);
```

### 8.10 Tabel `payment_methods`

```sql
CREATE TABLE payment_methods (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,    -- "Tunai", "Transfer", "QRIS"
    is_active  TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Seed data awal:**
```php
// database/seeders/PaymentMethodSeeder.php
PaymentMethod::insert([
    ['name' => 'Tunai', 'is_active' => 1],
    ['name' => 'Transfer Bank', 'is_active' => 1],
    ['name' => 'QRIS', 'is_active' => 1],
    ['name' => 'Lainnya', 'is_active' => 1],
]);
```

### 8.11 Tabel `activity_logs`

```sql
CREATE TABLE activity_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,
    action      VARCHAR(50) NOT NULL,     -- 'create', 'update', 'delete', 'payment'
    module      VARCHAR(50) NOT NULL,     -- 'customer', 'bill', 'payment', dll
    description TEXT NOT NULL,           -- keterangan lengkap
    ip_address  VARCHAR(45) NULL,
    user_agent  TEXT NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 8.12 Tabel `settings`

```sql
CREATE TABLE settings (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key        VARCHAR(100) NOT NULL UNIQUE,
    value      TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Seed data awal:**
```php
Setting::insert([
    ['key' => 'app_name', 'value' => 'Sistem Air Bersih'],
    ['key' => 'address', 'value' => 'Jl. Contoh No. 1'],
    ['key' => 'phone', 'value' => '08xxxxxxxxxx'],
    ['key' => 'bill_prefix', 'value' => 'INV'],
]);
```

---

## 9. API & Route Laravel

### 9.1 Web Routes (Inertia)

```php
// routes/web.php

Route::middleware('auth')->group(function () {

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('customers', CustomerController::class);
        Route::resource('areas', AreaController::class);
        Route::resource('tariffs', TariffController::class);
        Route::resource('billing-periods', BillingPeriodController::class);
        Route::resource('meter-readings', MeterReadingController::class)->only(['index', 'show']);
        Route::resource('bills', BillController::class)->only(['index', 'show', 'edit', 'update']);
        Route::resource('payments', PaymentController::class)->only(['index', 'show']);
        Route::resource('users', UserController::class);
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/bills', [ReportController::class, 'bills'])->name('reports.bills');
        Route::get('/reports/payments', [ReportController::class, 'payments'])->name('reports.payments');
        Route::get('/reports/arrears', [ReportController::class, 'arrears'])->name('reports.arrears');
    });

    // Officer & Admin
    Route::middleware('role:admin|officer')->group(function () {
        Route::get('/mobile/dashboard', [MobileDashboardController::class, 'index']);
        Route::get('/mobile/customers', [MobileCustomerController::class, 'index']);
        Route::get('/mobile/customers/{customer}', [MobileCustomerController::class, 'show']);
        Route::get('/mobile/meter-readings/create/{customer}', [MeterReadingController::class, 'create']);
        Route::post('/mobile/meter-readings', [MeterReadingController::class, 'store']);
        Route::post('/mobile/meter-readings/ocr', [OcrController::class, 'process']);
    });

    // Officer, Cashier & Admin
    Route::middleware('role:admin|officer|cashier')->group(function () {
        Route::get('/mobile/bills/{bill}', [BillController::class, 'show']);
        Route::get('/mobile/payments/create/{bill}', [PaymentController::class, 'create']);
        Route::post('/mobile/payments', [PaymentController::class, 'store']);
    });
});
```

### 9.2 OCR Endpoint Detail

**Request:**
```
POST /mobile/meter-readings/ocr
Content-Type: multipart/form-data

Fields:
- customer_id   : integer (required)
- billing_period_id : integer (required)  
- photo         : file (jpeg/png, max 5MB) (required)
```

**Response sukses:**
```json
{
    "success": true,
    "photo_path": "meter-readings/2026/06/customer-001-1749600000.jpg",
    "ocr_raw_text": "001235 m3",
    "detected_value": 1235,
    "confidence": 0.87,
    "status": "success",
    "message": null
}
```

**Response OCR gagal:**
```json
{
    "success": false,
    "photo_path": "meter-readings/2026/06/customer-001-1749600001.jpg",
    "ocr_raw_text": "",
    "detected_value": null,
    "confidence": 0,
    "status": "failed",
    "message": "Angka meter tidak terbaca. Silakan input manual."
}
```

**Response confidence rendah:**
```json
{
    "success": true,
    "photo_path": "meter-readings/2026/06/customer-001-1749600002.jpg",
    "ocr_raw_text": "1?35 m3",
    "detected_value": 135,
    "confidence": 0.45,
    "status": "low_confidence",
    "message": "Tingkat kepercayaan OCR rendah (45%). Mohon cek ulang angka."
}
```

### 9.3 Controller MeterReading — Contoh Kode

```php
// app/Http/Controllers/MeterReadingController.php

public function store(MeterReadingRequest $request): RedirectResponse
{
    // 1. Ambil data periode & meteran
    $activePeriod = BillingPeriod::where('status', 'open')->firstOrFail();
    $meter = Meter::where('customer_id', $request->customer_id)
                  ->where('status', 'active')
                  ->firstOrFail();
    
    // 2. Ambil reading bulan lalu
    $previousReading = MeterReading::where('customer_id', $request->customer_id)
        ->orderBy('reading_date', 'desc')
        ->value('current_reading') ?? $meter->initial_reading;
    
    // 3. Hitung pemakaian
    $usageM3 = $request->current_reading - $previousReading;
    
    // 4. Simpan meter reading
    $reading = MeterReading::create([
        'customer_id'        => $request->customer_id,
        'meter_id'           => $meter->id,
        'billing_period_id'  => $activePeriod->id,
        'previous_reading'   => $previousReading,
        'current_reading'    => $request->current_reading,
        'usage_m3'           => $usageM3,
        'photo_path'         => $request->photo_path, // dari OCR endpoint
        'ocr_raw_text'       => $request->ocr_raw_text,
        'ocr_detected_value' => $request->ocr_detected_value,
        'ocr_confidence'     => $request->ocr_confidence,
        'ocr_status'         => $request->ocr_status,
        'is_manual_corrected'=> $request->ocr_detected_value != $request->current_reading,
        'officer_id'         => auth()->id(),
        'reading_date'       => today(),
        'notes'              => $request->notes,
    ]);
    
    // 5. Generate tagihan otomatis
    $bill = app(BillingService::class)->generateBill($reading);
    
    // 6. Log aktivitas
    ActivityLog::create([
        'user_id'     => auth()->id(),
        'action'      => 'create',
        'module'      => 'meter_reading',
        'description' => "Catat meter pelanggan {$reading->customer->name} periode {$activePeriod->name}: {$previousReading} → {$request->current_reading} ({$usageM3} m³)",
        'ip_address'  => $request->ip(),
    ]);
    
    return redirect()->route('mobile.bills.show', $bill->id)
                     ->with('success', 'Pencatatan meter berhasil disimpan. Tagihan telah dibuat.');
}
```

---

## 10. Business Rules

Aturan bisnis yang **wajib** diimplementasikan di backend (jangan hanya di frontend):

| No | Aturan | Implementasi |
|---|---|---|
| 1 | Setiap pelanggan aktif harus punya meteran aktif | Validasi saat tambah pelanggan |
| 2 | 1 tagihan per pelanggan per periode | UNIQUE constraint di DB + validasi di controller |
| 3 | Meter sekarang ≥ meter sebelumnya | Validasi di MeterReadingRequest |
| 4 | Foto meteran wajib diupload | Validasi `required` di form request |
| 5 | OCR tidak bisa langsung simpan tanpa konfirmasi | Checkbox wajib dicentang sebelum submit |
| 6 | Tagihan otomatis dibuat setelah meter dicatat | Dipanggil di controller setelah save |
| 7 | Status tagihan update otomatis jika lewat jatuh tempo | Scheduled command harian |
| 8 | Pembayaran tidak boleh melebihi sisa tagihan | Validasi di PaymentRequest |
| 9 | Pencatatan meter hanya bisa di periode `open` | Cek status periode di controller |
| 10 | Perubahan data penting wajib tercatat di activity log | Panggil ActivityLog::create di setiap controller |

---

## 11. Validasi & Error Handling

### 11.1 Validasi Form Request OCR

```php
// app/Http/Requests/OcrRequest.php
public function rules(): array
{
    return [
        'customer_id'        => ['required', 'exists:customers,id'],
        'billing_period_id'  => ['required', 'exists:billing_periods,id'],
        'photo'              => ['required', 'file', 'mimes:jpeg,jpg,png', 'max:5120'], // max 5MB
    ];
}
```

### 11.2 Validasi Form Request MeterReading

```php
// app/Http/Requests/MeterReadingRequest.php
public function rules(): array
{
    $customerId = $this->input('customer_id');
    $previousReading = MeterReading::where('customer_id', $customerId)
        ->orderBy('reading_date', 'desc')
        ->value('current_reading') ?? 0;

    return [
        'customer_id'        => ['required', 'exists:customers,id'],
        'current_reading'    => ['required', 'integer', 'min:' . $previousReading],
        'photo_path'         => ['required', 'string'],
        'notes'              => ['nullable', 'string', 'max:500'],
        'confirmed'          => ['required', 'accepted'], // checkbox wajib dicentang
        'ocr_detected_value' => ['nullable', 'integer'],
        'ocr_confidence'     => ['nullable', 'numeric', 'between:0,1'],
        'ocr_status'         => ['nullable', 'in:pending,success,failed,low_confidence,manual_override'],
    ];
}

public function messages(): array
{
    return [
        'current_reading.min' => 'Angka meter sekarang tidak boleh lebih kecil dari meter bulan lalu (' . $previousReading . ').',
        'confirmed.accepted'  => 'Anda harus mengkonfirmasi bahwa angka meter sudah sesuai foto.',
        'photo_path.required' => 'Foto meteran wajib diupload sebelum menyimpan.',
    ];
}
```

### 11.3 Pesan Warning OCR di Frontend

| Kondisi | Pesan | Warna |
|---|---|---|
| Confidence < 70% | "Tingkat kepercayaan OCR rendah. Harap cek ulang angka." | Kuning |
| OCR gagal | "Angka meter tidak terbaca. Silakan input manual." | Merah |
| Angka OCR < meter lalu | "Angka lebih kecil dari meter bulan lalu. Mohon cek ulang." | Merah |
| Pemakaian > 2x rata-rata | "Pemakaian bulan ini jauh di atas rata-rata. Pastikan angka sudah benar." | Kuning |

---

## 12. Desain UI & Komponen

### 12.1 Komponen shadcn/ui yang Dipakai

```bash
# Install komponen shadcn/ui yang dibutuhkan
npx shadcn@latest add button card input select dialog table badge tabs alert toast sheet
```

| Komponen | Dipakai Di |
|---|---|
| `Button` | Semua halaman |
| `Card` | Dashboard stat cards |
| `Input` | Semua form |
| `Select` | Dropdown area, tarif, metode bayar |
| `Dialog` | Konfirmasi hapus, lihat detail |
| `Table` | List pelanggan, tagihan, pembayaran |
| `Badge` | Status tagihan, status pelanggan |
| `Tabs` | Detail pelanggan (riwayat tagihan, pemakaian) |
| `Alert` | Peringatan OCR, warning validasi |
| `Toast` | Notifikasi sukses/error setelah aksi |
| `Sheet` | Drawer mobile untuk filter & detail |

### 12.2 Warna Badge Status Tagihan

```tsx
// components/BillStatusBadge.tsx
const statusConfig = {
    unpaid:    { label: 'Belum Bayar',  variant: 'secondary' },
    partial:   { label: 'Bayar Sebagian', variant: 'warning' },
    paid:      { label: 'Lunas',         variant: 'success' },
    overdue:   { label: 'Menunggak',     variant: 'destructive' },
    cancelled: { label: 'Dibatalkan',    variant: 'outline' },
};
```

### 12.3 Layout Mobile (Petugas)

- Font size minimal **16px** untuk readability di outdoor
- Tombol aksi minimal tinggi **48px** (mudah diklik)
- Input meter angka besar, keyboard numpad otomatis (`inputMode="numeric"`)
- Sticky button "Simpan" di bawah layar
- Preview foto full width

### 12.4 Panduan Foto Meteran (UI Kamera)

Tampilkan overlay/instruksi di halaman pengambilan foto:
```
📷 Tips Foto Meteran:
✓ Pastikan angka terlihat jelas
✓ Gunakan kamera belakang
✓ Jarak ±30 cm dari meteran
✓ Cahaya cukup, hindari pantulan
✓ Tahan HP tegak & stabil
⬜ [Kotak panduan — angka harus dalam kotak ini]
```

---

## 13. Struktur Folder Project

```
water-billing/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── UpdateOverdueBills.php      ← scheduler harian
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── DashboardController.php
│   │   │   ├── CustomerController.php
│   │   │   ├── AreaController.php
│   │   │   ├── TariffController.php
│   │   │   ├── BillingPeriodController.php
│   │   │   ├── MeterReadingController.php
│   │   │   ├── OcrController.php           ← handle upload foto & proses OCR
│   │   │   ├── BillController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── ReportController.php
│   │   │   ├── UserController.php
│   │   │   └── Mobile/
│   │   │       ├── MobileDashboardController.php
│   │   │       ├── MobileCustomerController.php
│   │   │       └── MobileMeterReadingController.php
│   │   ├── Requests/
│   │   │   ├── CustomerRequest.php
│   │   │   ├── MeterReadingRequest.php
│   │   │   ├── OcrRequest.php
│   │   │   ├── BillRequest.php
│   │   │   └── PaymentRequest.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Customer.php
│   │   ├── Area.php
│   │   ├── Meter.php
│   │   ├── Tariff.php
│   │   ├── BillingPeriod.php
│   │   ├── MeterReading.php
│   │   ├── Bill.php
│   │   ├── Payment.php
│   │   ├── PaymentMethod.php
│   │   ├── ActivityLog.php
│   │   └── Setting.php
│   ├── Services/
│   │   ├── BillingService.php              ← hitung & generate tagihan
│   │   ├── OcrService.php                  ← integrasi Google Vision / Tesseract
│   │   └── PaymentService.php             ← proses & update status pembayaran
│   └── Policies/
│       ├── CustomerPolicy.php
│       └── BillPolicy.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_areas_table.php
│   │   ├── 2024_01_01_000002_create_customers_table.php
│   │   ├── 2024_01_01_000003_create_meters_table.php
│   │   ├── 2024_01_01_000004_create_tariffs_table.php
│   │   ├── 2024_01_01_000005_create_billing_periods_table.php
│   │   ├── 2024_01_01_000006_create_meter_readings_table.php
│   │   ├── 2024_01_01_000007_create_bills_table.php
│   │   ├── 2024_01_01_000008_create_payment_methods_table.php
│   │   └── 2024_01_01_000009_create_payments_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── RoleSeeder.php
│       ├── AdminUserSeeder.php
│       ├── AreaSeeder.php
│       ├── TariffSeeder.php
│       └── PaymentMethodSeeder.php
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Auth/
│       │   │   └── Login.tsx
│       │   ├── Dashboard/
│       │   │   └── Index.tsx
│       │   ├── Customers/
│       │   │   ├── Index.tsx
│       │   │   ├── Create.tsx
│       │   │   ├── Edit.tsx
│       │   │   └── Show.tsx
│       │   ├── Areas/
│       │   ├── Tariffs/
│       │   ├── BillingPeriods/
│       │   ├── MeterReadings/
│       │   ├── Bills/
│       │   ├── Payments/
│       │   ├── Reports/
│       │   ├── Users/
│       │   └── Mobile/
│       │       ├── Dashboard.tsx
│       │       ├── Customers/
│       │       │   ├── Index.tsx
│       │       │   └── Show.tsx
│       │       ├── MeterReadings/
│       │       │   └── Create.tsx         ← form OCR + input meter
│       │       └── Payments/
│       │           └── Create.tsx
│       ├── Components/
│       │   ├── ui/                         ← shadcn/ui components
│       │   ├── BillStatusBadge.tsx
│       │   ├── CustomerStatusBadge.tsx
│       │   ├── OcrResultCard.tsx
│       │   ├── MeterPhotoCapture.tsx       ← komponen kamera + OCR
│       │   ├── StatsCard.tsx
│       │   └── DataTable.tsx
│       └── Layouts/
│           ├── AdminLayout.tsx
│           └── MobileLayout.tsx
├── routes/
│   ├── web.php
│   └── api.php
└── storage/
    └── app/public/
        └── meter-readings/
            └── YYYY/
                └── MM/
```

---

## 14. Acceptance Criteria MVP

MVP dianggap **selesai** jika semua kriteria berikut terpenuhi:

| No | Kriteria | Cara Test |
|---|---|---|
| 1 | Admin bisa login | Login dengan akun admin → masuk dashboard |
| 2 | Petugas bisa login | Login dengan akun petugas → masuk halaman mobile |
| 3 | Admin bisa tambah pelanggan | Isi form → cek data muncul di list |
| 4 | Admin bisa buat periode tagihan | Buat periode baru → status `open` |
| 5 | Admin bisa atur tarif | Tambah tarif → centang aktif |
| 6 | Petugas bisa lihat daftar pelanggan | Buka `/mobile/customers` → list muncul |
| 7 | Petugas bisa upload foto meteran | Upload foto → foto tersimpan, preview muncul |
| 8 | Sistem bisa baca angka dari foto | Upload foto meteran → angka muncul di field |
| 9 | Hasil OCR masuk ke form | Field "meter saat ini" terisi otomatis |
| 10 | Petugas bisa koreksi hasil OCR | Edit field angka → is_manual_corrected = true |
| 11 | Validasi meter tidak turun | Input angka < meter lalu → error muncul |
| 12 | Petugas bisa simpan pencatatan | Klik Simpan → data tersimpan di DB |
| 13 | Tagihan otomatis terbuat | Cek tabel bills → ada record baru |
| 14 | Perhitungan tagihan benar | Cek total = (pemakaian × tarif) + abonemen |
| 15 | Petugas/kasir bisa catat pembayaran | Input pembayaran → status tagihan update |
| 16 | Status lunas/belum lunas benar | Bayar penuh → `paid`; bayar sebagian → `partial` |
| 17 | Admin bisa lihat laporan tagihan | Buka `/reports` → data muncul, bisa filter |
| 18 | Admin bisa lihat laporan tunggakan | Filter status overdue → list muncul |
| 19 | Foto meteran bisa dibuka kembali | Klik foto di detail pencatatan → foto terbuka |
| 20 | Tampilan mobile nyaman di HP | Buka di HP → tidak ada elemen yang terpotong |

---

## 15. Sprint Plan & Task Breakdown

### Sprint 1 — Fondasi Sistem (Estimasi: 3–5 hari)

**Goal:** Project bisa dijalankan, auth & role berjalan.

| Task | Keterangan | Siapa |
|---|---|---|
| 1.1 | Buat project Laravel baru | Junior |
| 1.2 | Install Inertia.js + React + TypeScript | Junior |
| 1.3 | Install & setup Tailwind CSS | Junior |
| 1.4 | Install & setup shadcn/ui | Junior |
| 1.5 | Konfigurasi `.env` (DB, storage) | Junior |
| 1.6 | Install Laravel Breeze (auth) | Junior |
| 1.7 | Install & setup Spatie Permission | Junior |
| 1.8 | Buat migration semua tabel | Junior |
| 1.9 | Buat seeder: Role (admin/officer/cashier), Admin User | Junior |
| 1.10 | Test login admin berhasil | Junior |
| 1.11 | Setup redirect setelah login sesuai role | Junior |
| 1.12 | Setup AdminLayout dan MobileLayout | Junior |

**Checklist Sprint 1:**
- [ ] `php artisan migrate` berhasil tanpa error
- [ ] Login dengan akun admin berhasil
- [ ] Redirect sesuai role berjalan
- [ ] `php artisan serve` + `npm run dev` bisa jalan bersamaan

---

### Sprint 2 — Master Data (Estimasi: 4–6 hari)

**Goal:** Admin bisa kelola area, pelanggan, meteran, tarif, periode.

| Task | Keterangan |
|---|---|
| 2.1 | CRUD Area (halaman + controller + model + migration) |
| 2.2 | CRUD Pelanggan (termasuk validasi nomor HP, nomor pelanggan unik) |
| 2.3 | CRUD Meteran (1 meteran per pelanggan) |
| 2.4 | CRUD Tarif (validasi hanya 1 tarif aktif) |
| 2.5 | CRUD Periode Tagihan (validasi hanya 1 periode `open`) |
| 2.6 | Halaman Detail Pelanggan (tampilkan data + meteran) |
| 2.7 | Seeder: data area, tarif, payment methods, beberapa pelanggan sampel |
| 2.8 | Filter & search di halaman list pelanggan |

**Urutan pengerjaan yang benar:**
```
Areas → Customers (butuh area) → Meters (butuh customer) → Tariffs → Billing Periods
```

**Checklist Sprint 2:**
- [ ] Admin bisa tambah, edit pelanggan
- [ ] Validasi nomor HP & nomor pelanggan berjalan
- [ ] Tarif bisa diatur, hanya 1 aktif
- [ ] Periode tagihan bisa dibuat, hanya 1 yang `open`

---

### Sprint 3 — Pencatatan Meter (Estimasi: 4–5 hari)

**Goal:** Petugas bisa input meter manual + upload foto (tanpa OCR dulu).

| Task | Keterangan |
|---|---|
| 3.1 | Halaman mobile `/mobile/customers` — list pelanggan + badge status dicatat/belum |
| 3.2 | Halaman mobile `/mobile/customers/{id}` — detail pelanggan |
| 3.3 | Form input meter `/mobile/meter-readings/create/{customer_id}` |
| 3.4 | Upload foto meteran ke Laravel Storage |
| 3.5 | Tampilkan preview foto setelah upload |
| 3.6 | Hitung `previous_reading` otomatis dari data sebelumnya |
| 3.7 | Hitung `usage_m3` otomatis saat angka diisi |
| 3.8 | Tampilkan estimasi tagihan real-time saat angka diisi |
| 3.9 | Validasi: meter sekarang tidak boleh < meter lalu |
| 3.10 | Simpan pencatatan meter ke database |
| 3.11 | MeterReadingController — logic store() |

**Checklist Sprint 3:**
- [ ] List pelanggan mobile muncul dengan badge status
- [ ] Upload foto berhasil, preview muncul
- [ ] Angka pemakaian otomatis terhitung
- [ ] Estimasi tagihan muncul sebelum submit
- [ ] Validasi berjalan (angka tidak boleh turun)
- [ ] Data tersimpan di tabel `meter_readings`

---

### Sprint 4 — OCR Meteran (Estimasi: 3–4 hari)

**Goal:** Foto yang diupload bisa dibaca angkanya otomatis.

| Task | Keterangan |
|---|---|
| 4.1 | Daftar ke Google Cloud Vision API, simpan API key di `.env` |
| 4.2 | Buat `OcrService.php` — kirim foto ke Vision API, parse angka |
| 4.3 | Buat `OcrController.php` — handle endpoint POST /mobile/meter-readings/ocr |
| 4.4 | Frontend: setelah foto diupload, panggil endpoint OCR |
| 4.5 | Frontend: isi field "Meter Saat Ini" dengan angka hasil OCR |
| 4.6 | Tampilkan confidence level OCR |
| 4.7 | Tampilkan warning jika confidence < 70% |
| 4.8 | Tampilkan error jika OCR gagal, minta input manual |
| 4.9 | Simpan field `ocr_*` di tabel `meter_readings` |
| 4.10 | Set `is_manual_corrected = true` jika petugas mengubah angka OCR |
| 4.11 | Fallback: jika Google Vision tidak tersedia, coba Tesseract |

**Konfigurasi `.env` untuk OCR:**
```
GOOGLE_VISION_API_KEY=AIzaSy...
```

**Checklist Sprint 4:**
- [ ] Upload foto → angka muncul otomatis di form
- [ ] Warning confidence rendah muncul
- [ ] Pesan error muncul jika OCR gagal
- [ ] `is_manual_corrected` tersimpan benar di DB
- [ ] Semua field `ocr_*` tersimpan

---

### Sprint 5 — Tagihan & Pembayaran (Estimasi: 4–5 hari)

**Goal:** Tagihan otomatis terbuat, pembayaran bisa dicatat.

| Task | Keterangan |
|---|---|
| 5.1 | Buat `BillingService.php` — hitung total tagihan dari meter reading |
| 5.2 | Panggil `BillingService::generateBill()` setelah meter disimpan |
| 5.3 | Generate `bill_number` otomatis (format: INV-2026-06-0001) |
| 5.4 | Halaman list tagihan `/bills` (admin) |
| 5.5 | Halaman detail tagihan `/bills/{id}` |
| 5.6 | Form catat pembayaran `/payments/create/{bill_id}` |
| 5.7 | Buat `PaymentService.php` — proses pembayaran, update status tagihan |
| 5.8 | Tampilkan struk setelah pembayaran berhasil |
| 5.9 | Tombol "Kirim ke WhatsApp" — buka link `wa.me` dengan pesan terisi |
| 5.10 | Scheduled command `UpdateOverdueBills` — update status overdue harian |
| 5.11 | Daftarkan command di `app/Console/Kernel.php` atau `routes/console.php` |

**Checklist Sprint 5:**
- [ ] Tagihan otomatis terbuat setelah meter dicatat
- [ ] Total tagihan terhitung benar sesuai tarif
- [ ] Pembayaran bisa dicatat
- [ ] Status tagihan update otomatis (unpaid/partial/paid)
- [ ] Struk pembayaran tampil
- [ ] Link WhatsApp bisa diklik dan pesan sudah terisi

---

### Sprint 6 — Dashboard & Laporan (Estimasi: 3–4 hari)

**Goal:** Admin punya dashboard dan laporan lengkap.

| Task | Keterangan |
|---|---|
| 6.1 | Dashboard stat cards (pelanggan aktif, tagihan, pembayaran, tunggakan) |
| 6.2 | Grafik pemakaian air bulanan (recharts) |
| 6.3 | Grafik tagihan vs pembayaran (recharts) |
| 6.4 | Halaman laporan — filter periode & area |
| 6.5 | Laporan tagihan bulanan (tabel) |
| 6.6 | Laporan pembayaran (tabel) |
| 6.7 | Laporan tunggakan (tabel) |
| 6.8 | Export Excel laporan tagihan |
| 6.9 | Export PDF laporan tunggakan |

**Checklist Sprint 6:**
- [ ] Dashboard angka sesuai data di DB
- [ ] Grafik tampil dengan data yang benar
- [ ] Filter laporan berfungsi
- [ ] Export Excel berhasil di-download
- [ ] Export PDF bisa dibuka

---

## 16. Risiko & Antisipasi

| Risiko | Kemungkinan | Dampak | Antisipasi |
|---|---|---|---|
| OCR salah baca angka | Tinggi | Sedang | Petugas wajib cek + konfirmasi; simpan angka OCR & koreksi terpisah |
| Foto meteran buram/gelap | Tinggi | Sedang | Panduan foto, tombol ambil ulang, bisa input manual |
| Petugas salah pilih pelanggan | Sedang | Tinggi | Tampilkan nama & alamat besar di form; filter by area; UNIQUE constraint per periode |
| Sinyal internet lemah di lapangan | Sedang | Tinggi | MVP tetap online-only; tahap 2: PWA offline queue |
| OCR quota Google Vision habis | Rendah | Sedang | Fallback ke Tesseract; tampilkan pesan error yang jelas |
| Double entry meter | Rendah | Tinggi | UNIQUE constraint di DB: `(customer_id, billing_period_id)` |
| Periode salah dibuat | Rendah | Tinggi | Validasi hanya 1 periode `open`; tidak bisa hapus jika ada data |

---

## 17. Roadmap Tahap 2 & 3

### Tahap 2 — Setelah MVP Stabil

1. **WhatsApp API otomatis** — kirim tagihan & bukti bayar via WA Business API
2. **Export Excel & PDF** lengkap untuk semua laporan
3. **Grafik pemakaian per pelanggan** — tampil di detail pelanggan
4. **Warning pemakaian tidak normal** — notifikasi ke admin jika pemakaian > 2x rata-rata
5. **Pembagian rute petugas** — assign petugas ke area tertentu
6. **QR Code pelanggan** — scan QR langsung buka data pelanggan di form meter

### Tahap 3 — Pengembangan Lanjutan

1. **Portal pelanggan** — pelanggan bisa cek tagihan & riwayat sendiri via web
2. **Payment gateway** — pelanggan bisa bayar online (GoPay, OVO, dll)
3. **Mode offline PWA** — petugas bisa catat meter tanpa internet, sync saat ada sinyal
4. **GPS lokasi** — simpan koordinat saat pencatatan meter
5. **Model AI khusus meteran** — model OCR custom yang dilatih khusus untuk angka meteran air (lebih akurat dari Google Vision umum)
6. **Notifikasi otomatis** — reminder tagihan jatuh tempo via WhatsApp

---

*PRD ini dibuat untuk memudahkan pengerjaan oleh junior developer. Jika ada bagian yang masih belum jelas, tanyakan ke senior atau PM sebelum mulai coding.*

*Terakhir diperbarui: Juni 2026 | Versi 2.0*
