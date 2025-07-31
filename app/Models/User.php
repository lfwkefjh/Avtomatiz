<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // User roles
    const ROLE_ADMIN = 'admin';
    const ROLE_ORGANIZER = 'organizer';
    const ROLE_HELPER = 'helper';
    const ROLE_USER = 'user';
    const ROLE_GUEST = 'guest';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'permissions',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'permissions' => 'array',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Update last login timestamp
     */
    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => Carbon::now()]);
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role && $this->is_active;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles) && $this->is_active;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Check if user is organizer
     */
    public function isOrganizer(): bool
    {
        return $this->hasRole(self::ROLE_ORGANIZER);
    }

    /**
     * Check if user is helper
     */
    public function isHelper(): bool
    {
        return $this->hasRole(self::ROLE_HELPER);
    }

    /**
     * Check if user can manage events
     */
    public function canManageEvents(): bool
    {
        return $this->hasAnyRole([self::ROLE_ADMIN, self::ROLE_ORGANIZER]);
    }

    /**
     * Check if user can validate tickets
     */
    public function canValidateTickets(): bool
    {
        return $this->hasAnyRole([self::ROLE_ADMIN, self::ROLE_ORGANIZER, self::ROLE_HELPER]);
    }

    /**
     * Check if user can access admin panel
     */
    public function canAccessFilament(): bool
    {
        return $this->hasAnyRole([self::ROLE_ADMIN, self::ROLE_ORGANIZER, self::ROLE_HELPER]) && $this->is_active;
    }

    /**
     * Получить все доступные роли
     */
    public static function getRoles(): array
    {
        return [
            self::ROLE_ADMIN => 'Администратор',
            self::ROLE_ORGANIZER => 'Организатор',
            self::ROLE_HELPER => 'Помощник',
            self::ROLE_USER => 'Пользователь',
            self::ROLE_GUEST => 'Гость',
        ];
    }

    /**
     * Получить название роли
     */
    public function getRoleName(): string
    {
        return self::getRoles()[$this->role] ?? 'Неизвестная роль';
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Admin has all permissions
        if ($this->isAdmin()) {
            return true;
        }

        // Check custom permissions
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Get available roles
     */
    public static function getAvailableRoles(): array
    {
        return [
            self::ROLE_ADMIN => 'Администратор',
            self::ROLE_ORGANIZER => 'Организатор',
            self::ROLE_HELPER => 'Помощник',
            self::ROLE_USER => 'Пользователь',
            self::ROLE_GUEST => 'Гость',
        ];
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for users with specific role
     */
    public function scopeWithRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Orders relationship
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Validated tickets relationship
     */
    public function validatedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'validated_by');
    }

    /**
     * Determine if the user can access the Filament admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        // Разрешаем доступ админам и организаторам
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_ORGANIZER]) && $this->is_active;
    }
}
