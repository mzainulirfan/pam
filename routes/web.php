<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\BillingPeriodController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Mobile\MobileCustomerController;
use App\Http\Controllers\Mobile\MobileMeterReadingController;
use App\Http\Controllers\OcrController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TariffController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('areas', AreaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('customers', CustomerController::class)->except(['destroy']);
    Route::resource('tariffs', TariffController::class)->only(['index', 'store', 'update']);
    Route::resource('billing-periods', BillingPeriodController::class)->only(['index', 'store', 'update']);
    Route::resource('bills', BillController::class)->only(['index', 'show']);
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/create/{bill}', [PaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments/{bill}', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    Route::get('/mobile/customers', [MobileCustomerController::class, 'index'])->name('mobile.customers.index');
    Route::get('/mobile/meter-readings/create/{customer}', [MobileMeterReadingController::class, 'create'])->name('mobile.meter-readings.create');
    Route::post('/mobile/meter-readings/{customer}', [MobileMeterReadingController::class, 'store'])->name('mobile.meter-readings.store');
    Route::post('/mobile/meter-readings/ocr/read', OcrController::class)->name('mobile.meter-readings.ocr');
});

require __DIR__.'/auth.php';
