/**
 * Конфигурация новостного блока
 * 
 * Здесь можно настроить все параметры отображения новостей:
 * - Позиционирование элементов
 * - Лимиты текста
 * - Размеры и отступы
 */

export interface NewsDisplayConfig {
  // Настройки обрезки текста
  textLimits: {
    excerptMaxLength: number;        // Максимальная длина excerpt (описания)
    titleMaxLength: number;          // Максимальная длина заголовка
    enableTruncation: boolean;       // Включить обрезку текста
  };
  
  // Позиционирование заголовка и навигации
  positioning: {
    titleTop: number;               // Позиция заголовка "НОВОСТИ" сверху (px)
    subtitleTop: number;            // Позиция подзаголовка "Новости ассоциации" (px) 
    lineTop: number;                // Позиция декоративной линии (px)
    navigationTop: number;          // Позиция стрелок навигации (px)
    indicatorsTop: number;          // Позиция индикаторов слайдов (px)
  };
  
  // Настройки слайдера
  slider: {
    cardsPerSlide: number;          // Количество карточек на слайде
    autoplay: boolean;              // Автопроигрывание
    autoplayDelay: number;          // Задержка автопроигрывания (ms)
    transitionDuration: number;     // Длительность перехода (ms)
  };
  
  // Размеры карточек
  cardDimensions: {
    width: number;                  // Ширина карточки (px)
    height: number;                 // Высота карточки (px)
    gap: number;                    // Отступ между карточками (px)
  };
}

// ОСНОВНАЯ КОНФИГУРАЦИЯ - МЕНЯЙТЕ ЗДЕСЬ
export const newsConfig: NewsDisplayConfig = {
  textLimits: {
    excerptMaxLength: 140,          // Лимит символов для описания (текущий: 140)
    titleMaxLength: 60,             // Лимит символов для заголовка
    enableTruncation: true          // Включена обрезка текста
  },
  
  positioning: {
    titleTop: -130,                 // Заголовок опущен еще на 30px (было -160px, стало -130px)
    subtitleTop: -94,               // Подзаголовок опущен еще на 30px (было -124px, стало -94px)
    lineTop: -102.5,                // Линия опущена еще на 30px (было -132.5px, стало -102.5px)
    navigationTop: -98,             // Стрелки опущены еще на 30px (было -128px, стало -98px)
    indicatorsTop: -85              // Индикаторы опущены еще на 30px (было -115px, стало -85px)
  },
  
  slider: {
    cardsPerSlide: 3,               // По 3 карточки на слайде
    autoplay: false,                // Автопроигрывание отключено
    autoplayDelay: 5000,            // 5 секунд между слайдами
    transitionDuration: 500         // 500ms анимация перехода
  },
  
  cardDimensions: {
    width: 486,                     // Ширина карточки (px)
    height: 568,                    // Высота карточки (px)
    gap: 70                         // Отступ между карточками уменьшен с 109px до 70px
  }
};

// БЫСТРЫЕ НАСТРОЙКИ

/**
 * Функция для изменения позиции всех элементов заголовка
 * @param offsetY - смещение по Y в пикселях (положительное - вниз, отрицательное - вверх)
 */
export function adjustHeaderPosition(offsetY: number) {
  const basePositions = {
    titleTop: 0,
    subtitleTop: 36,
    lineTop: 27.5,
    navigationTop: 32,
    indicatorsTop: 45
  };
  
  newsConfig.positioning.titleTop = basePositions.titleTop + offsetY;
  newsConfig.positioning.subtitleTop = basePositions.subtitleTop + offsetY;
  newsConfig.positioning.lineTop = basePositions.lineTop + offsetY;
  newsConfig.positioning.navigationTop = basePositions.navigationTop + offsetY;
  newsConfig.positioning.indicatorsTop = basePositions.indicatorsTop + offsetY;
}

/**
 * Функция для изменения лимита символов в описании
 * @param maxLength - максимальное количество символов
 */
export function setExcerptLimit(maxLength: number) {
  newsConfig.textLimits.excerptMaxLength = maxLength;
}

/**
 * Функция для включения/выключения автопроигрывания
 * @param enabled - включить/выключить
 * @param delay - задержка в миллисекундах
 */
export function setAutoplay(enabled: boolean, delay: number = 5000) {
  newsConfig.slider.autoplay = enabled;
  newsConfig.slider.autoplayDelay = delay;
}

// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В КОММЕНТАРИЯХ

/**
 * БЫСТРЫЕ ИЗМЕНЕНИЯ:
 * 
 * // Поднять весь заголовок еще на 50px вверх:
 * adjustHeaderPosition(-150);
 * 
 * // Вернуть заголовок в исходное положение:
 * adjustHeaderPosition(0);
 * 
 * // Изменить лимит текста на 200 символов:
 * setExcerptLimit(200);
 * 
 * // Включить автопроигрывание каждые 3 секунды:
 * setAutoplay(true, 3000);
 */

/**
 * ПРЯМОЕ ИЗМЕНЕНИЕ КОНФИГУРАЦИИ:
 * 
 * import { newsConfig } from '@/config/newsConfig';
 * 
 * // Изменить позицию только стрелок:
 * newsConfig.positioning.navigationTop = -200;
 * 
 * // Изменить размер карточек:
 * newsConfig.cardDimensions.width = 500;
 * newsConfig.cardDimensions.height = 600;
 * 
 * // Изменить количество карточек на слайде:
 * newsConfig.slider.cardsPerSlide = 4;
 */ 