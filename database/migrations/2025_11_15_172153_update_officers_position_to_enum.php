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
        // For MySQL, we need to alter the column to use ENUM
        DB::statement("ALTER TABLE officers MODIFY COLUMN position ENUM(
            'President',
            'Vice President - Internal',
            'Vice President - External',
            'Secretary',
            'Treasurer',
            'Auditor',
            'Business Manager',
            'Public Information Officer (PIO)',
            'Attendance Officer',
            'PITON Representative',
            'Media Team Director',
            'Media Team Managing Director'
        ) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to string
        Schema::table('officers', function (Blueprint $table) {
            $table->string('position')->change();
        });
