# PRD - Sistem Tagihan Air Berlangganan Berbasis Web

**Versi:** 2.1  
**Status:** MVP terimplementasi  
**Terakhir diperbarui:** Juni 2026  
**Tech Stack:** Laravel 11, Inertia React, TypeScript, Tailwind CSS, SQLite/MySQL

---

## 1. Ringkasan Produk

Sistem Tagihan Air adalah aplikasi web untuk operasional layanan air berlangganan. Aplikasi digunakan oleh admin, kasir, dan petugas lapangan untuk mengelola pelanggan, mencatat meter, membuat tagihan, mencatat pembayaran, dan melihat laporan.

Alur utama:

```text
Setup master data -> Catat meter -> Generate tagihan -> Catat pembayaran -> Pantau laporan
```

MVP saat ini sudah memiliki dashboard desktop, halaman mobile untuk petugas, command palette pencarian menu, pencatatan meter dengan estimasi tagihan, struk setelah pencatatan, dan laporan berdasarkan periode.

---

## 2. Masalah yang Diselesaikan

| Masalah | Dampak | Solusi di aplikasi |
| --- | --- | --- |
| Data pelanggan tersebar di kertas | Sulit dicari dan rawan hilang | Data pelanggan terpusat |
| Catat angka meter manual | Rawan salah tulis | Form mobile dengan validasi angka meter |
| Hitung tagihan manual | Tagihan bisa salah | Tagihan dihitung otomatis dari tarif aktif |
| Pembayaran sulit dipantau | Piutang menumpuk | Status tagihan dan sisa tagihan tersimpan |
| Rekap laporan manual | Lambat dan tidak realtime | Dashboard dan laporan per periode |
| Petugas bekerja lewat HP | Tampilan desktop sulit dipakai | Halaman mobile khusus petugas |

---

## 3. Target Pengguna

| Role | Kebutuhan utama |
| --- | --- |
| Admin | Mengelola master data, memantau dashboard, melihat laporan |
| Petugas | Melihat daftar pelanggan mobile dan mencatat meter di lapangan |
| Kasir | Mencari tagihan dan mencatat pembayaran |

Seeder membuat role `admin`, `officer`, dan `cashier`.

---

## 4. Fitur Saat Ini

### 4.1 Home

URL: `/`

Halaman landing aplikasi yang menggantikan tampilan default Laravel. Berisi ringkasan sistem, modul utama, dan CTA ke login/dashboard/mobile petugas.

### 4.2 Auth dan Profile

URL:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/profile`

Fitur:

- Login dan register dari Laravel Breeze.
- Halaman auth sudah mengikuti visual desain aplikasi.
- Profile pengguna untuk update informasi akun, password, dan hapus akun.

### 4.3 Dashboard

URL: `/dashboard`

Fitur:

- Filter periode tagihan.
- Ringkasan pelanggan aktif, tagihan, pembayaran, tunggakan, dan progres pencatatan.
- Data dashboard mengikuti periode yang dipilih.
- Sidebar desktop dengan icon menu.
- Topbar menampilkan akun dan logout.
- Command palette untuk mencari dan membuka menu.
- Sidebar/mobile navigation untuk akses dari layar kecil.

### 4.4 Area

URL: `/areas`

Fitur:

- Tambah area.
- Edit area.
- Hapus area jika tidak terikat pelanggan.
- Tampilkan jumlah pelanggan per area.

### 4.5 Pelanggan

URL:

- `/customers`
- `/customers/create`
- `/customers/{customer}`
- `/customers/{customer}/edit`

Fitur:

- List pelanggan dengan filter/search.
- Tambah dan edit pelanggan.
- Detail pelanggan berisi informasi pelanggan, meter, dan riwayat.
- Relasi pelanggan dengan area dan meter.
- Status pelanggan `active` atau `inactive`.

### 4.6 Tarif

URL: `/tariffs`

Fitur:

- Tambah tarif.
- Edit tarif.
- Atur tarif aktif.
- Komponen biaya: harga per m3, biaya tetap, denda, dan biaya admin.

Business rule:

- Hanya satu tarif yang aktif untuk perhitungan tagihan.

### 4.7 Periode Tagihan

URL: `/billing-periods`

Fitur:

- Tambah dan edit periode tagihan.
- Form periode dapat mengisi data otomatis berdasarkan bulan dan tahun.
- Status periode: `open` atau `closed`.
- Data periode berisi nama, bulan, tahun, tanggal mulai, tanggal selesai, dan tanggal jatuh tempo.

Business rule:

- Hanya satu periode `open` pada satu waktu.
- Pencatatan meter memakai periode `open`.

### 4.8 Tagihan

URL:

- `/bills`
- `/bills/{bill}`

Fitur:

- List tagihan.
- Detail tagihan.
- Status tagihan: `unpaid`, `partial`, `paid`, `overdue`.
- Sisa tagihan dihitung dari total tagihan dikurangi total pembayaran.
- Link ke form pembayaran.

Perhitungan:

```text
pemakaian_m3 = meter_saat_ini - meter_sebelumnya
biaya_air = pemakaian_m3 * tarif_per_m3
total_tagihan = biaya_air + biaya_tetap + biaya_admin + denda
```

### 4.9 Pembayaran

URL:

- `/payments`
- `/payments/create/{bill}`
- `POST /payments/{bill}`

Fitur:

- List pembayaran.
- Form pembayaran.
- Metode pembayaran dari `payment_methods`.
- Validasi nominal pembayaran.
- Update otomatis status tagihan:
  - `paid` jika lunas.
  - `partial` jika pembayaran sebagian.
  - tetap `unpaid` jika belum ada pembayaran.

### 4.10 Laporan

URL: `/reports`

Fitur:

- Filter periode.
- Ringkasan tagihan, pembayaran, tunggakan, dan kolektibilitas.
- Tabel data operasional sesuai periode.

### 4.11 Mobile Petugas

URL:

- `/mobile/customers`
- `/mobile/meter-readings/create/{customer}`
- `POST /mobile/meter-readings/{customer}`
- `POST /mobile/meter-readings/ocr/read`

Fitur:

- List pelanggan aktif untuk petugas.
- Search dan filter pelanggan.
- Badge status berdasarkan tagihan/pencatatan periode berjalan.
- Form catat meter yang nyaman di HP.
- Validasi meter saat ini tidak boleh lebih kecil dari meter sebelumnya.
- Estimasi pemakaian dan tagihan.
- Tombol simpan dinonaktifkan jika tagihan periode tersebut sudah `paid`.
- Setelah pencatatan selesai, tersedia aksi cetak struk.
- Struk dioptimalkan agar tetap terbaca dan muat satu halaman.

Business rule:

- Satu pelanggan hanya boleh punya satu pencatatan per periode.
- Jika pencatatan untuk pelanggan dan periode yang sama sudah ada, sistem memperbarui data yang ada, bukan membuat duplikat.
- Jika tagihan sudah lunas, petugas tidak boleh mengubah catatan meter periode tersebut.

---

## 5. Data Model

### 5.1 Users

Digunakan untuk login admin, petugas, dan kasir.

Kolom utama:

- `name`
- `email`
- `password`

Role dikelola dengan Spatie Permission.

### 5.2 Areas

Area layanan pelanggan.

Kolom utama:

- `name`
- `description`

### 5.3 Customers

Data pelanggan.

Kolom utama:

- `customer_number`
- `name`
- `phone`
- `address`
- `area_id`
- `status`
- `start_date`
- `notes`

Relasi:

- Customer belongs to Area.
- Customer has one Meter.
- Customer has many MeterReadings.
- Customer has many Bills.

### 5.4 Meters

Data meter pelanggan.

Kolom utama:

- `customer_id`
- `meter_number`
- `initial_reading`

### 5.5 Tariffs

Tarif penagihan.

Kolom utama:

- `name`
- `price_per_m3`
- `fixed_charge`
- `late_fee`
- `admin_fee`
- `is_active`

### 5.6 Billing Periods

Periode penagihan bulanan.

Kolom utama:

- `name`
- `month`
- `year`
- `start_date`
- `end_date`
- `due_date`
- `status`

### 5.7 Meter Readings

Catatan meter per pelanggan dan periode.

Kolom utama:

- `customer_id`
- `meter_id`
- `billing_period_id`
- `user_id`
- `previous_reading`
- `current_reading`
- `usage_m3`
- `photo_path`
- `ocr_text`
- `ocr_value`
- `ocr_confidence`
- `is_manual_corrected`
- `notes`
- `read_at`

Constraint penting:

- Unique pada `customer_id` dan `billing_period_id`.

### 5.8 Bills

Tagihan pelanggan.

Kolom utama:

- `bill_number`
- `customer_id`
- `meter_reading_id`
- `billing_period_id`
- `usage_m3`
- `price_per_m3`
- `water_charge`
- `fixed_charge`
- `late_fee`
- `admin_fee`
- `total_amount`
- `paid_amount`
- `remaining_amount`
- `status`
- `due_date`

### 5.9 Payments

Pembayaran tagihan.

Kolom utama:

- `bill_id`
- `payment_method_id`
- `user_id`
- `amount`
- `paid_at`
- `notes`

### 5.10 Payment Methods

Metode pembayaran.

Kolom utama:

- `name`
- `code`
- `is_active`

---

## 6. Route Laravel

| Method | URL | Name | Controller |
| --- | --- | --- | --- |
| GET | `/` | - | Welcome page |
| GET | `/dashboard` | `dashboard` | `DashboardController` |
| GET | `/profile` | `profile.edit` | `ProfileController@edit` |
| PATCH | `/profile` | `profile.update` | `ProfileController@update` |
| DELETE | `/profile` | `profile.destroy` | `ProfileController@destroy` |
| GET/POST/PATCH/DELETE | `/areas` | `areas.*` | `AreaController` |
| GET/POST/PATCH | `/tariffs` | `tariffs.*` | `TariffController` |
| GET/POST/PATCH | `/billing-periods` | `billing-periods.*` | `BillingPeriodController` |
| Resource | `/customers` | `customers.*` | `CustomerController` |
| GET | `/bills` | `bills.index` | `BillController@index` |
| GET | `/bills/{bill}` | `bills.show` | `BillController@show` |
| GET | `/payments` | `payments.index` | `PaymentController@index` |
| GET | `/payments/create/{bill}` | `payments.create` | `PaymentController@create` |
| POST | `/payments/{bill}` | `payments.store` | `PaymentController@store` |
| GET | `/reports` | `reports.index` | `ReportController@index` |
| GET | `/mobile/customers` | `mobile.customers.index` | `MobileCustomerController@index` |
| GET | `/mobile/meter-readings/create/{customer}` | `mobile.meter-readings.create` | `MobileMeterReadingController@create` |
| POST | `/mobile/meter-readings/{customer}` | `mobile.meter-readings.store` | `MobileMeterReadingController@store` |
| POST | `/mobile/meter-readings/ocr/read` | `mobile.meter-readings.ocr` | `OcrController` |

Semua route operasional selain home dan auth berada di middleware `auth`.

---

## 7. Business Rules

1. Pelanggan harus berada pada satu area.
2. Pelanggan aktif wajib memiliki meter.
3. Meter pelanggan memiliki nomor meter unik.
4. Tarif aktif dipakai untuk semua tagihan baru.
5. Hanya satu tarif aktif pada satu waktu.
6. Hanya satu periode tagihan yang `open`.
7. Pencatatan meter memakai periode `open`.
8. Angka meter saat ini tidak boleh lebih kecil dari angka meter sebelumnya.
9. Satu pelanggan hanya boleh memiliki satu pencatatan meter per periode.
10. Pencatatan meter membuat atau memperbarui tagihan periode tersebut.
11. Tagihan `paid` tidak boleh diubah lewat form catat meter mobile.
12. Pembayaran tidak boleh melebihi sisa tagihan.
13. Status tagihan menjadi `paid` jika sisa tagihan nol.
14. Status tagihan menjadi `partial` jika sudah ada pembayaran tetapi belum lunas.
15. Tagihan `unpaid` atau `partial` yang melewati jatuh tempo dapat diubah menjadi `overdue`.

---

## 8. UI dan UX

### 8.1 Prinsip desain

- Desktop memakai layout sidebar dan topbar.
- Sidebar menggunakan icon untuk memudahkan pemindaian menu.
- Mobile memakai layout yang lebih ringkas dan fokus pada aksi utama.
- Tombol mobile dibuat besar dan mudah ditekan.
- Warna status harus konsisten di semua halaman.
- Card dan tabel dibuat padat tetapi tetap mudah dibaca.

### 8.2 Status badge

| Status | Label tampilan | Makna |
| --- | --- | --- |
| `unpaid` | Belum Bayar | Tagihan sudah dibuat, belum ada pembayaran |
| `partial` | Sebagian | Sudah ada pembayaran, belum lunas |
| `paid` | Lunas | Tagihan sudah dibayar penuh |
| `overdue` | Menunggak | Lewat jatuh tempo dan belum lunas |
| `open` | Terbuka | Periode masih dapat digunakan |
| `closed` | Ditutup | Periode tidak dipakai untuk pencatatan baru |
| `active` | Aktif | Pelanggan aktif |
| `inactive` | Nonaktif | Pelanggan tidak aktif |

### 8.3 Mobile petugas

Kebutuhan UX khusus:

- Font minimal nyaman dibaca di luar ruangan.
- Input angka meter menggunakan keyboard numerik.
- Informasi pelanggan tampil jelas sebelum petugas menyimpan.
- Struk cetak tidak terlalu kecil dan tidak terlalu padat.
- Jika tagihan sudah lunas, tombol simpan catatan dinonaktifkan.

---

## 9. Seed Data

Seeder membuat:

- Role: `admin`, `officer`, `cashier`.
- User demo:
  - `admin@example.com` / `password`
  - `petugas@example.com` / `password`
  - `kasir@example.com` / `password`
- Area contoh: Blok A, Blok B, Jalur Utara, Jalur Selatan.
- Tarif aktif: Tarif Rumah Tangga 2026.
- Periode contoh: Mei 2026 dan Juni 2026.
- Metode pembayaran: Tunai, Transfer Bank, QRIS.
- Pelanggan contoh lengkap dengan meter.
- Meter reading, tagihan, dan beberapa pembayaran contoh.

---

## 10. Acceptance Criteria MVP

| No | Kriteria | Status |
| --- | --- | --- |
| 1 | User dapat login | Selesai |
| 2 | Dashboard tampil dengan filter periode | Selesai |
| 3 | Admin dapat kelola area | Selesai |
| 4 | Admin dapat kelola pelanggan dan meter | Selesai |
| 5 | Admin dapat kelola tarif aktif | Selesai |
| 6 | Admin dapat kelola periode tagihan | Selesai |
| 7 | Petugas dapat melihat pelanggan versi mobile | Selesai |
| 8 | Petugas dapat mencatat meter | Selesai |
| 9 | Sistem menghitung pemakaian otomatis | Selesai |
| 10 | Sistem membuat tagihan dari pencatatan meter | Selesai |
| 11 | Kasir dapat mencatat pembayaran | Selesai |
| 12 | Status tagihan berubah sesuai pembayaran | Selesai |
| 13 | Laporan periode tersedia | Selesai |
| 14 | Halaman mobile dapat digunakan petugas | Selesai |
| 15 | Struk setelah pencatatan tersedia | Selesai |
| 16 | Update overdue tersedia lewat artisan command | Selesai |

---

## 11. Perintah Operasional

Install dependency:

```bash
composer install
npm install
```

Setup environment:

```bash
cp .env.example .env
php artisan key:generate
```

Migrasi dan seed:

```bash
php artisan migrate --seed
```

Jalankan development server:

```bash
php artisan serve
npm run dev
```

Build frontend:

```bash
npm run build
```

Jalankan test:

```bash
php artisan test
```

Update tagihan overdue:

```bash
php artisan bills:update-overdue
```

---

## 12. Struktur Folder Aktual

```text
app/
  Console/Commands/UpdateOverdueBills.php
  Http/Controllers/
    AreaController.php
    BillController.php
    BillingPeriodController.php
    CustomerController.php
    DashboardController.php
    OcrController.php
    PaymentController.php
    ProfileController.php
    ReportController.php
    TariffController.php
    Mobile/
      MobileCustomerController.php
      MobileMeterReadingController.php
  Http/Requests/
    CustomerRequest.php
    MeterReadingRequest.php
    ProfileUpdateRequest.php
  Models/
    Area.php
    Bill.php
    BillingPeriod.php
    Customer.php
    Meter.php
    MeterReading.php
    Payment.php
    PaymentMethod.php
    Tariff.php
    User.php
  Services/
    BillingService.php
    OcrService.php
    PaymentService.php

database/
  migrations/
  seeders/DatabaseSeeder.php

resources/js/
  Components/
  Layouts/
    AuthenticatedLayout.tsx
    GuestLayout.tsx
  Pages/
    Areas/
    Auth/
    BillingPeriods/
    Bills/
    Customers/
    Dashboard.tsx
    Mobile/
    Payments/
    Profile/
    Reports/
    Tariffs/
    Welcome.tsx

routes/
  auth.php
  console.php
  web.php
```

---

## 13. Roadmap Lanjutan

### Tahap 2

1. Export laporan ke Excel/PDF.
2. Kirim tagihan dan struk via WhatsApp.
3. Hak akses lebih granular per role.
4. Assign petugas ke area/rute tertentu.
5. Grafik pemakaian per pelanggan.
6. Notifikasi pemakaian tidak normal.
7. Upload dan penyimpanan foto meter yang lebih lengkap.

### Tahap 3

1. Portal pelanggan untuk cek tagihan mandiri.
2. Payment gateway.
3. PWA offline queue untuk petugas.
4. GPS lokasi saat pencatatan meter.
5. OCR meter yang lebih akurat dengan provider eksternal atau model khusus.
6. Reminder otomatis untuk tagihan jatuh tempo.

---

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Petugas salah pilih pelanggan | Tagihan salah orang | Tampilkan nama, alamat, nomor meter, dan periode dengan jelas |
| Angka meter salah input | Tagihan salah | Validasi angka tidak turun dan tampilkan estimasi sebelum simpan |
| Double entry pencatatan | Data tagihan duplikat | Unique constraint `customer_id` + `billing_period_id` dan update data existing |
| Tagihan lunas berubah | Data pembayaran tidak konsisten | Disable form simpan jika status tagihan `paid` |
| Periode salah dipilih | Data masuk bulan salah | Sistem memakai periode `open` dan dashboard memakai filter periode |
| Koneksi lapangan buruk | Petugas sulit input | Roadmap PWA offline queue |

---

## 15. Definisi Selesai

Sebuah fitur dianggap selesai jika:

1. Route dan controller tersedia.
2. UI desktop/mobile sesuai konteks penggunaan.
3. Validasi backend berjalan.
4. Error validasi tampil di form.
5. Data tersimpan dengan relasi yang benar.
6. Status atau kalkulasi otomatis terbarui.
7. Tidak ada data sensitif yang masuk repository.
8. `npm run build` berhasil.
9. Test penting tetap lulus atau risiko test yang belum ada dicatat.
