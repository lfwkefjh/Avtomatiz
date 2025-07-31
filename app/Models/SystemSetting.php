<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
        'sort_order',
    ];

    protected $casts = [
        'value' => 'array',
        'is_public' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Cache timeout for settings (1 hour)
     */
    const CACHE_TIMEOUT = 3600;

    /**
     * Get setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $cacheKey = "system_setting_{$key}";
        
        return Cache::remember($cacheKey, self::CACHE_TIMEOUT, function() use ($key, $default) {
            $setting = self::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }
            
            return self::castValue($setting->value, $setting->type);
        });
    }

    /**
     * Set setting value
     */
    public static function set(string $key, $value, string $type = 'string', string $group = 'general'): void
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );
        
        // Clear cache
        Cache::forget("system_setting_{$key}");
    }

    /**
     * Get all settings for a group
     */
    public static function getGroup(string $group): array
    {
        $cacheKey = "system_settings_group_{$group}";
        
        return Cache::remember($cacheKey, self::CACHE_TIMEOUT, function() use ($group) {
            $settings = self::where('group', $group)->get();
            
            $result = [];
        foreach ($settings as $setting) {
                $result[$setting->key] = self::castValue($setting->value, $setting->type);
        }
        
        return $result;
        });
    }

    /**
     * Get all public settings (for frontend)
     */
    public static function getPublicSettings(): array
    {
        $cacheKey = "system_settings_public";
        
        return Cache::remember($cacheKey, self::CACHE_TIMEOUT, function() {
            $settings = self::where('is_public', true)->get();
            
            $result = [];
            foreach ($settings as $setting) {
                $result[$setting->key] = self::castValue($setting->value, $setting->type);
            }
            
            return $result;
        });
    }

    /**
     * Cast value based on type
     */
    private static function castValue($value, string $type)
    {
        return match($type) {
            'boolean' => (bool) $value,
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => is_array($value) ? $value : json_decode($value, true),
            'string' => (string) $value,
            'encrypted' => $value, // Handle encrypted values as strings
            default => $value,
        };
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache(): void
    {
        Cache::flush(); // For simplicity, clear all cache
        // In production, you might want to be more selective
    }

    /**
     * Boot method to clear cache when settings change
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($setting) {
            Cache::forget("system_setting_{$setting->key}");
            Cache::forget("system_settings_group_{$setting->group}");
            Cache::forget("system_settings_public");
        });

        static::deleted(function ($setting) {
            Cache::forget("system_setting_{$setting->key}");
            Cache::forget("system_settings_group_{$setting->group}");
            Cache::forget("system_settings_public");
        });
    }

    /**
     * Get setting display value
     */
    public function getDisplayValueAttribute(): string
    {
        return match($this->type) {
            'boolean' => $this->value ? 'Да' : 'Нет',
            'json' => json_encode($this->value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            'encrypted' => '***скрыто***',
            default => (string) $this->value,
        };
    }

    /**
     * Scope for specific group
     */
    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope for public settings
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope ordered by group and sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('group')->orderBy('sort_order')->orderBy('key');
    }

    /**
     * Default system settings
     */
    public static function getDefaults(): array
    {
        return [
            // PayMe settings
            'payme.merchant_id' => ['value' => '', 'type' => 'string', 'group' => 'payme', 'description' => 'PayMe Merchant ID'],
            'payme.test_key' => ['value' => '', 'type' => 'string', 'group' => 'payme', 'description' => 'PayMe Test Key'],
            'payme.production_key' => ['value' => '', 'type' => 'string', 'group' => 'payme', 'description' => 'PayMe Production Key'],
            'payme.is_test_mode' => ['value' => true, 'type' => 'boolean', 'group' => 'payme', 'description' => 'PayMe Test Mode'],
            
            // Telegram settings
            'telegram.bot_token' => ['value' => '', 'type' => 'string', 'group' => 'telegram', 'description' => 'Telegram Bot Token'],
            'telegram.admin_chat_ids' => ['value' => [], 'type' => 'json', 'group' => 'telegram', 'description' => 'Admin Chat IDs'],
            'telegram.group_notifications' => ['value' => [], 'type' => 'json', 'group' => 'telegram', 'description' => 'Group Notifications'],
            
            // General settings
            'site.name' => ['value' => 'Sellercom Events', 'type' => 'string', 'group' => 'general', 'description' => 'Site Name', 'is_public' => true],
            'site.description' => ['value' => 'Платформа мероприятий', 'type' => 'string', 'group' => 'general', 'description' => 'Site Description', 'is_public' => true],
            'order.expiry_minutes' => ['value' => 15, 'type' => 'integer', 'group' => 'orders', 'description' => 'Order Expiry Time (minutes)'],
            'tickets.max_per_order' => ['value' => 10, 'type' => 'integer', 'group' => 'tickets', 'description' => 'Max Tickets Per Order'],
        ];
    }

    /**
     * Seed default settings
     */
    public static function seedDefaults(): void
    {
        foreach (self::getDefaults() as $key => $config) {
            self::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $config['value'],
                    'type' => $config['type'],
                    'group' => $config['group'],
                    'description' => $config['description'],
                    'is_public' => $config['is_public'] ?? false,
                ]
            );
        }
    }
}
