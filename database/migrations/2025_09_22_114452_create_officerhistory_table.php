<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officer_history', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->unsignedBigInteger('officer_id');
            $table->unsignedBigInteger('batch_id');
            $table->string('position');
            $table->date('term_start');
            $table->date('term_end')->nullable();
            $table->timestamps();

            $table->foreign('officer_id')
                  ->references('officer_id') // matches officers PK
                  ->on('officers')
                  ->onDelete('cascade');

            $table->foreign('batch_id')
                  ->references('id') // matches batches PK
                  ->on('batches')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_history');
    }
};
