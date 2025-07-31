<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Added DB facade import

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // Setting identifier (payme.merchant_id, telegram.bot_token, etc.)
            $table->text('value')->nullable(); // Setting value
            $table->text('description')->nullable(); // Human-readable description
            $table->enum('type', ['string', 'integer', 'boolean', 'json', 'encrypted'])->default('string'); // Value type
            $table->boolean('is_public')->default(false); // Can be accessed from frontend
            $table->boolean('is_required')->default(false); // Required for system to work
            $table->string('group')->nullable(); // Setting group (payme, telegram, sms, etc.)
            $table->timestamps();
            
            // Indexes
            $table->index(['group', 'key']);
            $table->index('is_required');
        });

        // Insert default settings
        DB::table('system_settings')->insert([
            // PayMe settings
            [
                'key' => 'payme.merchant_id',
                'value' => null,
                'description' => 'PayMe Merchant ID',
                'type' => 'string',
                'is_public' => false,
                'is_required' => true,
                'group' => 'payme',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'payme.test_key',
                'value' => null,
                'description' => 'PayMe Test Key',
                'type' => 'encrypted',
                'is_public' => false,
                'is_required' => true,
                'group' => 'payme',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'payme.production_key',
                'value' => null,
                'description' => 'PayMe Production Key',
                'type' => 'encrypted',
                'is_public' => false,
                'is_required' => false,
                'group' => 'payme',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'payme.is_test_mode',
                'value' => 'true',
                'description' => 'PayMe Test Mode',
                'type' => 'boolean',
                'is_public' => false,
                'is_required' => true,
                'group' => 'payme',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Telegram settings
            [
                'key' => 'telegram.bot_token',
                'value' => null,
                'description' => 'Telegram Bot API Token',
                'type' => 'encrypted',
                'is_public' => false,
                'is_required' => false,
                'group' => 'telegram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'telegram.admin_chat_ids',
                'value' => '[]',
                'description' => 'Admin Telegram Chat IDs for notifications',
                'type' => 'json',
                'is_public' => false,
                'is_required' => false,
                'group' => 'telegram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'telegram.group_notifications',
                'value' => '{}',
                'description' => 'Group notification mapping {"group_id": "message_types"}',
                'type' => 'json',
                'is_public' => false,
                'is_required' => false,
                'group' => 'telegram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // System settings
            [
                'key' => 'system.site_name',
                'value' => 'Sellercom Event Tickets',
                'description' => 'Site Name',
                'type' => 'string',
                'is_public' => true,
                'is_required' => true,
                'group' => 'system',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'system.default_language',
                'value' => 'ru',
                'description' => 'Default System Language',
                'type' => 'string',
                'is_public' => true,
                'is_required' => true,
                'group' => 'system',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'system.order_expiry_minutes',
                'value' => '15',
                'description' => 'Order expiry time in minutes',
                'type' => 'integer',
                'is_public' => false,
                'is_required' => true,
                'group' => 'system',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
