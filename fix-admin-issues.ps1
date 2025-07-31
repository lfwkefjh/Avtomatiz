# PowerShell скрипт для исправления проблем с админкой Avtomatiz
# Запуск: .\fix-admin-issues.ps1

Write-Host "Исправление проблем с админкой Avtomatiz..." -ForegroundColor Green
Write-Host ""

# Остановка контейнеров если они запущены
Write-Host "1. Остановка существующих контейнеров..." -ForegroundColor Blue
docker-compose down 2>$null

# Удаление старых volumes для чистого старта
Write-Host "2. Очистка старых данных..." -ForegroundColor Blue
docker volume prune -f 2>$null

# Создание .env файла если его нет
if (!(Test-Path ".env")) {
    Write-Host "3. Создание .env файла..." -ForegroundColor Blue
    
    $envContent = @'
APP_NAME="Avtomatiz Events"
APP_ENV=local
APP_KEY=base64:yB2naHaJPKDRd8rGUoBDTadJetU3Fa/8zTZ6XUfUAT8=
APP_DEBUG=true
APP_TIMEZONE=Asia/Tashkent
APP_URL=http://localhost

APP_LOCALE=ru
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=ru_RU

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Database settings (согласованы с docker-compose.yml)
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=avtomatiz
DB_USERNAME=postgres
DB_PASSWORD=Xdwqaz123

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=avtomatiz

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=redis123
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@avtomatiz.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# PayMe settings
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
PAYME_CALLBACK_URL="${APP_URL}/api/payme/callback"
PAYME_TEST_MODE=true

# Telegram Bot settings
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=-100xxxxxxxxx
'@

    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "   [OK] .env файл создан" -ForegroundColor Green
} else {
    Write-Host "3. .env файл уже существует, пропускаем..." -ForegroundColor Yellow
}

# Запуск контейнеров
Write-Host "4. Запуск Docker контейнеров..." -ForegroundColor Blue
docker-compose up -d

# Ожидание запуска PostgreSQL
Write-Host "5. Ожидание запуска PostgreSQL..." -ForegroundColor Blue
Start-Sleep -Seconds 20

# Установка зависимостей
Write-Host "6. Установка PHP зависимостей..." -ForegroundColor Blue
docker-compose exec php composer install --no-dev --optimize-autoloader

# Настройка прав доступа
Write-Host "7. Настройка прав доступа..." -ForegroundColor Blue
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache

# Публикация ассетов Filament и Livewire
Write-Host "8. Публикация ассетов Filament и Livewire..." -ForegroundColor Blue
docker-compose exec php php artisan vendor:publish --tag=filament-config --force
docker-compose exec php php artisan vendor:publish --tag=filament-assets --force
docker-compose exec php php artisan vendor:publish --tag=livewire-config --force
docker-compose exec php php artisan vendor:publish --tag=livewire-assets --force

# Создание символической ссылки для storage
Write-Host "9. Создание символической ссылки для storage..." -ForegroundColor Blue
docker-compose exec php php artisan storage:link

# Очистка кэша
Write-Host "10. Очистка кэша..." -ForegroundColor Blue
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Запуск миграций
Write-Host "11. Запуск миграций базы данных..." -ForegroundColor Blue
docker-compose exec php php artisan migrate --force

# Создание админ пользователя
Write-Host "12. Создание админ пользователя..." -ForegroundColor Blue
docker-compose exec php php artisan db:seed --class=AdminUserSeeder

# Финальная очистка и оптимизация
Write-Host "13. Финальная оптимизация..." -ForegroundColor Blue
docker-compose exec php php artisan optimize
docker-compose exec php php artisan filament:optimize

Write-Host ""
Write-Host "[SUCCESS] Все проблемы исправлены!" -ForegroundColor Green
Write-Host ""
Write-Host "Доступные сервисы:" -ForegroundColor Cyan
Write-Host "   - Главная страница: http://localhost" -ForegroundColor White
Write-Host "   - Админ-панель: http://localhost/admin" -ForegroundColor White
Write-Host "   - PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "   - Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "Данные для входа в админку:" -ForegroundColor Cyan
Write-Host "   - Email: admin@sellercom.uz" -ForegroundColor White
Write-Host "   - Пароль: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Если проблемы остаются, проверьте:" -ForegroundColor Yellow
Write-Host "   1. Статус контейнеров: docker-compose ps" -ForegroundColor White
Write-Host "   2. Логи: docker-compose logs" -ForegroundColor White
Write-Host "   3. Подключение к БД: docker-compose exec postgres psql -U postgres -d avtomatiz" -ForegroundColor White 