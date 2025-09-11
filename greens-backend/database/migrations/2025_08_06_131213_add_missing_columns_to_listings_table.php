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
        // Dodawanie kolumn pojedynczo, tylko jeśli nie istnieją
        if (!Schema::hasColumn('listings', 'title')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('title')->after('id');
            });
        }
        if (!Schema::hasColumn('listings', 'description')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->text('description')->after('title');
            });
        }
        if (!Schema::hasColumn('listings', 'long_description')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->text('long_description')->nullable()->after('description');
            });
        }
        if (!Schema::hasColumn('listings', 'price')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->decimal('price', 10, 2)->after('long_description');
            });
        }
        if (!Schema::hasColumn('listings', 'rating')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->decimal('rating', 2, 1)->default(0)->after('price');
            });
        }
        if (!Schema::hasColumn('listings', 'category')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('category')->after('rating');
            });
        }
        if (!Schema::hasColumn('listings', 'subcategory')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('subcategory')->after('category');
            });
        }
        if (!Schema::hasColumn('listings', 'company_id')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->foreignId('company_id')->nullable()->after('subcategory')->constrained()->onDelete('cascade');
            });
        }
        if (!Schema::hasColumn('listings', 'company_name')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('company_name')->nullable()->after('company_id');
            });
        }
        if (!Schema::hasColumn('listings', 'location')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('location')->after('company_name');
            });
        }
        if (!Schema::hasColumn('listings', 'phone')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('phone')->nullable()->after('location');
            });
        }
        if (!Schema::hasColumn('listings', 'email')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('email')->nullable()->after('phone');
            });
        }
        if (!Schema::hasColumn('listings', 'avatar')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->string('avatar')->nullable()->after('email');
            });
        }
        if (!Schema::hasColumn('listings', 'images')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->json('images')->nullable()->after('avatar');
            });
        }
        if (!Schema::hasColumn('listings', 'tags')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->json('tags')->nullable()->after('images');
            });
        }
        if (!Schema::hasColumn('listings', 'experience')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->text('experience')->nullable()->after('tags');
            });
        }
        if (!Schema::hasColumn('listings', 'social_media')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->json('social_media')->nullable()->after('experience');
            });
        }
        if (!Schema::hasColumn('listings', 'status')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->enum('status', ['aktywne', 'nie aktywne', 'oczekujące'])->default('aktywne')->after('social_media');
            });
        }
        if (!Schema::hasColumn('listings', 'is_featured')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->boolean('is_featured')->default(false)->after('status');
            });
        }
        if (!Schema::hasColumn('listings', 'clicks')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->integer('clicks')->default(0)->after('is_featured');
            });
        }
        if (!Schema::hasColumn('listings', 'user_id')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('clicks')->constrained()->onDelete('cascade');
            });
        }
        if (!Schema::hasColumn('listings', 'published_at')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->timestamp('published_at')->nullable()->after('user_id');
            });
        }

        // Dodanie indeksów - zakładamy, że kolumny już istnieją
        Schema::table('listings', function (Blueprint $table) {
            $table->index('category', 'listings_category_index');
            $table->index('subcategory', 'listings_subcategory_index');
            $table->index('status', 'listings_status_index');
            $table->index('is_featured', 'listings_is_featured_index');
            $table->index('company_id', 'listings_company_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            // Usuń indeksy po nazwach
            $table->dropIndex('listings_category_index');
            $table->dropIndex('listings_subcategory_index');
            $table->dropIndex('listings_status_index');
            $table->dropIndex('listings_is_featured_index');
            $table->dropIndex('listings_company_id_index');

            // Usuń foreign keys jeśli istnieją
            $foreignKeys = Schema::getConnection()
                ->getDoctrineSchemaManager()
                ->listTableForeignKeys('listings');

            $foreignKeyNames = [];
            foreach ($foreignKeys as $fk) {
                $foreignKeyNames[] = $fk->getName();
            }

            if (in_array('listings_company_id_foreign', $foreignKeyNames)) {
                $table->dropForeign('listings_company_id_foreign');
            }
            if (in_array('listings_user_id_foreign', $foreignKeyNames)) {
                $table->dropForeign('listings_user_id_foreign');
            }

            // Usuń kolumny, jeśli istnieją
            $columns = [
                'title', 'description', 'long_description', 'price', 'rating',
                'category', 'subcategory', 'company_id', 'company_name', 'location',
                'phone', 'email', 'avatar', 'images', 'tags', 'experience',
                'social_media', 'status', 'is_featured', 'clicks', 'user_id', 'published_at'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('listings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
