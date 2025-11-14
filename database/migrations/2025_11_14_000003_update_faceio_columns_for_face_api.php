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
        Schema::table('members', function (Blueprint $table) {
            // Change faceio_id to text to store face descriptor JSON
            $table->text('face_descriptor')->nullable()->after('faceio_id');
        });
        
        Schema::table('users', function (Blueprint $table) {
            // Change faceio_id to text to store face descriptor JSON
            $table->text('face_descriptor')->nullable()->after('faceio_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('face_descriptor');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('face_descriptor');
        });
    }
};
