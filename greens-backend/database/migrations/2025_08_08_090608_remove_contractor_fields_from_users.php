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
        Schema::table('users', function (Blueprint $table) {
            // Usuń kolumnę user_type (nie potrzebna już w users - tylko client)
            $table->dropColumn('user_type');
            
            // Opcjonalnie: usuń pola firmowe jeśli nie są używane przez clientów
            // $table->dropColumn('company_name');
            // $table->dropColumn('company_description');
            // $table->dropColumn('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Przywróć user_type
            $table->enum('user_type', ['client', 'contractor'])->default('client')->after('is_admin');
            
            // Przywróć pola firmowe jeśli zostały usunięte
            // $table->string('company_name')->nullable()->after('user_type');
            // $table->text('company_description')->nullable()->after('company_name');
            // $table->string('website')->nullable()->after('company_description');
        });
    }
};