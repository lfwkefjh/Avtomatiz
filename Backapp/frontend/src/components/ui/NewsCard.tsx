'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsItem } from '@/data/mock/newsData';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { calculateReadTime, formatReadTime } from '@/utils/readTime';
import { glowEffects, buttonAnimations } from '@/config/glowEffects';
import { newsConfig } from '@/config/newsConfig';
import { getDeviceAnalytics } from '@/utils/deviceDetection';

interface NewsCardProps {
  news: NewsItem;
  priority?: boolean;
  className?: string;
}

interface NewsTranslations {
  ru: {
    readMore: string;
    readTime: string;
    minutes: string;
  };
  en: {
    readMore: string;
    readTime: string;
    minutes: string;
  };
  uz: {
    readMore: string;
    readTime: string;
    minutes: string;
  };
}

const translations: NewsTranslations = {
  ru: {
    readMore: "Подробнее",
    readTime: "Время чтения",
    minutes: "мин"
  },
  en: {
    readMore: "Read More",
    readTime: "Read time",
    minutes: "min"
  },
  uz: {
    readMore: "Batafsil",
    readTime: "O'qish vaqti",
    minutes: "daq"
  }
};

export default function NewsCard({ news, priority = false, className = "" }: NewsCardProps) {
  const { currentLocale } = useLanguage();
  const { t } = useTranslation();
  
  // Динамически вычисляем время чтения для текущего языка
  const currentContent = news.content[currentLocale as keyof typeof news.content];
  const readTime = calculateReadTime(currentContent, currentLocale);
  const formattedReadTime = formatReadTime(readTime, currentLocale);

  // Функция для обрезки текста (используем конфиг)
  const truncateText = (text: string, maxLength: number = newsConfig.textLimits.excerptMaxLength): string => {
    if (!newsConfig.textLimits.enableTruncation || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Аналитика - трекинг просмотра карточки
  const trackNewsView = () => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      // Отправляем аналитику
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'news_card_view',
          newsId: news.id,
          newsTitle: news.title[currentLocale as keyof typeof news.title],
          category: news.category[currentLocale as keyof typeof news.category],
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  // Аналитика - трекинг клика на карточку
  const trackNewsClick = () => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'news_card_click',
          newsId: news.id,
          newsTitle: news.title[currentLocale as keyof typeof news.title],
          category: news.category[currentLocale as keyof typeof news.category],
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          readTime: readTime,
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  // Аналитика - трекинг hover
  const trackNewsHover = () => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'news_card_hover',
          newsId: news.id,
          newsTitle: news.title[currentLocale as keyof typeof news.title],
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === 'uz' ? 'uz-UZ' : currentLocale === 'en' ? 'en-US' : 'ru-RU');
  };

  React.useEffect(() => {
    trackNewsView();
  }, []);

  return (
    <div 
      className={`group relative w-[486px] h-[568px] bg-[rgba(25,21,52,0.75)] border border-[#0184F8] rounded-[16px] overflow-hidden cursor-pointer transition-all duration-${glowEffects.newsCards.duration} hover:border-[#0396FF] hover:scale-[1.02] hover:shadow-[inset_0_0_20px_1px_rgba(1,132,244,0.4)] hover:z-50 ${className}`}
      style={{
        '--glow-blur': `${glowEffects.newsCards.blurRadius}px`,
        '--glow-spread': `${glowEffects.newsCards.spreadRadius}px`,
        '--glow-color': glowEffects.newsCards.color,
        '--glow-opacity': glowEffects.newsCards.opacity
      } as React.CSSProperties}
      onMouseEnter={trackNewsHover}
      data-news-id={news.id}
    >
      
      {/* Изображение */}
      <div className="w-[438px] h-[200px] mx-[24px] mt-[32px] rounded-[16px] overflow-hidden">
        <Image
          src={news.image}
          alt={news.title[currentLocale as keyof typeof news.title]}
          width={438}
          height={200}
          className="w-full h-full object-cover"
          priority={priority}
        />
      </div>

      {/* Контент */}
      <div className="p-[24px] space-y-[16px] flex flex-col h-[312px]">
        {/* Категория и время чтения */}
        <div className="flex justify-between items-center">
          <span className="text-[#0396FF] text-[14px] font-inter font-medium uppercase">
            {news.category[currentLocale as keyof typeof news.category]}
          </span>
          <span className="text-[#999D9C] text-[14px] font-inter">
            {t({ ru: translations.ru.readTime, en: translations.en.readTime, uz: translations.uz.readTime })}: {formattedReadTime}
          </span>
        </div>

        {/* Заголовок */}
        <h3 className="text-white text-[24px] leading-[26.4px] font-geist font-bold transition-colors overflow-hidden" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
          {news.title[currentLocale as keyof typeof news.title]}
        </h3>

        {/* Описание */}
        <p className="text-[#999D9C] text-[18px] leading-[22px] font-inter flex-1 overflow-hidden"
           style={{
             display: '-webkit-box',
             WebkitLineClamp: 3,
             WebkitBoxOrient: 'vertical'
           }}>
          {truncateText(news.excerpt[currentLocale as keyof typeof news.excerpt])}
        </p>

        {/* Нижняя секция: дата и кнопка */}
        <div className="flex justify-between items-end mt-auto">
          {/* Дата */}
          <p className="text-[#999D9C] text-[16px] leading-[19.2px] font-inter">
            {formatDate(news.date)}
          </p>

          {/* Кнопка "Подробнее" */}
          <Link 
            href={`/${currentLocale}/news/${news.slug}`}
            onClick={trackNewsClick}
            className={`group/btn relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] text-white text-[16px] font-inter font-semibold overflow-hidden transition-all duration-${buttonAnimations.card.duration} hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/25 min-w-[120px]`}
            style={{
              '--btn-hover-scale': buttonAnimations.card.hoverScale,
              '--btn-shadow-intensity': buttonAnimations.card.shadowIntensity,
              '--btn-shine-speed': `${buttonAnimations.card.shineSpeed}ms`,
              '--btn-shine-intensity': buttonAnimations.card.shineIntensity
            } as React.CSSProperties}
          >
            {/* Градиентный overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            
            {/* Блик эффект */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${buttonAnimations.card.shineIntensity}), transparent)`,
                transitionDuration: `${buttonAnimations.card.shineSpeed}ms`
              }}
            ></div>
            
            <span className="relative z-10 mr-2 group-hover/btn:text-shadow-lg transition-all duration-300">
              {t({ ru: translations.ru.readMore, en: translations.en.readMore, uz: translations.uz.readMore })}
            </span>
            <span className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>

      {/* Featured badge */}
      {news.featured && (
        <div className="absolute top-[16px] right-[16px] bg-gradient-to-r from-[#0283F7] to-[#850191] text-white text-[12px] font-inter font-bold px-3 py-1 rounded-full">
          ⭐ TOP
        </div>
      )}


    </div>
  );
} 