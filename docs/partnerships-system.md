# Система Партнеров (Partnerships System)

## Обзор

Система партнеров представляет собой интерактивный слайдер для отображения информации о партнерах компании. Включает в себя основной слайдер партнеров и отдельный слайдер логотипов партнеров.

## Структура данных

### PartnerItem Interface
```typescript
interface PartnerItem {
  id: string;
  order: number;
  title: { ru: string; en: string; uz: string };
  category: { ru: string; en: string; uz: string };
  description: { ru: string; en: string; uz: string };
  mainImage: {
    ru: string; en: string; uz: string;
    width: number; height: number;
  };
  partnerLogos: PartnerLogo[];
  partnerUrl?: string;
  openInNewTab?: boolean;
  metaTitle: { ru: string; en: string; uz: string };
  metaDescription: { ru: string; en: string; uz: string };
  isActive: boolean;
}
```

### PartnerLogo Interface
```typescript
interface PartnerLogo {
  id: string;
  name: { ru: string; en: string; uz: string };
  logo: {
    ru: string; en: string; uz: string;
    width: number; height: number;
  };
  url?: string;
  openInNewTab?: boolean;
}
```

## Компоненты

### 1. PartnershipsSection
**Файл:** `frontend/src/components/sections-main/PartnershipsSection.tsx`

Основной компонент секции партнеров с функциями:
- Автоматическое переключение партнеров (5 секунд)
- Пауза при наведении мыши
- Кнопки навигации
- Аналитика кликов и просмотров
- Кнопка перехода к партнеру
- Индикаторы текущего партнера

**Особенности:**
- Зацикленный слайдер
- Плавные переходы между партнерами
- Адаптивная локализация
- Аналитика событий

### 2. PartnerLogosSlider
**Файл:** `frontend/src/components/ui/PartnerLogosSlider.tsx`

Слайдер логотипов партнеров с функциями:
- Центрированный активный логотип
- Уменьшенные соседние логотипы
- Автоматическое переключение (3 секунды)
- Клики по логотипам для перехода
- Индикаторы прогресса

**Визуальные эффекты:**
- Активный логотип: полный размер, без фильтров
- Соседние логотипы: 75% размера, 60% прозрачности
- Остальные логотипы: 50% размера, 30% прозрачности
- Градация серого для неактивных логотипов

## Моковые данные

### Файл: `frontend/src/data/mock/partnersData.ts`

Содержит 3 примера партнеров:
1. **SELLER TOP** - IT сервис
2. **MARKETPLACE PRO** - E-commerce
3. **LOGISTICS HUB** - Логистика

Каждый партнер включает:
- Многоязычную информацию
- Основное изображение
- 4 логотипа партнеров
- Meta данные для SEO
- Ссылки на сайты партнеров

## Функции

### getActivePartners()
Возвращает активных партнеров, отсортированных по порядку.

### getPartnerById(id: string)
Возвращает партнера по ID.

## Аналитика

### События отслеживания:

1. **partner_view** - просмотр партнера
   - partnerId, partnerName, category, locale, timestamp

2. **partner_click** - клик по партнеру
   - partnerId, partnerName, category, url, locale, timestamp

## Интеграция

### В главной странице:
```typescript
import PartnershipsSection from '@/components/sections-main/PartnershipsSection';

// В компоненте
<PartnershipsSection />
```

## Стилизация

### Цветовая схема:
- Основной градиент: `from-[#0283F7] to-[#850191]`
- Акцентный цвет: `#3B82F6`
- Фон блоков: `rgba(25,21,52,0.3)`
- Границы: `#0F74EB`

### Анимации:
- Плавные переходы: `duration-500 ease-in-out`
- Hover эффекты: `hover:scale-105`
- Блик эффекты для кнопок
- Пульсация активных элементов

## Локализация

Поддерживает 3 языка:
- **ru** - Русский
- **en** - Английский  
- **uz** - Узбекский

Все тексты и изображения адаптированы под каждый язык.

## Производительность

- Мемоизация компонентов с `useCallback`
- Оптимизированные переходы
- Ленивая загрузка изображений
- Автоматическая пауза при взаимодействии

## Расширение

Для добавления нового партнера:
1. Добавить данные в `partnersData.ts`
2. Загрузить изображения в `/public/images/`
3. Обновить логотипы партнеров
4. Настроить аналитику при необходимости 