<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conference_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('capacity');
            $table->decimal('hourly_rate', 12, 2);
            $table->decimal('daily_rate', 12, 2);
            $table->json('equipment')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('tenant_id');
        });

        Schema::create('conference_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('conference_room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guest_id')->nullable()->constrained()->nullOnDelete();
            $table->string('organizer_name');
            $table->string('organizer_email')->nullable();
            $table->string('organizer_phone')->nullable();
            $table->string('event_name');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('attendees');
            $table->decimal('total_amount', 14, 2);
            $table->string('status')->default('pending');
            $table->json('requirements')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'date']);
            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conference_bookings');
        Schema::dropIfExists('conference_rooms');
    }
};
