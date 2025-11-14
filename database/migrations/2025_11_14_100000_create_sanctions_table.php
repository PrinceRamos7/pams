<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sanctions', function (Blueprint $table) {
            $table->id('sanction_id');
            $table->unsignedBigInteger('member_id');
            $table->unsignedBigInteger('event_id');
            $table->decimal('amount', 10, 2);
            $table->string('reason');
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->dateTime('payment_date')->nullable();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('member_id')
                ->references('member_id')
                ->on('members')
                ->onDelete('restrict');
            
            $table->foreign('event_id')
                ->references('event_id')
                ->on('attendance_events')
                ->onDelete('restrict');
            
            // Indexes for performance
            $table->index(['member_id', 'status'], 'idx_member_status');
            $table->index('event_id', 'idx_event');
            $table->index('status', 'idx_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sanctions');
    }
};
