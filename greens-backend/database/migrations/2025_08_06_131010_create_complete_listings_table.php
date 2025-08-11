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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('long_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('rating', 2, 1)->default(0);
            $table->string('category');
            $table->string('subcategory');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('location');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->json('images')->nullable();
            $table->json('tags')->nullable();
            $table->text('experience')->nullable();
            $table->json('social_media')->nullable();
            $table->enum('status', ['aktywne', 'nie aktywne', 'oczekujące'])->default('aktywne');
            $table->boolean('is_featured')->default(false);
            $table->integer('clicks')->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            // Indeksy
            $table->index('category');
            $table->index('subcategory');
            $table->index('status');
            $table->index('is_featured');
            $table->index('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};