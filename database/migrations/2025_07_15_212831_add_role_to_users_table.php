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
            $table->enum('role', ['admin', 'organizer', 'helper', 'user', 'guest'])->default('user')->after('email_verified_at');
            $table->boolean('is_active')->default(true)->after('role');
            $table->json('permissions')->nullable()->after('is_active'); // Additional permissions for fine-grained control
            $table->timestamp('last_login_at')->nullable()->after('permissions');
            
            // Index for role-based queries
            $table->index(['role', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'is_active']);
            $table->dropColumn(['role', 'is_active', 'permissions', 'last_login_at']);
        });
    }
};
