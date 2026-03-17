<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->decimal('base_price', 12, 2);
            $table->integer('max_occupancy')->default(2);
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->string('bed_type')->nullable();
            $table->string('size')->nullable();
            $table->string('view')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'slug']);
            $table->index('tenant_id');
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
            $table->string('number');
            $table->integer('floor')->default(1);
            $table->string('status')->default('available');
            $table->boolean('is_clean')->default(true);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'number']);
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'room_type_id']);
        });

        Schema::create('room_rate_overrides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('rate_type')->default('fixed'); // fixed, percentage
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'room_type_id', 'start_date', 'end_date'], 'rate_overrides_tenant_type_dates_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_rate_overrides');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('room_types');
    }
};
