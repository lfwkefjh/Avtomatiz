# PowerShell скрипт для инициализации проекта Sellercom Backend
# Для запуска: .\init-project.ps1

Write-Host "🚀 Инициализация проекта Sellercom Backend..." -ForegroundColor Green

# Проверка наличия Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker найден" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не установлен. Установите Docker Desktop для Windows." -ForegroundColor Red
    Write-Host "Скачать: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose найден" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose не установлен." -ForegroundColor Red
    exit 1
}

# Создание .env файла
if (!(Test-Path ".env")) {
    Write-Host "📝 Создание .env файла..." -ForegroundColor Blue
    
    $envContent = @"
APP_NAME="Sellercom Backend"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=Asia/Tashkent
APP_URL=http://localhost

APP_LOCALE=ru
APP_FALLBACK_LOCALE=ru
APP_FAKER_LOCALE=ru_RU

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=sellercom
DB_USERNAME=sellercom
DB_PASSWORD=sellercom123

SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis

CACHE_STORE=redis
CACHE_PREFIX=sellercom

REDIS_HOST=redis
REDIS_PASSWORD=redis123
REDIS_PORT=6379
REDIS_DB=0

REDIS_CACHE_DB=1
REDIS_SESSION_DB=2
REDIS_QUEUE_DB=3

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@sellercom.uz"
MAIL_FROM_NAME="`${APP_NAME}"

# SMS Settings (Eskiz.uz)
SMS_SERVICE=eskiz
ESKIZ_API_URL=https://notify.eskiz.uz/api
ESKIZ_EMAIL=your-email@example.com
ESKIZ_PASSWORD=your-password
ESKIZ_FROM=4546

# Payment Settings (PayMe)
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
PAYME_CALLBACK_URL="`${APP_URL}/api/payments/payme/callback"
PAYME_TEST_MODE=true

# Telegram Bot Settings
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=-100xxxxxxxxx
TELEGRAM_WEBHOOK_URL="`${APP_URL}/api/telegram/webhook"

# File Upload Settings
MAX_FILE_SIZE=20480
ALLOWED_IMAGE_EXTENSIONS=jpg,jpeg,png,gif,webp
ALLOWED_DOCUMENT_EXTENSIONS=pdf,doc,docx,ppt,pptx,xls,xlsx

# QR Code Settings
QR_CODE_SIZE=300
QR_CODE_MARGIN=10
QR_CODE_FORMAT=png

# PDF Settings
PDF_ORIENTATION=portrait
PDF_PAPER_SIZE=A4

# SEO Settings
SITEMAP_CACHE_TTL=3600
META_DEFAULT_TITLE="Sellercom.uz - Платформа ассоциации селлеров"
META_DEFAULT_DESCRIPTION="Мероприятия, курсы и партнерские программы для селлеров Узбекистана"

# Analytics
GOOGLE_ANALYTICS_ID=
YANDEX_METRICA_ID=

# Security
CORS_ALLOWED_ORIGINS="http://localhost:3000,https://sellercom.uz"
RATE_LIMIT_API=60
RATE_LIMIT_AUTH=5

# Monitoring
TELESCOPE_ENABLED=true
LOG_SQL_QUERIES=false

# Cache TTL (в секундах)
CACHE_EVENTS_TTL=3600
CACHE_BLOG_TTL=7200
CACHE_SETTINGS_TTL=86400

# Queue Settings
QUEUE_RETRY_AFTER=90
QUEUE_MAX_ATTEMPTS=3

# Backup Settings
BACKUP_DISK=local
"@

    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env файл создан" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env файл уже существует" -ForegroundColor Yellow
}

# Сборка и запуск контейнеров
Write-Host "🐳 Сборка Docker контейнеров..." -ForegroundColor Blue
docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке контейнеров" -ForegroundColor Red
    exit 1
}

# Ожидание запуска MySQL
Write-Host "⏳ Ожидание запуска базы данных..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Проверка статуса контейнеров
Write-Host "🔍 Проверка статуса контейнеров..." -ForegroundColor Blue
docker-compose ps

# Инициализация Laravel только если нет artisan файла
if (!(Test-Path "artisan")) {
    Write-Host "🎼 Инициализация Laravel приложения..." -ForegroundColor Blue
    
    # Создание базовой структуры Laravel
    docker-compose exec php composer create-project laravel/laravel . --prefer-dist --no-scripts
    
    # Установка дополнительных пакетов
    Write-Host "📦 Установка дополнительных пакетов..." -ForegroundColor Blue
    docker-compose exec php composer require filament/filament spatie/laravel-permission spatie/laravel-translatable spatie/laravel-sluggable spatie/laravel-settings intervention/image simplesoftwareio/simple-qrcode barryvdh/laravel-dompdf maatwebsite/excel predis/predis doctrine/dbal
    
    # Генерация ключа приложения
    Write-Host "🔑 Генерация ключа приложения..." -ForegroundColor Blue
    docker-compose exec php php artisan key:generate
} else {
    Write-Host "🎼 Laravel уже инициализирован, устанавливаем зависимости..." -ForegroundColor Blue
    docker-compose exec php composer install
}

# Настройка прав доступа (в Linux контейнере)
Write-Host "🔒 Настройка прав доступа..." -ForegroundColor Blue
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache

# Публикация ресурсов
Write-Host "📂 Публикация ресурсов пакетов..." -ForegroundColor Blue
docker-compose exec php php artisan vendor:publish --all --force

# Создание символической ссылки для storage
Write-Host "🔗 Создание символической ссылки для storage..." -ForegroundColor Blue
docker-compose exec php php artisan storage:link

# Очистка кэша
Write-Host "🧹 Очистка кэша..." -ForegroundColor Blue
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Информация о завершении
Write-Host ""
Write-Host "✅ Проект успешно инициализирован!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступные сервисы:" -ForegroundColor Cyan
Write-Host "   - Приложение: http://localhost" -ForegroundColor White
Write-Host "   - Админ-панель: http://localhost/admin" -ForegroundColor White
Write-Host "   - MailHog: http://localhost:8025" -ForegroundColor White
Write-Host "   - MySQL: localhost:3306" -ForegroundColor White
Write-Host "   - Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Отредактируйте .env файл с вашими настройками" -ForegroundColor White
Write-Host "   2. Запустите миграции: docker-compose exec php php artisan migrate" -ForegroundColor White
Write-Host "   3. Создайте администратора: docker-compose exec php php artisan make:filament-user" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Полезные команды:" -ForegroundColor Cyan
Write-Host "   - Логи: docker-compose logs -f php" -ForegroundColor White
Write-Host "   - Консоль: docker-compose exec php bash" -ForegroundColor White
Write-Host "   - Остановка: docker-compose down" -ForegroundColor White

# Пауза чтобы пользователь мог прочитать вывод
Write-Host ""
Write-Host "Нажмите любую клавишу для завершения..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 