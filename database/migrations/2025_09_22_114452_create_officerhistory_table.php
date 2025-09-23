<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officer_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('officer_id');
            $table->date('term_start');
            $table->date('term_end');
            $table->timestamps();

            $table->foreign('officer_id')
                  ->references('officer_id')
                  ->on('officers')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_history');
    }
};
