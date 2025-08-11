<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Kto wysyła
            $table->foreignId('company_id')->constrained()->onDelete('cascade'); // Do jakiej firmy
            $table->string('sender_name'); // Nazwa nadawcy
            $table->string('sender_email'); // Email nadawcy
            $table->string('sender_phone')->nullable(); // Telefon nadawcy
            $table->string('subject'); // Temat wiadomości
            $table->text('message'); // Treść wiadomości
            $table->enum('status', ['pending', 'approved', 'rejected', 'replied', 'resolved', 'spam'])->default('pending');
            $table->boolean('is_urgent')->default(false); // Czy pilne (wykrzyknik)
            $table->boolean('is_read')->default(false); // Czy przeczytane
            $table->text('admin_reply')->nullable(); // Odpowiedź admina
            $table->timestamp('replied_at')->nullable(); // Kiedy odpowiedziano
            $table->foreignId('replied_by')->nullable()->constrained('users'); // Kto odpowiedział
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
};