'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getActivePartners, PartnerItem } from '@/data/mock/partnersData';

interface PartnersSliderProps {
  className?: string;
}

export default function PartnersSlider({ className = "" }: PartnersSliderProps) {
  const { currentLocale } = useLanguage();
  const [partners] = useState(() => getActivePartners());
  
  // Переводы для кнопки
  const buttonTranslations = {
    ru: "Ко всем сервисам",
    en: "To all services",
    uz: "Barcha xizmatlarga"
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPartner = partners[currentIndex];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      if (newIndex >= partners.length) {
        return 0;
      }
      return newIndex;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  }, [partners.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return partners.length - 1;
      }
      return newIndex;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  }, [partners.length, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [currentIndex, isTransitioning]);

  // Автоматическое переключение каждые 8 секунд
  useEffect(() => {
    if (!isAutoPlaying || partners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, partners.length]);

  // Обработчики для паузы при наведении
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  if (partners.length === 0) {
    return (
      <div className={`w-full h-[850px] bg-white rounded-[16px] flex items-center justify-center ${className}`}>
        <span className="text-black text-[20px] font-inter">Партнёры</span>
      </div>
    );
  }

  return (
    <div className="absolute left-[114px] top-[3450px] w-[1681px] h-[850px] relative">
      {/* Заголовок секции */}
      <div className="absolute left-0 top-0 w-[561px] h-[94px] z-10">
        <div className="absolute left-0 top-0 w-[561px] h-[65px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">
            Сотрудничества
          </h2>
        </div>
        <div className="absolute left-0 top-[36px] w-[547px] h-[58px]">
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">
            Наши партнёры и друзья
          </h1>
        </div>
        <div className="absolute left-[2px] top-[27.5px] w-[190px] h-[1px] bg-white"></div>
      </div>

      {/* Навигационные стрелки и кнопка - правый верхний угол */}
      <div className="absolute right-0 flex gap-[14px] z-20" style={{ top: '20px' }}>
        {/* Кнопка "Перейти к нашим партнёрам" */}
        <Link 
          href={`/${currentLocale}/partners`}
          className="group relative block w-[380px] h-[54px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center overflow-hidden hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
        >
          {/* Градиентный overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Блик эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <span className="relative z-10 text-white text-[16px] font-inter font-bold uppercase group-hover:text-shadow-lg transition-all duration-300 mr-2">
            {buttonTranslations[currentLocale as keyof typeof buttonTranslations]}
          </span>
          
          {/* Стрелка справа */}
          <div className="relative z-10 text-white group-hover:translate-x-1 transition-transform duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

        {/* Стрелка влево */}
        <button
          onClick={prevSlide}
          className="group w-[54px] h-[54px] bg-gradient-to-br from-[#0C7AF0] to-[#840191] rounded-[8px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
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

      {/* Слайдер партнеров */}
      <div 
        className="absolute left-0 top-[120px] w-full h-[700px] relative overflow-hidden "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Основной контейнер */}
        <div className="w-full h-full relative">
          
          {/* Центральный большой блок */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] z-20">
            <div className="group relative w-full h-full rounded-[20px] overflow-hidden transition-all duration-600 ease-out border border-[#0184F8] hover:border-[#0396FF] hover:scale-[1.02] hover:shadow-[inset_0_0_20px_1px_rgba(1,132,244,0.4)] hover:z-50" style={{ backgroundColor: '#18142e' }}>
              {/* Фоновое изображение */}
              <Image
                src={currentPartner.mainImage[currentLocale as keyof typeof currentPartner.mainImage] as string}
                alt={currentPartner.title[currentLocale as keyof typeof currentPartner.title] as string}
                width={currentPartner.mainImage.width}
                height={currentPartner.mainImage.height}
                className="w-full h-full object-cover transition-all duration-600 ease-out"
              />

              {/* Контент */}
              <div className="absolute bottom-8 left-0 right-0 p-8 text-white transition-all duration-600 ease-out">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm font-inter font-bold uppercase">
                      {currentPartner.category[currentLocale as keyof typeof currentPartner.category]}
                    </span>
                  </div>
                  <h3 className="text-3xl font-franklin font-bold uppercase transition-all duration-600 ease-out text-white">
                    {currentPartner.title[currentLocale as keyof typeof currentPartner.title]}
                  </h3>
                  <p className="text-lg font-inter leading-relaxed opacity-90 line-clamp-3 transition-all duration-600 ease-out text-white">
                    {currentPartner.description[currentLocale as keyof typeof currentPartner.description]}
                  </p>

                  {/* Кнопка перехода к партнеру */}
                  {currentPartner.partnerUrl && (
                    <Link
                      href={currentPartner.partnerUrl}
                      target={currentPartner.openInNewTab ? "_blank" : "_self"}
                      rel={currentPartner.openInNewTab ? "noopener noreferrer" : ""}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-lg hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden top-[20px]"
                    >
                      {/* Градиентный overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Блик эффект */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <span className="relative z-10 text-white font-inter group-hover:text-shadow-lg transition-all duration-300">
                        Перейти к сервису
                      </span>
                      <svg className="relative z-10 w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Маленькие блоки по краям */}
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-between px-4">
            {partners.map((partner, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + partners.length) % partners.length;
              const isNext = index === (currentIndex + 1) % partners.length;
              
              // Определяем позицию и размер
              let position, width, height, opacity, scale, zIndex;
              
              if (isActive) {
                return null;
              } else if (isPrev || isNext) {
                position = isPrev ? 'left-4' : 'right-4';
                width = 300;
                height = 200;
                opacity = 0.8;
                scale = 0.9;
                zIndex = 15;
              } else {
                return null;
              }
              
              return (
                <div
                  key={partner.id}
                  className={`absolute ${position} top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-600 ease-out`}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    opacity: opacity,
                    transform: `translateY(-50%) scale(${scale})`,
                    zIndex: zIndex
                  }}
                  onClick={() => goToSlide(index)}
                >
                  <div className="relative w-full h-full rounded-[16px] overflow-hidden transition-all duration-600 ease-out border border-[#0184F8] hover:border-[#0396FF]" style={{ backgroundColor: 'rgb(21, 26, 38)' }}>
                    {/* Фоновое изображение */}
                    <Image
                      src={partner.mainImage[currentLocale as keyof typeof partner.mainImage] as string}
                      alt={partner.title[currentLocale as keyof typeof partner.title] as string}
                      width={partner.mainImage.width}
                      height={partner.mainImage.height}
                      className="w-full h-full object-cover transition-all duration-600 ease-out"
                      style={{ transform: 'translateY(40px)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>



          {/* Индикаторы */}
          {partners.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#0283F7] scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 