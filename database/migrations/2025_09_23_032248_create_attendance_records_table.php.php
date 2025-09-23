<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id('record_id');

            // Link to attendance_events
            $table->foreignId('event_id')
                  ->constrained('attendance_events', 'event_id')
                  ->cascadeOnDelete();

            // Link to members
            $table->foreignId('member_id')
                  ->constrained('members', 'member_id')
                  ->cascadeOnDelete();

            $table->timestamp('time_in')->nullable();
            $table->timestamp('time_out')->nullable();
            $table->string('status')->default('Present'); // optional, Active/Inactive
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
