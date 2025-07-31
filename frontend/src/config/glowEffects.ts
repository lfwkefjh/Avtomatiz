/**
 * Конфигурация эффектов свечения для всех блоков сайта
 * 
 * Этот файл позволяет настраивать интенсивность и параметры
 * всех свечений и анимаций на сайте из одного места
 */

export interface GlowConfig {
  // Размер свечения (px)
  blurRadius: number;
  // Толщина свечения (px)  
  spreadRadius: number;
  // Прозрачность (0-1)
  opacity: number;
  // Цвет свечения (rgba)
  color: string;
  // Скорость анимации (ms)
  duration: number;
}

export interface ButtonAnimationConfig {
  // Масштабирование при hover (1.0 = без изменений)
  hoverScale: number;
  // Интенсивность тени (0-1)
  shadowIntensity: number;
  // Скорость анимации (ms)
  duration: number;
  // Прозрачность overlay (0-1)
  overlayOpacity: number;
  // Скорость блика (ms)
  shineSpeed: number;
  // Интенсивность блика (0-1)
  shineIntensity: number;
}

// КОНФИГУРАЦИЯ СВЕЧЕНИЙ - ПРИМЕНЕНО СРЕДНЕЕ СВЕЧЕНИЕ
export const glowEffects = {
  // Новостные карточки - уменьшенное свечение
  newsCards: {
    blurRadius: 20,
    spreadRadius: 1,
    opacity: 0.4,
    color: "rgba(1,132,244,0.4)", // синий, прозрачнее на 30%
    duration: 300,
  } as GlowConfig,

  // Блоки развития (Селлеру/Партнёру) - среднее свечение
  developmentBlocks: {
    blurRadius: 32,
    spreadRadius: 2,
    opacity: 0.7,
    color: "rgba(1,132,244,0.7)", // синий
    duration: 300,
  } as GlowConfig,

  // Другие блоки - среднее свечение
  serviceBlocks: {
    blurRadius: 32,
    spreadRadius: 2,
    opacity: 0.7,
    color: "rgba(1,132,244,0.7)",
    duration: 300,
  } as GlowConfig,

  // Преимущества - среднее свечение
  advantageBlocks: {
    blurRadius: 32,
    spreadRadius: 2,
    opacity: 0.7,
    color: "rgba(1,132,244,0.7)",
    duration: 300,
  } as GlowConfig,

  // Блоки доверия - как новостные карточки
  trustBlocks: {
    blurRadius: 20,
    spreadRadius: 1,
    opacity: 0.4,
    color: "rgba(1,132,244,0.4)",
    duration: 300,
  } as GlowConfig,
};

// КОНФИГУРАЦИЯ АНИМАЦИЙ КНОПОК
export const buttonAnimations = {
  // Основные кнопки (Подробнее, Все новости)
  primary: {
    hoverScale: 1.01,
    shadowIntensity: 0.25,
    duration: 300,
    overlayOpacity: 1.0,
    shineSpeed: 1000,
    shineIntensity: 0.1,
  } as ButtonAnimationConfig,

  // Кнопки в карточках
  card: {
    hoverScale: 1.01,
    shadowIntensity: 0.25,
    duration: 300,
    overlayOpacity: 1.0,
    shineSpeed: 1000,
    shineIntensity: 0.1,
  } as ButtonAnimationConfig,

  // Кнопки в блоках развития
  development: {
    hoverScale: 1.02,
    shadowIntensity: 0.20,
    duration: 300,
    overlayOpacity: 1.0,
    shineSpeed: 700,
    shineIntensity: 0.1,
  } as ButtonAnimationConfig,

  // Стрелки навигации слайдера
  navigation: {
    hoverScale: 1.05,
    shadowIntensity: 0.30,
    duration: 300,
    overlayOpacity: 1.0,
    shineSpeed: 800,
    shineIntensity: 0.15,
  } as ButtonAnimationConfig,
};

// УТИЛИТЫ ДЛЯ ГЕНЕРАЦИИ CSS КЛАССОВ

/**
 * Генерирует CSS класс для inset shadow свечения
 * @param config - конфигурация свечения
 * @returns строка с CSS классом
 */
export function generateGlowClass(config: GlowConfig): string {
  return `shadow-[inset_0_0_${config.blurRadius}px_${config.spreadRadius}px_${config.color}]`;
}

/**
 * Генерирует CSS стили для кнопки
 * @param config - конфигурация анимации кнопки
 * @returns объект со стилями
 */
export function generateButtonStyles(config: ButtonAnimationConfig) {
  return {
    transform: `scale(${config.hoverScale})`,
    boxShadow: `0 20px 50px rgba(59, 130, 246, ${config.shadowIntensity})`,
    transition: `all ${config.duration}ms ease`,
  };
}

/**
 * Генерирует настройки для блика
 * @param config - конфигурация анимации кнопки  
 * @returns объект с настройками блика
 */
export function generateShineSettings(config: ButtonAnimationConfig) {
  return {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${config.shineIntensity}), transparent)`,
    transition: `transform ${config.shineSpeed}ms ease`,
  };
}

// ПРЕДУСТАНОВКИ ДЛЯ БЫСТРОЙ НАСТРОЙКИ

export const glowPresets = {
  // Слабое свечение
  subtle: {
    blurRadius: 16,
    spreadRadius: 1,
    opacity: 0.3,
    duration: 200,
  },

  // Нормальное свечение (по умолчанию)
  normal: {
    blurRadius: 32,
    spreadRadius: 2,
    opacity: 0.7,
    duration: 300,
  },

  // Сильное свечение
  intense: {
    blurRadius: 48,
    spreadRadius: 3,
    opacity: 0.9,
    duration: 400,
  },

  // Очень сильное свечение
  extreme: {
    blurRadius: 64,
    spreadRadius: 4,
    opacity: 1.0,
    duration: 500,
  },
};

// ФУНКЦИИ ДЛЯ ПРИМЕНЕНИЯ ПРЕДУСТАНОВОК

/**
 * Применяет предустановку ко всем эффектам свечения
 * @param preset - выбранная предустановка
 * @param color - цвет свечения (опционально)
 */
export function applyGlowPreset(
  preset: keyof typeof glowPresets, 
  color: string = "rgba(1,132,244,0.7)"
) {
  const settings = glowPresets[preset];
  
  Object.keys(glowEffects).forEach(key => {
    const effect = glowEffects[key as keyof typeof glowEffects];
    effect.blurRadius = settings.blurRadius;
    effect.spreadRadius = settings.spreadRadius;
    effect.opacity = settings.opacity;
    effect.duration = settings.duration;
    effect.color = color;
  });
}

// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В КОММЕНТАРИЯХ

/**
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТЕ:
 * 
 * import { glowEffects, generateGlowClass } from '@/config/glowEffects';
 * 
 * // В классе компонента:
 * const newsGlow = generateGlowClass(glowEffects.newsCards);
 * 
 * // В JSX:
 * <div className={`hover:${newsGlow} transition-shadow duration-${glowEffects.newsCards.duration}`}>
 *   Контент
 * </div>
 */

/**
 * БЫСТРАЯ НАСТРОЙКА ИНТЕНСИВНОСТИ:
 * 
 * // Для слабого свечения везде:
 * applyGlowPreset('subtle');
 * 
 * // Для сильного свечения везде:
 * applyGlowPreset('intense');
 * 
 * // Для экстремального свечения с красным цветом:
 * applyGlowPreset('extreme', 'rgba(255,0,0,1.0)');
 */

/**
 * ИНДИВИДУАЛЬНАЯ НАСТРОЙКА:
 * 
 * // Изменить только новостные карточки:
 * glowEffects.newsCards.opacity = 0.9;
 * glowEffects.newsCards.blurRadius = 40;
 * 
 * // Изменить только кнопки:
 * buttonAnimations.primary.hoverScale = 1.05;
 * buttonAnimations.primary.shadowIntensity = 0.5;
 */ 