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
        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn('subscriptions', 'duration')) {
                $table->string('duration')->after('name');
            }
            
            if (!Schema::hasColumn('subscriptions', 'description')) {
                $table->text('description')->nullable()->after('price');
            }
            
            if (!Schema::hasColumn('subscriptions', 'features')) {
                $table->json('features')->nullable()->after('description');
            }
            
            if (!Schema::hasColumn('subscriptions', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('features');
            }
            
            if (!Schema::hasColumn('subscriptions', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('is_active');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $columnsToRemove = ['duration', 'description', 'features', 'is_active', 'sort_order'];
            
            foreach ($columnsToRemove as $column) {
                if (Schema::hasColumn('subscriptions', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};