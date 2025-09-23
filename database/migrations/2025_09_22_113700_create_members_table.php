
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
    $table->id('member_id'); // unsignedBigInteger by default
            $table->string('student_id')->unique(); // Unique student number
            $table->string('firstname');
            $table->string('lastname');
            $table->enum('sex', ['Male', 'Female'])->nullable();
            $table->integer('age')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->unique();
            $table->string('year')->nullable();   // e.g. 1st year, 2nd year
            $table->string('status')->default('Active'); // e.g. Active, Inactive
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
