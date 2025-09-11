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
        Schema::table('companies', function (Blueprint $table) {
            // Pola dla authentykacji
            $table->string('password')->after('email'); // Hasło dla logowania
            $table->timestamp('email_verified_at')->nullable()->after('password');
            $table->rememberToken()->after('email_verified_at');
            $table->string('user_type')->default('contractor')->after('remember_token'); // Typ użytkownika
            
            // Dodatkowe pola jak w User
            $table->string('city')->nullable()->after('address');
            $table->text('about')->nullable()->after('nip');
            $table->string('avatar')->nullable()->after('about');
            $table->string('website')->nullable()->after('avatar');
            $table->text('company_description')->nullable()->after('website');
            
            // Ustawienia powiadomień
            $table->boolean('email_new_messages')->default(true)->after('company_description');
            $table->boolean('email_new_reviews')->default(true)->after('email_new_messages');
            $table->boolean('email_listing_updates')->default(false)->after('email_new_reviews');
            $table->boolean('email_promotional')->default(false)->after('email_listing_updates');
            $table->boolean('sms_new_messages')->default(true)->after('email_promotional');
            $table->boolean('sms_urgent_notifications')->default(true)->after('sms_new_messages');
            $table->boolean('push_new_messages')->default(true)->after('sms_urgent_notifications');
            $table->boolean('push_new_reviews')->default(true)->after('push_new_messages');
            
            // Ustawienia prywatności
            $table->enum('profile_visibility', ['public', 'registered_only', 'private'])->default('public')->after('push_new_reviews');
            $table->boolean('show_phone')->default(true)->after('profile_visibility');
            $table->boolean('show_email')->default(false)->after('show_phone');
            $table->boolean('allow_reviews')->default(true)->after('show_email');
            $table->boolean('allow_messages')->default(true)->after('allow_reviews');
            $table->boolean('search_engine_indexing')->default(true)->after('allow_messages');
            
            // Subskrypcja
            $table->string('subscription_type')->default('STANDARD')->after('search_engine_indexing');
            $table->timestamp('subscription_expires_at')->nullable()->after('subscription_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn([
                'password',
                'email_verified_at', 
                'remember_token',
                'user_type',
                'city',
                'about',
                'avatar',
                'website',
                'company_description',
                'email_new_messages',
                'email_new_reviews',
                'email_listing_updates',
                'email_promotional',
                'sms_new_messages',
                'sms_urgent_notifications', 
                'push_new_messages',
                'push_new_reviews',
                'profile_visibility',
                'show_phone',
                'show_email',
                'allow_reviews',
                'allow_messages',
                'search_engine_indexing',
                'subscription_type',
                'subscription_expires_at'
            ]);
        });
    }
};