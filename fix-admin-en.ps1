# Fix Avtomatiz admin panel issues
# Run: .\fix-admin-en.ps1

Write-Host "=== Fixing Avtomatiz Admin Panel Issues ===" -ForegroundColor Green

# Stop containers and remove volumes
Write-Host "Stopping containers and removing old data..." -ForegroundColor Blue
docker-compose down -v
docker volume prune -f

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Blue
$env_content = @'
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
MAIL_FROM_NAME="Avtomatiz Events"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="Avtomatiz Events"

PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
PAYME_CALLBACK_URL="http://localhost/api/payme/callback"
PAYME_TEST_MODE=true

TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=-100xxxxxxxxx
'@

$env_content | Set-Content -Path ".env" -Encoding UTF8

# Start containers
Write-Host "Starting containers..." -ForegroundColor Blue
docker-compose up -d

# Wait for PostgreSQL
Write-Host "Waiting for PostgreSQL (20 seconds)..." -ForegroundColor Blue
Start-Sleep 20

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
docker-compose exec php composer install --no-dev --optimize-autoloader

# Set permissions
Write-Host "Setting permissions..." -ForegroundColor Blue
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache

# Publish assets
Write-Host "Publishing assets..." -ForegroundColor Blue
docker-compose exec php php artisan vendor:publish --tag=filament-config --force
docker-compose exec php php artisan vendor:publish --tag=filament-assets --force
docker-compose exec php php artisan vendor:publish --tag=livewire-config --force
docker-compose exec php php artisan vendor:publish --tag=livewire-assets --force

# Create storage link
Write-Host "Creating storage link..." -ForegroundColor Blue
docker-compose exec php php artisan storage:link

# Clear cache
Write-Host "Clearing cache..." -ForegroundColor Blue
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Blue
docker-compose exec php php artisan migrate --force

# Create admin user
Write-Host "Creating admin user..." -ForegroundColor Blue
docker-compose exec php php artisan db:seed --class=AdminUserSeeder

# Optimize
Write-Host "Optimizing..." -ForegroundColor Blue
docker-compose exec php php artisan optimize
docker-compose exec php php artisan filament:optimize

Write-Host ""
Write-Host "=== DONE! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Admin Panel: http://localhost/admin" -ForegroundColor Cyan
Write-Host "Email: admin@sellercom.uz" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "If issues remain, check:" -ForegroundColor Yellow
Write-Host "1. Container status: docker-compose ps" -ForegroundColor White
Write-Host "2. Logs: docker-compose logs" -ForegroundColor White 