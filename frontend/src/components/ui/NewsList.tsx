'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewsCard from './NewsCard';
import { newsData } from '@/data/mock/newsData';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { buttonAnimations } from '@/config/glowEffects';
import { newsConfig } from '@/config/newsConfig';

interface NewsListProps {
  limit?: number;
  showAllButton?: boolean;
  className?: string;
}

const newsTranslations = {
  ru: {
    title: "Новости",
    subtitle: "Новости ассоциации",
    allNews: "Все новости"
  },
  en: {
    title: "News",
    subtitle: "Association news",
    allNews: "All news"
  },
  uz: {
    title: "Yangiliklar",
    subtitle: "Assotsiatsiya yangiliklari",
    allNews: "Barcha yangiliklar"
  }
};

export default function NewsList({ limit = 6, showAllButton = true, className = "" }: NewsListProps) {
  const { currentLocale } = useLanguage();
  const { t } = useTranslation();
  
  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsPerSlide = newsConfig.slider.cardsPerSlide;
  const totalSlides = Math.ceil(newsData.length / cardsPerSlide);

  // Навигация слайдера
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    trackSlideNavigation('next');
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    trackSlideNavigation('prev');
  };

  // Получение текущих карточек для отображения
  const getCurrentNews = () => {
    const startIndex = currentSlide * cardsPerSlide;
    return newsData.slice(startIndex, startIndex + cardsPerSlide);
  };

  // Аналитика - трекинг просмотра секции новостей
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'news_section_view',
          newsCount: newsData.length,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname
        })
      }).catch(console.error);
    }
  }, [currentLocale]);

  // Аналитика - трекинг навигации слайдера
  const trackSlideNavigation = (direction: 'next' | 'prev') => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'news_slider_navigation',
          direction,
          currentSlide,
          totalSlides,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname
        })
      }).catch(console.error);
    }
  };

  // Аналитика - трекинг клика на "Все новости"
  const trackAllNewsClick = () => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'all_news_button_click',
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname
        })
      }).catch(console.error);
    }
  };

  return (
    <div className={`w-[1682px] h-[880px] relative ${className}`}>
      {/* Заголовок с навигацией */}
      <div className="relative mb-[151px] z-10">
        {/* Текст заголовка */}
        <div className="absolute left-[1px] w-[561px] h-[65px] z-10" style={{ top: `${newsConfig.positioning.titleTop}px` }}>
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">
            {t({ ru: newsTranslations.ru.title, en: newsTranslations.en.title, uz: newsTranslations.uz.title })}
          </h2>
        </div>
        <div className="absolute left-0 w-[547px] h-[58px] z-10" style={{ top: `${newsConfig.positioning.subtitleTop}px` }}>
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">
            {currentLocale === 'ru' && (
              <>
                <span className="text-[#0396FF]">Новости</span> ассоциации
              </>
            )}
            {currentLocale === 'en' && (
              <>
                Association <span className="text-[#0396FF]">news</span>
              </>
            )}
            {currentLocale === 'uz' && (
              <>
                Assotsiatsiya <span className="text-[#0396FF]">yangiliklari</span>
              </>
            )}
          </h1>
        </div>
        <div className="absolute left-[3px] w-[97px] h-[1px] bg-white z-10" style={{ top: `${newsConfig.positioning.lineTop}px` }}></div>

        {/* Навигационные стрелки - правый верхний угол */}
        <div className="absolute right-0 flex gap-[14px] z-20" style={{ top: `${newsConfig.positioning.navigationTop}px` }}>
          {/* Стрелка влево */}
          <button
            onClick={prevSlide}
            className="group w-[54px] h-[54px] bg-gradient-to-br from-[#0C7AF0] to-[#840191] rounded-[8px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            style={{
              transform: currentSlide === 0 ? 'scale(1)' : 'scale(1)',
              opacity: currentSlide === 0 ? 0.6 : 1
            }}
            disabled={currentSlide === 0}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white group-hover:scale-110 transition-transform duration-300 rotate-180"
            >
              <path 
                d="M14.43 5.93L20.5 12L14.43 18.07" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M20.33 12H3.67" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Стрелка вправо */}
          <button
            onClick={nextSlide}
            className="group w-[54px] h-[54px] bg-gradient-to-br from-[#0C7AF0] to-[#840191] rounded-[8px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            style={{
              transform: currentSlide === totalSlides - 1 ? 'scale(1)' : 'scale(1)',
              opacity: currentSlide === totalSlides - 1 ? 0.6 : 1
            }}
            disabled={currentSlide === totalSlides - 1}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white group-hover:scale-110 transition-transform duration-300"
            >
              <path 
                d="M14.43 5.93L20.5 12L14.43 18.07" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M20.33 12H3.67" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>


      </div>

      {/* Слайдер карточек */}
      <div className="relative h-[630px] mb-[82px] p-[30px]">
        <div className="overflow-hidden -m-[30px] p-[30px]">
          <div 
            className="flex transition-transform ease-in-out"
            style={{ 
              transform: `translateX(-${currentSlide * (newsConfig.cardDimensions.width * cardsPerSlide + newsConfig.cardDimensions.gap * cardsPerSlide)}px)`,
              width: `${newsData.length * (newsConfig.cardDimensions.width + newsConfig.cardDimensions.gap)}px`,
              transitionDuration: `${newsConfig.slider.transitionDuration}ms`
            }}
          >
            {newsData.map((news, index) => (
              <div key={news.id} className="flex-shrink-0 last:mr-0" style={{ marginRight: `${newsConfig.cardDimensions.gap}px` }}>
                <NewsCard 
                  news={news}
                  priority={index < cardsPerSlide}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка "Все новости" */}
      {showAllButton && (
        <Link 
          href={`/${currentLocale}/news`}
          onClick={trackAllNewsClick}
          className="group relative block w-full h-[54px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center overflow-hidden hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 -mt-10"
        >
          {/* Градиентный overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Блик эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <span className="relative z-10 text-white text-[20px] font-inter group-hover:text-shadow-lg transition-all duration-300 mr-4">
            {t({ ru: newsTranslations.ru.allNews, en: newsTranslations.en.allNews, uz: newsTranslations.uz.allNews })}
          </span>
          
          {/* Стрелка справа */}
          <div className="relative z-10 text-white group-hover:translate-x-2 transition-transform duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M14.43 5.93L20.5 12L14.43 18.07" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M20.33 12H3.67" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      )}
    </div>
  );
} 