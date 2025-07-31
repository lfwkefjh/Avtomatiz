# Ассоциация Селлеров Узбекистана - Frontend

Современный многоязычный сайт для Ассоциации Селлеров Узбекистана, построенный на Next.js 14.

## 🚀 Технологический стек

- **Framework**: Next.js 14 с App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Utilities**: date-fns, lodash

## 📁 Структура проекта

```
frontend/
├── src/
│   ├── app/[locale]/              # Мультиязычные страницы
│   │   ├── page.tsx              # Главная страница
│   │   ├── events/               # Мероприятия
│   │   ├── services/             # Услуги
│   │   ├── sellers/              # Селлеры
│   │   ├── partners/             # Партнеры
│   │   ├── news/                 # Новости
│   │   ├── about/                # О нас
│   │   ├── contacts/             # Контакты
│   │   ├── profile/              # Личный кабинет
│   │   ├── offer/                # Публичная оферта
│   │   ├── privacy/              # Политика конфиденциальности
│   │   └── refund/               # Условия возврата
│   ├── components/
│   │   ├── ui/                   # Базовые UI компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/               # Layout компоненты
│   │   │   └── Header.tsx
│   │   └── sections-main/        # Секции главной страницы
│   ├── data/
│   │   ├── translations/         # Файлы переводов
│   │   │   ├── ru.json
│   │   │   ├── uz.json
│   │   │   └── en.json
│   │   └── mock/                 # Мок данные
│   └── styles/
│       └── variables.css         # CSS переменные
├── middleware.ts                 # Middleware для мультиязычности
└── tailwind.config.ts           # Конфигурация Tailwind
```

## 🎨 Цветовая схема

- **Основной синий**: `#0184F4` (hover, акценты)
- **Вторичный синий**: `#0283F7` (уведомления)
- **Темно-синий**: `#121353` (фоны, overlay 65%)
- **Градиенты**: `#0184F4 → #8B5CF6`
- **Текст**: `#1F2937` (темный), `#6B7280` (серый)

## 🌐 Мультиязычность

Поддерживаются языки:
- **RU** - Русский (по умолчанию)
- **UZ** - O'zbek
- **EN** - English

### URL структура:
- `/ru/` - Русская версия
- `/uz/` - Узбекская версия  
- `/en/` - Английская версия

## 🔧 Установка и запуск

### Требования
- Node.js 18+
- npm или yarn

### Установка зависимостей
\`\`\`bash
npm install
\`\`\`

### Запуск в режиме разработки
\`\`\`bash
npm run dev
\`\`\`

### Сборка для production
\`\`\`bash
npm run build
npm run start
\`\`\`

### Другие команды
\`\`\`bash
# Линтинг
npm run lint
npm run lint:fix

# Форматирование
npm run format
npm run format:check

# Тестирование
npm run test
npm run test:watch
npm run test:e2e

# Анализ bundle
npm run analyze

# Проверка типов
npm run type-check
\`\`\`

## 📱 Компоненты UI

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  Кнопка
</Button>

// Варианты: primary, secondary, gradient, outline, ghost
// Размеры: sm, md, lg, xl
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    Содержимое карточки
  </CardContent>
</Card>
```

### Input
```tsx
import { Input } from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  error="Неверный email"
  required
/>
```

### Modal
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Заголовок модального окна"
>
  Содержимое модального окна
</Modal>
```

## 🎯 Готовые страницы

Все страницы созданы с базовой структурой и готовы для интеграции с Figma:

1. **Главная** (`/`) - Hero секция + блоки возможностей
2. **Мероприятия** (`/events`) - Сетка мероприятий
3. **Услуги** (`/services`) - Каталог услуг
4. **Селлеры** (`/sellers`) - Участники ассоциации
5. **Партнеры** (`/partners`) - Логотипы партнеров
6. **Новости** (`/news`) - Лента новостей
7. **О нас** (`/about`) - Информация об ассоциации
8. **Контакты** (`/contacts`) - Контактная форма
9. **Профиль** (`/profile`) - Страница входа/регистрации
10. **Правовые страницы** - Оферта, конфиденциальность, возврат

## 🔄 Следующие шаги

Проект готов для интеграции дизайна из Figma:

1. **Получение данных из Figma** - готов к получению компонентов и макетов
2. **Создание секций главной страницы** - HeroSection, EventsSection, PartnersSection и др.
3. **Настройка анимаций** - Framer Motion уже подключен
4. **Интеграция с API** - TanStack Query настроен
5. **Формы с валидацией** - React Hook Form + Zod готовы к использованию

## 📞 Контакты

При возникновении вопросов по разработке:
- Email: dev@sellers-uz.org
- Telegram: @sellers_uz_dev

---

**Статус проекта**: ✅ Готов к интеграции дизайна из Figma
**Версия**: 1.0.0
**Дата создания**: 25 января 2024
