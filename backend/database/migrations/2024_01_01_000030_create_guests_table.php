<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('id_type')->nullable();
            $table->string('id_number')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('preferences')->nullable();
            $table->text('notes')->nullable();
            $table->string('vip_status')->default('regular');
            $table->integer('total_stays')->default(0);
            $table->decimal('total_spent', 14, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
            $table->index(['tenant_id', 'email']);
            $table->index(['tenant_id', 'last_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
