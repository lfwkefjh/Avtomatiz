# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Платформа ассоциации селлеров Sellercom.uz

## ОГЛАВЛЕНИЕ
1. [ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА](#общее-описание-проекта)
2. [АРХИТЕКТУРА И ТЕХНОЛОГИИ](#архитектура-и-технологии)
3. [РОЛИ И ПРАВА ДОСТУПА](#роли-и-права-доступа)
4. [СТРУКТУРА БАЗЫ ДАННЫХ](#структура-базы-данных)
5. [АРХИТЕКТУРА ФАЙЛОВ](#архитектура-файлов)
6. [API ЭНДПОИНТЫ](#api-эндпоинты)
7. [ИНТЕГРАЦИИ](#интеграции)
8. [ПЛАН РАЗРАБОТКИ](#план-разработки)
9. [ДЕПЛОЙ И DEVOPS](#деплой-и-devops)
10. [ТЕСТИРОВАНИЕ](#тестирование)

---

## ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА

### Основные цели:
- ✅ Система продажи билетов на мероприятия с QR-кодами
- ✅ Реклама курсов для селлеров (внешние платформы)
- ✅ Партнерские программы и реклама с трекингом
- ✅ Новостной блог с SEO оптимизацией
- ✅ Полная система администрирования Filament

### Технические требования:
- **Backend**: Laravel 12+ + Filament 3.2+ (admin panel)
- **Frontend**: Только веб (без мобильного приложения)
- **База данных**: PostgreSQL 15+ (заменили MySQL на PostgreSQL по требованию)
- **Кэширование**: Redis
- **Очереди**: Redis/Database
- **Файловое хранилище**: Local → S3 (миграция в будущем)
- **Контейнеризация**: Docker + Docker Compose
- **Web-сервер**: Nginx
- **Нагрузка**: До 100 одновременных пользователей (без горизонтального масштабирования)
- **SMS**: Eskiz.uz
- **Платежи**: PayMe (есть тестовые ключи, 3 попытки обработки)
- **Карты**: Яндекс.Карты
- **Мониторинг**: Telescope + custom dashboard
- **Хостинг**: VPS с автодеплоем и бесплатным SSL (Let's Encrypt)

### Языки и локализация:
- **Админка**: Только русский
- **Контент**: Русский (ru) - основной + fallback, Узбекский (uz), Английский (en)
- **Создание мероприятий**: Только для ассоциации (модерация не нужна)

### НОВЫЕ КРИТИЧНЫЕ РЕШЕНИЯ (от пользователя):

1. **🔄 Возвраты билетов**: 
   - Дата возврата: админ указывает при создании (по умолчанию 5 дней до мероприятия)
   - Предупреждение при покупке: если покупка после даты возврата - показать уведомление
   - Автоматический расчет: при изменении даты мероприятия пересчитывать дату возврата

2. **🎫 QR-коды (оптимальное решение)**:
   - **Одноразовые**: 1 вход на билет
   - **Время жизни**: До окончания мероприятия
   - **Структура**: ID + Hash + временная метка для максимальной безопасности
   - **Офлайн валидация**: Локальное кэширование для работы без интернета

3. **💰 Платежи PayMe (рекомендуемая стратегия)**:
   - **3 попытки** обработки платежа
   - **Exponential backoff**: 1сек → 3сек → 9сек между попытками
   - **Детальное логирование** всех попыток для отладки
   - **Webhook валидация** с проверкой подписи

4. **🌍 Мультиязычность (детальная стратегия)**:
   - **JSON экспорт целиком**: Все переводы в одном файле для AI
   - **Fallback**: Русский язык при отсутствии перевода
   - **Без версионности**: Простая система без отката изменений

5. **📁 Файлы и медиа**:
   - **Старт**: Локальное хранилище (storage/app/public)
   - **Будущее**: Миграция на S3
   - **Лимиты**: Максимум 1MB на файл
   - **PDF билеты**: Автогенерация при подтверждении платежа

### Критичные технические решения (от команды разработчиков):

1. **🔔 Система уведомлений**: Мультиканальная (Telegram + In-app + Push)
2. **🎫 QR-коды**: ID + Hash (безопасно + офлайн поддержка)
3. **💰 Возвраты**: Автоматически через PayMe API (если поддерживается) + заявки
4. **🌐 Языки**: Админка RU, весь контент 3 языка (ru/uz/en)
5. **📊 Аналитика**: Полный трекинг (продажи + поведение + клики + время + эффективность)

---

## АРХИТЕКТУРА И ТЕХНОЛОГИИ

### Laravel Packages (composer.json):
```json
{
    "require": {
        "laravel/framework": "^11.0",
        "filament/filament": "^3.0",
        "spatie/laravel-permission": "^6.0",
        "spatie/laravel-translatable": "^6.0",
        "spatie/laravel-sluggable": "^3.0",
        "spatie/laravel-settings": "^3.0",
        "laravel/telescope": "^5.0",
        "intervention/image": "^3.0",
        "simplesoftwareio/simple-qrcode": "^4.0",
        "barryvdh/laravel-dompdf": "^2.0",
        "maatwebsite/excel": "^3.1",
        "pusher/pusher-php-server": "^7.0",
        "guzzlehttp/guzzle": "^7.0",
        "laravel/sanctum": "^4.0"
    }
}
```

### Docker Services:
- **nginx**: Web server с оптимизацией
- **php**: PHP 8.2+ FPM с необходимыми расширениями
- **mysql**: MySQL 8.0 с оптимизированной конфигурацией
- **redis**: Для кэширования и очередей
- **supervisor**: Для управления Laravel Queue Workers

---

## РОЛИ И ПРАВА ДОСТУПА

### 1. Суперадмин (Super Admin)
- Полный доступ ко всем функциям
- Управление пользователями и ролями
- Доступ к мониторингу системы
- Управление настройками безопасности

### 2. Админ (Admin)  
- Полный функционал кроме управления пользователями
- Создание и управление мероприятиями
- Просмотр всей аналитики
- Управление билетами и платежами
- Доступ к системному мониторингу

### 3. Организатор (Organizer)
- Функционал админа без мониторинга
- Создание и управление мероприятиями
- Просмотр аналитики по своим мероприятиям
- Управление билетами для своих мероприятий

### 4. Помощник (Assistant)
- Только сканирование билетов
- Доступ к модулю сканирования QR-кодов
- Просмотр информации о билетах
- Регистрация посетителей на мероприятиях

### 5. Пользователь (User)
- Личный кабинет
- Покупка билетов
- Просмотр истории покупок
- Управление профилем
- Возврат билетов

### 6. Гость (Guest)
- Только просмотр
- Просмотр мероприятий
- Чтение блога
- Просмотр курсов
- Регистрация на сайте

---

## СТРУКТУРА БАЗЫ ДАННЫХ

### Схема таблиц (22 таблицы):

#### 1. users - Пользователи системы
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('super_admin', 'admin', 'organizer', 'assistant', 'user') DEFAULT 'user',
    phone_verified_at TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. events - Мероприятия
```sql
CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title JSON NOT NULL, -- {"ru": "Название", "uz": "Nom", "en": "Title"}
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description JSON,
    full_description JSON,
    pc_image VARCHAR(500),
    mobile_image VARCHAR(500),
    youtube_url VARCHAR(500),
    format ENUM('online', 'offline', 'mixed') NOT NULL,
    language ENUM('ru', 'uz', 'en') DEFAULT 'ru',
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    location_name JSON,
    location_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ticket_sales_start DATE,
    ticket_sales_end DATE NOT NULL,
    refund_deadline DATE,
    refund_policy JSON,
    promotional_link VARCHAR(500),
    status ENUM('draft', 'published', 'ongoing', 'completed', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    max_attendees INT UNSIGNED,
    price_increase_enabled BOOLEAN DEFAULT FALSE,
    price_increase_dates JSON, -- [{"date": "2024-01-15", "increase_percent": 10}]
    meta_title JSON,
    meta_description JSON,
    meta_keywords JSON,
    og_title JSON,
    og_description JSON,
    og_image VARCHAR(500),
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. event_ticket_types - Тарифы билетов
```sql
CREATE TABLE event_ticket_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT UNSIGNED NOT NULL,
    name JSON NOT NULL,
    description JSON,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UZS',
    max_quantity INT UNSIGNED,
    sold_quantity INT UNSIGNED DEFAULT 0,
    included_items JSON, -- ["WiFi", "Coffee", "Lunch"]
    excluded_items JSON,
    color VARCHAR(7) DEFAULT '#007bff',
    is_active BOOLEAN DEFAULT TRUE,
    requires_survey BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);
```

#### 4. tickets - Билеты
```sql
CREATE TABLE tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT UNSIGNED NOT NULL,
    ticket_type_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED,
    buyer_name VARCHAR(200) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    buyer_email VARCHAR(255),
    quantity INT UNSIGNED DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    promocode_id BIGINT UNSIGNED NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'used', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_id BIGINT UNSIGNED,
    purchased_at TIMESTAMP NULL,
    used_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    refund_reason TEXT,
    refund_account_info JSON, -- {"card_number": "8600...", "cardholder": "Name"}
    ticket_type ENUM('purchased', 'guest', 'organizer', 'speaker') DEFAULT 'purchased'
);
```

#### 5. payments - Платежи
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED,
    payment_system ENUM('payme') DEFAULT 'payme',
    external_payment_id VARCHAR(255), -- ID от PayMe
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UZS',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    card_mask VARCHAR(20), -- 8600****1234
    cardholder_name VARCHAR(200),
    transaction_data JSON, -- полная информация от PayMe
    callback_data JSON, -- данные callback'ов
    error_message TEXT,
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL
);
```

#### Остальные таблицы:
- **promocodes** - Промокоды
- **corporate_discounts** - Корпоративные скидки
- **event_materials** - Материалы мероприятий
- **event_partners** - Партнеры мероприятий
- **event_surveys** - Опросы
- **survey_questions** - Вопросы опросов
- **survey_responses** - Ответы на опросы
- **blogs** - Блог статьи
- **courses** - Курсы
- **partners** - Глобальные партнеры
- **banners** - Рекламные баннеры
- **galleries** - Галерея изображений
- **contact_requests** - Заявки обратной связи
- **ticket_scans** - История сканирований билетов
- **partner_clicks** - Клики по партнерам
- **banner_clicks** - Клики по баннерам
- **settings** - Настройки системы

---

## АРХИТЕКТУРА ФАЙЛОВ

### Структура проекта:
```
sellercom-backend/
├── app/
│   ├── Console/Commands/          # Artisan команды
│   ├── Events/                    # Laravel Events
│   ├── Exceptions/                # Обработчики исключений
│   ├── Filament/                  # Filament админка
│   │   ├── Resources/             # Ресурсы админки
│   │   └── Widgets/               # Виджеты дашборда
│   ├── Http/
│   │   ├── Controllers/API/       # API контроллеры
│   │   ├── Middleware/            # Middleware
│   │   ├── Requests/              # Form Request валидация
│   │   └── Resources/             # API Resources
│   ├── Jobs/                      # Фоновые задачи
│   ├── Listeners/                 # Event Listeners
│   ├── Mail/                      # Mail классы
│   ├── Models/                    # Eloquent модели
│   ├── Notifications/             # Уведомления
│   ├── Policies/                  # Авторизация
│   ├── Providers/                 # Service Providers
│   ├── Services/                  # Бизнес логика
│   │   ├── Auth/                  # Аутентификация
│   │   ├── Payment/               # Платежи
│   │   ├── Ticket/                # Билеты
│   │   ├── Event/                 # Мероприятия
│   │   ├── Notification/          # Уведомления
│   │   ├── Analytics/             # Аналитика
│   │   ├── File/                  # Файлы
│   │   ├── SEO/                   # SEO
│   │   └── Cache/                 # Кэширование
│   ├── Traits/                    # Общие трейты
│   └── Rules/                     # Кастомные правила валидации
├── config/                        # Конфигурация
├── database/
│   ├── factories/                 # Model Factories
│   ├── migrations/                # Миграции БД
│   └── seeders/                   # Сидеры
├── docker/                        # Docker конфигурация
├── resources/
│   ├── lang/                      # Языковые файлы
│   └── views/                     # Blade шаблоны
├── routes/                        # Маршруты
├── tests/                         # Тесты
│   ├── Feature/                   # Feature тесты
│   └── Unit/                      # Unit тесты
└── storage/                       # Хранилище файлов
```

---

## API ЭНДПОИНТЫ

### Аутентификация
```
POST   /api/auth/register              # Регистрация
POST   /api/auth/verify-code           # Подтверждение кода
POST   /api/auth/login                 # Авторизация
POST   /api/auth/logout                # Выход
POST   /api/auth/refresh               # Обновление токена
POST   /api/auth/forgot-password       # Восстановление пароля
```

### Мероприятия
```
GET    /api/events                     # Список мероприятий с фильтрами
GET    /api/events/{slug}              # Детали мероприятия
GET    /api/events/{id}/ticket-types   # Тарифы мероприятия
```

### Билеты
```
POST   /api/tickets/purchase           # Покупка билета
GET    /api/tickets/{id}               # Информация о билете
POST   /api/tickets/{id}/scan          # Сканирование билета
POST   /api/tickets/{id}/refund        # Возврат билета
```

### Платежи
```
POST   /api/payments/callback          # Callback от PayMe
GET    /api/payments/{id}/status       # Статус платежа
```

### Блог
```
GET    /api/blog                       # Список статей
GET    /api/blog/{slug}                # Конкретная статья
GET    /api/blog/search                # Поиск по блогу
```

### Курсы
```
GET    /api/courses                    # Список курсов
GET    /api/courses/{slug}             # Детали курса
POST   /api/courses/{id}/click         # Трекинг клика
```

### Партнеры
```
GET    /api/partners                   # Список партнеров
POST   /api/partners/{id}/click        # Трекинг клика
```

### Галерея
```
GET    /api/gallery                    # Галерея изображений
```

### Контакты
```
POST   /api/contact                    # Отправка заявки
```

---

## ИНТЕГРАЦИИ

### 1. SMS (Eskiz.uz)
```php
// Конфигурация
'eskiz' => [
    'api_url' => env('ESKIZ_API_URL', 'https://notify.eskiz.uz/api'),
    'email' => env('ESKIZ_EMAIL'),
    'password' => env('ESKIZ_PASSWORD'),
    'from' => env('ESKIZ_FROM', '4546'),
]

// Использование
SMS::send('+998901234567', 'Код подтверждения: 1234');
```

### 2. PayMe (ОПТИМАЛЬНАЯ СТРАТЕГИЯ)

#### Обоснование выбора стратегии:
- **3 попытки обработки**: Надежность при временных сбоях сети
- **Exponential backoff**: Снижение нагрузки на PayMe API
- **Детальное логирование**: Отладка проблем и мониторинг
- **Webhook валидация**: Защита от поддельных уведомлений

#### Конфигурация:
```php
'payme' => [
    'merchant_id' => env('PAYME_MERCHANT_ID'),
    'secret_key' => env('PAYME_SECRET_KEY'),
    'callback_url' => env('APP_URL') . '/api/payments/payme/callback',
    'test_mode' => env('PAYME_TEST_MODE', true),
    'max_attempts' => 3,
    'retry_delays' => [1, 3, 9], // секунды между попытками
    'timeout' => 30, // таймаут запроса
]
```

#### Алгоритм обработки платежа:
```php
// Создание платежа с retry логикой
$payment = PayMe::createPaymentWithRetry($amount, $order_id, [
    'attempts' => 3,
    'delays' => [1, 3, 9],
    'on_failure' => function($attempt, $error) {
        Log::error("PayMe attempt {$attempt} failed: {$error}");
        // Уведомление администратора при финальной ошибке
        if ($attempt === 3) {
            Notification::send($admin, new PaymentFailedNotification($error));
        }
    }
]);
```

#### Webhook безопасность:
```php
// Валидация подписи PayMe
public function validatePaymeSignature($request) {
    $signature = $request->header('X-PayMe-Signature');
    $payload = $request->getContent();
    $expected = hash_hmac('sha256', $payload, config('payme.secret_key'));
    
    return hash_equals($signature, $expected);
}
```

### 3. Telegram Bot
```php
// Уведомление о покупке билета
📍 Покупка билета!
🧾 {ticket_id} - номер id билета 
👤 {cardholder_name} - владелец карточки
💳 {card_mask} - карточка с которой была проведена оплата
🇺🇿 {amount} сум - сумма оплаты
🔸 Ф.И.О.: {buyer_name}
🔸 Номер телефона: {buyer_phone}
🔸 Промокод: {promocode} (Или нет промо)
🔸 Тариф: {tariff_name}
🕓 {time} {date}
🆔 {payment_id} - id платежа из PayMe 
✅ Успешно оплачен
```

### 4. Яндекс.Карты
```javascript
// Интеграция для выбора местоположения мероприятий
ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [41.311158, 69.279737], // Ташкент
        zoom: 10
    });
});
```

---

## ПЛАН РАЗРАБОТКИ (ОБНОВЛЕННЫЙ)

### 🚀 Этап 1: Основа проекта (Задачи 1-8)
1. ✅ **Настройка окружения** - Docker, Laravel, пакеты
2. **База данных** - Миграции, модели, отношения + мультиязычность
3. **Аутентификация** - SMS, JWT токены, роли
4. **Мероприятия** - CRUD, мультиязычный контент
5. **Билеты** - QR-коды (ID+Hash), PDF генерация, офлайн поддержка
6. **Платежи** - PayMe интеграция + исследование автовозвратов
7. **Система уведомлений** - Архитектура мультиканальных уведомлений
8. **Базовая аналитика** - События, трекинг, метрики

### 🔧 Этап 2: Расширенный функционал (Задачи 9-16)
9. **Возвраты** - Автоматические + заявки (в зависимости от PayMe API)
10. **Telegram Bot** - Полная интеграция с уведомлениями
11. **Push-уведомления** - Веб push для пользователей
12. **In-app уведомления** - Система уведомлений в админке и для API
13. **Опросы** - Создание и проведение опросов (мультиязычно)
14. **Материалы** - Файлы для мероприятий с контролем доступа
15. **Партнеры** - Трекинг переходов + аналитика эффективности
16. **Баннеры** - Реклама с полной аналитикой кликов

### 📊 Этап 3: Контент и аналитика (Задачи 17-22)
17. **Блог** - Статьи с SEO + мультиязычность
18. **Курсы** - Каталог внешних курсов + трекинг переходов
19. **Галерея** - Фотогалерея мероприятий (мультиязычные описания)
20. **Контакты** - Обратная связь + CRM функционал
21. **Расширенная аналитика** - Поведение пользователей, время на сайте, воронки
22. **Дашборды** - Визуализация всех метрик

### 🎯 Этап 4: Оптимизация и продакшен (Задачи 23-28)
23. **SEO** - Мультиязычные sitemap, meta теги, схемы
24. **Кэширование** - Redis стратегии для высокой нагрузки
25. **Очереди** - Фоновые задачи с приоритизацией
26. **Система настроек** - Полная конфигурация платформы
27. **Тестирование** - Покрытие критичного функционала
28. **Продакшен деплой** - CI/CD, мониторинг, алерты

### 🔍 ИССЛЕДОВАТЕЛЬСКИЕ ЗАДАЧИ (приоритетные):
- **PayMe API возвраты** - изучить документацию на предмет автоматических возвратов
- **Push-уведомления** - выбрать сервис (FCM, OneSignal, собственный)
- **Аналитика** - определить метрики и события для трекинга

---

## ДЕТАЛЬНАЯ АРХИТЕКТУРА КЛЮЧЕВЫХ КОМПОНЕНТОВ

### 🔔 Система уведомлений (мультиканальная)

#### Каналы уведомлений:
1. **Telegram** - для администраторов
2. **In-app** - внутри админки и API для фронтенда
3. **Push** - веб push-уведомления для пользователей
4. **Email** - резервный канал
5. **SMS** - критичные уведомления

#### Архитектура:
```php
// Единая система отправки
NotificationManager::send($user, $notification, $channels = ['telegram', 'push', 'in_app']);

// Типы уведомлений
- TicketPurchasedNotification (Telegram + In-app + Push)
- RefundRequestNotification (Telegram + In-app)
- EventUpdatedNotification (Push + In-app)
- SystemAlertNotification (Telegram + Email)
```

#### Таблицы БД:
```sql
-- Уведомления в приложении
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    type VARCHAR(100),
    data JSON,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP
);

-- Push подписки
CREATE TABLE push_subscriptions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    endpoint TEXT,
    public_key VARCHAR(255),
    auth_token VARCHAR(255),
    created_at TIMESTAMP
);
```

### 🎫 QR-коды (ОПТИМАЛЬНОЕ РЕШЕНИЕ)

#### Обоснование выбора:
- **Одноразовые QR-коды**: Максимальная безопасность (1 вход = 1 билет)
- **Время жизни**: До окончания мероприятия (автоматическое истечение)
- **Офлайн валидация**: Работа без интернета в критических ситуациях
- **Hash-защита**: Невозможность подделки билетов

#### Структура QR-кода:
```json
{
    "ticket_id": "12345",
    "hash": "sha256_hash_of_ticket_data",
    "event_id": "67890",
    "type": "purchased",
    "expires_at": "2024-12-31T23:59:59Z",
    "single_use": true,
    "timestamp": "2024-01-01T10:00:00Z"
}
```

#### Алгоритм валидации:
1. **Проверка hash**: Сверка с данными билета
2. **Проверка времени**: Билет действителен до окончания события
3. **Проверка использования**: Одноразовый билет не может быть использован повторно
4. **Проверка подлинности**: Билет принадлежит этому мероприятию

#### Офлайн поддержка:
1. **Кэширование билетов** в локальное хранилище сканера
2. **Синхронизация** при подключении к интернету
3. **Валидация hash** для проверки подлинности
4. **Очередь сканирований** для синхронизации

#### API для сканеров:
```php
// Загрузка данных для офлайн работы
GET /api/events/{id}/tickets/offline-data
// Синхронизация отсканированных билетов
POST /api/tickets/sync-scans
// Проверка билета (онлайн/офлайн)
POST /api/tickets/{id}/validate
```

### 📊 Система аналитики и трекинга

#### ОБЪЯСНЕНИЕ: Custom Events vs Стандартные
**Стандартные события** - базовые метрики Google Analytics:
- page_view (просмотры страниц)
- session_start (начало сессии)  
- first_visit (первый визит)
- purchase (покупка)

**Custom Events** - специальные для нашего бизнеса:
- ticket_purchased (покупка билета)
- qr_scanned (сканирование билета)
- refund_requested (запрос возврата)
- event_shared (поделился мероприятием)

**Рекомендация**: Использовать ОБА типа для полной картины.

#### События для трекинга:
```php
// Продажи (Custom Events)
- ticket_purchased
- ticket_refunded
- promocode_used
- payment_failed

// Поведение пользователей (Custom Events)
- page_viewed
- button_clicked
- time_spent
- scroll_depth
- event_shared
- event_favorited

// Маркетинг (Custom Events)
- banner_clicked
- partner_clicked
- course_viewed
- blog_read
- utm_conversion

// Конверсии (Standard + Custom Events)
- registration_completed (custom)
- payment_started (custom)
- purchase (standard)
- event_attended (custom)
```

#### Структура событий:
```json
{
    "event": "ticket_purchased",
    "user_id": 123,
    "session_id": "uuid",
    "timestamp": "2024-01-01T12:00:00Z",
    "properties": {
        "event_id": 456,
        "ticket_type": "premium",
        "amount": 50000,
        "currency": "UZS",
        "payment_method": "payme"
    },
    "context": {
        "ip": "1.2.3.4",
        "user_agent": "...",
        "referrer": "https://google.com",
        "utm_source": "facebook"
    }
}
```

#### Метрики дашборда:
- **Продажи**: выручка, количество билетов, конверсия
- **Поведение**: bounce rate, время на сайте, популярные страницы
- **Эффективность**: CTR баннеров, конверсия партнеров
- **Воронки**: регистрация → просмотр → покупка → посещение

### 🔄 Система возвратов (ДЕТАЛЬНАЯ ЛОГИКА)

#### Бизнес-правила возвратов:
1. **Дата возврата**: Админ указывает при создании мероприятия
2. **По умолчанию**: 5 дней до начала мероприятия
3. **Автопересчет**: При изменении даты мероприятия пересчитывать дату возврата
4. **Предупреждение**: При покупке после даты возврата показать уведомление

#### Алгоритм расчета даты возврата:
```php
// При создании мероприятия
$refund_deadline = $admin_date ?? $event_start_date->subDays(5);

// При изменении даты мероприятия
if ($event->isDirty('start_date')) {
    $event->refund_deadline = $event->admin_refund_date ?? 
                              $event->start_date->subDays(5);
}

// Проверка при покупке
$can_refund = now() <= $event->refund_deadline;
if (!$can_refund) {
    // Показать предупреждение пользователю
    $warning = "Внимание! Билет возврату не подлежит после " . 
               $event->refund_deadline->format('d.m.Y');
}
```

#### Интерфейс создания мероприятия:
```php
// Форма в админке
'refund_deadline' => DatePicker::make('refund_deadline')
    ->label('Дата окончания возврата билетов')
    ->helperText('Если не указано, будет установлено за 5 дней до мероприятия')
    ->nullable(),

// Автоматический расчет
protected function mutateFormDataBeforeCreate(array $data): array {
    if (empty($data['refund_deadline'])) {
        $data['refund_deadline'] = Carbon::parse($data['start_date'])
                                         ->subDays(5)
                                         ->toDateString();
    }
    return $data;
}
```

### 🌐 Мультиязычность (ДЕТАЛЬНАЯ СТРАТЕГИЯ)

#### ОБЪЯСНЕНИЕ: Версионность переводов
**Версионность** означает сохранение истории изменений переводов:
- Возможность откатить перевод к предыдущей версии
- История кто и когда менял переводы
- Сравнение версий переводов

**Наше решение**: БЕЗ версионности для простоты системы.

#### Структура JSON полей:
```json
{
    "title": {
        "ru": "Название мероприятия",
        "uz": "Tadbir nomi", 
        "en": "Event Title"
    }
}
```

#### JSON экспорт для AI перевода:
```json
{
    "events": {
        "event_1_title": {
            "ru": "Мастер-класс по продажам",
            "uz": "",
            "en": ""
        },
        "event_1_description": {
            "ru": "Изучаем эффективные техники продаж",
            "uz": "",
            "en": ""
        }
    },
    "general": {
        "buy_ticket": {
            "ru": "Купить билет",
            "uz": "Chipta sotib olish",
            "en": "Buy ticket"
        }
    }
}
```

#### Fallback система:
```php
// Если перевод отсутствует - показываем русский
function getTranslation($field, $lang = 'ru') {
    $translations = json_decode($this->$field, true);
    return $translations[$lang] ?? $translations['ru'] ?? '';
}
```

#### Модели с переводами:
- events (title, description, location_name, meta_title, meta_description)
- event_ticket_types (name, description)
- blogs (title, content, short_description)
- courses (title, description)
- partners (name, description)
- galleries (title, description, category)

#### API с языками:
```php
GET /api/events?lang=ru
GET /api/events?lang=uz
GET /api/events?lang=en
```

### 🔍 SEO и мультиязычность (ДЕТАЛЬНАЯ СТРАТЕГИЯ)

#### ОБЪЯСНЕНИЕ: Canonical URLs
**Canonical URL** - это "основная" версия страницы при наличии дублей:
- Проблема: `/events/master-klass` и `/events/master-klass?lang=ru` - одна страница
- Решение: `<link rel="canonical" href="/events/master-klass" />` указывает основную версию
- Цель: Избежать штрафов поисковиков за дублированный контент

#### Структура мультиязычных URL:
```
/events/master-klass           # русский (основной)
/uz/events/master-klass        # узбекский
/en/events/master-klass        # английский
```

#### Meta теги для каждого мероприятия:
```php
// В модели Event
public function getMetaTitle($lang = 'ru') {
    $meta = json_decode($this->meta_title, true);
    return $meta[$lang] ?? $meta['ru'] ?? $this->getTitle($lang);
}

// В контроллере
$event = Event::findBySlug($slug);
$meta_title = $event->getMetaTitle($lang);
$meta_description = $event->getMetaDescription($lang);

// В шаблоне
<title>{{ $meta_title }}</title>
<meta name="description" content="{{ $meta_description }}">
<link rel="canonical" href="{{ url('/events/' . $event->slug) }}">
<link rel="alternate" hreflang="ru" href="{{ url('/events/' . $event->slug) }}">
<link rel="alternate" hreflang="uz" href="{{ url('/uz/events/' . $event->slug) }}">
<link rel="alternate" hreflang="en" href="{{ url('/en/events/' . $event->slug) }}">
```

#### SEO оптимизация:
- **Meta title**: Уникальный для каждого мероприятия и языка
- **Meta description**: Описание мероприятия (160 символов)
- **Slug**: ЧПУ на основе названия мероприятия
- **Meta keywords**: Ключевые слова (5-10 штук)
- **Canonical URLs**: Избежание дублей контента
- **Hreflang**: Указание языка для поисковиков
- **OpenGraph**: Для социальных сетей (title, description, image)
- **Sitemap**: Отдельные карты для каждого языка

---

### 📄 PDF билеты (АВТОГЕНЕРАЦИЯ)

#### Когда создаются PDF билеты:
1. **При подтверждении платежа**: Автоматическая генерация после успешной оплаты
2. **При ручном создании**: Админ может создать билет и сразу сгенерировать PDF
3. **При повторном запросе**: Пользователь может скачать PDF из личного кабинета

#### Структура PDF билета:
```php
// Данные для PDF
$ticket_data = [
    'ticket_number' => $ticket->ticket_number,
    'event_title' => $ticket->event->getTitle('ru'),
    'event_date' => $ticket->event->start_date->format('d.m.Y'),
    'event_time' => $ticket->event->start_time->format('H:i'),
    'buyer_name' => $ticket->buyer_name,
    'ticket_type' => $ticket->ticketType->getName('ru'),
    'qr_code' => $ticket->qr_code, // base64 изображение QR
    'location' => $ticket->event->getLocationName('ru'),
    'price' => $ticket->final_price . ' сум'
];

// Генерация PDF
$pdf = PDF::loadView('tickets.pdf-template', $ticket_data);
$pdf_path = "tickets/{$ticket->id}/ticket.pdf";
Storage::put($pdf_path, $pdf->output());
```

#### Template PDF билета:
- **Логотип ассоциации** (верхний левый угол)
- **QR-код** (крупно, справа)
- **Номер билета** (уникальный)
- **Название мероприятия** (крупным шрифтом)
- **Дата и время** (четко выделено)
- **Тариф билета** и цена
- **ФИО покупателя**
- **Место проведения**
- **Контакты организатора**

#### Безопасность PDF:
- **Водяной знак** с логотипом
- **QR-код** для валидации на входе
- **Защита от копирования** (PDF restrictions)

## ДЕПЛОЙ И DEVOPS (VPS + АВТОДЕПЛОЙ)

### Docker Compose (Production) - PostgreSQL
```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./storage/app/public:/var/www/storage
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - php
  
  php:
    build: ./docker/php
    volumes:
      - .:/var/www
      - ./storage:/var/www/storage
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
  
  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

### SSL Certificate (Let's Encrypt)
```bash
# Установка Certbot на Ubuntu VPS
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d sellercom.uz -d www.sellercom.uz

# Автоматическое продление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Автодеплой через GitHub Actions
```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/sellercom
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
            docker-compose exec -T php composer install --no-dev --optimize-autoloader
            docker-compose exec -T php php artisan migrate --force
            docker-compose exec -T php php artisan config:cache
            docker-compose exec -T php php artisan route:cache
            docker-compose exec -T php php artisan view:cache
            docker-compose exec -T php php artisan queue:restart
```

### Файловое хранилище (Local → S3 Migration)
```php
// Конфигурация для будущей миграции
'filesystems' => [
    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
        ],
        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
        ],
    ],
];

// Текущий диск: local, будущий: s3
'current_disk' => env('FILESYSTEM_DISK', 'local'),
'file_size_limit' => 1024 * 1024, // 1MB
```

---

## ТЕСТИРОВАНИЕ

### Ngrok для разработки
```bash
# Запуск локального сервера
php artisan serve --host=0.0.0.0 --port=8000

# Ngrok туннель
ngrok http 8000

# PayMe Callback URL: https://abc123.ngrok.io/api/payments/payme/callback
```

### Тестовые сценарии
1. **Регистрация/Авторизация** - SMS коды, токены
2. **Покупка билетов** - PayMe, QR-коды, PDF
3. **Сканирование** - Валидация, дубликаты
4. **Возвраты** - Сроки, уведомления
5. **Админка** - CRUD операции, права доступа

---

## БЕЗОПАСНОСТЬ

### Меры защиты:
- ✅ CSRF защита
- ✅ XSS защита  
- ✅ SQL injection защита
- ✅ Rate limiting
- ✅ JWT токены с истечением
- ✅ Validation всех входных данных
- ✅ Encryption чувствительных данных
- ✅ HTTPS обязательно для production
- ✅ Логирование всех критичных операций

### Мониторинг:
- ✅ Laravel Telescope для отладки
- ✅ Логирование в файлы и Telegram
- ✅ Мониторинг производительности
- ✅ Алерты при ошибках

---

## ЗАКЛЮЧЕНИЕ

Данная спецификация содержит полное техническое задание для создания платформы ассоциации селлеров. Проект разбит на 24 основные задачи с четкими зависимостями. При возникновении вопросов или необходимости изменений, обращайтесь для уточнения деталей.

**Важно**: Проект требует внимательного подхода к безопасности платежей и персональных данных. Все критичные операции должны логироваться и мониториться.

**Статус проекта**: В разработке
**Версия спецификации**: 1.0
**Дата создания**: 2024-01-01 