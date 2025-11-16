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
        Schema::create('officers_history', function (Blueprint $table) {
            $table->id('history_id');
            $table->unsignedBigInteger('officer_id')->nullable();
            $table->unsignedBigInteger('member_id');
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->string('position');
            $table->enum('action', ['added', 'removed', 'position_changed'])->default('added');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('member_id')
                ->references('member_id')
                ->on('members')
                ->onDelete('cascade');
            
            $table->foreign('batch_id')
                ->references('id')
                ->on('batches')
                ->onDelete('set null');
            
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
            
            // Indexes
            $table->index('member_id');
            $table->index('batch_id');
            $table->index('position');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('officers_history');
    }
};
