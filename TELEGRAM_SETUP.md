# 🤖 Настройка Telegram бота для форм обратной связи

## 🎯 **Что получится:**

После отправки формы в Telegram придет сообщение:
```
🔔 Новая заявка на связь

📋 ID заявки: №1
👤 Имя: Иван Иванов  
📞 Телефон: +998 (90) 123-45-67
📝 Комментарий: Интересует сотрудничество

🌐 Заявка со страницы: Главная (RU)
📅 Дата, время: 25.12.2024, 14:30
📊 Статус заявки: новая

[📋 Взять в обработку] [✅ Закрыть заявку]
```

---

## 🚀 **Пошаговая настройка:**

### **1. Создание Telegram бота**

1. **Откройте Telegram** и найдите **@BotFather**
2. **Отправьте команду:** `/newbot`
3. **Введите название бота:** например "SellersAssociation Bot"
4. **Введите username бота:** например "sellers_association_bot"
5. **Получите токен** - скопируйте его! 
   ```
   Пример: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk
   ```

### **2. Получение Chat ID**

**Вариант A - Личные сообщения:**
1. Напишите своему боту любое сообщение
2. Откройте: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Найдите `"chat":{"id":123456789}` - это ваш Chat ID

**Вариант B - Группа (рекомендуется):**
1. Создайте группу в Telegram
2. Добавьте бота в группу и сделайте администратором
3. Напишите любое сообщение в группу
4. Откройте: `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Найдите Chat ID группы (начинается с минуса: `-1001234567890`)

### **3. Настройка переменных окружения**

Создайте файл `.env.local` в папке `frontend/`:

```bash
# Telegram Bot Configuration  
TELEGRAM_BOT_TOKEN=ВАШ_ТОКЕН_ОТ_BOTFATHER
TELEGRAM_CHAT_ID=ВАШ_CHAT_ID

# Для продакшена
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Пример:**
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk
TELEGRAM_CHAT_ID=-1001234567890
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

---

## ⚙️ **Проверка работы:**

### **1. Без настройки Telegram**
- Форма работает нормально
- Заявки сохраняются в памяти
- В консоль выводится сообщение которое отправилось бы в Telegram

### **2. С настроенным Telegram**
- Все заявки автоматически приходят в Telegram
- Кнопки "Взять в обработку" и "Закрыть заявку" (пока декоративные)
- Красивое форматирование с эмодзи

### **3. Тестирование**
1. Заполните форму на сайте
2. Нажмите "Отправить заявку"
3. Проверьте Telegram - должно прийти уведомление
4. В консоли браузера увидите лог с деталями заявки

---

## 🛠️ **Дополнительные возможности:**

### **Webhook для кнопок (будущее развитие):**
```javascript
// Обработка нажатий кнопок в Telegram
app.post('/api/telegram/webhook', (req, res) => {
  const { callback_query } = req.body;
  
  if (callback_query?.data.startsWith('process_')) {
    const id = callback_query.data.replace('process_', '');
    // Обновить статус заявки на "в обработке"
  }
  
  if (callback_query?.data.startsWith('close_')) {
    const id = callback_query.data.replace('close_', '');
    // Обновить статус заявки на "закрыта"
  }
});
```

### **Интеграция с админкой Laravel:**
```php
// В Laravel контроллере
public function getSubmissions() {
    return ContactSubmission::with(['user', 'status'])
        ->orderBy('created_at', 'desc')
        ->paginate(20);
}

public function updateStatus($id, $status) {
    $submission = ContactSubmission::findOrFail($id);
    $submission->update(['status' => $status]);
    
    // Уведомить в Telegram об изменении статуса
    TelegramService::sendStatusUpdate($submission);
}
```

---

## 📊 **API endpoints:**

### **POST /api/contact/submit**
Отправка новой заявки
```json
{
  "name": "Иван Иванов",
  "phone": "+998 (90) 123-45-67", 
  "comment": "Интересует сотрудничество",
  "locale": "ru",
  "page": "/ru"
}
```

### **GET /api/contact/submit**
Получение всех заявок (для админки)
```json
{
  "success": true,
  "submissions": [...],
  "total": 25
}
```

---

## 🔒 **Безопасность:**

1. **Никогда не коммитьте** `.env.local` в Git
2. **Используйте переменные окружения** на продакшене
3. **Ограничьте доступ к боту** - только администраторы
4. **Валидируйте данные** на сервере
5. **Rate limiting** для предотвращения спама

---

## 🎨 **Кастомизация сообщений:**

В файле `frontend/src/app/api/contact/submit/route.ts` можно изменить:

```typescript
// Форматирование сообщения
function formatTelegramMessage(submission: ContactSubmission): string {
  return `🔥 НОВАЯ ЗАЯВКА! 🔥
  
👤 Клиент: ${submission.name}
📱 Связь: ${submission.phone}
💬 Сообщение: ${submission.comment || 'не указано'}

🌍 Откуда: ${submission.page}
⏰ Когда: ${formatDate(submission.createdAt)}`;
}
```

**✅ Теперь форма обратной связи полностью готова к работе!** 