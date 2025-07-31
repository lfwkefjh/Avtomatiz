<?php

use Illuminate\Support\Facades\Route;
use App\Models\SystemSetting;
use App\Services\PayMeService;
use App\Services\TelegramService;
use Illuminate\Http\Request;

// Главная страница - простая заглушка
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Статические страницы
Route::view('/about', 'pages.about')->name('about');
Route::view('/contact', 'pages.contact')->name('contact');

// System status page
Route::get('/status', function () {
    $paymeService = new PayMeService();
    $telegramService = new TelegramService();
    
    $status = [
        'database' => 'OK',
        'payme_configured' => $paymeService->isConfigured() ? 'OK' : 'NOT CONFIGURED',
        'telegram_configured' => $telegramService->isConfigured() ? 'OK' : 'NOT CONFIGURED',
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
        'settings_count' => SystemSetting::count(),
        'time' => now()->format('Y-m-d H:i:s T'),
    ];
    
    return response()->json($status);
})->name('system.status');
