# 🔍 ИССЛЕДОВАТЕЛЬСКИЕ ЗАДАЧИ

> **Критично важно для архитектуры проекта!**  
> Эти исследования определят техническую реализацию ключевых компонентов.

---

## 💰 PayMe API - Автоматические возвраты (ОБНОВЛЕНО)

### Найденная информация:

#### ✅ Что удалось выяснить:
1. **PayMe (paycom.uz)** - узбекская платежная система
2. **Существует Python SDK** - payme-pkg с открытым исходным кодом
3. **Документация**: docs.pay-tech.uz (неофициальная), официальная закрыта
4. **GitHub проекты показывают наличие** `handle_cancelled_payment` методов

#### 🔍 Анализ payme-pkg:
```python
# В SDK есть обработчики:
def handle_created_payment(self, params, result, *args, **kwargs):
    # Создание платежа
    
def handle_successfully_payment(self, params, result, *args, **kwargs):
    # Успешный платеж
    
def handle_cancelled_payment(self, params, result, *args, **kwargs):
    # Отмененный платеж - ЭТО ВАЖНО!
```

### ❗ Критичные вопросы остаются:
1. **Инициация отмены**: Может ли мерчант отменить платеж через API?
2. **Временные ограничения**: В течение какого времени можно отменить?
3. **Типы отмен**: Полная отмена vs частичный возврат?
4. **Комиссии**: Взимается ли комиссия за отмену?

### 🎯 План действий:
**СРОЧНО ТРЕБУЕТСЯ:**
1. **Связаться с PayMe support** для получения полной документации API
2. **Протестировать sandbox** с вашими credentials
3. **Изучить merchant dashboard** на предмет функций возврата

### 💡 Рекомендация архитектуры:
**Реализуем ГИБРИДНЫЙ подход:**

```php
// Универсальная система возвратов
class RefundService 
{
    public function requestRefund($ticket_id, $reason, $amount = null)
    {
        $ticket = Ticket::find($ticket_id);
        
        // Пытаемся автоматический возврат через PayMe
        try {
            $result = PayMe::refund($ticket->payment_id, $amount ?? $ticket->final_price);
            
            if ($result->success) {
                // Автоматический возврат успешен
                $ticket->update(['status' => 'refunded']);
                return ['type' => 'automatic', 'result' => $result];
            }
        } catch (PayMeApiException $e) {
            // API возврата недоступно или ошибка
            Log::warning("PayMe refund failed: " . $e->getMessage());
        }
        
        // Создаем заявку на ручной возврат
        $request = RefundRequest::create([
            'ticket_id' => $ticket_id,
            'reason' => $reason,
            'amount' => $amount ?? $ticket->final_price,
            'status' => 'pending',
            'account_info' => $this->getRefundAccountInfo($ticket)
        ]);
        
        // Уведомляем администраторов в Telegram
        TelegramService::sendRefundRequest($request);
        
        return ['type' => 'manual', 'request_id' => $request->id];
    }
}
```

---

## 🔔 Push-уведомления - Выбор решения (ФИНАЛИЗИРОВАН)

### ✅ **РЕШЕНИЕ ПРИНЯТО: OneSignal**

#### Почему OneSignal:
1. **Быстрая интеграция** - MVP за несколько часов
2. **Бесплатный план** до 30,000 пользователей 
3. **Готовая аналитика** - клики, открытия, конверсии
4. **Поддержка всех браузеров** - Chrome, Firefox, Safari, Edge
5. **A/B тестирование** из коробки

#### Техническая реализация:
```php
// Установка
composer require ladumor/one-signal

// Конфигурация .env
ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_REST_API_KEY=your-api-key

// Отправка уведомления
OneSignal::sendNotificationToUser([
    'contents' => [
        'ru' => 'Ваш билет подтвержден!',
        'uz' => 'Sizning chiptangiz tasdiqlandi!',
        'en' => 'Your ticket is confirmed!'
    ],
    'headings' => [
        'ru' => 'Покупка билета',
        'uz' => 'Chipta sotib olish', 
        'en' => 'Ticket Purchase'
    ],
    'include_external_user_ids' => [$user_id],
    'data' => [
        'ticket_id' => $ticket_id,
        'event_id' => $event_id,
        'type' => 'ticket_purchased'
    ],
    'url' => "https://sellercom.uz/tickets/{$ticket_id}"
]);
```

#### Миграция на собственное решение:
- **Когда**: При росте до 25,000+ активных пользователей
- **Зачем**: Снижение зависимости, кастомизация, экономия

---

## 📊 Аналитика - События и метрики (ОБНОВЛЕНО)

### ✅ **ФИНАЛЬНАЯ СТРУКТУРА СОБЫТИЙ:**

#### 🎫 Воронка покупки билетов:
```php
// 1. Просмотр мероприятия
Analytics::track('event_viewed', [
    'event_id' => $event_id,
    'source' => 'direct|search|social|email',
    'utm_campaign' => $utm_campaign
]);

// 2. Начало выбора билета
Analytics::track('ticket_selection_started', [
    'event_id' => $event_id,
    'ticket_types_available' => $types_count
]);

// 3. Выбор тарифа
Analytics::track('ticket_type_selected', [
    'event_id' => $event_id,
    'ticket_type_id' => $ticket_type_id,
    'price' => $price
]);

// 4. Применение промокода
Analytics::track('promocode_applied', [
    'event_id' => $event_id,
    'promocode' => $code,
    'discount_amount' => $discount
]);

// 5. Начало оплаты
Analytics::track('payment_started', [
    'event_id' => $event_id,
    'amount' => $total_amount,
    'payment_method' => 'payme'
]);

// 6. Успешная покупка
Analytics::track('ticket_purchased', [
    'event_id' => $event_id,
    'ticket_id' => $ticket_id,
    'revenue' => $final_amount,
    'currency' => 'UZS'
]);
```

#### 📈 Маркетинговые события:
```php
// Клики по баннерам
Analytics::track('banner_clicked', [
    'banner_id' => $banner_id,
    'position' => 'header|sidebar|content',
    'campaign' => $campaign_name
]);

// Переходы к партнерам
Analytics::track('partner_clicked', [
    'partner_id' => $partner_id,
    'source_page' => $current_page,
    'partner_name' => $partner_name
]);

// Активность в блоге
Analytics::track('blog_read', [
    'article_id' => $article_id,
    'reading_time' => $seconds_spent,
    'scroll_depth' => $percentage
]);
```

#### 📊 Дашборд метрики:
1. **Конверсия воронки**: просмотр → выбор → покупка
2. **AOV (средний чек)**: по мероприятиям и типам билетов  
3. **Источники трафика**: органика, реклама, соцсети
4. **Эффективность промокодов**: использование, конверсия
5. **ROI партнеров**: клики → конверсии
6. **Поведенческие метрики**: время на сайте, bounce rate

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ (ПРИОРИТЕТНЫЕ):

### 🚨 Критично важно (на этой неделе):
1. **[СРОЧНО] PayMe API исследование**
   - Связаться с PayMe support
   - Получить тестовые credentials 
   - Протестировать возможности возврата

2. **[В РАБОТЕ] Настройка OneSignal**
   - Создать аккаунт OneSignal
   - Интегрировать с Laravel
   - Настроить первые уведомления

3. **[ГОТОВО] Структура аналитики**
   - События определены ✅
   - Структура данных готова ✅
   - Нужна реализация

### 📋 Чек-лист готовности:
- [ ] **PayMe возвраты исследованы** (в процессе)
- [x] **Push уведомления сервис выбран** (OneSignal)
- [x] **События аналитики определены** (финализированы)
- [x] **Архитектура QR-кодов проработана** (ID+Hash+офлайн)
- [x] **Мультиязычность спланирована** (JSON поля)
- [x] **Система уведомлений спроектирована** (мультиканальная)

### ⏰ Дедлайн: 
**PayMe API исследование должно быть завершено до начала разработки системы платежей!**

---

## 🔗 Полезные ссылки:
- [PayMe SDK (Python)](https://github.com/Muhammadali-Akbarov/payme-pkg)
- [OneSignal Laravel](https://github.com/ladumor/one-signal)
- [PayMe Support](https://help.paycom.uz/) (если доступно)

**Статус исследований: 80% завершено** 