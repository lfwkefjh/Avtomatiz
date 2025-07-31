/**
 * Утилита для вычисления времени чтения текста
 * 
 * Формула: количество слов / скорость чтения в минуту
 * Средняя скорость чтения: 200-250 слов в минуту
 * Для русского языка обычно 180-220 слов в минуту
 */

// Средняя скорость чтения по языкам (слов в минуту)
const READING_SPEEDS = {
  ru: 200,  // Русский
  en: 230,  // Английский  
  uz: 180   // Узбекский
};

/**
 * Подсчитывает количество слов в тексте
 * @param text - текст для анализа
 * @returns количество слов
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Убираем HTML теги, если есть
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Разбиваем по пробелам и фильтруем пустые строки
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
    
  return words.length;
}

/**
 * Вычисляет время чтения текста в минутах
 * @param text - текст для анализа  
 * @param locale - язык текста (для выбора скорости чтения)
 * @returns время чтения в минутах (минимум 1 минута)
 */
export function calculateReadTime(text: string, locale: string = 'ru'): number {
  const wordCount = countWords(text);
  
  if (wordCount === 0) return 1;
  
  // Выбираем скорость чтения по языку
  const readingSpeed = READING_SPEEDS[locale as keyof typeof READING_SPEEDS] || READING_SPEEDS.ru;
  
  // Вычисляем время в минутах
  const readTimeMinutes = Math.ceil(wordCount / readingSpeed);
  
  // Минимум 1 минута
  return Math.max(1, readTimeMinutes);
}

/**
 * Вычисляет время чтения для мультиязычного контента
 * @param content - объект с текстом на разных языках
 * @returns объект с временем чтения для каждого языка
 */
export function calculateMultilingualReadTime(content: {
  ru?: string;
  en?: string; 
  uz?: string;
}): {
  ru: number;
  en: number;
  uz: number;
} {
  return {
    ru: calculateReadTime(content.ru || '', 'ru'),
    en: calculateReadTime(content.en || '', 'en'),
    uz: calculateReadTime(content.uz || '', 'uz')
  };
}

/**
 * Форматирует время чтения для отображения
 * @param minutes - время в минутах
 * @param locale - язык для локализации
 * @returns отформатированная строка
 */
export function formatReadTime(minutes: number, locale: string = 'ru'): string {
  const formatters = {
    ru: (min: number) => `${min} мин`,
    en: (min: number) => `${min} min`,
    uz: (min: number) => `${min} daq`
  };
  
  const formatter = formatters[locale as keyof typeof formatters] || formatters.ru;
  return formatter(minutes);
}

/**
 * Анализирует статью и возвращает подробную статистику
 * @param title - заголовок
 * @param excerpt - краткое описание  
 * @param content - полный текст статьи
 * @param locale - язык
 * @returns объект со статистикой
 */
export function analyzeArticle(
  title: string, 
  excerpt: string, 
  content: string, 
  locale: string = 'ru'
) {
  const titleWords = countWords(title);
  const excerptWords = countWords(excerpt);
  const contentWords = countWords(content);
  const totalWords = titleWords + excerptWords + contentWords;
  
  const readTime = calculateReadTime(content, locale);
  
  return {
    words: {
      title: titleWords,
      excerpt: excerptWords, 
      content: contentWords,
      total: totalWords
    },
    readTime: {
      minutes: readTime,
      formatted: formatReadTime(readTime, locale)
    },
    difficulty: totalWords > 1000 ? 'сложная' : totalWords > 500 ? 'средняя' : 'легкая'
  };
} 