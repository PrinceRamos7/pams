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
            // Check if batch_id column doesn't exist before adding
            if (!Schema::hasColumn('officers_history', 'batch_id')) {
                $table->unsignedBigInteger('batch_id')->nullable()->after('member_id');
                
                // Add foreign key
                $table->foreign('batch_id')
                    ->references('id')
                    ->on('batches')
                    ->onDelete('set null');
                
                // Add index
                $table->index('batch_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('officers_history', function (Blueprint $table) {
            if (Schema::hasColumn('officers_history', 'batch_id')) {
                $table->dropForeign(['batch_id']);
                $table->dropIndex(['batch_id']);
                $table->dropColumn('batch_id');
            }
        });
    }
};
