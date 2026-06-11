<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_number')->unique();
            $table->string('name', 100);
            $table->string('phone', 20);
            $table->text('address');
            $table->foreignId('area_id')->constrained()->restrictOnDelete();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->date('start_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('meters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('meter_number')->unique();
            $table->unsignedInteger('initial_reading')->default(0);
            $table->timestamps();
        });

        Schema::create('tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->unsignedInteger('price_per_m3');
            $table->unsignedInteger('fixed_charge')->default(0);
            $table->unsignedInteger('late_fee')->default(0);
            $table->unsignedInteger('admin_fee')->default(0);
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('billing_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('due_date');
            $table->enum('status', ['open', 'closed'])->default('open')->index();
            $table->timestamps();
            $table->unique(['month', 'year']);
        });

        Schema::create('meter_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('billing_period_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('previous_reading');
            $table->unsignedInteger('current_reading');
            $table->unsignedInteger('usage_m3');
            $table->string('photo_path')->nullable();
            $table->text('ocr_text')->nullable();
            $table->unsignedInteger('ocr_value')->nullable();
            $table->decimal('ocr_confidence', 5, 2)->nullable();
            $table->boolean('is_manual_corrected')->default(false);
            $table->text('notes')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->unique(['customer_id', 'billing_period_id']);
        });

        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meter_reading_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('billing_period_id')->constrained()->restrictOnDelete();
            $table->foreignId('tariff_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('usage_m3');
            $table->unsignedInteger('price_per_m3');
            $table->unsignedInteger('water_charge');
            $table->unsignedInteger('fixed_charge');
            $table->unsignedInteger('late_fee')->default(0);
            $table->unsignedInteger('admin_fee')->default(0);
            $table->unsignedInteger('total_amount');
            $table->unsignedInteger('paid_amount')->default(0);
            $table->unsignedInteger('remaining_amount');
            $table->enum('status', ['unpaid', 'partial', 'paid', 'overdue', 'cancelled'])->default('unpaid')->index();
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('bill_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('amount');
            $table->timestamp('paid_at');
            $table->string('proof_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('meter_readings');
        Schema::dropIfExists('billing_periods');
        Schema::dropIfExists('tariffs');
        Schema::dropIfExists('meters');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('areas');
    }
};
