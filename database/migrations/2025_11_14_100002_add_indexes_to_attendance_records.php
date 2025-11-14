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
        Schema::table('attendance_records', function (Blueprint $table) {
            // Composite index for duplicate checking and lookups
            $table->index(['event_id', 'member_id'], 'idx_event_member');
            
            // Index for sanction calculation queries
            $table->index(['event_id', 'time_in'], 'idx_event_timein');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropIndex('idx_event_member');
            $table->dropIndex('idx_event_timein');
        });
    }
};
