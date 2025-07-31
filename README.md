# Ассоциация селлеров Узбекистана

Полнофункциональный веб-сайт для Ассоциации селлеров Узбекистана с современным дизайном и многоязычной поддержкой.

## 🚀 Технологии

### Backend
- **Laravel 11** - PHP фреймворк
- **Filament** - Административная панель
- **MySQL/PostgreSQL** - База данных
- **Docker** - Контейнеризация

### Frontend
- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Framer Motion** - Анимации

## 📁 Структура проекта

```
Avtomatiz/
├── app/                    # Laravel приложение
├── frontend/              # Next.js приложение
├── Backapp/               # Дополнительный backend
├── docker/                # Docker конфигурация
├── database/              # Миграции и сидеры
├── resources/             # Laravel ресурсы
└── docs/                  # Документация
```

## 🛠️ Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd Avtomatiz
```

### 2. Настройка Laravel
```bash
# Установка зависимостей
composer install

# Копирование .env файла
cp .env.example .env

# Генерация ключа приложения
php artisan key:generate

# Запуск миграций
php artisan migrate

# Запуск сидеров
php artisan db:seed
```

### 3. Настройка Next.js
```bash
cd frontend
npm install
```

### 4. Запуск с Docker
```bash
# Запуск всех сервисов
docker-compose up -d

# Или запуск отдельных сервисов
docker-compose up -d mysql
docker-compose up -d php
docker-compose up -d nginx
```

### 5. Запуск в режиме разработки
```bash
# Laravel
php artisan serve

# Next.js
cd frontend
npm run dev
```

## 🌐 Доступные URL

- **Главная страница**: `http://localhost:3000`
- **Админ панель**: `http://localhost/admin`
- **API**: `http://localhost/api`

## 📱 Функциональность

### Для пользователей
- ✅ Многоязычная поддержка (RU, EN, UZ)
- ✅ Адаптивный дизайн
- ✅ Интерактивные компоненты
- ✅ Форма обратной связи
- ✅ Новости и события
- ✅ FAQ система
- ✅ Видео галерея

### Для администраторов
- ✅ Управление контентом
- ✅ Управление пользователями
- ✅ Аналитика и статистика
- ✅ Система уведомлений
- ✅ Управление событиями

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env` на основе `.env.example`:

```env
APP_NAME="Ассоциация селлеров Узбекистана"
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=avtomatiz
DB_USERNAME=root
DB_PASSWORD=

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# PayMe
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
```

## 📊 Аналитика

Проект включает встроенную систему аналитики:
- Отслеживание просмотров страниц
- Аналитика взаимодействий с видео
- Статистика форм
- Отслеживание событий

## 🚀 Деплой

### Продакшн
```bash
# Сборка Next.js
cd frontend
npm run build

# Оптимизация Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Docker продакшн
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Документация

Подробная документация находится в папке `docs/`:
- [Система партнерства](docs/partnerships-system.md)
- [Технические решения](TECHNICAL_DECISIONS.md)
- [Руководство по оптимизации](OPTIMIZATION_SUMMARY.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект является частной собственностью Ассоциации селлеров Узбекистана.

## 📞 Поддержка

По вопросам поддержки обращайтесь:
- Email: support@example.com
- Telegram: @support_bot

---

**Разработано с ❤️ для развития e-commerce в Узбекистане**
