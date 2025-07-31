<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаем главного администратора
        $admin = User::updateOrCreate(
            ['email' => 'admin@avtomatiz.uz'],
            [
                'name' => 'Главный администратор',
                'email' => 'admin@avtomatiz.uz',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'role' => User::ROLE_ADMIN,
                'is_active' => true,
            ]
        );

        // Создаем тестового организатора
        $organizer = User::updateOrCreate(
            ['email' => 'organizer@avtomatiz.uz'],
            [
                'name' => 'Организатор',
                'email' => 'organizer@avtomatiz.uz',
                'email_verified_at' => now(),
                'password' => Hash::make('organizer123'),
                'role' => User::ROLE_ORGANIZER,
                'is_active' => true,
            ]
        );

        // Создаем тестового помощника
        $helper = User::updateOrCreate(
            ['email' => 'helper@avtomatiz.uz'],
            [
                'name' => 'Помощник',
                'email' => 'helper@avtomatiz.uz',
                'email_verified_at' => now(),
                'password' => Hash::make('helper123'),
                'role' => User::ROLE_HELPER,
                'is_active' => true,
            ]
        );

        // Создаем тестового пользователя
        $user = User::updateOrCreate(
            ['email' => 'user@avtomatiz.uz'],
            [
                'name' => 'Обычный пользователь',
                'email' => 'user@avtomatiz.uz',
                'email_verified_at' => now(),
                'password' => Hash::make('user123'),
                'role' => User::ROLE_USER,
                'is_active' => true,
            ]
        );

        // Инициализируем системные настройки
        SystemSetting::seedDefaults();

        $this->command->info('✅ Пользователи созданы успешно!');
        $this->command->info('👤 Администратор - admin@avtomatiz.uz / admin123');
        $this->command->info('👤 Организатор - organizer@avtomatiz.uz / organizer123');
        $this->command->info('👤 Помощник - helper@avtomatiz.uz / helper123');
        $this->command->info('👤 Пользователь - user@avtomatiz.uz / user123');
        $this->command->info('⚙️ Системные настройки созданы');
    }
} 