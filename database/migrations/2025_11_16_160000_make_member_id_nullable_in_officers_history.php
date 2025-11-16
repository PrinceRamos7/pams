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
        Schema::table('officers_history', function (Blueprint $table) {
            // Drop the foreign key first
            $table->dropForeign(['member_id']);
            
            // Make member_id nullable
            $table->unsignedBigInteger('member_id')->nullable()->change();
            
            // Re-add the foreign key with nullable
            $table->foreign('member_id')
                ->references('member_id')
                ->on('members')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('officers_history', function (Blueprint $table) {
            // Drop the foreign key
            $table->dropForeign(['member_id']);
            
            // Make member_id not nullable
            $table->unsignedBigInteger('member_id')->nullable(false)->change();
            
            // Re-add the foreign key
            $table->foreign('member_id')
                ->references('member_id')
                ->on('members')
                ->onDelete('cascade');
        });
    }
};
