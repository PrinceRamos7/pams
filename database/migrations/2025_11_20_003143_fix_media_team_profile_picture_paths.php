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
        // Fix existing profile picture paths to include leading slash
        DB::table('media_team')
            ->whereNotNull('profile_picture')
            ->whereRaw("profile_picture NOT LIKE '/%'")
            ->update([
                'profile_picture' => DB::raw("CONCAT('/', profile_picture)")
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove leading slash from profile picture paths
        DB::table('media_team')
            ->whereNotNull('profile_picture')
            ->whereRaw("profile_picture LIKE '/%'")
            ->update([
                'profile_picture' => DB::raw("SUBSTRING(profile_picture, 2)")
            ]);
    }
};
