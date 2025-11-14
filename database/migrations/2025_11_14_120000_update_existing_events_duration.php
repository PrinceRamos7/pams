<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing events to have default duration values
        DB::table('attendance_events')
            ->whereNull('time_in_duration')
            ->orWhereNull('time_out_duration')
            ->update([
                'time_in_duration' => 30,
                'time_out_duration' => 30,
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this
    }
};
