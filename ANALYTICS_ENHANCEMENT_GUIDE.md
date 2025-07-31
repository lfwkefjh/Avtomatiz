# 📊 Руководство по Расширенной Аналитике

## 🎯 Обзор обновлений

Система аналитики была значительно расширена для включения:
- ✅ **Детекции устройств** для всех блоков (FAQ, новости, видео)
- ✅ **Трекинга процента просмотра видео**
- ✅ **Подробной статистики по браузерам и ОС**
- ✅ **Времени просмотра видео**

## 🖥️ Детекция устройств

### 📱 Типы устройств:
- `mobile` - мобильные устройства
- `tablet` - планшеты
- `desktop` - настольные компьютеры

### 🌐 Браузеры:
- `chrome`, `firefox`, `safari`, `edge`, `opera`

### 💻 Операционные системы:
- `windows`, `macos`, `linux`, `android`, `ios`

### 📊 Что отслеживается:
```typescript
{
  device: 'mobile' | 'tablet' | 'desktop',
  browser: 'chrome' | 'firefox' | 'safari' | ...,
  os: 'windows' | 'macos' | 'android' | ...,
  screenSize: '1920x1080'
}
```

## 🎥 Аналитика видео

### 📈 Новые метрики:
- **Время просмотра** (в миллисекундах)
- **Процент просмотра** (0-100%)
- **Полные просмотры** (> 80% видео)
- **Средний процент просмотра**

### 📋 События видео:
```typescript
// При запуске видео
{
  event: 'video_play',
  videoId: 'video-001',
  videoTitle: 'Название видео',
  videoType: 'youtube' | 'local',
  device: 'desktop',
  browser: 'chrome',
  os: 'windows'
}

// При остановке видео
{
  event: 'video_stop',
  videoId: 'video-001',
  watchTime: 45000, // 45 секунд
  watchedPercentage: 75, // 75% просмотра
  device: 'mobile',
  browser: 'safari',
  os: 'ios'
}
```

## 📰 Аналитика новостей

### 🔄 Обновления:
- ✅ Информация об устройстве во всех событиях
- ✅ Статистика по браузерам и ОС
- ✅ Разбивка по типам устройств

### 📋 События новостей:
```typescript
{
  event: 'news_card_view',
  newsId: 'news-001',
  newsTitle: 'Заголовок новости',
  category: 'События',
  device: 'tablet',
  browser: 'chrome',
  os: 'android',
  readTime: 180 // секунды
}
```

## ❓ Аналитика FAQ

### 🔄 Обновления:
- ✅ Информация об устройстве в событиях ховера
- ✅ Разбивка по устройствам в статистике

## 🔧 API Endpoint

### 📊 GET `/api/analytics/track`
Возвращает расширенную статистику:

```json
{
  "success": true,
  "totalEntries": 1500,
  "faqStats": [...],
  "newsStats": [
    {
      "id": "news-001",
      "title": "Заголовок",
      "totalViews": 245,
      "devices": {
        "desktop": 150,
        "mobile": 70,
        "tablet": 25
      },
      "browsers": {
        "chrome": 180,
        "firefox": 35,
        "safari": 30
      },
      "operatingSystems": {
        "windows": 120,
        "android": 60,
        "ios": 40,
        "macos": 25
      }
    }
  ],
  "videoStats": [
    {
      "id": "video-001", 
      "title": "Название видео",
      "totalPlays": 89,
      "watchTimeStats": {
        "avgWatchTime": 32000,
        "maxWatchTime": 120000,
        "totalWatchTime": 2848000
      },
      "watchPercentageStats": {
        "avgPercentage": 67.5,
        "maxPercentage": 100,
        "completedViews": 23
      },
      "devices": { "desktop": 45, "mobile": 44 }
    }
  ],
  "summary": {
    "deviceBreakdown": {
      "desktop": 800,
      "mobile": 500,
      "tablet": 200
    },
    "avgWatchPercentage": 65.3,
    "totalCompletedViews": 156
  }
}
```

## 📱 Компоненты

### 🔧 Обновленные файлы:
- `utils/deviceDetection.ts` - утилиты детекции
- `components/ui/NewsCard.tsx` - информация об устройстве
- `components/ui/VideoBlock.tsx` - трекинг просмотра + устройства
- `components/ui/AccordionItem.tsx` - информация об устройстве
- `app/api/analytics/track/route.ts` - расширенная обработка

### 📊 Новые возможности:
- **Автоматическая детекция** устройства, браузера, ОС
- **Точный трекинг** времени и процента просмотра видео
- **Единая статистика** по всем типам взаимодействий
- **Разбивка по устройствам** для каждого типа контента

## 🚀 Использование

1. **Просмотр общей статистики**: `/analytics`
2. **Автоматический сбор данных** при взаимодействии с сайтом
3. **Фильтрация по периодам** (7d, 30d, 90d)
4. **Экспорт данных** через API

## 📈 Преимущества

- ✅ **Полная картина** поведения пользователей
- ✅ **Оптимизация контента** на основе устройств
- ✅ **Измерение вовлеченности** через проценты просмотра
- ✅ **Кроссплатформенная аналитика**
- ✅ **Принятие решений** на основе данных

Теперь система предоставляет детальную аналитику для принятия обоснованных решений по улучшению пользовательского опыта! 📊 