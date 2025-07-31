# 🧪 ТЕСТИРОВАНИЕ PayMe и SMS через NGROK

## 📋 ОБЩЕЕ ОПИСАНИЕ

Это руководство поможет вам протестировать интеграции PayMe и Eskiz SMS до деплоя на сервер, используя ngrok для создания публичных URL.

---

## 🚀 УСТАНОВКА И НАСТРОЙКА NGROK

### 1. Установка ngrok
```bash
# Через npm (глобально)
npm install -g ngrok

# Или скачать с официального сайта
# https://ngrok.com/download
```

### 2. Регистрация и получение токена
```bash
# Зарегистрируйтесь на ngrok.com
# Получите свой authtoken из дашборда

# Авторизация
ngrok authtoken YOUR_AUTHTOKEN_HERE
```

### 3. Запуск туннеля
```bash
# Запуск Laravel сервера
php artisan serve --host=0.0.0.0 --port=8000

# В новом терминале - создание туннеля
ngrok http 8000

# Результат будет выглядеть так:
# https://abc123def.ngrok.io -> http://localhost:8000
```

---

## 💳 ТЕСТИРОВАНИЕ PayMe

### 1. Настройка PayMe для тестирования

#### В .env файле:
```env
# PayMe тестовые настройки
PAYME_MERCHANT_ID=your_test_merchant_id
PAYME_SECRET_KEY=your_test_secret_key
PAYME_TEST_MODE=true

# NGROK URL для callback'ов
PAYME_CALLBACK_URL=https://abc123def.ngrok.io/api/payments/payme/callback
PAYME_SUCCESS_URL=https://abc123def.ngrok.io/tickets/success
PAYME_CANCEL_URL=https://abc123def.ngrok.io/tickets/cancel
```

#### Настройка в PayMe личном кабинете:
```
Callback URL: https://abc123def.ngrok.io/api/payments/payme/callback
Success URL: https://abc123def.ngrok.io/tickets/success/{order_id}
Cancel URL: https://abc123def.ngrok.io/tickets/cancel/{order_id}
```

### 2. Создание тестового маршрута PayMe

```php
// routes/api.php
Route::post('/payments/payme/callback', [PaymentController::class, 'paymeCallback']);
Route::get('/test-payme', [PaymentController::class, 'testPayMe']);
```

### 3. Тестовый контроллер PayMe

```php
// app/Http/Controllers/PaymentController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function testPayMe()
    {
        // Тестовые данные для PayMe
        $orderData = [
            'order_id' => 'TEST-' . time(),
            'amount' => 50000, // 500 сум в тийинах
            'fio' => 'Тестовый Пользователь',
            'phone' => '+998901234567',
            'tariff' => 'Стандартный',
            'promocode' => 'TEST2025'
        ];

        // Создание PayMe ссылки
        $paymeUrl = $this->createPayMeUrl($orderData);

        return response()->json([
            'success' => true,
            'payme_url' => $paymeUrl,
            'order_data' => $orderData
        ]);
    }

    public function paymeCallback(Request $request)
    {
        Log::info('PayMe Callback received:', [
            'headers' => $request->headers->all(),
            'body' => $request->all(),
            'raw_body' => $request->getContent()
        ]);

        // Валидация подписи PayMe
        $signature = $request->header('X-PayMe-Signature');
        $expectedSignature = hash_hmac('sha256', $request->getContent(), config('payme.secret_key'));
        
        if (!hash_equals($signature, $expectedSignature)) {
            Log::error('PayMe: Invalid signature');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $data = $request->json()->all();
        
        // Обработка различных типов callback'ов
        switch ($data['method'] ?? '') {
            case 'CheckPerformTransaction':
                return $this->checkPerformTransaction($data);
            case 'CreateTransaction':
                return $this->createTransaction($data);
            case 'PerformTransaction':
                return $this->performTransaction($data);
            case 'CancelTransaction':
                return $this->cancelTransaction($data);
            case 'CheckTransaction':
                return $this->checkTransaction($data);
        }

        return response()->json(['error' => 'Unknown method'], 400);
    }

    private function createPayMeUrl($orderData)
    {
        $merchantId = config('payme.merchant_id');
        $params = [
            'm' => $merchantId,
            'ac.order_id' => $orderData['order_id'],
            'a' => $orderData['amount'],
            'c' => urlencode($orderData['fio'] . ' | ' . $orderData['tariff']),
            'l' => 'ru'
        ];

        return 'https://checkout.test.paycom.uz/?' . http_build_query($params);
    }
}
```

### 4. Логирование PayMe транзакций

```php
// app/Models/PaymeTransaction.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymeTransaction extends Model
{
    protected $fillable = [
        'payme_transaction_id',
        'payme_time',
        'order_id',
        'amount',
        'state',
        'reason',
        'receivers',
        'perform_time',
        'cancel_time',
        'raw_data'
    ];

    protected $casts = [
        'raw_data' => 'array',
        'receivers' => 'array'
    ];
}
```

### 5. Тестирование PayMe транзакций

```bash
# 1. Запуск Laravel + ngrok
php artisan serve --host=0.0.0.0 --port=8000
ngrok http 8000

# 2. Тестовый запрос создания платежа
curl -X GET "https://abc123def.ngrok.io/api/test-payme"

# 3. Переход по полученной PayMe ссылке
# 4. Оплата тестовой картой PayMe
# 5. Проверка логов callback'ов
tail -f storage/logs/laravel.log | grep PayMe
```

---

## 📱 ТЕСТИРОВАНИЕ SMS (Eskiz.uz)

### 1. Настройка Eskiz для тестирования

#### В .env файле:
```env
# Eskiz тестовые настройки
ESKIZ_API_URL=https://notify.eskiz.uz/api
ESKIZ_EMAIL=your_test_email@example.com
ESKIZ_PASSWORD=your_test_password
ESKIZ_FROM=4546
ESKIZ_TEST_MODE=true

# NGROK URL для webhook'ов
ESKIZ_WEBHOOK_URL=https://abc123def.ngrok.io/api/sms/webhook
```

### 2. Сервис для работы с Eskiz

```php
// app/Services/SMS/EskizService.php
<?php

namespace App\Services\SMS;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class EskizService
{
    protected $apiUrl;
    protected $email;
    protected $password;
    protected $from;

    public function __construct()
    {
        $this->apiUrl = config('eskiz.api_url');
        $this->email = config('eskiz.email');
        $this->password = config('eskiz.password');
        $this->from = config('eskiz.from');
    }

    public function sendSMS($phone, $message)
    {
        try {
            $token = $this->getAuthToken();
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ])->post($this->apiUrl . '/message/sms/send', [
                'mobile_phone' => $phone,
                'message' => $message,
                'from' => $this->from,
                'callback_url' => config('eskiz.webhook_url')
            ]);

            Log::info('Eskiz SMS sent:', [
                'phone' => $phone,
                'message' => $message,
                'response' => $response->json()
            ]);

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Eskiz SMS error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendVerificationCode($phone)
    {
        $code = rand(10000, 99999);
        $message = "Ваш код подтверждения для регистрации на сайте Sellercom.uz: {$code}";
        
        // Сохраняем код в кэше на 5 минут
        Cache::put("verification_code_{$phone}", $code, 300);
        
        return $this->sendSMS($phone, $message);
    }

    private function getAuthToken()
    {
        $cacheKey = 'eskiz_auth_token';
        
        return Cache::remember($cacheKey, 3600, function () {
            $response = Http::post($this->apiUrl . '/auth/login', [
                'email' => $this->email,
                'password' => $this->password
            ]);

            if ($response->successful()) {
                return $response->json()['data']['token'];
            }

            throw new \Exception('Failed to authenticate with Eskiz');
        });
    }
}
```

### 3. Тестовые маршруты для SMS

```php
// routes/api.php
Route::post('/sms/webhook', [SMSController::class, 'eskizWebhook']);
Route::get('/test-sms/{phone}', [SMSController::class, 'testSMS']);
Route::post('/verify-code', [SMSController::class, 'verifyCode']);
```

### 4. Контроллер для тестирования SMS

```php
// app/Http/Controllers/SMSController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\SMS\EskizService;

class SMSController extends Controller
{
    protected $eskizService;

    public function __construct(EskizService $eskizService)
    {
        $this->eskizService = $eskizService;
    }

    public function testSMS($phone)
    {
        // Валидация номера телефона
        if (!preg_match('/^\+998\d{9}$/', $phone)) {
            return response()->json([
                'error' => 'Invalid phone format. Use +998XXXXXXXXX'
            ], 400);
        }

        $result = $this->eskizService->sendVerificationCode($phone);

        return response()->json([
            'success' => (bool)$result,
            'phone' => $phone,
            'eskiz_response' => $result
        ]);
    }

    public function verifyCode(Request $request)
    {
        $phone = $request->input('phone');
        $code = $request->input('code');

        $cachedCode = Cache::get("verification_code_{$phone}");

        if ($cachedCode && $cachedCode == $code) {
            Cache::forget("verification_code_{$phone}");
            return response()->json(['success' => true, 'message' => 'Code verified']);
        }

        return response()->json(['success' => false, 'message' => 'Invalid or expired code'], 400);
    }

    public function eskizWebhook(Request $request)
    {
        Log::info('Eskiz Webhook received:', [
            'headers' => $request->headers->all(),
            'body' => $request->all()
        ]);

        // Обработка статуса доставки SMS
        $data = $request->all();
        
        if (isset($data['status'])) {
            // Обновление статуса SMS в БД
            Log::info('SMS delivery status:', [
                'message_id' => $data['id'] ?? null,
                'status' => $data['status'],
                'phone' => $data['phone'] ?? null
            ]);
        }

        return response()->json(['success' => true]);
    }
}
```

### 5. Тестирование SMS функционала

```bash
# 1. Запуск Laravel + ngrok (если еще не запущен)
php artisan serve --host=0.0.0.0 --port=8000
ngrok http 8000

# 2. Тестирование отправки SMS
curl -X GET "https://abc123def.ngrok.io/api/test-sms/+998901234567"

# 3. Тестирование верификации кода
curl -X POST "https://abc123def.ngrok.io/api/verify-code" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567", "code": "12345"}'

# 4. Проверка логов SMS
tail -f storage/logs/laravel.log | grep Eskiz
```

---

## 🔄 КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ

### 1. Полный цикл покупки билета

```php
// routes/web.php (для браузерного тестирования)
Route::get('/test-full-flow', function () {
    return view('test-purchase');
});
```

```html
<!-- resources/views/test-purchase.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Тест покупки билета</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Тестирование покупки билета</h1>
    
    <form id="purchaseForm">
        <div>
            <label>Телефон:</label>
            <input type="text" name="phone" value="+998901234567" required>
        </div>
        <div>
            <label>Ф.И.О.:</label>
            <input type="text" name="name" value="Тестовый Пользователь" required>
        </div>
        <div>
            <label>Email:</label>
            <input type="email" name="email" value="test@example.com" required>
        </div>
        <div>
            <label>Промокод:</label>
            <input type="text" name="promocode" value="TEST2025">
        </div>
        <button type="submit">Купить билет</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('purchaseForm').onsubmit = async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                // 1. Регистрация пользователя
                const regResponse = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Registration:', await regResponse.json());
                
                // 2. Создание заказа
                const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        event_id: 1,
                        tariff_id: 1,
                        quantity: 1,
                        ...data
                    })
                });
                
                const orderResult = await orderResponse.json();
                console.log('Order:', orderResult);
                
                // 3. Переход на PayMe
                if (orderResult.payme_url) {
                    window.open(orderResult.payme_url, '_blank');
                }
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('result').innerHTML = 'Ошибка: ' + error.message;
            }
        };
    </script>
</body>
</html>
```

### 2. Мониторинг в реальном времени

```bash
# Терминал 1: Laravel логи
tail -f storage/logs/laravel.log

# Терминал 2: Nginx логи (если используется)
tail -f /var/log/nginx/access.log

# Терминал 3: ngrok статистика
# Откройте http://localhost:4040 в браузере
```

---

## 📊 ОТЛАДКА И МОНИТОРИНГ

### 1. Полезные команды для отладки

```bash
# Проверка статуса ngrok
curl -s http://localhost:4040/api/tunnels | jq '.'

# Тест доступности callback URL
curl -X POST "https://abc123def.ngrok.io/api/payments/payme/callback" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Проверка SMS webhook
curl -X POST "https://abc123def.ngrok.io/api/sms/webhook" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered", "id": "123", "phone": "+998901234567"}'
```

### 2. Логирование для отладки

```php
// config/logging.php - добавить канал для тестирования
'channels' => [
    'ngrok_test' => [
        'driver' => 'single',
        'path' => storage_path('logs/ngrok_test.log'),
        'level' => 'debug',
    ],
],

// Использование в коде
Log::channel('ngrok_test')->info('PayMe callback:', $request->all());
```

### 3. Middleware для отладки

```php
// app/Http/Middleware/LogRequests.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogRequests
{
    public function handle($request, Closure $next)
    {
        Log::info('Incoming request:', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'body' => $request->all()
        ]);

        $response = $next($request);

        Log::info('Outgoing response:', [
            'status' => $response->getStatusCode(),
            'content' => $response->getContent()
        ]);

        return $response;
    }
}
```

---

## ✅ ЧЕКЛИСТ ТЕСТИРОВАНИЯ

### PayMe:
- [ ] Callback URL доступен через ngrok
- [ ] Тестовые транзакции создаются
- [ ] Signature валидация работает
- [ ] Success/Cancel редиректы функционируют
- [ ] Логирование callback'ов настроено
- [ ] 3 попытки обработки тестируются

### SMS (Eskiz):
- [ ] Аутентификация в Eskiz API работает
- [ ] SMS отправляются на тестовые номера
- [ ] Коды верификации генерируются и проверяются
- [ ] Webhook'и получаются и обрабатываются
- [ ] Статусы доставки логируются

### Общее:
- [ ] ngrok туннель стабилен
- [ ] Все API endpoints доступны
- [ ] Логирование подробное и информативное
- [ ] Ошибки обрабатываются корректно
- [ ] Тестирование полного цикла покупки

---

## 🚨 ЧАСТО ВСТРЕЧАЮЩИЕСЯ ПРОБЛЕМЫ

### 1. ngrok туннель недоступен
```bash
# Проверка статуса
curl -I https://abc123def.ngrok.io

# Перезапуск ngrok
ngrok http 8000 --region eu
```

### 2. PayMe callback не приходят
- Проверить URL в PayMe личном кабинете
- Убедиться что Laravel сервер запущен
- Проверить Firewall настройки

### 3. SMS не отправляются
- Проверить баланс в Eskiz кабинете  
- Валидировать формат номера телефона
- Проверить токен авторизации

### 4. CSRF ошибки
```php
// В VerifyCsrfToken middleware добавить исключения
protected $except = [
    'api/payments/payme/callback',
    'api/sms/webhook',
];
```

---

## 🎯 ЗАКЛЮЧЕНИЕ

После успешного тестирования через ngrok все интеграции будут готовы для деплоя на продакшен сервер. Сохраните все логи тестирования для дальнейшего анализа и оптимизации.

**Важно**: Не забудьте изменить URL'ы на продакшен после деплоя! 