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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Kto wystawił ocenę
            $table->foreignId('company_id')->constrained()->onDelete('cascade'); // Która firma jest oceniana
            $table->integer('rating')->check('rating >= 1 AND rating <= 5'); // 1-5 gwiazdek
            $table->text('comment')->nullable(); // Komentarz
            $table->string('order_number')->nullable(); // Nr zlecenia
            $table->date('order_date')->nullable(); // Data zlecenia
            $table->boolean('is_hidden')->default(false); // Czy komentarz jest ukryty
            $table->text('admin_note')->nullable(); // Notatka admina
            $table->timestamps();
            
            // Indeksy
            $table->index(['company_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['rating']);
            $table->index(['is_hidden']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};