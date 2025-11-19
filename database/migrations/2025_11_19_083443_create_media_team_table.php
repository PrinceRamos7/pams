<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_team', function (Blueprint $table) {
            $table->id('media_team_id');
            $table->string('student_id')->nullable()->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->enum('sex', ['Male', 'Female', 'Others']);
            $table->string('role')->nullable(); // e.g., Director, Managing Director, Photographer, Videographer, Editor
            $table->string('specialization')->nullable(); // e.g., Photography, Videography, Editing, Graphics
            $table->integer('age')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('phone_number')->nullable()->unique();
            $table->string('email')->nullable()->unique();
            $table->text('address')->nullable();
            $table->string('year')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Alumni'])->default('Active');
            $table->string('profile_picture')->nullable();
            $table->string('faceio_id')->nullable();
            $table->text('face_descriptor')->nullable();
            $table->text('face_image')->nullable();
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_team');
    }
};
