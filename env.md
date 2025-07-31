# Переменные окружения для Sellercom.uz Event Platform

## Основные настройки Laravel
```env
APP_NAME="Sellercom Events"
APP_ENV=local
APP_KEY=base64:ВАША_КЛЮЧ_ПРИЛОЖЕНИЯ
APP_DEBUG=true
APP_TIMEZONE=Asia/Tashkent
APP_URL=http://localhost

# Локализация
APP_LOCALE=ru
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=ru_RU
```

## База данных PostgreSQL
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sellercom_events
DB_USERNAME=postgres
DB_PASSWORD=ваш_пароль_postgres
```

## Кэширование Redis
```env
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Почта (для уведомлений)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=ваш_email@gmail.com
MAIL_PASSWORD=ваш_пароль_приложения
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@sellercom.uz
MAIL_FROM_NAME="Sellercom Events"
```

## PayMe (Платежная система) 🔔
```env
# Получить в личном кабинете PayMe Business
PAYME_MERCHANT_ID=ваш_merchant_id
PAYME_TEST_KEY=ваш_test_key
PAYME_PROD_KEY=ваш_production_key
PAYME_TEST_MODE=true
PAYME_ENDPOINT_URL=https://checkout.test.paycom.uz
# PAYME_ENDPOINT_URL=https://checkout.paycom.uz  # для продакшена
```

## Telegram Bot 🔔
```env
# Получить у @BotFather
TELEGRAM_BOT_TOKEN=ваш_telegram_bot_token

# ID чатов для уведомлений (получить через @userinfobot)
TELEGRAM_ADMIN_CHAT_ID=ваш_админ_chat_id
TELEGRAM_ORDERS_CHAT_ID=chat_id_для_заказов
TELEGRAM_PAYMENTS_CHAT_ID=chat_id_для_платежей
TELEGRAM_ERRORS_CHAT_ID=chat_id_для_ошибок
```

## SMS-уведомления (опционально)
```env
# Uzbekistan SMS providers
SMS_PROVIDER=eskiz  # или playmobile
SMS_LOGIN=ваш_sms_логин
SMS_PASSWORD=ваш_sms_пароль
SMS_FROM=SellercomUz
```

## Безопасность
```env
# Генерация QR-кодов
QR_ENCRYPTION_KEY=ваш_32_символьный_ключ_шифрования

# JWT для API (опционально)
JWT_SECRET=ваш_jwt_секретный_ключ
```

## Файловое хранилище
```env
FILESYSTEM_DISK=local
# Для продакшена можно использовать S3 или аналоги
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_DEFAULT_REGION=
# AWS_BUCKET=
```

## Логирование
```env
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug
```

## Дополнительные настройки
```env
# Максимальное время жизни заказа (минуты)
ORDER_EXPIRY_MINUTES=15

# Максимальное количество билетов в одном заказе
MAX_TICKETS_PER_ORDER=10

# Включить debug режим для QR-кодов
QR_DEBUG_MODE=true

# Часовой пояс событий
EVENTS_TIMEZONE=Asia/Tashkent
```

## Команды для настройки после заполнения .env:

1. **Настройка PayMe:**
```bash
php artisan setup:payme
```

2. **Настройка Telegram:**
```bash
php artisan setup:telegram
```

3. **Генерация ключа приложения:**
```bash
php artisan key:generate
```

4. **Очистка кэша:**
```bash
php artisan config:clear
php artisan cache:clear
```

---

**🔔 ВАЖНО:** 
- PayMe merchant_id и ключи получить в PayMe Business кабинете
- Telegram bot token получить у @BotFather 
- Chat ID получить через @userinfobot в нужных группах
- Для продакшена изменить PAYME_TEST_MODE=false и URL 