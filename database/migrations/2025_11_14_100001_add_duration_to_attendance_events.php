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
        Schema::table('attendance_events', function (Blueprint $table) {
            $table->integer('time_in_duration')->default(30)->after('time_out')->comment('Duration in minutes for time-in window');
            $table->integer('time_out_duration')->default(30)->after('time_in_duration')->comment('Duration in minutes for time-out window');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendance_events', function (Blueprint $table) {
            $table->dropColumn(['time_in_duration', 'time_out_duration']);
        });
    }
};
