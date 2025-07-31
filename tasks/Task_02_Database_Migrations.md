# Task 2: Создание миграций БД (22 таблицы)

## 📋 ОПИСАНИЕ ЗАДАЧИ
Создание всех 22 таблиц базы данных с JSON полями для мультиязычности, правильными индексами и связями для платформы ассоциации селлеров.

## 🎯 ЦЕЛИ
- ✅ Создать 22 миграции PostgreSQL
- ✅ Настроить JSON поля для мультиязычности
- ✅ Добавить все необходимые индексы
- ✅ Настроить foreign key связи
- ✅ Добавить soft deletes где нужно
- ✅ Оптимизировать для 100 пользователей

## 📊 СТРУКТУРА ТАБЛИЦ

### 1. users - Пользователи системы
```php
<?php
// database/migrations/2024_01_01_000001_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('phone', 20)->unique();
            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar', 500)->nullable();
            $table->enum('role', ['super_admin', 'admin', 'organizer', 'assistant', 'user'])->default('user');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['role', 'is_active']);
            $table->index('phone');
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### 2. events - Мероприятия
```php
<?php
// database/migrations/2024_01_01_000002_create_events_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->json('title'); // {"ru": "Название", "uz": "Nom", "en": "Title"}
            $table->string('slug')->unique();
            $table->json('short_description')->nullable();
            $table->json('full_description')->nullable();
            $table->string('pc_image', 500)->nullable();
            $table->string('mobile_image', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->enum('format', ['online', 'offline', 'mixed'])->default('offline');
            $table->enum('language', ['ru', 'uz', 'en'])->default('ru');
            $table->date('start_date');
            $table->time('start_time');
            $table->date('end_date');
            $table->time('end_time');
            $table->json('location_name')->nullable();
            $table->string('location_url', 500)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('ticket_sales_start')->nullable();
            $table->date('ticket_sales_end');
            $table->date('refund_deadline')->nullable(); // По умолчанию 5 дней до мероприятия
            $table->json('refund_policy')->nullable();
            $table->string('promotional_link', 500)->nullable(); // Для QR-кодов
            $table->enum('status', ['created', 'published', 'ongoing', 'completed', 'archived'])->default('created');
            $table->boolean('is_featured')->default(false);
            $table->integer('max_attendees')->unsigned()->nullable();
            $table->boolean('price_increase_enabled')->default(false);
            $table->json('price_increase_dates')->nullable(); // [{"date": "2024-01-15", "increase_percent": 10}]
            $table->json('meta_title')->nullable();
            $table->json('meta_description')->nullable();
            $table->json('meta_keywords')->nullable();
            $table->json('og_title')->nullable();
            $table->json('og_description')->nullable();
            $table->string('og_image', 500)->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            // Индексы для поиска и производительности
            $table->index(['status', 'start_date']);
            $table->index(['is_featured', 'status']);
            $table->index('start_date');
            $table->index('created_by');
            $table->index('slug');
            $table->fullText(['title', 'short_description']); // PostgreSQL полнотекстовый поиск
        });
    }
};
```

### 3. event_ticket_types - Тарифы билетов
```php
<?php
// database/migrations/2024_01_01_000003_create_event_ticket_types_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('event_ticket_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->json('name'); // {"ru": "Стандартный", "uz": "Standart", "en": "Standard"}
            $table->json('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('UZS');
            $table->integer('max_quantity')->unsigned()->nullable();
            $table->integer('sold_quantity')->unsigned()->default(0);
            $table->json('included_items')->nullable(); // ["WiFi", "Coffee", "Lunch"]
            $table->json('excluded_items')->nullable();
            $table->string('color', 7)->default('#007bff');
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_survey')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Индексы
            $table->index(['event_id', 'is_active']);
            $table->index('sort_order');
        });
    }
};
```

### 4. tickets - Билеты
```php
<?php
// database/migrations/2024_01_01_000004_create_tickets_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events');
            $table->foreignId('ticket_type_id')->constrained('event_ticket_types');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('buyer_name', 200);
            $table->string('buyer_phone', 20);
            $table->string('buyer_email')->nullable();
            $table->integer('quantity')->unsigned()->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->foreignId('promocode_id')->nullable()->constrained('promocodes');
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('final_price', 10, 2);
            $table->string('qr_code')->unique(); // Уникальный QR-код
            $table->string('ticket_number', 50)->unique(); // T-2024-001234
            $table->enum('status', ['pending', 'confirmed', 'used', 'refunded', 'cancelled'])->default('pending');
            $table->foreignId('payment_id')->nullable()->constrained('payments');
            $table->timestamp('purchased_at')->nullable();
            $table->timestamp('used_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->text('refund_reason')->nullable();
            $table->json('refund_account_info')->nullable(); // {"card_number": "8600...", "cardholder": "Name"}
            $table->enum('ticket_type', ['purchased', 'guest', 'organizer', 'speaker'])->default('purchased');
            $table->timestamps();
            $table->softDeletes();

            // Индексы для быстрого поиска
            $table->index(['event_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('qr_code');
            $table->index('ticket_number');
            $table->index('buyer_phone');
            $table->index(['status', 'purchased_at']);
        });
    }
};
```

### 5. payments - Платежи
```php
<?php
// database/migrations/2024_01_01_000005_create_payments_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->enum('payment_system', ['payme'])->default('payme');
            $table->string('external_payment_id')->nullable(); // ID от PayMe
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('UZS');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])->default('pending');
            $table->string('payment_method', 50)->nullable();
            $table->string('card_mask', 20)->nullable(); // 8600****1234
            $table->string('cardholder_name', 200)->nullable();
            $table->json('transaction_data')->nullable(); // полная информация от PayMe
            $table->json('callback_data')->nullable(); // данные callback'ов
            $table->text('error_message')->nullable();
            $table->integer('attempt_count')->default(0); // Для 3 попыток
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            // Индексы
            $table->index(['status', 'created_at']);
            $table->index('external_payment_id');
            $table->index(['ticket_id', 'status']);
            $table->index('user_id');
        });
    }
};
```

### 6-22. Остальные таблицы (краткое описание)

```php
// 6. promocodes - Промокоды
Schema::create('promocodes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->string('code', 50)->unique();
    $table->string('name'); // Название в системе
    $table->enum('type', ['percent', 'amount']);
    $table->decimal('value', 10, 2);
    $table->integer('max_uses')->nullable();
    $table->integer('used_count')->default(0);
    $table->json('applicable_ticket_types')->nullable(); // null = все тарифы
    $table->boolean('is_active')->default(true);
    $table->date('valid_from')->nullable();
    $table->date('valid_until')->nullable();
    $table->timestamps();
});

// 7. corporate_discounts - Корпоративные скидки
Schema::create('corporate_discounts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->string('code', 50);
    $table->string('name'); // Название в системе
    $table->integer('min_people');
    $table->enum('type', ['percent', 'amount']);
    $table->decimal('value', 10, 2);
    $table->string('contact_phone', 20);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 8. event_materials - Материалы мероприятий
Schema::create('event_materials', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->json('title');
    $table->json('description')->nullable();
    $table->string('file_path', 500);
    $table->string('file_type', 50);
    $table->integer('file_size');
    $table->enum('access_level', ['before', 'during', 'after', 'always'])->default('always');
    $table->boolean('is_public')->default(false);
    $table->integer('download_count')->default(0);
    $table->timestamps();
});

// 9. event_partners - Партнеры мероприятий
Schema::create('event_partners', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->json('name');
    $table->string('logo', 500);
    $table->string('website_url', 500)->nullable();
    $table->json('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});

// 10. event_surveys - Опросы
Schema::create('event_surveys', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->json('title');
    $table->json('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->boolean('is_required')->default(false);
    $table->date('available_from')->nullable();
    $table->date('available_until')->nullable();
    $table->timestamps();
});

// 11. survey_questions - Вопросы опросов
Schema::create('survey_questions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('survey_id')->constrained('event_surveys')->onDelete('cascade');
    $table->json('question_text');
    $table->enum('question_type', ['text', 'textarea', 'select', 'multiselect']);
    $table->json('options')->nullable(); // Для select/multiselect
    $table->boolean('is_required')->default(false);
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});

// 12. survey_responses - Ответы на опросы
Schema::create('survey_responses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('survey_id')->constrained('event_surveys');
    $table->foreignId('question_id')->constrained('survey_questions');
    $table->foreignId('user_id')->constrained('users');
    $table->foreignId('ticket_id')->nullable()->constrained('tickets');
    $table->json('answer'); // Гибкое хранение ответов
    $table->timestamps();
});

// 13. blogs - Блог статьи
Schema::create('blogs', function (Blueprint $table) {
    $table->id();
    $table->json('title');
    $table->string('slug')->unique();
    $table->json('short_description');
    $table->json('content');
    $table->string('pc_image', 500)->nullable();
    $table->string('mobile_image', 500)->nullable();
    $table->json('keywords')->nullable(); // Для поиска
    $table->json('meta_title')->nullable();
    $table->json('meta_description')->nullable();
    $table->boolean('is_published')->default(false);
    $table->boolean('allow_comments')->default(true);
    $table->integer('views_count')->default(0);
    $table->timestamp('published_at')->nullable();
    $table->foreignId('author_id')->constrained('users');
    $table->timestamps();
    $table->softDeletes();
});

// 14. courses - Курсы
Schema::create('courses', function (Blueprint $table) {
    $table->id();
    $table->json('title');
    $table->string('slug')->unique();
    $table->json('short_description');
    $table->json('full_description');
    $table->string('pc_image', 500)->nullable();
    $table->string('mobile_image', 500)->nullable();
    $table->string('external_url', 500);
    $table->decimal('price', 10, 2)->nullable();
    $table->string('currency', 3)->default('UZS');
    $table->json('meta_title')->nullable();
    $table->json('meta_description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->boolean('is_featured')->default(false);
    $table->integer('click_count')->default(0);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});

// 15. partners - Глобальные партнеры
Schema::create('partners', function (Blueprint $table) {
    $table->id();
    $table->json('name');
    $table->string('logo', 500);
    $table->string('website_url', 500);
    $table->json('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->integer('click_count')->default(0);
    $table->timestamps();
});

// 16. banners - Рекламные баннеры
Schema::create('banners', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Название в системе
    $table->string('pc_image', 500);
    $table->string('mobile_image', 500);
    $table->string('link_url', 500);
    $table->enum('type', ['horizontal', 'vertical']);
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->integer('click_count')->default(0);
    $table->date('display_from')->nullable();
    $table->date('display_until')->nullable();
    $table->timestamps();
});

// 17. galleries - Галерея изображений
Schema::create('galleries', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained('gallery_categories');
    $table->json('title');
    $table->json('description')->nullable();
    $table->string('image_path', 500);
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});

// 18. gallery_categories - Категории галереи
Schema::create('gallery_categories', function (Blueprint $table) {
    $table->id();
    $table->json('name');
    $table->string('slug')->unique();
    $table->json('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});

// 19. contact_requests - Заявки обратной связи
Schema::create('contact_requests', function (Blueprint $table) {
    $table->id();
    $table->string('name', 200);
    $table->string('phone', 20);
    $table->string('email')->nullable();
    $table->text('message')->nullable();
    $table->enum('type', ['general', 'corporate_discount', 'partnership'])->default('general');
    $table->enum('status', ['new', 'processing', 'completed', 'closed'])->default('new');
    $table->text('admin_notes')->nullable();
    $table->foreignId('processed_by')->nullable()->constrained('users');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});

// 20. ticket_scans - История сканирований билетов
Schema::create('ticket_scans', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ticket_id')->constrained('tickets');
    $table->foreignId('scanned_by')->constrained('users');
    $table->enum('scan_result', ['success', 'already_used', 'invalid', 'expired']);
    $table->string('device_info')->nullable();
    $table->string('ip_address', 45)->nullable();
    $table->decimal('latitude', 10, 8)->nullable();
    $table->decimal('longitude', 11, 8)->nullable();
    $table->timestamps();
});

// 21. partner_clicks - Клики по партнерам
Schema::create('partner_clicks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('partner_id')->constrained('partners');
    $table->string('ip_address', 45);
    $table->string('user_agent')->nullable();
    $table->string('referer')->nullable();
    $table->json('device_info')->nullable();
    $table->timestamps();
});

// 22. banner_clicks - Клики по баннерам
Schema::create('banner_clicks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('banner_id')->constrained('banners');
    $table->string('ip_address', 45);
    $table->string('user_agent')->nullable();
    $table->string('referer')->nullable();
    $table->json('device_info')->nullable();
    $table->timestamps();
});
```

## 🔧 НАСТРОЙКИ POSTGRESQL

### Расширения для полнотекстового поиска:
```sql
-- В файле docker/postgres/init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Настройка полнотекстового поиска для русского языка
CREATE TEXT SEARCH CONFIGURATION ru (COPY = russian);
```

### Команды для запуска миграций:
```bash
# Создание всех миграций
php artisan make:migration create_users_table
php artisan make:migration create_events_table
# ... и так далее для всех 22 таблиц

# Запуск миграций
docker-compose exec php php artisan migrate

# Откат миграций (если нужно)
docker-compose exec php php artisan migrate:rollback

# Проверка статуса миграций
docker-compose exec php php artisan migrate:status
```

## ✅ КРИТЕРИИ ГОТОВНОСТИ

- [ ] Все 22 миграции созданы
- [ ] JSON поля настроены для мультиязычности
- [ ] Все foreign key связи корректны
- [ ] Индексы добавлены для производительности
- [ ] Soft deletes добавлены где нужно
- [ ] PostgreSQL расширения установлены
- [ ] Миграции успешно выполняются
- [ ] Схема БД оптимизирована для 100 пользователей

## 🔄 СТАТУС ВЫПОЛНЕНИЯ

**Текущий статус**: 📋 Готов к началу
**Зависимости**: Task 1 (завершен)
**Следующий шаг**: Создание файлов миграций
**Время выполнения**: ~4-6 часов 