#!/bin/bash

echo "🚀 Инициализация проекта Sellercom Backend..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен."
    exit 1
fi

# Создание .env файла
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cat > .env << 'EOF'
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
MAIL_FROM_NAME="${APP_NAME}"

# SMS Settings (Eskiz.uz)
SMS_SERVICE=eskiz
ESKIZ_API_URL=https://notify.eskiz.uz/api
ESKIZ_EMAIL=your-email@example.com
ESKIZ_PASSWORD=your-password
ESKIZ_FROM=4546

# Payment Settings (PayMe)
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
PAYME_CALLBACK_URL="${APP_URL}/api/payments/payme/callback"
PAYME_TEST_MODE=true

# Telegram Bot Settings
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=-100xxxxxxxxx
TELEGRAM_WEBHOOK_URL="${APP_URL}/api/telegram/webhook"

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
EOF
    echo "✅ .env файл создан"
else
    echo "ℹ️  .env файл уже существует"
fi

# Сборка и запуск контейнеров
echo "🐳 Сборка Docker контейнеров..."
docker-compose up -d --build

# Ожидание запуска MySQL
echo "⏳ Ожидание запуска базы данных..."
sleep 30

# Проверка статуса контейнеров
echo "🔍 Проверка статуса контейнеров..."
docker-compose ps

# Инициализация Laravel только если нет artisan файла
if [ ! -f artisan ]; then
    echo "🎼 Инициализация Laravel приложения..."
    
    # Создание базовой структуры Laravel
    docker-compose exec php composer create-project laravel/laravel . --prefer-dist --no-scripts
    
    # Установка дополнительных пакетов
    echo "📦 Установка дополнительных пакетов..."
    docker-compose exec php composer require filament/filament spatie/laravel-permission spatie/laravel-translatable spatie/laravel-sluggable spatie/laravel-settings intervention/image simplesoftwareio/simple-qrcode barryvdh/laravel-dompdf maatwebsite/excel predis/predis doctrine/dbal
    
    # Генерация ключа приложения
    echo "🔑 Генерация ключа приложения..."
    docker-compose exec php php artisan key:generate
else
    echo "🎼 Laravel уже инициализирован, устанавливаем зависимости..."
    docker-compose exec php composer install
fi

# Настройка прав доступа
echo "🔒 Настройка прав доступа..."
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache

# Публикация ресурсов
echo "📂 Публикация ресурсов пакетов..."
docker-compose exec php php artisan vendor:publish --all --force

# Создание символической ссылки для storage
echo "🔗 Создание символической ссылки для storage..."
docker-compose exec php php artisan storage:link

# Очистка кэша
echo "🧹 Очистка кэша..."
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Информация о завершении
echo ""
echo "✅ Проект успешно инициализирован!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   - Приложение: http://localhost"
echo "   - Админ-панель: http://localhost/admin"
echo "   - MailHog: http://localhost:8025"
echo "   - MySQL: localhost:3306"
echo "   - Redis: localhost:6379"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Отредактируйте .env файл с вашими настройками"
echo "   2. Запустите миграции: docker-compose exec php php artisan migrate"
echo "   3. Создайте администратора: docker-compose exec php php artisan make:filament-user"
echo ""
echo "🔧 Полезные команды:"
echo "   - Логи: docker-compose logs -f php"
echo "   - Консоль: docker-compose exec php bash"
echo "   - Остановка: docker-compose down"
echo " 