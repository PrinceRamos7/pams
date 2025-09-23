<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officers', function (Blueprint $table) {
            $table->id('officer_id');        // Primary key
            $table->string('position');      // e.g. President, Secretary
            $table->unsignedBigInteger('member_id'); // Foreign key from members
            $table->timestamps();

            // Relationship with members
            $table->foreign('member_id')
                  ->references('member_id')
                  ->on('members')
                  ->onDelete('cascade'); // if member deleted, officer deleted too
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officers');
    }
};
