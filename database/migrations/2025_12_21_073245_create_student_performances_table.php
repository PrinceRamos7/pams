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
        Schema::create('student_performances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('member_id');
            $table->foreignId('category_id')->constrained('performance_categories')->onDelete('cascade');
            $table->decimal('score', 5, 2); // e.g., 95.50
            $table->text('remarks')->nullable();
            $table->timestamps();
            
            // Foreign key for member_id (members table uses member_id as primary key)
            $table->foreign('member_id')->references('member_id')->on('members')->onDelete('cascade');
            
            // Prevent duplicate entries for same member and category
            $table->unique(['member_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_performances');
    }
};
