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
        // Check if role column exists, if not create it
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('admin')->after('email');
            });
        }
        
        // Update role column to allow attendance_manager
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('admin')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to remove the column as it might be used by other roles
    }
};
