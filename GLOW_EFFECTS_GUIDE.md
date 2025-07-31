# 🌟 Руководство по настройке эффектов свечения

## ✅ **Что исправлено:**

### **1. 📰 Текст "НОВОСТИ" - исправлен z-index**
- ✅ **Добавлен z-10** для всех элементов заголовка
- ✅ **Теперь не перекрывается** другими блоками

### **2. 🔘 Кнопка "Подробнее" - полная анимация**
- ✅ **Все эффекты** как у "Все новости"
- ✅ **Градиентный overlay** при hover
- ✅ **Блик эффект** слева направо
- ✅ **Масштабирование** и свечение
- ✅ **Движение стрелки** →

### **3. ✨ Свечение новостных карточек - добавлено**
- ✅ **Inset shadow** как у блоков развития
- ✅ **Синяя подсветка** при hover
- ✅ **Интенсивность 0.7** (70% прозрачности)

---

## 🎛️ **Как настроить интенсивность свечения:**

### **📁 Файл конфигурации:**
`frontend/src/config/glowEffects.ts`

### **⚡ Быстрые предустановки:**

#### **🔸 Слабое свечение (subtle):**
```typescript
import { applyGlowPreset } from '@/config/glowEffects';
applyGlowPreset('subtle');
```
- Размытие: 16px
- Прозрачность: 30%
- Скорость: 200ms

#### **🔸 Нормальное свечение (normal) - по умолчанию:**
```typescript
applyGlowPreset('normal');
```
- Размытие: 32px  
- Прозрачность: 70%
- Скорость: 300ms

#### **🔸 Сильное свечение (intense):**
```typescript
applyGlowPreset('intense');
```
- Размытие: 48px
- Прозрачность: 90%
- Скорость: 400ms

#### **🔸 Экстремальное свечение (extreme):**
```typescript
applyGlowPreset('extreme');
```
- Размытие: 64px
- Прозрачность: 100%
- Скорость: 500ms

---

## 🎨 **Индивидуальная настройка блоков:**

### **📰 Только новостные карточки:**
```typescript
import { glowEffects } from '@/config/glowEffects';

// Увеличить интенсивность
glowEffects.newsCards.opacity = 0.9;        // 90% прозрачности
glowEffects.newsCards.blurRadius = 40;      // больше размытия
glowEffects.newsCards.spreadRadius = 3;     // толще обводка

// Изменить цвет на зелёный
glowEffects.newsCards.color = "rgba(0,255,0,0.8)";
```

### **🏢 Только блоки развития (Селлеру/Партнёру):**
```typescript
// Сделать ярче
glowEffects.developmentBlocks.opacity = 1.0;
glowEffects.developmentBlocks.blurRadius = 50;

// Красное свечение
glowEffects.developmentBlocks.color = "rgba(255,0,0,0.8)";
```

### **🔘 Настройка анимаций кнопок:**
```typescript
import { buttonAnimations } from '@/config/glowEffects';

// Сильнее масштабирование
buttonAnimations.primary.hoverScale = 1.05;  // +5%

// Ярче тень
buttonAnimations.primary.shadowIntensity = 0.5;  // 50%

// Быстрее блик
buttonAnimations.primary.shineSpeed = 500;  // 0.5 секунды
```

---

## 🎯 **Применение настроек:**

### **🔧 В компоненте (пример):**
```typescript
import { glowEffects, generateGlowClass } from '@/config/glowEffects';

export default function MyComponent() {
  // Генерируем CSS класс
  const newsGlow = generateGlowClass(glowEffects.newsCards);
  
  return (
    <div className={`hover:${newsGlow} transition-shadow duration-300`}>
      Контент с свечением
    </div>
  );
}
```

### **🎨 Динамическое изменение:**
```typescript
// В useEffect или обработчике событий
useEffect(() => {
  // Применить сильное свечение
  applyGlowPreset('intense');
  
  // Или настроить индивидуально
  glowEffects.newsCards.opacity = 0.95;
}, []);
```

---

## 📊 **Текущие настройки эффектов:**

| **Блок** | **Размытие** | **Толщина** | **Прозрачность** | **Цвет** |
|----------|--------------|-------------|------------------|----------|
| Новости | 32px | 2px | 70% | Синий |
| Развитие | 32px | 2px | 70% | Синий |
| Услуги | 24px | 1px | 50% | Синий |
| Преимущества | 28px | 2px | 60% | Синий |

---

## 🔧 **Примеры настройки интенсивности:**

### **🌟 Сделать всё ярче:**
```typescript
// В любом файле компонента или в main.tsx
import { applyGlowPreset } from '@/config/glowEffects';

// При загрузке приложения
applyGlowPreset('intense');
```

### **💙 Изменить цвет свечения:**
```typescript
// Синий (по умолчанию)
applyGlowPreset('normal', 'rgba(1,132,244,0.7)');

// Зелёный
applyGlowPreset('normal', 'rgba(0,255,0,0.7)');

// Фиолетовый  
applyGlowPreset('normal', 'rgba(128,0,255,0.7)');

// Красный
applyGlowPreset('normal', 'rgba(255,0,0,0.7)');
```

### **⚡ Настройка по времени суток:**
```typescript
const hour = new Date().getHours();

if (hour >= 18 || hour <= 6) {
  // Ночью - ярче
  applyGlowPreset('intense');
} else {
  // Днём - нормально
  applyGlowPreset('normal');
}
```

### **🎮 Интерактивная настройка:**
```typescript
// Функция для пользователя
function setGlowIntensity(level: 'subtle' | 'normal' | 'intense' | 'extreme') {
  applyGlowPreset(level);
  
  // Сохранить настройку
  localStorage.setItem('glowLevel', level);
}

// При загрузке восстановить
const savedLevel = localStorage.getItem('glowLevel') as any;
if (savedLevel) {
  applyGlowPreset(savedLevel);
}
```

---

## 🎨 **CSS классы для ручного применения:**

### **📰 Новостные карточки:**
```css
/* Стандартное свечение */
.news-glow:hover {
  box-shadow: inset 0 0 32px 2px rgba(1,132,244,0.7);
}

/* Усиленное свечение */
.news-glow-intense:hover {
  box-shadow: inset 0 0 48px 3px rgba(1,132,244,0.9);
}
```

### **🏢 Блоки развития:**
```css
/* Текущее свечение */
.dev-glow:hover {
  box-shadow: inset 0 0 32px 2px rgba(1,132,244,0.7);
}

/* Экстремальное свечение */
.dev-glow-extreme:hover {
  box-shadow: inset 0 0 64px 4px rgba(1,132,244,1.0);
}
```

---

## 🎯 **Рекомендации по настройке:**

### **💡 Для обычного использования:**
- Используйте предустановку `'normal'`
- Оставьте синий цвет по умолчанию

### **⚡ Для привлечения внимания:**
- Используйте предустановку `'intense'`
- Попробуйте зелёный или фиолетовый цвет

### **🔥 Для акционных страниц:**
- Используйте предустановку `'extreme'`
- Красный или жёлтый цвет свечения

### **😌 Для минимализма:**
- Используйте предустановку `'subtle'`
- Или полностью отключите: `opacity: 0`

---

## 🎉 **Результат обновлений:**

**✅ Исправлено:**
- 📰 Заголовок "НОВОСТИ" не перекрывается
- 🔘 Кнопка "Подробнее" имеет все анимации
- ✨ Новостные карточки светятся при hover
- 🎛️ Создана система настройки интенсивности

**🎨 Теперь вы можете:**
- Настроить силу свечения одной командой
- Изменить цвет всех эффектов
- Настроить каждый блок индивидуально
- Сохранить настройки пользователя

**🚀 Эффекты работают единообразно и настраиваются из одного места!** 