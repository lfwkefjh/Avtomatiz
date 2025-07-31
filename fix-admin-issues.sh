#!/bin/bash

echo "🔧 Исправление проблем с админкой Avtomatiz..."
echo ""

# Остановка контейнеров если они запущены
echo "1️⃣ Остановка существующих контейнеров..."
docker-compose down 2>/dev/null

# Удаление старых volumes для чистого старта
echo "2️⃣ Очистка старых данных..."
docker volume prune -f 2>/dev/null

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "3️⃣ Создание .env файла..."
    
    cat > .env << 'EOF'
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
EOF

    echo "   ✅ .env файл создан"
else
    echo "3️⃣ .env файл уже существует, пропускаем..."
fi

# Запуск контейнеров
echo "4️⃣ Запуск Docker контейнеров..."
docker-compose up -d

# Ожидание запуска PostgreSQL
echo "5️⃣ Ожидание запуска PostgreSQL..."
sleep 20

# Установка зависимостей
echo "6️⃣ Установка PHP зависимостей..."
docker-compose exec php composer install --no-dev --optimize-autoloader

# Настройка прав доступа
echo "7️⃣ Настройка прав доступа..."
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache

# Публикация ассетов Filament и Livewire
echo "8️⃣ Публикация ассетов Filament и Livewire..."
docker-compose exec php php artisan vendor:publish --tag=filament-config --force
docker-compose exec php php artisan vendor:publish --tag=filament-assets --force
docker-compose exec php php artisan vendor:publish --tag=livewire-config --force
docker-compose exec php php artisan vendor:publish --tag=livewire-assets --force

# Создание символической ссылки для storage
echo "9️⃣ Создание символической ссылки для storage..."
docker-compose exec php php artisan storage:link

# Очистка кэша
echo "🔟 Очистка кэша..."
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Запуск миграций
echo "1️⃣1️⃣ Запуск миграций базы данных..."
docker-compose exec php php artisan migrate --force

# Создание админ пользователя
echo "1️⃣2️⃣ Создание админ пользователя..."
docker-compose exec php php artisan db:seed --class=AdminUserSeeder

# Финальная очистка и оптимизация
echo "1️⃣3️⃣ Финальная оптимизация..."
docker-compose exec php php artisan optimize
docker-compose exec php php artisan filament:optimize

echo ""
echo "✅ Все проблемы исправлены!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   - Главная страница: http://localhost"
echo "   - Админ-панель: http://localhost/admin"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "👤 Данные для входа в админку:"
echo "   - Email: admin@sellercom.uz"
echo "   - Пароль: admin123"
echo ""
echo "🔍 Если проблемы остаются, проверьте:"
echo "   1. Статус контейнеров: docker-compose ps"
echo "   2. Логи: docker-compose logs"
echo "   3. Подключение к БД: docker-compose exec postgres psql -U postgres -d avtomatiz" 