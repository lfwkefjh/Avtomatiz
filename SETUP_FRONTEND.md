# 🚀 Настройка Frontend части проекта Avtomatiz

## ✅ Что уже готово

### 1. Базовая структура Next.js 14
- ✅ Создана папка `frontend/` с Next.js проектом
- ✅ Настроен TypeScript и ESLint
- ✅ Установлен Tailwind CSS с кастомной темой
- ✅ Добавлены зависимости: framer-motion, lucide-react, three.js

### 2. Дизайн система на основе Figma
- ✅ Настроены цвета из дизайна (#0184F4, #17101E, #31303D)
- ✅ Добавлены кастомные шрифты (Franklin Gothic Demi, Inter, Geist)
- ✅ Созданы размеры, отступы и анимации
- ✅ Темная тема по умолчанию

### 3. TypeScript типы и архитектура
- ✅ Полный набор интерфейсов для Event, Partner, Course, TeamMember, NewsArticle
- ✅ API типы с пагинацией и фильтрацией
- ✅ Типы для форм и UI компонентов
- ✅ Поддержка мультиязычности (ru/uz/en)

### 4. Утилиты и Mock данные
- ✅ DataService класс для работы с API
- ✅ Mock функции для разработки
- ✅ Утилиты для дат, валют, форматирования
- ✅ Валидация и обработка форм

### 5. Контейнеризация
- ✅ Production Dockerfile с многоэтапной сборкой
- ✅ Development Dockerfile с hot reload
- ✅ Docker-compose с nginx, postgres, redis
- ✅ Next.js конфигурация для standalone output

## 🔧 Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Application Configuration
APP_NAME=Avtomatiz
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost
APP_PORT=80
APP_SSL_PORT=443

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=avtomatiz
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_APP_URL=http://localhost
NEXT_PUBLIC_APP_NAME=Avtomatiz

# Payment Configuration (добавьте ваши данные)
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
```

## 🚀 Запуск проекта

### Вариант 1: Docker (рекомендуется)

```bash
# 1. Перейдите в корень проекта
cd /path/to/Avtomatiz

# 2. Создайте .env файл из примера выше

# 3. Запустите все сервисы
docker-compose up -d

# 4. Проверьте статус
docker-compose ps

# 5. Откройте в браузере
# Фронтенд: http://localhost
# Бэкенд API: http://localhost/api
```

### Вариант 2: Локальная разработка

```bash
# 1. Запустите бэкенд (Laravel)
cd Avtomatiz
composer install
php artisan serve --port=8000

# 2. В новом терминале запустите фронтенд
cd Avtomatiz/frontend
npm install
npm run dev

# 3. Откройте в браузере
# Фронтенд: http://localhost:3000
# Бэкенд API: http://localhost:8000/api
```

### Вариант 3: Только фронтенд в Docker

```bash
cd frontend
docker build -f Dockerfile.dev -t avtomatiz-frontend-dev .
docker run -p 3000:3000 -v $(pwd):/app avtomatiz-frontend-dev
```

## 🔍 Проверка работы

### 1. Фронтенд работает
- Откройте http://localhost (или :3000 для dev)
- Должна появиться стартовая страница Next.js

### 2. API подключение
- API запросы автоматически проксируются на бэкенд
- Проверьте в Network tab браузера

### 3. Hot reload (для разработки)
- Измените любой файл в `frontend/src/`
- Страница должна обновиться автоматически

## 📁 Структура проекта

```
Avtomatiz/
├── frontend/                 # Next.js фронтенд
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React компоненты
│   │   │   ├── ui/         # Базовые UI компоненты  
│   │   │   ├── layout/     # Header, Footer, Layout
│   │   │   ├── sections/   # Секции страниц
│   │   │   └── features/   # Бизнес-логика
│   │   ├── lib/            # Утилиты и API
│   │   ├── types/          # TypeScript типы
│   │   └── data/           # Mock данные
│   ├── public/             # Статические файлы
│   ├── Dockerfile          # Production контейнер
│   └── Dockerfile.dev      # Development контейнер
├── docker-compose.yml       # Оркестрация контейнеров
└── .env                    # Переменные окружения
```

## 🎯 Следующие шаги

Теперь можете приступить к разработке компонентов:

1. **Создание Header компонента** с навигацией и языковым переключателем
2. **Главная страница** с hero секцией и каталогом событий
3. **Карточки событий** с обратным отсчетом и информацией
4. **Страницы событий** с детальной информацией
5. **Формы** для покупки билетов и обратной связи

## ❓ Ответы на ваши вопросы

### 1. Архитектура контейнеров
Настроен docker-compose с отдельными сервисами для фронтенда, бэкенда, БД и nginx

### 2. Reverse proxy  
Nginx настроен как reverse proxy, проксирует фронтенд и API

### 3. Порты
- Фронтенд: 3000 (внутри контейнера), 80 (внешний через nginx)
- Бэкенд: 8000 (внутри контейнера), 80/api (через nginx)
- PostgreSQL: 5432

### 4. Hot reload
Есть отдельный Dockerfile.dev с поддержкой hot reload для разработки

### 5. База данных
PostgreSQL уже настроена в docker-compose

## 🔗 Полезные команды

```bash
# Логи всех сервисов
docker-compose logs -f

# Логи только фронтенда
docker-compose logs -f frontend

# Перестройка контейнеров
docker-compose up --build

# Остановка всех сервисов
docker-compose down

# Очистка данных
docker-compose down -v

# Вход в контейнер фронтенда
docker-compose exec frontend sh
```

Проект готов к разработке! 🎉 