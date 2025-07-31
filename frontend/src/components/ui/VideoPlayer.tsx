'use client';

import React, { useEffect, useRef } from 'react';
import { VideoBlockItem, getYouTubeEmbedUrl } from '@/data/mock/videoBlockData';

interface VideoPlayerProps {
  video: VideoBlockItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Закрытие по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Пауза видео при закрытии
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  // Обработка свайпов для мобильных устройств
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const diffY = startY - currentY;
      
      // Если свайп вниз больше 100px - закрываем
      if (diffY < -100) {
        onClose();
      }
    };

    if (isOpen && playerRef.current) {
      playerRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
      playerRef.current.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener('touchstart', handleTouchStart);
        playerRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      ref={playerRef}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M18 6L6 18M6 6L18 18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Видеоконтент */}
      <div className="w-full max-w-6xl max-h-[90vh] aspect-video bg-black rounded-lg overflow-hidden">
        {video.videoType === 'youtube' ? (
          <iframe
            src={getYouTubeEmbedUrl(video.videoUrl)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title.ru}
          />
        ) : (
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            poster={video.thumbnail}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        )}
      </div>

      {/* Индикатор свайпа для мобильных */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm md:hidden">
        Свайпните вниз для закрытия
      </div>
    </div>
  );
};

export default VideoPlayer; 