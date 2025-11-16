<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the status enum to include 'excused'
        DB::statement("ALTER TABLE sanctions MODIFY COLUMN status ENUM('unpaid', 'paid', 'excused') NOT NULL DEFAULT 'unpaid'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE sanctions MODIFY COLUMN status ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid'");
    }
};
