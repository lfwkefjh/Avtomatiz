'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { getActiveBanners, AdBannerItem, AD_BANNER_CONFIG } from '@/data/mock/adBannerData';
import { getDeviceAnalytics } from '@/utils/deviceDetection';

interface AdBannerProps {
  className?: string;
}

interface BannerViewData {
  bannerId: string;
  startTime: number;
  viewDuration: number;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  const { currentLocale } = useLanguage();
  const [banners] = useState(() => getActiveBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(AD_BANNER_CONFIG.AUTOPLAY);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewData, setViewData] = useState<BannerViewData | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    if (typeof window !== 'undefined') {
      checkDevice();
      window.addEventListener('resize', checkDevice);
      return () => window.removeEventListener('resize', checkDevice);
    }
  }, []);

  const currentBanner = banners[currentIndex];
  const hasMultipleBanners = banners.length > 1;

  // Аналитика - трекинг показа баннера
  const trackBannerView = useCallback((banner: AdBannerItem) => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      const startTime = Date.now();
      
      setViewData({
        bannerId: banner.id,
        startTime,
        viewDuration: 0
      });

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ad_banner_view',
          bannerId: banner.id,
          bannerTitle: banner.metaTitle[currentLocale as keyof typeof banner.metaTitle],
          bannerType: banner.type,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          isMobile,
          ...deviceInfo
        })
      }).catch(console.error);
    }
  }, [currentLocale, isMobile]);

  // Аналитика - трекинг клика по баннеру
  const trackBannerClick = useCallback((banner: AdBannerItem) => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      const currentViewDuration = viewData ? Date.now() - viewData.startTime : 0;

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ad_banner_click',
          bannerId: banner.id,
          bannerTitle: banner.metaTitle[currentLocale as keyof typeof banner.metaTitle],
          bannerType: banner.type,
          bannerLink: banner.link,
          viewDuration: currentViewDuration,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          isMobile,
          ...deviceInfo
        })
      }).catch(console.error);
    }
  }, [currentLocale, isMobile, viewData]);

  // Аналитика - трекинг завершения просмотра
  const trackBannerViewComplete = useCallback((banner: AdBannerItem, duration: number) => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ad_banner_view_complete',
          bannerId: banner.id,
          bannerTitle: banner.metaTitle[currentLocale as keyof typeof banner.metaTitle],
          viewDuration: duration,
          expectedDuration: banner.duration * 1000,
          completionRate: Math.min(duration / (banner.duration * 1000) * 100, 100),
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          isMobile,
          ...deviceInfo
        })
      }).catch(console.error);
    }
  }, [currentLocale, isMobile]);

  // Переход к следующему баннеру
  const nextBanner = useCallback(() => {
    if (!hasMultipleBanners) return;
    
    // Отправляем аналитику завершения просмотра
    if (viewData && currentBanner) {
      const duration = Date.now() - viewData.startTime;
      trackBannerViewComplete(currentBanner, duration);
    }

    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setProgress(0);
  }, [hasMultipleBanners, viewData, currentBanner, banners.length, trackBannerViewComplete]);

  // Обработчик клика по баннеру
  const handleBannerClick = () => {
    if (!currentBanner?.link) return;
    
    trackBannerClick(currentBanner);
    
    if (currentBanner.openInNewTab) {
      window.open(currentBanner.link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = currentBanner.link;
    }
  };

  // Управление автоплеем
  useEffect(() => {
    if (!hasMultipleBanners || !isPlaying || isPaused) return;

    const duration = currentBanner?.duration || AD_BANNER_CONFIG.DEFAULT_DURATION;
    const interval = duration * 1000;

    intervalRef.current = setTimeout(nextBanner, interval);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, isPlaying, isPaused, hasMultipleBanners, currentBanner, nextBanner]);

  // Прогресс бар
  useEffect(() => {
    if (!hasMultipleBanners || !isPlaying || isPaused) return;

    const duration = currentBanner?.duration || AD_BANNER_CONFIG.DEFAULT_DURATION;
    const interval = 50; // Обновляем каждые 50мс
    const increment = (interval / (duration * 1000)) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, interval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, isPlaying, isPaused, hasMultipleBanners, currentBanner]);

  // Трекинг показа текущего баннера
  useEffect(() => {
    if (currentBanner) {
      trackBannerView(currentBanner);
    }
  }, [currentBanner, trackBannerView]);

  // Обработчики hover для паузы
  const handleMouseEnter = () => {
    if (AD_BANNER_CONFIG.PAUSE_ON_HOVER) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (AD_BANNER_CONFIG.PAUSE_ON_HOVER) {
      setIsPaused(false);
    }
  };

  // Рендер медиа элемента
  const renderMedia = (banner: AdBannerItem) => {
    const mediaData = isMobile ? banner.mobile : banner.desktop;
    const src = (mediaData[currentLocale as keyof typeof mediaData] as string) || mediaData.ru;
    const alt = banner.alt[currentLocale as keyof typeof banner.alt];

    // Отладочная информация
    console.log('AdBanner Debug:', {
      bannerId: banner.id,
      bannerType: banner.type,
      isMobile,
      currentLocale,
      src,
      currentIndex
    });

    const commonProps = {
      width: mediaData.width,
      height: mediaData.height,
      className: "w-full h-full object-cover transition-all duration-300",
      alt,
    };

    const handleImageError = () => {
      console.error('Ошибка загрузки изображения:', src);
    };

    switch (banner.type) {
      case 'webm':
        return (
          <video
            key={banner.id}
            {...commonProps}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          >
            <source src={src} type="video/webm" />
            Ваш браузер не поддерживает видео.
          </video>
        );
      
      case 'gif':
      case 'image':
      default:
        return (
          <Image
            key={banner.id}
            src={src}
            {...commonProps}
            priority={currentIndex === 0}
            unoptimized={banner.type === 'gif'}
            onError={handleImageError}
            onLoad={() => console.log('Изображение загружено:', src)}
          />
        );
    }
  };

  if (!currentBanner) {
    return null;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-[44px] ${className}`}>
      {/* Основной контент баннера */}
      <div
        className={`relative w-full h-full cursor-pointer group ${currentBanner.link ? 'hover:scale-[1.01]' : ''} transition-transform duration-300`}
        onClick={handleBannerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-banner-id={currentBanner.id}
      >
        {/* Медиа контент с анимацией */}
        <div className="relative w-full h-full overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-${AD_BANNER_CONFIG.TRANSITION_DURATION} ${
                index === currentIndex
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0'
              }`}
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: `${AD_BANNER_CONFIG.TRANSITION_DURATION}ms`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              {renderMedia(banner)}
            </div>
          ))}
        </div>

        {/* Градиентный overlay для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Индикатор клика */}
        {currentBanner.link && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Прогресс бар и индикаторы */}
      {hasMultipleBanners && AD_BANNER_CONFIG.SHOW_INDICATORS && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`relative w-8 h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {index === currentIndex && (
                <div
                  className="absolute top-0 left-0 h-full bg-[#0283F7] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Play/Pause контрол (только если несколько баннеров) */}
      {hasMultipleBanners && (
        <button
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-2 z-20"
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying && !isPaused ? (
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
} 