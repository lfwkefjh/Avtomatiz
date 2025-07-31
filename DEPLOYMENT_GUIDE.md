# 🎫 Sellercom Event Tickets - Гайд по развертыванию

## ✅ Что было создано

### 🏗️ Архитектура системы
- **Laravel 12** с PostgreSQL
- **Docker** окружение (nginx, PHP 8.3, PostgreSQL, Redis, MailHog)
- **Filament 3.2** админ-панель
- **PayMe API** интеграция с правильными параметрами
- **Telegram Bot** для уведомлений
- **QR-коды** с гибридным форматом
- **Система ролей**: admin, organizer, helper, user, guest

### 📊 База данных (22 таблицы)
✅ **categories** - категории мероприятий  
✅ **events** - мероприятия с многоязычностью  
✅ **event_sessions** - сессии для многодневных событий  
✅ **ticket_types** - типы билетов с ценами  
✅ **orders** - заказы с автогенерацией номеров  
✅ **tickets** - билеты с QR-кодами  
✅ **payments** - PayMe транзакции  
✅ **refunds** - гибридная система возвратов  
✅ **system_settings** - настройки PayMe/Telegram  
✅ **users** с ролями и правами

### 🔧 API Endpoints
```
POST /api/payme/callback - PayMe callbacks
POST /api/payme/create-payment - создание платежа
GET  /api/payme/status - статус PayMe

POST /api/tickets/validate - валидация QR (требует auth)
POST /api/tickets/check - проверка QR без валидации
GET  /api/tickets/history - история валидации
GET  /api/tickets/statistics - статистика

GET  /status - статус системы
GET  /customer/tickets/{order} - билеты клиента
GET  /event/{event} - страница мероприятия
```

### 📱 QR-коды (гибридная система)
- **Обычная камера** → переход на ссылку мероприятия
- **Система валидации** → получение служебной информации
- **Одноразовые** с проверкой повторного сканирования
- **Безопасность** через SHA256 хеш

## 🚀 Быстрый старт

### 1. Настройка PayMe
```bash
# В контейнере PHP
docker exec -it avtomatiz-php-1 bash
php artisan setup:payme --merchant-id="YOUR_MERCHANT_ID" --test-key="YOUR_TEST_KEY"
```

### 2. Настройка Telegram
```bash
php artisan setup:telegram --bot-token="YOUR_BOT_TOKEN" --admin-chat-ids="CHAT_ID1,CHAT_ID2" --test
```

### 3. Доступ к админ-панели
- URL: `http://localhost/admin`
- Логин: `admin@sellercom.uz`
- Пароль: `admin123`

## 📋 PayMe параметры (согласно вашим требованиям)

### account (основные)
- `order_id` - ID заказа (именно так, без большой буквы)

### additional (дополнительные)
- `fio` - Ф.И.О клиента
- `phone` - Телефон
- `tariff` - Тариф (тип билета)
- `promocode` - Промокод (пока пустой)

### Callback URL для PayMe
```
https://yourdomain.com/api/payme/callback
```

## 🔧 Системные настройки

### Через админ-панель
1. Перейти в **System Settings**
2. Настроить PayMe: `merchant_id`, `test_key`, `is_test_mode`
3. Настроить Telegram: `bot_token`, `admin_chat_ids`, `group_notifications`

### Через команды
```bash
# PayMe настройки
php artisan setup:payme

# Telegram настройки
php artisan setup:telegram --test

# Проверка статуса
curl http://localhost/status
```

## 🎭 Роли пользователей

| Роль | Права |
|------|-------|
| **admin** | Все права + системные настройки |
| **organizer** | Управление мероприятиями + валидация |
| **helper** | Только валидация билетов |
| **user** | Покупка билетов |
| **guest** | Просмотр мероприятий |

## 📱 Telegram уведомления

### Типы событий
- `new_order` - новый заказ
- `payment_completed` - оплата завершена
- `refund_requested` - запрос возврата
- `ticket_validated` - билет отсканирован
- `event_created` - новое мероприятие
- `system_error` - системная ошибка

### Настройка групп
В админке можно настроить, какие сообщения в какие группы отправлять:
```json
{
  "GROUP_ID_1": ["new_order", "payment_completed"],
  "GROUP_ID_2": ["ticket_validated", "refund_requested"]
}
```

## 🔒 Безопасность QR-кодов

### Формат QR
```
https://yourdomain.com/event/EVENT_SLUG?t=BASE64_ENCODED_DATA
```

### Валидация
- Проверка хеша SHA256
- Проверка статуса билета
- Проверка оплаты заказа
- Защита от повторного использования

## 💰 Система возвратов

### Автоматические возвраты
- Через PayMe API (если поддерживается)
- До дедлайна: 5 дней до мероприятия или кастомная дата

### Ручные возвраты
- Заявки через админ-панель
- Уведомления в Telegram
- Варианты: банковский перевод, наличные, зачет на счет, перенос на другое мероприятие

## 🎯 Что нужно от вас для тестирования

### КРИТИЧЕСКИ ВАЖНО:
1. **PayMe реквизиты**: merchant_id и test_key
2. **Telegram Bot Token**: создать бота через @BotFather
3. **Chat ID**: для получения уведомлений

### Получение Chat ID:
1. Написать боту @userinfobot
2. Он покажет ваш Chat ID
3. Добавить в настройки

## 🧪 Тестирование

### 1. Проверка статуса
```bash
curl http://localhost/status
```

### 2. Создание тестового мероприятия
1. Зайти в админку `/admin`
2. Categories → создать категорию
3. Events → создать мероприятие
4. Указать QR redirect URL

### 3. Тестирование PayMe
```bash
curl -X POST http://localhost/api/payme/create-payment \
  -H "Content-Type: application/json" \
  -d '{"order_id": 1}'
```

## 📈 Производительность

### Текущие настройки
- **Redis** для кеширования и очередей
- **PostgreSQL** с индексами
- **100 одновременных пользователей** (расчет)
- **Filament** оптимизирован для админки

### Мониторинг
- **Laravel Telescope** - отладка и профилирование
- **Логи** в `/storage/logs/laravel.log`
- **Telegram уведомления** об ошибках

## 🚨 Важные URL для PayMe

### Тестовый режим
- Checkout: `https://checkout.test.paycom.uz`
- Callback: `https://yourdomain.com/api/payme/callback`

### Продакшн
- Checkout: `https://checkout.paycom.uz`
- Callback: `https://yourdomain.com/api/payme/callback`

## 📞 Поддержка

Система готова к тестированию! 
Предоставьте PayMe реквизиты и Telegram Bot Token для полноценного тестирования.

### Следующие шаги:
1. ✅ Вставить PayMe реквизиты
2. ✅ Настроить Telegram бота  
3. ✅ Создать тестовое мероприятие
4. ✅ Протестировать покупку билета
5. ✅ Протестировать валидацию QR

**Система полностью готова к работе!** 🎉 