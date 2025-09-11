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
            // Dodajemy wszystkie brakujące kolumny
            $table->string('name')->unique()->after('id');
            $table->string('duration')->after('name');
            $table->decimal('price', 10, 2)->after('duration');
            $table->text('description')->nullable()->after('price');
            $table->json('features')->nullable()->after('description');
            $table->boolean('is_active')->default(true)->after('features');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
        
        // Dodajemy indeksy
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->index('name');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            // Usuń indeksy
            $table->dropIndex(['name']);
            $table->dropIndex(['is_active']);
            
            // Usuń kolumny
            $table->dropColumn([
                'name',
                'duration', 
                'price',
                'description',
                'features',
                'is_active',
                'sort_order'
            ]);
        });
    }
};