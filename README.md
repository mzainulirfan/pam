# Sistem Tagihan Air

Aplikasi operasional PAM/layanan air untuk mengelola pelanggan, pencatatan meter, tagihan, pembayaran, dan laporan periode. Aplikasi ini dibangun dengan Laravel 11, Inertia React, TypeScript, Tailwind CSS, dan SQLite/MySQL.

## Fitur Utama

- Dashboard ringkasan operasional berdasarkan periode tagihan.
- Manajemen area layanan, pelanggan, meter pelanggan, tarif, dan periode tagihan.
- Pencatatan meter versi mobile untuk petugas lapangan.
- Perhitungan tagihan otomatis dari pemakaian meter dan tarif aktif.
- Status tagihan `unpaid`, `partial`, `paid`, dan `overdue`.
- Pencatatan pembayaran dengan metode bayar dan riwayat transaksi.
- Cetak struk setelah pencatatan meter.
- Laporan tagihan, pembayaran, tunggakan, dan kolektibilitas per periode.
- Command palette untuk pencarian menu di dashboard.
- Perintah scheduler untuk memperbarui tagihan jatuh tempo menjadi overdue.

## Stack

- PHP 8.2+
- Laravel 11
- Inertia.js React
- React 18 + TypeScript
- Tailwind CSS
- Spatie Laravel Permission
- Vite

## Instalasi Lokal

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Gunakan SQLite untuk setup cepat:

```bash
touch database/database.sqlite
```

Pastikan konfigurasi database di `.env` sesuai. Contoh SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

Jalankan migrasi dan seed data contoh:

```bash
php artisan migrate --seed
```

Jalankan aplikasi:

```bash
php artisan serve
npm run dev
```

Buka `http://127.0.0.1:8000`.

## Akun Demo

Seeder membuat beberapa akun berikut dengan password `password`:

| Role | Email |
| --- | --- |
| Admin | `admin@example.com` |
| Petugas | `petugas@example.com` |
| Kasir | `kasir@example.com` |

Seeder juga membuat data area, tarif aktif, periode Mei/Juni 2026, metode pembayaran, pelanggan contoh, pencatatan meter, tagihan, dan beberapa pembayaran.

## Modul Aplikasi

| Modul | Keterangan |
| --- | --- |
| Dashboard | Ringkasan pelanggan, tagihan, pembayaran, tunggakan, dan progres pencatatan sesuai filter periode. |
| Area | Data wilayah/blok pelanggan. |
| Pelanggan | Data pelanggan, meter, status layanan, alamat, dan riwayat tagihan. |
| Tarif | Tarif aktif, biaya tetap, denda, dan biaya admin. |
| Periode | Periode tagihan bulanan dengan tanggal mulai, selesai, jatuh tempo, dan status. |
| Tagihan | Daftar dan detail tagihan pelanggan. |
| Pembayaran | Pencatatan pembayaran dan status sisa tagihan. |
| Laporan | Rekap operasional berdasarkan periode. |
| Mobile Petugas | Daftar pelanggan mobile dan form pencatatan meter lapangan. |

## Alur Operasional

1. Admin mengatur area, tarif aktif, pelanggan, dan periode tagihan.
2. Petugas membuka menu mobile, memilih pelanggan, lalu mencatat angka meter.
3. Sistem menghitung pemakaian dan membuat tagihan dari tarif aktif.
4. Kasir mencatat pembayaran penuh atau sebagian.
5. Dashboard dan laporan menampilkan status terbaru berdasarkan periode.

## Perintah Penting

Build frontend produksi:

```bash
npm run build
```

Jalankan test:

```bash
php artisan test
```

Update tagihan jatuh tempo menjadi overdue:

```bash
php artisan bills:update-overdue
```

Untuk menjalankannya otomatis, tambahkan command tersebut ke scheduler Laravel atau cron sesuai kebutuhan deployment.

## Catatan Deployment

- Jangan commit `.env`, database lokal, `vendor`, `node_modules`, `public/build`, atau file runtime storage.
- Jalankan `composer install --no-dev --optimize-autoloader` dan `npm run build` di environment produksi.
- Pastikan permission folder `storage` dan `bootstrap/cache` dapat ditulis oleh web server.
- Jalankan `php artisan migrate --force` saat deployment.

## Lisensi

Proyek ini menggunakan lisensi MIT mengikuti konfigurasi Laravel default.
