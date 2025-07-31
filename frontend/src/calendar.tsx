import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Grid, List, Search, Home, Filter, Tag, Clock, MapPin, User, Users, Star, Menu, Globe, Monitor, Percent, Timer, Ticket, ExternalLink, TrendingUp, Award, Eye, LucideIcon, WifiOff } from 'lucide-react';

// Типы и интерфейсы
interface Event {
  image: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  time: string;
  duration: string;
  dayOfWeek: string;
  language: string;
  format: string;
  location: string;
  organizer: string;
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  discountEndTime: Date;
  totalSeats: number;
  remainingSeats: number;
  priority: string;
  status: string;
  tags: string[];
  date?: Date;
}

interface Events {
  [key: string]: Event;
}

interface SearchSuggestion {
  type: 'event' | 'category' | 'tag' | 'location';
  text: string;
  subtitle: string;
  image?: string;
  category?: string;
  price?: number;
  discount?: number;
  tag?: string;
  location?: string;
  color?: string;
}

interface EventStats {
  total: number;
  active: number;
  discounted: number;
  free: number;
  totalPages: number;
}

interface Toast {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// Константы
const CONSTANTS = {
  PAGINATION: {
    MOBILE: 6,
    DESKTOP: 12
  },
  months: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  categories: [
    { id: 'all', name: 'Все категории', color: 'bg-gray-500' },
    { id: 'конференция', name: 'Конференции', color: 'bg-blue-500' },
    { id: 'мастер-класс', name: 'Мастер-классы', color: 'bg-green-500' },
    { id: 'концерт', name: 'Концерты', color: 'bg-purple-500' },
    { id: 'выставка', name: 'Выставки', color: 'bg-orange-500' },
    { id: 'семинар', name: 'Семинары', color: 'bg-red-500' }
  ]
};

// Утилиты безопасности
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

const sanitizeUrl = (url: string): string => {
  if (!validateUrl(url)) {
    return '#';
  }
  return url;
};

// Утилиты производительности
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Утилиты для календаря
const Utils = {
  getWeeksInMonth: (date: Date): Date[][] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() || 7;

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Добавляем дни предыдущего месяца
    for (let i = 1; i < startingDay; i++) {
      const prevDate = new Date(year, month, 1 - (startingDay - i));
      currentWeek.push(prevDate);
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentWeek.push(currentDate);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Добавляем дни следующего месяца
    while (currentWeek.length < 7) {
      const nextDate = new Date(year, month + 1, currentWeek.length + 1);
      currentWeek.push(nextDate);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  },

  getDaysInMonth: (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  },

  formatDateKey: (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  },

  formatTimeLeft: (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Завершено';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  }
};

// Хуки
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
};

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calendar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Что-то пошло не так</h2>
          <p className="text-gray-600 mb-4">Попробуйте обновить страницу</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Обновить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ======================== SECURITY UTILITIES ========================
const SecurityUtils = {
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .trim()
      .slice(0, 1000);
  },
  
  validateUrl: (url) => {
    try {
      const validUrl = new URL(url);
      return ['http:', 'https:'].includes(validUrl.protocol);
    } catch {
      return false;
    }
  },
  
  generateCSRFToken: () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

// ======================== PERFORMANCE UTILITIES ========================
const PerformanceUtils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }
};

// ======================== CONSTANTS ========================
const CONSTANTS = {
  PAGINATION: {
    DESKTOP: 8,
    MOBILE: 4
  },
  DEBOUNCE_DELAY: 300,
  months: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  weekDaysNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  weekDaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  weekDays: [
    { id: 'all', name: 'Любой день' },
    { id: 'понедельник', name: 'Понедельник' },
    { id: 'вторник', name: 'Вторник' },
    { id: 'среда', name: 'Среда' },
    { id: 'четверг', name: 'Четверг' },
    { id: 'пятница', name: 'Пятница' },
    { id: 'суббота', name: 'Суббота' },
    { id: 'воскресенье', name: 'Воскресенье' }
  ],
  categories: [
    { id: 'all', name: 'Все категории', icon: Grid, color: '#0283F7' },
    { id: 'конференция', name: 'Конференции', icon: Users, color: '#3B82F6' },
    { id: 'мастер-класс', name: 'Мастер-классы', icon: Star, color: '#8B5CF6' },
    { id: 'концерт', name: 'Концерты', icon: Users, color: '#EF4444' },
    { id: 'вебинар', name: 'Вебинары', icon: Monitor, color: '#10B981' },
    { id: 'выставка', name: 'Выставки', icon: Eye, color: '#F59E0B' },
    { id: 'семинар', name: 'Семинары', icon: Users, color: '#06B6D4' },
    { id: 'интенсив', name: 'Интенсивы', icon: TrendingUp, color: '#F97316' },
    { id: 'фестиваль', name: 'Фестивали', icon: Award, color: '#EC4899' }
  ],
  durations: [
    { id: 'all', name: 'Любая длительность' },
    { id: 'час', name: 'До часа' },
    { id: 'несколько часов', name: 'Несколько часов' },
    { id: 'полный день', name: 'Полный день' },
    { id: 'несколько дней', name: 'Несколько дней' }
  ],
  timeSlots: [
    { id: 'all', name: 'Любое время' },
    { id: 'утро', name: 'Утром (6:00-12:00)' },
    { id: 'день', name: 'Днем (12:00-18:00)' },
    { id: 'вечер', name: 'Вечером (18:00-23:00)' },
    { id: 'ночь', name: 'Ночью (23:00-6:00)' }
  ],
  levels: [
    { id: 'all', name: 'Любой уровень' },
    { id: 'начинающий', name: 'Начинающий' },
    { id: 'средний', name: 'Средний' },
    { id: 'продвинутый', name: 'Продвинутый' },
    { id: 'для всех', name: 'Для всех' }
  ],
  sortOptions: [
    { id: 'date', name: 'По дате' },
    { id: 'price', name: 'По цене' },
    { id: 'popularity', name: 'По популярности' },
    { id: 'name', name: 'По названию' },
    { id: 'seats', name: 'По доступности мест' }
  ],
  priceRanges: [
    { id: 'all', name: 'Любая цена', min: 0, max: 1000000 },
    { id: 'free', name: 'Бесплатно', min: 0, max: 0 },
    { id: 'budget', name: 'До 10000 сум', min: 0, max: 10000 },
    { id: 'medium', name: '10000-30000 сум', min: 10000, max: 30000 },
    { id: 'premium', name: '30000-50000 сум', min: 30000, max: 50000 },
    { id: 'luxury', name: 'Свыше 50000 сум', min: 50000, max: 1000000 }
  ],
  languages: [
    { id: 'all', name: 'Все языки' },
    { id: 'русский', name: 'Русский' },
    { id: 'английский', name: 'English' },
    { id: 'инструментальная', name: 'Инструментальная' }
  ],
  formats: [
    { id: 'all', name: 'Все форматы' },
    { id: 'онлайн', name: 'Онлайн', icon: Monitor },
    { id: 'офлайн', name: 'Офлайн', icon: MapPin }
  ]
};

// ======================== DEMO DATA ========================
const DEMO_EVENTS = {
      '2025-6-15': {
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
        title: 'IT-Конференция "Будущее технологий"',
        shortDescription: 'Обсуждение трендов в IT, ИИ и блокчейн технологиях с ведущими экспертами отрасли',
        description: 'Ежегодная конференция по новейшим технологиям и стартапам. Узнайте о последних тенденциях в сфере искусственного интеллекта, блокчейна и инновационных стартапов.',
        category: 'конференция',
        startDate: '2025-07-15',
        endDate: '2025-07-17',
        startTime: '09:00',
        endTime: '18:00',
        time: '09:00',
        duration: 'полный день',
        dayOfWeek: 'вторник',
        language: 'русский',
        format: 'офлайн',
        location: 'Конгресс-холл "Экспоцентр"',
        locationUrl: 'https://maps.google.com/экспоцентр',
        originalPrice: 50000,
        currentPrice: 35000,
        discountPercent: 30,
        discountEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        remainingSeats: 45,
        totalSeats: 200,
        status: 'active',
        priority: 'high',
        attendees: 155,
        tags: ['технологии', 'ИИ', 'блокчейн', 'стартапы', 'инновации'],
        date: new Date(2025, 6, 15),
        organizer: 'TechHub Russia',
        level: 'продвинутый'
      },
      '2025-6-20': {
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
        title: 'Мастер-класс портретной фотографии',
        shortDescription: 'Изучение портретной съемки и работы со светом от профессионального фотографа',
        description: 'Изучение основ композиции и работы со светом. Практические занятия с профессиональным оборудованием.',
        category: 'мастер-класс',
        startDate: '2025-07-20',
        endDate: '2025-07-20',
        startTime: '14:00',
        endTime: '17:00',
        time: '14:00',
        duration: 'несколько часов',
        dayOfWeek: 'воскресенье',
        language: 'русский',
        format: 'офлайн',
        location: 'Фотостудия "Свет и Тень"',
        locationUrl: 'https://maps.google.com/фотостудия',
        originalPrice: 25000,
        currentPrice: 25000,
        discountPercent: 0,
        remainingSeats: 8,
        totalSeats: 15,
        status: 'active',
        priority: 'medium',
        attendees: 7,
        tags: ['фотография', 'портрет', 'свет', 'творчество', 'искусство'],
        date: new Date(2025, 6, 20),
        organizer: 'Photo Academy',
        level: 'начинающий'
      },
      '2025-6-25': {
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600',
        title: 'Симфонический концерт "Классические шедевры"',
        shortDescription: 'Вечер классической музыки с произведениями Чайковского и Рахманинова',
        description: 'Вечер классической музыки с произведениями Чайковского. Выступает симфонический оркестр под управлением известного дирижера.',
        category: 'концерт',
        startDate: '2025-07-25',
        endDate: '2025-07-25',
        startTime: '19:00',
        endTime: '21:30',
        time: '19:00',
        duration: 'несколько часов',
        dayOfWeek: 'пятница',
        language: 'инструментальная',
        format: 'офлайн',
        location: 'Концертный зал им. Рахманинова',
        locationUrl: 'https://maps.google.com/концертный-зал',
        originalPrice: 30000,
        currentPrice: 24000,
        discountPercent: 20,
        discountEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        remainingSeats: 120,
        totalSeats: 800,
        status: 'active',
        priority: 'high',
        attendees: 680,
        tags: ['музыка', 'классика', 'оркестр', 'культура', 'концерт'],
        date: new Date(2025, 6, 25),
        organizer: 'Городская филармония',
        level: 'для всех'
      },
      '2025-6-18': {
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600',
        title: 'Вебинар "Digital-маркетинг 2025"',
        shortDescription: 'Современные стратегии digital-маркетинга и продвижения в соцсетях',
        description: 'Современные стратегии digital-маркетинга и продвижения в соцсетях. Практические кейсы и инструменты.',
        category: 'вебинар',
        startDate: '2025-07-18',
        endDate: '2025-07-18',
        startTime: '20:00',
        endTime: '22:00',
        time: '20:00',
        duration: 'несколько часов',
        dayOfWeek: 'пятница',
        language: 'русский',
        format: 'онлайн',
        location: 'Zoom конференция',
        locationUrl: 'https://zoom.us/webinar',
        originalPrice: 15000,
        currentPrice: 9990,
        discountPercent: 33,
        discountEndTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        remainingSeats: 250,
        totalSeats: 500,
        status: 'active',
        priority: 'medium',
        attendees: 250,
        tags: ['маркетинг', 'digital', 'соцсети', 'продвижение', 'онлайн'],
        date: new Date(2025, 6, 18),
        organizer: 'Marketing Pro Academy',
        level: 'средний'
      },
      '2025-6-12': {
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
        title: 'Выставка современного искусства "Новые грани"',
        shortDescription: 'Работы молодых художников России и СНГ',
        description: 'Работы молодых художников России и СНГ. Представлены различные направления современного искусства.',
        category: 'выставка',
        startDate: '2025-07-12',
        endDate: '2025-07-12',
        startTime: '10:00',
        endTime: '18:00',
        time: '10:00',
        duration: 'полный день',
        dayOfWeek: 'суббота',
        language: 'русский',
        format: 'офлайн',
        location: 'Галерея "Арт-Пространство"',
        locationUrl: 'https://maps.google.com/галерея',
        originalPrice: 8000,
        currentPrice: 8000,
        discountPercent: 0,
        remainingSeats: 50,
        totalSeats: 120,
        status: 'completed',
        priority: 'medium',
        attendees: 70,
        tags: ['искусство', 'выставка', 'современность', 'художники', 'культура'],
        date: new Date(2025, 6, 12),
        organizer: 'Арт-центр Москвы',
        level: 'для всех'
      },
      '2025-7-5': {
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec6ee32a?w=600',
        title: 'Семинар по стартапам "От идеи к успеху"',
        shortDescription: 'Пошаговое руководство по созданию успешного стартапа',
        description: 'Узнайте, как превратить идею в прибыльный бизнес. Опытные предприниматели поделятся секретами успеха.',
        category: 'семинар',
        startDate: '2025-08-05',
        endDate: '2025-08-05',
        startTime: '10:00',
        endTime: '16:00',
        time: '10:00',
        duration: 'полный день',
        dayOfWeek: 'вторник',
        language: 'русский',
        format: 'офлайн',
        location: 'Бизнес-центр "Инновации"',
        locationUrl: 'https://maps.google.com/бизнес-центр',
        originalPrice: 40000,
        currentPrice: 28000,
        discountPercent: 30,
        discountEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        remainingSeats: 25,
        totalSeats: 50,
        status: 'active',
        priority: 'high',
        attendees: 25,
        tags: ['стартапы', 'бизнес', 'предпринимательство', 'инвестиции', 'развитие'],
        date: new Date(2025, 7, 5),
        organizer: 'StartUp Hub',
        level: 'продвинутый'
  }
};

// ======================== UTILITY FUNCTIONS ========================
const Utils = {
  formatTimeLeft: (endTime) => {
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Завершено';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  },

  getPriorityColor: (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#0283F7';
    }
  },

  getStatusColor: (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#0283F7';
    }
  },

  formatDateKey: (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  },

  isCurrentMonth: (day, currentDate) => {
    return day.getMonth() === currentDate.getMonth();
  },

  isToday: (day) => {
    const today = new Date();
    return day.toDateString() === today.toDateString();
  },

  getWeeksInMonth: (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);

    const weeks = [];
    const currentDay = new Date(startDate);

    while (currentDay <= lastDay || weeks.length === 0 || currentDay.getDay() !== 1) {
      if (currentDay.getDay() === 1 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
      
      if (weeks[weeks.length - 1].length === 7) {
        if (currentDay > lastDay) break;
      }
    }

    return weeks;
  },

  getDaysInMonth: (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(startDate.getDate() - firstDayOfWeek);

    const days = [];
    const currentDay = new Date(startDate);

    while (days.length < 42) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  }
};

// ======================== CUSTOM HOOKS ========================
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
};

// ======================== ERROR BOUNDARY ========================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Calendar error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Произошла ошибка</h2>
            <p className="text-white/70 mb-4">Что-то пошло не так. Попробуйте обновить страницу.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Обновить страницу
            </button>
          </div>
          </div>
      );
    }

    return this.props.children;
  }
}

// ======================== TOAST COMPONENT ========================
const Toast = memo(({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-lg transition-all duration-300 ${
    type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  } text-white max-w-sm`}>
            <div className="flex items-center gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto">
        <X size={16} />
      </button>
                </div>
            </div>
));

// ======================== SEARCH COMPONENT ========================
const SearchComponent = memo(({ 
  searchTerm, 
  setSearchTerm, 
  searchSuggestions, 
  showSuggestions, 
  setShowSuggestions,
  searchHistory,
  onSuggestionSelect,
  onSearchChange,
  advancedSearch,
  setAdvancedSearch,
  onClose,
  isMobile,
  showMobileMenu,
  setShowMobileMenu 
}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, CONSTANTS.DEBOUNCE_DELAY);

  const handleInputChange = useCallback((e) => {
    const value = SecurityUtils.sanitizeInput(e.target.value);
    onSearchChange(value);
  }, [onSearchChange]);

  return (
              <div className="relative mb-4">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 z-20" />
                  <input
                    type="text"
                    placeholder="Найдите идеальное мероприятие..."
                    value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => onSearchChange(searchTerm)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 pl-12 pr-32 py-4 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300"
                    aria-label="Поиск мероприятий"
          maxLength="100"
                  />
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 z-20">
                    <button
                      onClick={() => setAdvancedSearch(!advancedSearch)}
                      className={`p-2 rounded-lg transition-colors duration-200 border ${
                        advancedSearch
                          ? 'bg-purple-500/30 text-purple-300 border-purple-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white/70 border-white/20'
                      }`}
                      aria-label="Расширенный поиск"
                      title="Расширенный поиск"
                    >
                      <Filter size={18} />
                    </button>
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className={`p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors duration-200 border border-blue-500/30 ${!isMobile ? 'hidden sm:flex' : ''}`}
                      aria-label="Открыть фильтры"
                    >
                      <Menu size={18} />
                    </button>
                    <button
            onClick={onClose}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200 border border-red-500/30"
                      aria-label="Закрыть календарь"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
      {/* Suggestions dropdown */}
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-2xl z-[100] max-h-96 overflow-y-auto custom-scrollbar">
          <div className="p-2">
            <div className="text-blue-300 text-xs font-medium mb-2 px-2">Предложения поиска:</div>
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-blue-500/10 cursor-pointer transition-colors duration-200 rounded-xl border-b border-white/5 last:border-b-0"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion.image && (
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.text}
                    className="w-12 h-12 object-cover rounded-lg border border-white/10"
                  />
                )}
                {!suggestion.image && (
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                    {suggestion.type === 'category' && <Grid size={18} className="text-blue-400" />}
                    {suggestion.type === 'tag' && <Tag size={18} className="text-purple-400" />}
                    {suggestion.type === 'location' && <MapPin size={18} className="text-green-400" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{suggestion.text}</div>
                  <div className="text-white/60 text-sm truncate">{suggestion.subtitle}</div>
                  {suggestion.price && (
                    <div className="text-green-400 text-sm flex items-center gap-1">
                      {suggestion.discount > 0 && (
                        <span className="text-red-400">-{suggestion.discount}%</span>
                      )}
                      {suggestion.price}сум
                    </div>
                  )}
                </div>
                <div className="text-xs text-blue-300/70 capitalize bg-blue-500/10 px-2 py-1 rounded">{suggestion.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search history */}
      {searchHistory.length > 0 && !searchTerm && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
          <div className="p-3 border-b border-white/10">
            <div className="text-blue-300 text-sm font-medium">Недавние поисковые запросы:</div>
          </div>
          {searchHistory.map((term, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-blue-500/10 cursor-pointer transition-colors duration-200"
              onClick={() => setSearchTerm(term)}
            >
              <Clock size={14} className="text-blue-400" />
              <span className="text-white">{term}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// ======================== FILTERS COMPONENT ========================
const FiltersComponent = memo(({ 
  filters, 
  activeFilter, 
  setActiveFilter,
  categories,
  selectedCategory,
  setSelectedCategory,
  events,
  isMobile,
  clearAllFilters 
}) => {
  return (
    <div className="space-y-4 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
      {/* Быстрые фильтры с горизонтальным скроллом */}
      <div>
        <h4 className="text-sm font-medium text-white/80 mb-3">Быстрые фильтры</h4>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2" style={{ minWidth: isMobile ? '800px' : 'auto' }}>
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex-shrink-0 p-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center flex-col gap-1 hover:scale-105 border min-w-[100px] ${
                    activeFilter === filter.id
                      ? 'bg-blue-500/30 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium truncate">{filter.name}</span>
                  <span className="text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded-full">
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Категории с горизонтальным скроллом */}
      <div>
        <h4 className="text-sm font-medium text-white/80 mb-3">Категории</h4>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2" style={{ minWidth: isMobile ? '1200px' : 'auto' }}>
            {categories.map(category => {
              const Icon = category.icon;
              const count = category.id === 'all' 
                ? Object.keys(events).length 
                : Object.values(events).filter(e => e.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 p-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center flex-col gap-1 hover:scale-105 border min-w-[120px] ${
                    selectedCategory === category.id
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? `${category.color}30` : undefined,
                    borderColor: selectedCategory === category.id ? `${category.color}80` : undefined,
                    color: selectedCategory === category.id ? category.color : undefined,
                    boxShadow: selectedCategory === category.id ? `0 8px 25px ${category.color}20` : undefined
                  }}
                >
                  <Icon size={16} />
                  <span className="font-medium truncate text-center leading-tight">
                    {category.name.split(' ')[0]}
                  </span>
                  <span className="text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

// ======================== ADVANCED FILTERS COMPONENT ========================
const AdvancedFiltersComponent = memo(({ 
  minPrice, setMinPrice, maxPrice, setMaxPrice, priceRange, setPriceRange,
  selectedMonth, setSelectedMonth, selectedDuration, setSelectedDuration,
  selectedTime, setSelectedTime, selectedDay, setSelectedDay,
  selectedFormat, setSelectedFormat, selectedLanguage, setSelectedLanguage,
  sortBy, setSortBy, sortOrder, setSortOrder, clearAllFilters,
  months, durations, timeSlots, weekDays, formats, languages, sortOptions, priceRanges,
  categories, selectedCategory, setSelectedCategory, events
}) => {
  return (
    <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top duration-300 max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <Filter size={18} className="text-purple-400" />
                        Расширенный поиск
                      </h4>
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors duration-200"
                      >
                        Очистить все
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {/* Ценовой диапазон с ползунками */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Цена (сум)</label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="От"
                              value={minPrice}
                              onChange={(e) => {
                  const value = SecurityUtils.sanitizeInput(e.target.value);
                                setMinPrice(value);
                                if (value) setPriceRange([parseInt(value), priceRange[1]]);
                              }}
                              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                max="1000000"
                            />
                            <input
                              type="number"
                              placeholder="До"
                              value={maxPrice}
                              onChange={(e) => {
                  const value = SecurityUtils.sanitizeInput(e.target.value);
                                setMaxPrice(value);
                                if (value) setPriceRange([priceRange[0], parseInt(value)]);
                              }}
                              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                max="1000000"
                            />
                          </div>
                          
                          <div className="relative">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-white/60">0</span>
                              <div className="flex-1 relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100000"
                                  value={priceRange[0]}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value <= priceRange[1]) {
                                      setPriceRange([value, priceRange[1]]);
                                      setMinPrice(value.toString());
                                    }
                                  }}
                                  className="absolute w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                                  style={{
                                    background: `linear-gradient(to right, #0283F7 0%, #0283F7 ${(priceRange[0]/100000)*100}%, rgba(255,255,255,0.2) ${(priceRange[0]/100000)*100}%, rgba(255,255,255,0.2) 100%)`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100000"
                                  value={priceRange[1]}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= priceRange[0]) {
                                      setPriceRange([priceRange[0], value]);
                                      setMaxPrice(value.toString());
                                    }
                                  }}
                                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                              <span className="text-xs text-white/60">100K</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/60 mt-1">
                              <span>{priceRange[0]} сум</span>
                              <span>{priceRange[1]} сум</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {priceRanges.filter(range => range.id !== 'all').map(range => (
                              <button
                                key={range.id}
                                onClick={() => {
                                  setMinPrice(range.min.toString());
                                  setMaxPrice(range.max.toString());
                                  setPriceRange([range.min, range.max]);
                                }}
                                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 rounded text-xs transition-colors duration-200"
                              >
                                {range.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

        {/* Остальные фильтры */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Месяц</label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="all">Любой месяц</option>
                          {months.map((month, index) => (
                            <option key={index} value={index.toString()}>{month}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Длительность</label>
                        <select
                          value={selectedDuration}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {durations.map(duration => (
                            <option key={duration.id} value={duration.id}>{duration.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Время</label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot.id} value={slot.id}>{slot.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">День недели</label>
                        <select
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {weekDays.map(day => (
                            <option key={day.id} value={day.id}>{day.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Формат</label>
                        <div className="flex gap-1">
                          {formats.map(format => {
                            const Icon = format.icon;
                            return (
                              <button
                                key={format.id}
                                onClick={() => setSelectedFormat(format.id)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1 ${
                                  selectedFormat === format.id
                                    ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                                }`}
                              >
                                {Icon && <Icon size={12} />}
                                {format.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Язык</label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {languages.map(language => (
                            <option key={language.id} value={language.id}>{language.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Сортировка</label>
                        <div className="flex gap-1">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {sortOptions.map(option => (
                              <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                              sortOrder === 'desc'
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                            title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
                          >
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Быстрые фильтры по категориям */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Категории</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {categories.map(category => {
                          const Icon = category.icon;
                          const count = category.id === 'all' 
                            ? Object.keys(events).length 
                            : Object.values(events).filter(e => e.category === category.id).length;
                          
                          return (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 ${
                                selectedCategory === category.id
                                  ? 'text-white border-2'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20 border-2 border-transparent'
                              }`}
                              style={{
                                backgroundColor: selectedCategory === category.id ? `${category.color}30` : undefined,
                                borderColor: selectedCategory === category.id ? `${category.color}80` : undefined,
                                color: selectedCategory === category.id ? category.color : undefined
                              }}
                            >
                              <Icon size={14} />
                              <span className="truncate">{category.name.split(' ')[0]}</span>
                              <span className="text-xs opacity-70">({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
  );
});

// ======================== EVENT CARD COMPONENT ========================
const EventCard = memo(({ event, dateKey, openEventDetails }: {
  event: Event;
  dateKey: string;
  openEventDetails: (date: Date, event: any) => void;
}) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const eventDate = new Date(year, month, day);
  
  return (
    <div
      className="group bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:scale-[1.02]"
      onClick={() => openEventDetails(eventDate, { stopPropagation: () => {} })}
    >
      {/* Изображение с индикаторами */}
      <div className="relative h-48 sm:h-56">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-event.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Бейджи */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {event.format === 'онлайн' ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Monitor size={10} /> Онлайн
            </span>
          ) : (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <MapPin size={10} /> Офлайн
            </span>
          )}
          {event.priority === 'high' && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> Хит
            </span>
          )}
                              </div>

        {/* Категория */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full capitalize">
            {event.category}
          </span>
              </div>

        {/* Язык */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
            <Globe size={10} /> {event.language}
          </span>
                    </div>
                  </div>

      {/* Контент */}
      <div className="p-4 space-y-3">
        {/* Заголовок */}
        <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
          {event.title}
        </h3>

        {/* Описание */}
        <p className="text-white/70 text-sm line-clamp-2">
          {event.shortDescription}
        </p>

        {/* Даты и время */}
        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {eventDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                            </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {event.startTime} - {event.endTime}
          </span>
                  </div>
                  
        {/* Количество мест */}
        <div className="flex items-center gap-1 text-sm text-white/80">
          <User size={14} className="text-blue-400" />
          <span className="text-white/80">
            Осталось мест: <span className="font-semibold text-blue-300">{event.remainingSeats}</span>
                            </span>
                    </div>

        {/* Цена и скидки */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
            {event.discountPercent > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-white/50 line-through text-sm">{event.originalPrice} сум</span>
                <span className="text-white font-bold text-lg">{event.currentPrice} сум</span>
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Percent size={10} /> -{event.discountPercent}%
                        </span>
                    </div>
            ) : (
              <span className="text-white font-bold text-lg">{event.currentPrice} сум</span>
                  )}
                </div>
                        </div>

        {/* Таймер */}
        <div className="bg-white/5 rounded-lg p-3">
          {event.discountPercent > 0 ? (
            <div className="text-center">
              <div className="text-xs text-white/60 mb-1">Скидка действует</div>
              <div className="text-red-400 font-bold flex items-center justify-center gap-1">
                <Timer size={14} />
                {Utils.formatTimeLeft(event.discountEndTime)}
                      </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-xs text-white/60 mb-1">До начала</div>
              <div className="text-blue-400 font-bold flex items-center justify-center gap-1">
                <Clock size={14} />
                {Utils.formatTimeLeft(new Date(event.startDate + 'T' + event.startTime))}
                      </div>
            </div>
                  )}
            </div>

        {/* Теги */}
        <div className="flex flex-wrap gap-1">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="text-white/50 text-xs">+{event.tags.length - 3}</span>
          )}
                      </div>
                    </div>
                      </div>
  );
});

// ======================== CALENDAR GRID COMPONENT ========================
const CalendarGrid = memo(({ 
  viewMode, 
  currentDate, 
  currentWeek, 
  events, 
  eventMatchesFilters, 
  openEventDetails,
  isMobile,
  getCurrentWeek 
}) => {
  const hasEvent = useCallback((day) => {
    const dateKey = Utils.formatDateKey(day);
    const event = events[dateKey];
    if (!event) return null;
    
    if (!eventMatchesFilters(event)) return null;
    return event;
  }, [events, eventMatchesFilters]);

  if (viewMode === 'week') {
    return (
      <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(90vh-300px)] overflow-y-auto custom-scrollbar">
                  {getCurrentWeek().map((day, index) => {
                    const eventData = hasEvent(day);
          const isOtherMonth = !Utils.isCurrentMonth(day, currentDate);
          const todayClass = Utils.isToday(day);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden
                          ${isOtherMonth ? 'opacity-60' : 'opacity-100'}
                          ${todayClass ? 'ring-2 ring-blue-400' : ''}
                          hover:scale-[1.02] hover:shadow-xl
                          h-24 sm:h-32 md:h-36
                        `}
                        style={{
                          backgroundColor: eventData ? 'transparent' : 'rgba(255,255,255,0.05)',
                          border: `2px solid #0283F7`
                        }}
                        onClick={() => {
                          if (eventData) {
                            openEventDetails(day, { stopPropagation: () => {} });
                          }
                        }}
                      >
                        {/* Фоновое изображение события */}
                        {eventData && (
                          <div
                            className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundImage: `url(${eventData.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
                          </div>
                        )}
                        
                        {/* Информация о дне */}
                        <div className="absolute inset-0 flex items-center">
                          <div className="flex-1 flex items-center justify-between p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="text-center text-white">
                                <div className={`
                                  text-lg sm:text-2xl font-bold
                                  ${todayClass && !eventData ? 'text-blue-400' : ''}
                                `}>
                                  {day.getDate()}
                                </div>
                                <div className="text-xs sm:text-sm opacity-80">
                        {CONSTANTS.weekDaysNames[index]}
                                </div>
                              </div>
                              
                              {eventData && (
                                <div className="text-white">
                                  <div className="text-sm sm:text-base font-medium flex items-center gap-2">
                                    {eventData.title}
                                    <div 
                                      className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: Utils.getPriorityColor(eventData.priority) }}
                                    ></div>
                                  </div>
                                  <div className="text-xs sm:text-sm opacity-80 flex items-center gap-2">
                                    <Clock size={12} />
                                    {eventData.time}
                                    <User size={12} />
                                    Осталось: {eventData.remainingSeats} мест
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Кнопка подробнее */}
                            {eventData && (
                              <button
                                onClick={(e) => openEventDetails(day, e)}
                                className="px-3 py-2 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors duration-200 text-xs sm:text-sm"
                              >
                                Подробнее
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
    );
  }

  return (
                <div>
                  {/* Дни недели */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 p-3 sm:p-6 pb-0">
        {CONSTANTS.weekDaysShort.map(day => (
                      <div key={day} className="text-center text-xs sm:text-sm font-semibold py-2 sm:py-3 text-white/70">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Календарная сетка */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 p-3 sm:p-6 max-h-[calc(90vh-350px)] overflow-y-auto custom-scrollbar">
        {Utils.getDaysInMonth(currentDate).map((day, index) => {
                      const eventData = hasEvent(day);
          const isOtherMonth = !Utils.isCurrentMonth(day, currentDate);
          const todayClass = Utils.isToday(day);
                      
                      return (
                        <div
                          key={index}
                          className={`
                            relative group cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden
                            ${isOtherMonth ? 'opacity-30' : 'opacity-100'}
                            ${todayClass ? 'ring-2 ring-blue-400' : ''}
                            ${eventData ? 'hover:scale-105 hover:shadow-lg' : ''}
                            h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32
                          `}
                          style={{
                            backgroundColor: eventData ? 'transparent' : 'rgba(255,255,255,0.05)',
                            border: `2px solid #0283F7`
                          }}
                          onClick={(e) => {
                            if (eventData) {
                              openEventDetails(day, e);
                            }
                          }}
                        >
                          {/* Фоновое изображение события */}
                          {eventData && (
                            <div
                              className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${eventData.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute top-1 right-1">
                                <div className="flex gap-1">
                                  <div 
                                    className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: Utils.getStatusColor(eventData.status) }}
                                  ></div>
                                  <div 
                                    className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: Utils.getPriorityColor(eventData.priority) }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Число */}
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                            <span className={`
                              text-xs sm:text-sm font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg
                              ${eventData ? 'bg-white/90 text-gray-900' : 'text-white'}
                              ${todayClass && !eventData ? 'bg-blue-500 text-white' : ''}
                            `}>
                              {day.getDate()}
                            </span>
                          </div>

                          {/* Подсказка для мероприятий */}
                          {eventData && (
                            <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="text-center">
                                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                                  {eventData.title}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
  );
});

// ======================== EVENTS LIST WITH PAGINATION ========================
const EventsList = memo(({ 
  events, 
  currentPage, 
  setCurrentPage, 
  itemsPerPage, 
  isMobile, 
  clearAllFilters,
  openEventDetails 
}) => {
  const { events: paginatedEvents, totalPages, totalItems } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      events: events.slice(startIndex, endIndex),
      totalPages: Math.ceil(events.length / itemsPerPage),
      totalItems: events.length
    };
  }, [events, currentPage, itemsPerPage]);

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Заголовок с информацией */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <List size={20} style={{ color: '#0283F7' }} />
          Мероприятия
          <span className="text-sm font-normal text-white/60">
            ({totalItems} найдено)
          </span>
        </h3>
      </div>

      {/* Сетка мероприятий с вертикальным скроллом */}
      <div className="max-h-[calc(90vh-250px)] overflow-y-auto custom-scrollbar pr-2">
        <div 
          className={`grid gap-4 sm:gap-6 ${
            isMobile 
              ? 'grid-cols-1' 
              : 'lg:grid-cols-2'
          }`}
        >
          {paginatedEvents.map(([dateKey, event]) => (
            <EventCard 
              key={dateKey} 
              event={event} 
              dateKey={dateKey} 
              openEventDetails={openEventDetails}
            />
          ))}
        </div>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Назад
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 1
              )
              .map((page, index, filteredPages) => (
                <React.Fragment key={page}>
                  {index > 0 && filteredPages[index - 1] !== page - 1 && (
                    <span className="px-2 py-2 text-white/50">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))
            }
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
          >
            Вперед
            <ChevronRight size={16} />
          </button>
                    </div>
      )}

      {/* Сообщение если ничего не найдено */}
      {totalItems === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-white/50" />
                  </div>
          <div className="text-white/50 text-xl mb-4">Мероприятия не найдены</div>
          <div className="text-white/30 text-sm mb-6">
            Попробуйте изменить фильтры или поисковый запрос
          </div>
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
          >
            Сбросить все фильтры
          </button>
                </div>
              )}
            </div>
  );
});

// ======================== EVENT DETAILS COMPONENT ========================
const EventDetails = memo(({ eventDetails, onClose }) => {
  if (!eventDetails) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-60 animate-in fade-in duration-300">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl custom-scrollbar">
        <div className="sticky top-0 z-10 p-6 border-b border-white/10 backdrop-blur-sm bg-gray-900/90">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Детали мероприятия</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Изображение */}
          <div className="relative">
            <img 
              src={eventDetails.image} 
              alt={eventDetails.title}
              className="w-full h-48 object-cover rounded-xl"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <div 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: Utils.getStatusColor(eventDetails.status) }}
              >
                {eventDetails.status === 'active' ? 'Активное' : 'Завершенное'}
              </div>
              <div 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: Utils.getPriorityColor(eventDetails.priority) }}
              >
                {eventDetails.priority === 'high' ? 'Важное' : eventDetails.priority === 'medium' ? 'Среднее' : 'Обычное'}
              </div>
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">{eventDetails.title}</h1>
            <p className="text-white/80 text-lg">{eventDetails.description || eventDetails.shortDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Дата</span>
                </div>
                <div className="text-white font-semibold">
                  {eventDetails.date ? eventDetails.date.toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Дата не указана'}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Время</span>
                </div>
                <div className="text-white font-semibold">{eventDetails.time}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <User size={16} />
                  <span className="text-sm font-medium">Мест осталось</span>
                </div>
                <div className="text-white font-semibold">{eventDetails.remainingSeats} из {eventDetails.totalSeats}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Ticket size={16} />
                  <span className="text-sm font-medium">Цена</span>
                </div>
                <div className="text-white font-semibold">
                  {eventDetails.discountPercent > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-white/50">{eventDetails.originalPrice} сум</span>
                      <span>{eventDetails.currentPrice} сум</span>
                      <span className="text-red-400 text-sm">-{eventDetails.discountPercent}%</span>
                    </div>
                  ) : (
                    <span>{eventDetails.currentPrice} сум</span>
                  )}
                </div>
              </div>
            </div>

            {/* Теги */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <Tag size={16} />
                <span className="text-sm font-medium">Теги</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventDetails.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Кнопка действия */}
            <div className="pt-4">
              <button
                onClick={() => {
                  if (SecurityUtils.validateUrl('https://yandex.uz')) {
                    const sanitizedUrl = sanitizeUrl('https://yandex.uz');
                if (sanitizedUrl !== '#') {
                  window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
                }
                  }
                }}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-200"
              >
                Зарегистрироваться на мероприятие
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ======================== STATISTICS COMPONENT ========================
const Statistics = memo(({ events, showStats, setShowStats, setActiveFilter }) => {
  if (!showStats) return null;

  const getEventStats = useCallback(() => {
    const allEvents = Object.values(events);
    const activeEvents = allEvents.filter(e => e.status === 'active');
    const completedEvents = allEvents.filter(e => e.status === 'completed');
    const discountedEvents = allEvents.filter(e => e.discountPercent > 0);
    const freeEvents = allEvents.filter(e => e.currentPrice === 0);
    const totalSeats = allEvents.reduce((sum, e) => sum + e.totalSeats, 0);
    const remainingSeats = allEvents.reduce((sum, e) => sum + e.remainingSeats, 0);
    const totalRevenue = allEvents.reduce((sum, e) => sum + (e.currentPrice * (e.totalSeats - e.remainingSeats)), 0);

    return {
      total: allEvents.length,
      active: activeEvents.length,
      completed: completedEvents.length,
      discounted: discountedEvents.length,
      free: freeEvents.length,
      totalSeats,
      remainingSeats,
      occupancyRate: totalSeats > 0 ? Math.round(((totalSeats - remainingSeats) / totalSeats) * 100) : 0,
      totalRevenue
    };
  }, [events]);

  const stats = useMemo(() => getEventStats(), [getEventStats]);

  return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-60 animate-in fade-in duration-300">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl custom-scrollbar">
            <div className="sticky top-0 z-10 p-6 border-b border-white/10 backdrop-blur-sm bg-gray-900/90">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp size={24} className="text-orange-400" />
                  Статистика мероприятий
                </h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200 text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
                    {/* Основная статистика */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                        <div className="text-sm text-white/70">Всего мероприятий</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.active}</div>
                        <div className="text-sm text-white/70">Активных</div>
                      </div>
                      <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gray-400">{stats.completed}</div>
                        <div className="text-sm text-white/70">Завершенных</div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">{stats.discounted}</div>
                        <div className="text-sm text-white/70">Со скидкой</div>
                      </div>
                    </div>

                    {/* Статистика мест */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-400" />
                        Заполняемость мероприятий
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{stats.totalSeats}</div>
                          <div className="text-sm text-white/60">Общее количество мест</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-orange-400">{stats.remainingSeats}</div>
                          <div className="text-sm text-white/60">Свободных мест</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-400">{stats.occupancyRate}%</div>
                          <div className="text-sm text-white/60">Заполняемость</div>
                        </div>
                      </div>
                      
                      {/* Прогресс бар заполняемости */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${stats.occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Статистика по категориям */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Grid size={20} className="text-purple-400" />
                        Распределение по категориям
                      </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto custom-scrollbar">
              {CONSTANTS.categories.filter(cat => cat.id !== 'all').map(category => {
                          const categoryCount = Object.values(events).filter(e => e.category === category.id).length;
                          const Icon = category.icon;
                          return (
                            <div key={category.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2">
                              <Icon size={16} className="text-blue-400" />
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">{category.name}</div>
                                <div className="text-white/60 text-xs">{categoryCount} мероприятий</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Быстрые действия */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setActiveFilter('active');
                            setShowStats(false);
                          }}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <Filter size={14} />
                          Показать активные
                        </button>
                        <button
                          onClick={() => {
                            setActiveFilter('discounted');
                            setShowStats(false);
                          }}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <Percent size={14} />
                          Показать со скидкой
                        </button>
                        <button
                          onClick={() => {
                            setActiveFilter('high');
                            setShowStats(false);
                          }}
                          className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <TrendingUp size={14} />
                          Показать популярные
                        </button>
                      </div>
                    </div>
            </div>
          </div>
    </div>
  );
});

// ======================== MAIN CALENDAR COMPONENT ========================
const EventCalendar = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [eventDetails, setEventDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('month');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showStats, setShowStats] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  
  // Состояния загрузки и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Performance optimizations
  const isOnline = useOnlineStatus();
  
  // Calculate items per page based on device
  const itemsPerPage = useMemo(() => {
    return isMobile ? CONSTANTS.PAGINATION.MOBILE : CONSTANTS.PAGINATION.DESKTOP;
  }, [isMobile]);

  // ======================== EFFECTS ========================
  
  // SEO and device detection
  useEffect(() => {
    document.title = "Календарь мероприятий - Найди свое идеальное событие | EventHub";
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setViewMode('week');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ======================== SEARCH LOGIC ========================
  
  const generateSearchSuggestions = useCallback((term) => {
    if (!term || term.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = [];
    const searchLower = term.toLowerCase();
    
    // Поиск по названиям и описаниям
    Object.values(events).forEach(event => {
      if (event.title.toLowerCase().includes(searchLower) || 
          event.shortDescription.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'event',
          text: event.title,
          subtitle: event.shortDescription,
          image: event.image,
          category: event.category,
          price: event.currentPrice,
          discount: event.discountPercent
        });
      }
    });

    // Поиск по категориям
    CONSTANTS.categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(searchLower) && cat.id !== 'all') {
        const categoryEvents = Object.values(events).filter(e => e.category === cat.id);
        if (categoryEvents.length > 0) {
          suggestions.push({
            type: 'category',
            text: cat.name,
            subtitle: `${categoryEvents.length} мероприятий`,
            category: cat.id,
            color: cat.color
          });
        }
      }
    });

    // Поиск по тегам
    const allTags = [...new Set(Object.values(events).flatMap(e => e.tags))];
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(searchLower)) {
        const tagEvents = Object.values(events).filter(e => e.tags.includes(tag));
        suggestions.push({
          type: 'tag',
          text: `#${tag}`,
          subtitle: `${tagEvents.length} мероприятий`,
          tag: tag
        });
      }
    });

    setSearchSuggestions(suggestions.slice(0, 12));
    setShowSuggestions(suggestions.length > 0);
  }, [events]);

  // Дебаунсированный поиск с улучшенной производительностью
  const debouncedSearchSuggestions = useMemo(
    () => debounce((value: string) => {
      if (!value || value.length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const suggestions: SearchSuggestion[] = [];
      const searchLower = value.toLowerCase();
      
      // Поиск по названиям и описаниям (ограниченный)
      Object.values(events).slice(0, 50).forEach(event => {
        if (event.title.toLowerCase().includes(searchLower) || 
            event.shortDescription.toLowerCase().includes(searchLower)) {
          suggestions.push({
            type: 'event',
            text: event.title,
            subtitle: event.shortDescription,
            image: event.image,
            category: event.category,
            price: event.currentPrice,
            discount: event.discountPercent
          });
        }
      });

      // Поиск по категориям
      CONSTANTS.categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(searchLower) && cat.id !== 'all') {
          const categoryEvents = Object.values(events).filter(e => e.category === cat.id);
          if (categoryEvents.length > 0) {
            suggestions.push({
              type: 'category',
              text: cat.name,
              subtitle: `${categoryEvents.length} мероприятий`,
              category: cat.id,
              color: cat.color
            });
          }
        }
      });

      setSearchSuggestions(suggestions.slice(0, 8));
      setShowSuggestions(suggestions.length > 0);
    }, 400),
    [events]
  );

  const debouncedHistoryUpdate = useMemo(
    () => debounce((value: string) => {
      if (value.length > 2 && !searchHistory.includes(value)) {
        setSearchHistory(prev => [value, ...prev].slice(0, 5));
      }
    }, 1000),
    [searchHistory]
  );

  const handleSearchChange = useCallback((value: string) => {
    const sanitizedValue = sanitizeHtml(value);
    setSearchTerm(sanitizedValue);
    
    // Немедленно показываем/скрываем подсказки
    if (!sanitizedValue || sanitizedValue.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } else {
      debouncedSearchSuggestions(sanitizedValue);
    }
    
    // Обновляем историю с задержкой
    debouncedHistoryUpdate(sanitizedValue);
  }, [debouncedSearchSuggestions, debouncedHistoryUpdate]);

  const selectSuggestion = useCallback((suggestion) => {
    if (suggestion.type === 'event') {
      setSearchTerm(suggestion.text);
    } else if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.category);
      setSearchTerm('');
    } else if (suggestion.type === 'tag') {
      setSearchTerm(suggestion.tag);
    }
    setShowSuggestions(false);
  }, []);

  // ======================== FILTER LOGIC ========================
  
  const eventMatchesFilters = useCallback((event) => {
    // Фильтр по статусу/важности
    if (activeFilter !== 'all') {
      if (activeFilter === 'active' && event.status !== 'active') return false;
      if (activeFilter === 'completed' && event.status !== 'completed') return false;
      if (activeFilter === 'discounted' && event.discountPercent === 0) return false;
      if (activeFilter === 'high' && event.priority !== 'high') return false;
      if (activeFilter === 'free' && event.currentPrice !== 0) return false;
      if (activeFilter === 'premium' && event.currentPrice <= 30000) return false;
      if (activeFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        if (event.startDate !== today) return false;
      }
    }

    // Фильтр по категории
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;

    // Фильтр по языку
    if (selectedLanguage !== 'all' && event.language !== selectedLanguage) return false;

    // Фильтр по формату
    if (selectedFormat !== 'all' && event.format !== selectedFormat) return false;

    // Фильтр по длительности
    if (selectedDuration !== 'all' && event.duration !== selectedDuration) return false;

    // Фильтр по времени суток
    if (selectedTime !== 'all') {
      const hour = parseInt(event.startTime.split(':')[0]);
      if (selectedTime === 'утро' && (hour < 6 || hour >= 12)) return false;
      if (selectedTime === 'день' && (hour < 12 || hour >= 18)) return false;
      if (selectedTime === 'вечер' && (hour < 18 || hour >= 23)) return false;
      if (selectedTime === 'ночь' && (hour < 23 && hour >= 6)) return false;
    }

    // Фильтр по дню недели
    if (selectedDay !== 'all' && event.dayOfWeek !== selectedDay) return false;

    // Фильтр по месяцу
    if (selectedMonth !== 'all') {
      const eventMonth = event.date ? event.date.getMonth() : -1;
      if (eventMonth !== parseInt(selectedMonth)) return false;
    }

    // Фильтр по цене
    const minPriceValue = minPrice ? parseInt(minPrice) : 0;
    const maxPriceValue = maxPrice ? parseInt(maxPrice) : 100000;
    if (event.currentPrice < minPriceValue || event.currentPrice > maxPriceValue) return false;

    // Поиск
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const searchableText = [
        event.title,
        event.shortDescription,
        event.location,
        event.organizer,
        ...event.tags
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(search)) return false;
    }

    return true;
  }, [activeFilter, selectedCategory, selectedLanguage, selectedFormat, selectedDuration, 
      selectedTime, selectedDay, selectedMonth, minPrice, maxPrice, searchTerm]);

  // ======================== NAVIGATION ========================
  
  // Мемоизированные календарные вычисления
  const currentWeekData = useMemo(() => {
    const weeks = Utils.getWeeksInMonth(currentDate);
    return weeks[currentWeek] || weeks[0];
  }, [currentDate, currentWeek]);

  const currentMonthData = useMemo(() => {
    return Utils.getDaysInMonth(currentDate);
  }, [currentDate]);

  const weekRange = useMemo(() => {
    const week = currentWeekData;
    if (!week.length) return '';
    const start = week[0];
    const end = week[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]}`;
    } else {
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    }
  }, [currentWeekData]);

  const navigateWeek = useCallback((direction) => {
    const weeks = Utils.getWeeksInMonth(currentDate);
    const newWeek = currentWeek + direction;
    
    if (newWeek >= 0 && newWeek < weeks.length) {
      setCurrentWeek(newWeek);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + direction);
      setCurrentDate(newDate);
      setCurrentWeek(direction > 0 ? 0 : Utils.getWeeksInMonth(newDate).length - 1);
    }
  }, [currentDate, currentWeek]);

  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setCurrentWeek(0);
  }, []);

  const getWeekRange = useCallback(() => {
    const week = getCurrentWeek();
    if (!week.length) return '';
    const start = week[0];
    const end = week[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${CONSTANTS.months[start.getMonth()]}`;
    } else {
      return `${start.getDate()} ${CONSTANTS.months[start.getMonth()]} - ${end.getDate()} ${CONSTANTS.months[end.getMonth()]}`;
    }
  }, [getCurrentWeek]);

  const openEventDetails = useCallback((day, event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    
    const dateKey = Utils.formatDateKey(day);
    const eventData = events[dateKey];
    
    if (eventData) {
      setEventDetails(eventData);
    }
  }, [events]);

  // ======================== FILTERS AND SORTING ========================
  
  const filters = useMemo(() => [
    { id: 'all', name: 'Все', count: Object.keys(events).length, icon: Grid },
    { id: 'active', name: 'Активные', count: Object.values(events).filter(e => e.status === 'active').length, icon: TrendingUp },
    { id: 'completed', name: 'Завершенные', count: Object.values(events).filter(e => e.status === 'completed').length, icon: Clock },
    { id: 'discounted', name: 'Со скидкой', count: Object.values(events).filter(e => e.discountPercent > 0).length, icon: Percent },
    { id: 'high', name: 'Популярные', count: Object.values(events).filter(e => e.priority === 'high').length, icon: Star },
    { id: 'today', name: 'Сегодня', count: 0, icon: Calendar },
    { id: 'free', name: 'Бесплатные', count: Object.values(events).filter(e => e.currentPrice === 0).length, icon: Ticket },
    { id: 'premium', name: 'Премиум', count: Object.values(events).filter(e => e.currentPrice > 30000).length, icon: Award }
  ], [events]);

  // Мемоизированная фильтрация и сортировка событий
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = Object.entries(events).filter(([_, event]) => eventMatchesFilters(event));

    // Сортировка
    filtered.sort(([dateKeyA, eventA], [dateKeyB, eventB]) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = eventA.date || new Date(0);
          const dateB = eventB.date || new Date(0);
          compareValue = dateA.getTime() - dateB.getTime();
          break;
        case 'price':
          compareValue = eventA.currentPrice - eventB.currentPrice;
          break;
        case 'popularity':
          compareValue = (eventB.totalSeats - eventB.remainingSeats) - (eventA.totalSeats - eventA.remainingSeats);
          break;
        case 'name':
          compareValue = eventA.title.localeCompare(eventB.title, 'ru');
          break;
        case 'seats':
          compareValue = eventB.remainingSeats - eventA.remainingSeats;
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return filtered;
  }, [events, eventMatchesFilters, sortBy, sortOrder]);

  // Мемоизированная пагинация
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedEvents.slice(startIndex, endIndex);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  // Мемоизированная статистика
  const eventStats = useMemo(() => {
    const totalEvents = Object.keys(events).length;
    const activeEvents = Object.values(events).filter(e => e.status === 'active').length;
    const discountedEvents = Object.values(events).filter(e => e.discountPercent > 0).length;
    const freeEvents = Object.values(events).filter(e => e.currentPrice === 0).length;
    
    return {
      total: totalEvents,
      active: activeEvents,
      discounted: discountedEvents,
      free: freeEvents,
      totalPages: Math.ceil(filteredAndSortedEvents.length / itemsPerPage)
    };
  }, [events, filteredAndSortedEvents.length, itemsPerPage]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setActiveFilter('all');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedFormat('all');
    setSelectedDuration('all');
    setSelectedTime('all');
    setSelectedDay('all');
    setSelectedMonth('all');
    setSelectedYear('all');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    setPriceRange([0, 100000]);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ======================== RENDER ========================
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        {/* SEO заголовок страницы */}
        <header className="sr-only">
          <h1>Календарь мероприятий - EventHub</h1>
          <p>Лучшие мероприятия, конференции, концерты и мастер-классы в вашем городе</p>
        </header>

        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-[9999]">
            <WifiOff size={16} className="inline mr-2" />
            Нет подключения к интернету
        </div>
      )}

        <div className="flex items-center justify-center p-4">
          {/* Главная кнопка открытия */}
                <button
            onClick={() => setIsOpen(true)}
            className="group relative overflow-hidden text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
            style={{
              background: `linear-gradient(135deg, #0283F7 0%, #18142e 100%)`,
            }}
            aria-label="Открыть календарь мероприятий"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Calendar size={24} />
              Календарь мероприятий
              {getFilteredEvents().length > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  {getFilteredEvents().length}
                </span>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
            </div>

        {/* Главный попап */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 z-50 animate-in fade-in duration-300">
            <div 
              className="relative w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden rounded-xl sm:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300"
              style={{ backgroundColor: '#18142e' }}
            >
              {/* Заголовок с поиском */}
              <div className="sticky top-0 z-10 p-3 sm:p-6 border-b border-white/10 backdrop-blur-sm" style={{ backgroundColor: '#18142e' }}>
                {/* Компонент поиска */}
                <SearchComponent 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchSuggestions={searchSuggestions}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  searchHistory={searchHistory}
                  onSuggestionSelect={selectSuggestion}
                  onSearchChange={handleSearchChange}
                  advancedSearch={advancedSearch}
                  setAdvancedSearch={setAdvancedSearch}
                  onClose={() => setIsOpen(false)}
                  isMobile={isMobile}
                  showMobileMenu={showMobileMenu}
                  setShowMobileMenu={setShowMobileMenu}
                />

                {/* Расширенные фильтры */}
                {advancedSearch && (
                  <AdvancedFiltersComponent 
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDuration={selectedDuration}
                    setSelectedDuration={setSelectedDuration}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    clearAllFilters={clearAllFilters}
                    months={CONSTANTS.months}
                    durations={CONSTANTS.durations}
                    timeSlots={CONSTANTS.timeSlots}
                    weekDays={CONSTANTS.weekDays}
                    formats={CONSTANTS.formats}
                    languages={CONSTANTS.languages}
                    sortOptions={CONSTANTS.sortOptions}
                    priceRanges={CONSTANTS.priceRanges}
                    categories={CONSTANTS.categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    events={events}
                  />
                )}

                {/* Мобильное меню фильтров */}
                {isMobile && showMobileMenu && (
                  <div className="mb-4 bg-white/5 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top duration-300 max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold">Фильтры и настройки</h4>
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm"
                      >
                        Очистить
                      </button>
                  </div>

                    {/* Режим просмотра для мобильных */}
                    <div>
                      <h5 className="text-white/80 font-medium mb-2 text-sm">Режим просмотра</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('week')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1 ${
                            viewMode === 'week'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          <List size={12} />
                          Неделя
                        </button>
                        <button
                          onClick={() => setViewMode('month')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1 ${
                            viewMode === 'month'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          <Grid size={12} />
                          Месяц
                        </button>
                        <button
                          onClick={() => setShowAllEvents(true)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1 ${
                            showAllEvents
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          <List size={12} />
                          Список
                        </button>
                  </div>
                    </div>

                    {/* Быстрые фильтры */}
                    <div>
                      <h5 className="text-white/80 font-medium mb-2 text-sm">Быстрые фильтры</h5>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {filters.map(filter => {
                          const Icon = filter.icon;
                          return (
                            <button
                              key={filter.id}
                              onClick={() => setActiveFilter(filter.id)}
                              className={`px-3 py-2 rounded-lg text-xs transition-colors duration-200 flex items-center gap-1 ${
                                activeFilter === filter.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white/10 text-white/70'
                              }`}
                            >
                              <Icon size={10} />
                              {filter.name}
                              <span className="bg-white/20 px-1 py-0.5 rounded text-xs">{filter.count}</span>
                            </button>
                          );
                        })}
                </div>
              </div>

                    {/* Категории для мобильных */}
                    <div>
                      <h5 className="text-white/80 font-medium mb-2 text-sm">Категории</h5>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {CONSTANTS.categories.map(category => {
                          const Icon = category.icon;
                          const count = category.id === 'all' 
                            ? Object.keys(events).length 
                            : Object.values(events).filter(e => e.category === category.id).length;
                          
                          return (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`px-3 py-2 rounded-lg text-xs transition-colors duration-200 flex items-center gap-1 ${
                                selectedCategory === category.id
                                  ? 'text-white border-2'
                                  : 'bg-white/10 text-white/70 border-2 border-transparent'
                              }`}
                              style={{
                                backgroundColor: selectedCategory === category.id ? `${category.color}30` : undefined,
                                borderColor: selectedCategory === category.id ? `${category.color}80` : undefined,
                                color: selectedCategory === category.id ? category.color : undefined
                              }}
                            >
                              <Icon size={10} />
                              <span className="truncate">{category.name.split(' ')[0]}</span>
                              <span className="text-xs opacity-70">({count})</span>
                            </button>
                          );
                        })}
                    </div>
                    </div>
                  </div>
                )}

                {/* Фильтры для десктопа */}
                {!isMobile && (
                  <FiltersComponent 
                    filters={filters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    categories={CONSTANTS.categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    events={events}
                    isMobile={isMobile}
                    clearAllFilters={clearAllFilters}
                  />
                )}

                {/* Навигация и режимы */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAllEvents(!showAllEvents)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-1 ${
                        showAllEvents
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <List size={14} />
                      {showAllEvents ? 'Календарь' : 'Список'}
                    </button>
                    
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-1 ${
                        showStats
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <TrendingUp size={14} />
                      <span className="hidden sm:inline">Статистика</span>
                      <span className="sm:hidden">Стат</span>
                    </button>

                    {/* Активные фильтры */}
                    {(searchTerm || activeFilter !== 'all' || selectedCategory !== 'all' || minPrice || maxPrice) && (
                      <div className="hidden sm:flex items-center gap-1">
                        <span className="text-xs text-white/60">Фильтры:</span>
                        {getFilteredEvents().length > 0 && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {getFilteredEvents().length} найдено
                          </span>
                        )}
                    </div>
                    )}
                  </div>

                        <div className="flex items-center gap-2">
                    {!showAllEvents && (
                      <>
                        {/* Индикатор текущего режима */}
                        {isMobile && (
                          <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-lg">
                            Режим: {viewMode === 'week' ? 'Неделя' : 'Месяц'}
                        </div>
                        )}

                        {/* Переключатель режима */}
                        <div className="flex bg-white/10 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('week')}
                            className={`p-2 rounded transition-all duration-200 ${
                              viewMode === 'week' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-white/70 hover:text-white'
                            }`}
                            title="Недельный вид"
                          >
                            <List size={16} />
                          </button>
                          <button
                            onClick={() => setViewMode('month')}
                            className={`p-2 rounded transition-all duration-200 ${
                              viewMode === 'month' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-white/70 hover:text-white'
                            }`}
                            title="Месячный вид"
                          >
                            <Grid size={16} />
                          </button>
                </div>

                        {/* Навигация по времени */}
                        <div className="flex items-center">
                          {viewMode === 'week' ? (
                            <>
                  <button
                                onClick={() => navigateWeek(-1)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                                style={{ color: '#0283F7' }}
                                title="Предыдущая неделя"
                              >
                                <ChevronLeft size={20} />
                  </button>
                              
                              <h3 className="text-center text-lg font-semibold text-white min-w-[200px]">
                                {getWeekRange()}
                              </h3>
                              
                              <button
                                onClick={() => navigateWeek(1)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                                style={{ color: '#0283F7' }}
                                title="Следующая неделя"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                                style={{ color: '#0283F7' }}
                                title="Предыдущий месяц"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              
                              <h2 className="text-center text-xl font-bold text-white min-w-[200px]">
                                {CONSTANTS.months[currentDate.getMonth()]} {currentDate.getFullYear()}
                              </h2>
                              
                              <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                                style={{ color: '#0283F7' }}
                                title="Следующий месяц"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </>
                          )}
                </div>
                      </>
                    )}
              </div>
                </div>
              </div>

              {/* Контент с правильным скроллингом */}
              <div className="overflow-y-auto max-h-[calc(98vh-200px)] sm:max-h-[calc(95vh-220px)] custom-scrollbar">
                {showAllEvents ? (
                  /* Список всех мероприятий с пагинацией */
                  <EventsList 
                    events={getFilteredEvents()}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    isMobile={isMobile}
                    clearAllFilters={clearAllFilters}
                    openEventDetails={openEventDetails}
                  />
                ) : (
                  /* Календарные виды */
                  <CalendarGrid 
                    viewMode={viewMode}
                    currentDate={currentDate}
                    currentWeek={currentWeek}
                    events={events}
                    eventMatchesFilters={eventMatchesFilters}
                    openEventDetails={openEventDetails}
                    isMobile={isMobile}
                    getCurrentWeek={getCurrentWeek}
                  />
                )}

                {/* Статистика фильтров */}
                {(searchTerm || activeFilter !== 'all' || selectedCategory !== 'all') && (
                  <div className="p-3 sm:p-6 pt-0">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-center text-white/60">
                        Найдено мероприятий: <span className="text-white font-semibold">{getFilteredEvents().length}</span>
                        {searchTerm && <span className="block text-sm mt-1">по запросу "{searchTerm}"</span>}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

        {/* Статистика мероприятий */}
        <Statistics 
          events={events}
          showStats={showStats}
          setShowStats={setShowStats}
          setActiveFilter={setActiveFilter}
        />

        {/* Детали мероприятия */}
        <EventDetails 
          eventDetails={eventDetails}
          onClose={() => setEventDetails(null)}
        />

        {/* Toast notifications */}
        {toast && (
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Стили */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(2, 131, 247, 0.6);
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(2, 131, 247, 0.8);
          }
        
        /* Улучшенные анимации */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .slide-in-from-top {
          animation: slideInFromTop 0.3s ease-out;
        }
        
        .zoom-in-95 {
          animation: zoomIn 0.3s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Улучшенная прокрутка для мобильных */
        @media (max-width: 768px) {
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Стили для ползунков цены */
        .slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          background: transparent;
          outline: none;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0283F7;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(2, 131, 247, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 4px rgba(2, 131, 247, 0.3);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0283F7;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 2px rgba(2, 131, 247, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 4px rgba(2, 131, 247, 0.3);
        }
      `}</style>

      {/* Дополнительные SEO мета-теги для поисковых систем */}
      <div className="sr-only">
        <h2>Популярные категории мероприятий</h2>
        <ul>
            {CONSTANTS.categories.filter(cat => cat.id !== 'all').map(category => (
            <li key={category.id}>
              {category.name} - лучшие мероприятия в категории
            </li>
          ))}
        </ul>
        
        <h2>Форматы проведения</h2>
        <ul>
          <li>Онлайн мероприятия - участвуйте из дома</li>
          <li>Офлайн события - живое общение и нетворкинг</li>
        </ul>
        
        <h2>Ценовые категории</h2>
        <ul>
          <li>Бесплатные мероприятия для всех</li>
            <li>Бюджетные события до 10000 сум</li>
          <li>Премиум мероприятия высокого качества</li>
        </ul>
              </div>
              </div>
    </ErrorBoundary>
  );
};

// Обернуть в Error Boundary для обработки ошибок
const EventCalendarWithErrorBoundary: React.FC = () => (
  <EventCalendarErrorBoundary>
    <EventCalendar />
  </EventCalendarErrorBoundary>
);

export default EventCalendarWithErrorBoundary;