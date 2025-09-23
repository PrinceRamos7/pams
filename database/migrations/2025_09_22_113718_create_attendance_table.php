<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
       Schema::create('attendance', function (Blueprint $table) {
    $table->id('attendance_id');
    $table->date('date');
    $table->time('time_in')->nullable();
    $table->time('time_out')->nullable();
    $table->string('status')->nullable();
    $table->string('agenda')->nullable();

    // This automatically sets up FK to members.member_id
    $table->foreignId('member_id')
          ->constrained('members', 'member_id')
          ->cascadeOnDelete();

    $table->timestamps();
});

        
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance');
    }
};