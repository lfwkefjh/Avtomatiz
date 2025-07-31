'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getFeaturedVideos, VideoBlockItem, getVideoThumbnail, getYouTubeEmbedUrl } from '@/data/mock/videoBlockData';
import { getDeviceAnalytics } from '@/utils/deviceDetection';

interface VideoBlockProps {
  limit?: number;
  className?: string;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ 
  limit = 8,
  className = ''
}) => {
  const { currentLocale } = useLanguage();
  const { t } = useTranslation();

  // Переводы для интерфейса
  const translations = {
    ru: {
      closeVideo: "Закрыть видео",
      playVideo: "Воспроизвести видео",
      browserNotSupported: "Ваш браузер не поддерживает воспроизведение видео."
    },
    en: {
      closeVideo: "Close video",
      playVideo: "Play video",
      browserNotSupported: "Your browser does not support video playback."
    },
    uz: {
      closeVideo: "Videoni yopish",
      playVideo: "Videoni ijro etish",
      browserNotSupported: "Sizning brauzeringiz video ijrosini qo'llab-quvvatlamaydi."
    }
  };
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number | null>(null);
  
  const videosData = getFeaturedVideos(limit);
  const cardsPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(videosData.length / cardsPerSlide));

  // Навигация слайдера
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      if (playingVideo) {
        safeCloseVideo(playingVideo, 'slide_navigation');
      }
      setCurrentSlide(prev => prev + 1);
      trackSlideNavigation('next');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      if (playingVideo) {
        safeCloseVideo(playingVideo, 'slide_navigation');
      }
      setCurrentSlide(prev => prev - 1);
      trackSlideNavigation('prev');
    }
  };

  // Безопасное закрытие видео с трекингом (процент просмотра убран)
  const safeCloseVideo = (videoId: string, reason: string = 'manual') => {
    const currentVideo = videosData.find(v => v.id === videoId);
    if (currentVideo && videoStartTime) {
      trackVideoStop(currentVideo, reason);
    }
    setPlayingVideo(null);
  };

  // Воспроизведение/остановка видео
  const toggleVideo = (video: VideoBlockItem) => {
    if (playingVideo === video.id) {
      // Останавливаем видео и трекаем просмотр
      safeCloseVideo(playingVideo, 'manual_toggle');
    } else {
      // Если другое видео уже играет, сначала остановим его
      if (playingVideo) {
        safeCloseVideo(playingVideo, 'video_switch');
      }
      // Запускаем новое видео
      setPlayingVideo(video.id);
      trackVideoPlay(video);
    }
  };

  // Удалена логика процента просмотра по просьбе пользователя

  // Аналитика навигации слайдера
  const trackSlideNavigation = (direction: 'next' | 'prev') => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video_slider_navigation',
          direction,
          currentSlide,
          totalSlides,
          locale: currentLocale,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  };

  // Аналитика воспроизведения видео
  const trackVideoPlay = (video: VideoBlockItem) => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      setVideoStartTime(Date.now());
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video_play',
          videoId: video.id,
          videoTitle: video.title[currentLocale as keyof typeof video.title],
          videoType: video.videoType,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  // Аналитика остановки/закрытия видео (процент просмотра убран)
  const trackVideoStop = (video: VideoBlockItem, stopReason: string = 'unknown') => {
    if (typeof window !== 'undefined' && videoStartTime) {
      const deviceInfo = getDeviceAnalytics();
      const watchTime = Date.now() - videoStartTime;
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video_stop',
          videoId: video.id,
          videoTitle: video.title[currentLocale as keyof typeof video.title],
          videoType: video.videoType,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          watchTime: watchTime, // время просмотра в миллисекундах
          stopReason: stopReason, // причина остановки
          ...deviceInfo
        })
      }).catch(console.error);
      setVideoStartTime(null);
    }
  };

  // Аналитика ховера видео карточки
  const trackVideoHover = (video: VideoBlockItem) => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video_card_hover',
          videoId: video.id,
          videoTitle: video.title[currentLocale as keyof typeof video.title],
          videoType: video.videoType,
          locale: currentLocale,
          timestamp: new Date().toISOString(),
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  // Отслеживание изменения языка и загрузки компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deviceInfo = getDeviceAnalytics();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video_section_view',
          locale: currentLocale,
          totalVideos: videosData.length,
          timestamp: new Date().toISOString(),
          ...deviceInfo
        })
      }).catch(console.error);
    }
  }, []);

  // Закрытие видео при выходе из зоны видимости
  useEffect(() => {
    if (!playingVideo) return;

    const playingElement = document.querySelector(`[data-video-id="${playingVideo}"]`);
    if (!playingElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Закрываем видео если оно полностью вышло из зоны видимости
          if (entry.intersectionRatio === 0) {
            safeCloseVideo(playingVideo, 'scroll_out_of_view');
          }
        });
      },
      {
        threshold: 0, // Срабатывает когда элемент полностью исчезает
        rootMargin: '0px'
      }
    );

    observer.observe(playingElement);

    return () => {
      observer.disconnect();
    };
  }, [playingVideo]);

  // Очистка состояния при unmount
  useEffect(() => {
    return () => {
      if (playingVideo) {
        safeCloseVideo(playingVideo, 'component_unmount');
      }
    };
  }, []);



  return (
    <>
      <div className={`w-[1680px] h-[931px] relative mx-auto ${className}`}>
        {/* Заголовок - слева */}
        <div className="absolute left-0 top-0 w-[561px] h-[65px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">Видеоотчет</h2>
        </div>

        {/* Белая линия под заголовком - слева */}
        <div className="absolute left-0 top-[32px] w-[140px] h-[1px] bg-white"></div>

        {/* Подзаголовок - слева */}
        <div className="absolute left-0 top-[28px] w-[600px] h-[65px] flex items-center">
          <h1 className="text-white text-[40px] leading-[48.41px] font-inter font-normal uppercase">
            <span className="text-white">Прошедшие </span>
            <span className="text-[#0184F8]">мероприятия</span>
          </h1>
        </div>



        {/* Навигационные стрелки - правый верхний угол */}
        <div className="absolute right-0 flex gap-[14px] z-20" style={{ top: `30px` }}>
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
              className="text-white group-hover:scale-140 transition-transform duration-300 rotate-180"
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

        {/* Слайдер с видео */}
        <div className="absolute top-[110px] left-0 w-[1680px] h-[900px] overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * cardsPerSlide * 478}px)`,
              width: `${Math.ceil(videosData.length / cardsPerSlide) * cardsPerSlide * 560}px`
            }}
          >
            {videosData.map((video, index) => {
              const isPlaying = playingVideo === video.id;
              const title = video.title[currentLocale as keyof typeof video.title];

              return (
                <div 
                  key={video.id}
                  className="flex-shrink-0 w-[365px] h-[650px] rounded-[20px] left-[25px] top-[50px] overflow-hidden relative group cursor-pointer border border-[#0184F8] transition-all duration-300 hover:border-[#0396FF] hover:scale-[1.02] hover:shadow-[inset_0_0_20px_1px_rgba(1,132,244,0.4)] hover:z-50"
                  onClick={() => !isPlaying && toggleVideo(video)}
                  onMouseEnter={() => trackVideoHover(video)}
                  data-video-id={video.id}
                  style={{ marginRight: index < videosData.length - 1 ? '113px' : '0' }}
                >
                  {/* Видео или превью */}
                  {isPlaying ? (
                    <div className="w-full h-full">
                      {video.videoType === 'youtube' ? (
                        <iframe
                          src={getYouTubeEmbedUrl(video.videoUrl)}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={title}
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          poster={video.thumbnail}
                        >
                          <source src={video.videoUrl} type="video/mp4" />
                          {t({ ru: translations.ru.browserNotSupported, en: translations.en.browserNotSupported, uz: translations.uz.browserNotSupported })}
                        </video>
                      )}
                      
                      {/* Кнопка закрытия видео */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          safeCloseVideo(video.id, 'close_button');
                        }}
                        className="absolute top-4 left-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                        title={t({ ru: translations.ru.closeVideo, en: translations.en.closeVideo, uz: translations.uz.closeVideo })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M18 6L6 18M6 6L18 18" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Превью изображение */}
                      <Image
                        src={getVideoThumbnail(video)}
                        alt={title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          
                          // Многоуровневый fallback для YouTube превью
                          if (target.src.includes('img.youtube.com') && target.src.includes('mqdefault.jpg')) {
                            // Первый fallback: переходим на default.jpg
                            const videoId = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                            if (videoId) {
                              target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                              return;
                            }
                          }
                          
                          // Финальный fallback: локальное изображение
                          if (!target.src.includes('/images/past-events-bg.png')) {
                            target.src = '/images/past-events-bg.png';
                          }
                        }}
                      />

                      {/* Кнопка Play по центру */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          className="w-20 h-20 bg-gradient-to-br from-[#0C7AF0] to-[#840191] text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                          title={t({ ru: translations.ru.playVideo, en: translations.en.playVideo, uz: translations.uz.playVideo })}
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M8 5.14v13.72L19 12L8 5.14z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Заголовок видео */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white text-lg font-semibold text-center">
                          {title}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoBlock; 