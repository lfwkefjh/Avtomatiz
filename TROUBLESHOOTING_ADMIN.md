# 🛠️ Устранение проблем с админкой Avtomatiz

## 🚨 Обнаруженные проблемы

1. **Отсутствует .env файл** - основная причина всех ошибок
2. **Конфликт учетных данных PostgreSQL** между docker-compose.yml и env.txt
3. **404 ошибка для livewire.js** - не опубликованы ассеты Filament/Livewire
4. **POST метод не поддерживается для /admin/login** - связано с отсутствием ассетов
5. **Ошибка аутентификации PostgreSQL** - неправильные данные подключения к БД

## 🔧 Автоматическое исправление

### Для Windows (PowerShell):
```powershell
.\fix-admin-issues.ps1
```

### Для Linux/macOS (Bash):
```bash
chmod +x fix-admin-issues.sh
./fix-admin-issues.sh
```

## 🔍 Ручное исправление (если автоматические скрипты не работают)

### 1. Остановка контейнеров
```bash
docker-compose down
docker volume prune -f
```

### 2. Создание .env файла
Создайте файл `.env` в корне проекта со следующим содержимым:

```env
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
```

### 3. Запуск контейнеров
```bash
docker-compose up -d
```

### 4. Ожидание запуска PostgreSQL
```bash
# Подождите 20-30 секунд для полного запуска PostgreSQL
sleep 20
```

### 5. Установка зависимостей
```bash
docker-compose exec php composer install --no-dev --optimize-autoloader
```

### 6. Настройка прав доступа
```bash
docker-compose exec php chown -R www-data:www-data storage bootstrap/cache
docker-compose exec php chmod -R 775 storage bootstrap/cache
```

### 7. Публикация ассетов Filament и Livewire
```bash
docker-compose exec php php artisan vendor:publish --tag=filament-config --force
docker-compose exec php php artisan vendor:publish --tag=filament-assets --force
docker-compose exec php php artisan vendor:publish --tag=livewire-config --force
docker-compose exec php php artisan vendor:publish --tag=livewire-assets --force
```

### 8. Создание символической ссылки для storage
```bash
docker-compose exec php php artisan storage:link
```

### 9. Очистка кэша
```bash
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear
```

### 10. Запуск миграций
```bash
docker-compose exec php php artisan migrate --force
```

### 11. Создание админ пользователя
```bash
docker-compose exec php php artisan db:seed --class=AdminUserSeeder
```

### 12. Финальная оптимизация
```bash
docker-compose exec php php artisan optimize
docker-compose exec php php artisan filament:optimize
```

## 🌐 После исправления

### Доступные сервисы:
- **Главная страница**: http://localhost
- **Админ-панель**: http://localhost/admin
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Данные для входа в админку:
- **Email**: admin@sellercom.uz
- **Пароль**: admin123

## 🔍 Диагностика проблем

### Проверка статуса контейнеров:
```bash
docker-compose ps
```

### Просмотр логов:
```bash
# Все логи
docker-compose logs

# Логи PHP контейнера
docker-compose logs php

# Логи PostgreSQL
docker-compose logs postgres

# Логи Nginx
docker-compose logs nginx
```

### Проверка подключения к БД:
```bash
docker-compose exec postgres psql -U postgres -d avtomatiz
```

### Проверка PHP конфигурации:
```bash
docker-compose exec php php -v
docker-compose exec php php artisan --version
```

## 🚨 Если проблемы остаются

### 1. Полная очистка и пересборка:
```bash
docker-compose down -v
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### 2. Проверка портов:
Убедитесь, что порты 80, 5432, 6379 не заняты другими процессами:
```bash
# Windows
netstat -an | findstr :80
netstat -an | findstr :5432

# Linux/macOS
netstat -tuln | grep :80
netstat -tuln | grep :5432
```

### 3. Проверка файлов:
- Убедитесь, что файл `.env` создан и содержит правильные настройки
- Проверьте, что `docker-compose.yml` содержит исправленные учетные данные PostgreSQL
- Убедитесь, что директории `storage` и `bootstrap/cache` имеют правильные права доступа

### 4. Альтернативный порт (если 80 занят):
Измените в `docker-compose.yml` порт nginx:
```yaml
nginx:
  ports:
    - "8080:80"  # вместо "80:80"
```

Тогда админка будет доступна по адресу: http://localhost:8080/admin

## 📞 Поддержка

Если проблемы не решаются, предоставьте следующую информацию:

1. Операционная система и версия
2. Версия Docker и Docker Compose
3. Вывод команды `docker-compose ps`
4. Логи контейнеров `docker-compose logs`
5. Содержимое файла `.env` (без паролей)

---

**Примечание**: Все пароли в данном руководстве предназначены только для разработки. В продакшене используйте надёжные пароли! 