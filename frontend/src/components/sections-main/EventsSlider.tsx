'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  badge: string;
  discount: string;
  discountText: string;
  date: string;
  time: string;
  location: string;
  language: string;
  price: string;
  targetDate: string; // Дата для таймера
}

interface EventsSliderProps {
  locale: string;
}

// Компонент для иконок
const Icon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons = {
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    ),
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
      </svg>
    ),
    location: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6Z"/>
      </svg>
    ),
    language: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
      </svg>
    ),
    price: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
      </svg>
    )
  };
  
  return icons[name as keyof typeof icons] || null;
};

const EventsSlider: React.FC<EventsSliderProps> = ({ locale }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Улучшенные моковые данные с реалистичными датами
  const events: Event[] = [
    {
      id: 1,
      title: "Международная конференция селлеров",
      description: "Крупнейшая международная конференция для селлеров где эксперты расскажут как эффективно продавать товары по выгодным ценам без переплат и комиссий. Узнайте секреты успешных продаж, найдите партнеров и развивайте свой бизнес.",
      image: "/images/events-image.png",
      badge: "Ежегодное событие",
      discount: "30%",
      discountText: "До поднятия цен",
      date: "25 - 28 марта 2025 г.",
      time: "С 10:00 до 18:00",
      location: "Улица Бобура, дом 1 кв 9",
      language: "Русский",
      price: "От 100 000 сумм",
      targetDate: "2025-03-25T10:00:00"
    },
    {
      id: 2,
      title: "Мастер-класс по e-commerce",
      description: "Интенсивный практический мастер-класс для начинающих селлеров. Изучите основы электронной коммерции, маркетинговые стратегии и современные инструменты для роста продаж в онлайн среде.",
      image: "/images/events-image.png",
      badge: "Новое событие",
      discount: "50%",
      discountText: "Для новых участников",
      date: "15 - 17 апреля 2025 г.",
      time: "С 14:00 до 20:00",
      location: "Центр инноваций, Ташкент",
      language: "Узбекский",
      price: "От 75 000 сумм",
      targetDate: "2025-04-15T14:00:00"
    },
    {
      id: 3,
      title: "Networking встреча селлеров",
      description: "Ежемесячная встреча для обмена опытом и установления деловых контактов между селлерами. Отличная возможность найти надежных партнеров и расширить свою профессиональную сеть.",
      image: "/images/events-image.png",
      badge: "Регулярное событие",
      discount: "20%",
      discountText: "Для членов ассоциации",
      date: "5 мая 2025 г.",
      time: "С 18:00 до 22:00",
      location: "Бизнес-центр Milliy, Ташкент",
      language: "Русский",
      price: "От 50 000 сумм",
      targetDate: "2025-05-05T18:00:00"
    },
    {
      id: 4,
      title: "Конференция по цифровому маркетингу",
      description: "Крупнейшая конференция по цифровому маркетингу в Центральной Азии. Ведущие эксперты поделятся последними трендами, стратегиями продвижения и инновационными подходами к маркетингу.",
      image: "/images/events-image.png",
      badge: "Премиум событие",
      discount: "40%",
      discountText: "Ранняя регистрация",
      date: "20 - 22 июня 2025 г.",
      time: "С 09:00 до 19:00",
      location: "Конгресс-холл Узэкспоцентр",
      language: "Английский",
      price: "От 200 000 сумм",
      targetDate: "2025-06-20T09:00:00"
    },
    {
      id: 5,
      title: "Воркшоп по аналитике продаж",
      description: "Практический воркшоп по аналитике и оптимизации продаж с использованием современных инструментов. Научитесь читать данные, анализировать тренды и принимать обоснованные решения для роста бизнеса.",
      image: "/images/events-image.png",
      badge: "Экспертное событие",
      discount: "25%",
      discountText: "Для профессионалов",
      date: "10 июля 2025 г.",
      time: "С 11:00 до 17:00",
      location: "Академия бизнеса INHA",
      language: "Русский",
      price: "От 120 000 сумм",
      targetDate: "2025-07-10T11:00:00"
    }
  ];

  const currentEvent = events[currentSlide];
  const timeLeft = useCountdownTimer(currentEvent.targetDate);

  // Автоматическое переключение слайдов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [events.length]);

  // Обработчик клика по кружочкам
  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    const direction = index > currentSlide ? 'left' : 'right';
    setSlideDirection(direction);
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 800);
  };

  // Обработчики для кнопок навигации
  const handlePrevSlide = () => {
    if (isTransitioning) return;
    
    setSlideDirection('right');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 800);
  };

  const handleNextSlide = () => {
    if (isTransitioning) return;
    
    setSlideDirection('left');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % events.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 800);
  };

  // Обработчики для свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextSlide();
    }
    if (isRightSwipe) {
      handlePrevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="absolute left-[121px] top-[2695px] w-[1681px] h-[897px]">
      <div className="relative w-full h-full">
        {/* Фон блока */}
        <div className="absolute left-0 top-[151px] w-[1681px] h-[746px] bg-[rgba(25,21,52,0.85)] border border-[#2786CA] rounded-[20px] backdrop-blur-sm"></div>
        
        {/* Заголовок */}
        <div className="absolute left-[1px] top-0 w-[561px] h-[27px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase tracking-wider">Мероприятия</h2>
        </div>
        
        {/* Линия */}
        <div className="absolute left-[3px] top-[27.5px] w-[151.5px] h-[1px] bg-gradient-to-r from-white to-transparent"></div>
        
        {/* Подзаголовок */}
        <div className="absolute left-0 top-[36px] w-[547px] h-[58px]">
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">Ближайшие мероприятия</h1>
        </div>

        {/* Картинка мероприятия */}
        <div 
          className="absolute left-[34px] top-[200px] w-[778px] h-[617px] rounded-[31px] border border-[#0D78EE] overflow-hidden group cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full">
            <Image
              src={currentEvent.image}
              alt="Event Image"
              width={778}
              height={617}
              className={`w-full h-full object-cover transition-all duration-800 ease-out transform ${
                isTransitioning 
                  ? 'opacity-0 scale-105'
                  : 'opacity-100 scale-100'
              } group-hover:scale-110`}
            />
            
            {/* Градиентный оверлей */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Бейдж */}
            <div className={`absolute right-[30px] top-[30px] transition-all duration-800 ease-out ${
              isTransitioning 
                ? 'opacity-0 translate-y-[-20px]' 
                : 'opacity-100 translate-y-0'
            }`}>
              <div className="px-6 py-2 bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[14px] shadow-2xl backdrop-blur-sm">
                <span className="text-white text-[16px] font-inter font-medium">{currentEvent.badge}</span>
              </div>
            </div>

            {/* Кнопки навигации на картинке */}
            <button
              onClick={handlePrevSlide}
              disabled={isTransitioning}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 group/btn backdrop-blur-sm ${
                isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <svg className="w-6 h-6 text-white group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNextSlide}
              disabled={isTransitioning}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 group/btn backdrop-blur-sm ${
                isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <svg className="w-6 h-6 text-white group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Кружочки для навигации */}
        <div className="absolute left-[773px] top-[847px] w-[113.5px] h-[11px] flex gap-[9px]">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`h-[11px] rounded-full transition-all duration-500 cursor-pointer ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-[#0283F7] to-[#850191] w-[41.88px] rounded-[5.5px] shadow-lg' 
                  : 'bg-[#757575] hover:bg-white/70 w-[12.12px]'
              } ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
            />
          ))}
        </div>

        {/* Кнопки */}
        <Link 
          href={`/${locale}/events`}
          className="group absolute left-[900px] top-[38px] w-[358px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10 text-white text-[18px] font-inter font-semibold uppercase group-hover:text-shadow-lg transition-all duration-300">Все мероприятия</span>
        </Link>
        
        <Link 
          href={`/${locale}/calendar`}
          className="group absolute left-[1327px] top-[-19px] w-[354px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10 text-white text-[18px] font-inter font-semibold uppercase group-hover:text-shadow-lg transition-all duration-300">Календарь мероприятий</span>
        </Link>

        {/* Правая часть с информацией */}
        <div className={`absolute left-[900px] top-[190px] w-[745px] h-[627px] transition-all duration-800 ease-out ${
          isTransitioning 
            ? 'opacity-0 translate-x-[30px]' 
            : 'opacity-100 translate-x-0'
        }`}>
          {/* Заголовок события */}
          <div className="absolute left-0 top-0 w-[726px] h-[217px]">
            <h1 className="text-[#0184F8] text-[60px] leading-[68.4px] font-franklin font-normal uppercase drop-shadow-lg">
              {currentEvent.title}
            </h1>
          </div>

          {/* Описание */}
          <div className="absolute left-[4px] top-[223px] w-[735px] h-[92px]">
            <p className="text-white/90 text-[15px] leading-[18.15px] font-inter font-normal">
              {currentEvent.description}
            </p>
          </div>

          {/* Скидка */}
          <div className="absolute left-[4px] top-[299px] w-[169px] h-[57px]">
            <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">Скидка</span>
          </div>
          <div className="absolute left-[94px] top-[335px] w-[208px] h-[128px]">
            <span className="text-[110px] leading-[125px] font-franklin font-normal uppercase bg-gradient-to-br from-[#0B7BF1] to-[#850191] bg-clip-text text-transparent drop-shadow-lg">{currentEvent.discount}</span>
          </div>
          <div className="absolute left-[345px] top-[300px] w-[400px] h-[57px]">
            <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">{currentEvent.discountText}</span>
          </div>

          {/* Живой таймер */}
          <div className="absolute left-[348px] top-[357px] w-[392px] h-[98px]">
            <div className="flex gap-[14px]">
              <div className="w-[87px] h-[75px] bg-gradient-to-b from-[#3F3F3F] to-[#2A2A2A] rounded-[8px] flex flex-col items-center justify-center shadow-xl border border-[#555]">
                <span className="text-white text-[40px] font-franklin font-bold">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="text-white/80 text-[12px] font-inter">Дней</span>
              </div>
              <div className="w-[86px] h-[75px] bg-gradient-to-b from-[#3F3F3F] to-[#2A2A2A] rounded-[8px] flex flex-col items-center justify-center shadow-xl border border-[#555]">
                <span className="text-white text-[40px] font-franklin font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-white/80 text-[12px] font-inter">Часов</span>
              </div>
              <div className="w-[86px] h-[75px] bg-gradient-to-b from-[#3F3F3F] to-[#2A2A2A] rounded-[8px] flex flex-col items-center justify-center shadow-xl border border-[#555]">
                <span className="text-white text-[40px] font-franklin font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-white/80 text-[12px] font-inter">Минут</span>
              </div>
              <div className="w-[87px] h-[75px] bg-gradient-to-b from-[#3F3F3F] to-[#2A2A2A] rounded-[8px] flex flex-col items-center justify-center shadow-xl border border-[#555]">
                <span className="text-white text-[40px] font-franklin font-bold animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-white/80 text-[12px] font-inter">Секунд</span>
              </div>
            </div>
          </div>

          {/* Детали события в сетке */}
          <div className="absolute left-[4px] top-[478px] w-[712px] h-[80px]">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Первая строка */}
              <div className="flex items-center gap-[12px] p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Icon name="calendar" className="w-5 h-5 text-[#0184F8]" />
                <span className="text-white text-[14px] font-inter font-medium">{currentEvent.date}</span>
              </div>
              <div className="flex items-center gap-[12px] p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Icon name="clock" className="w-5 h-5 text-[#0184F8]" />
                <span className="text-white text-[14px] font-inter font-medium">{currentEvent.time}</span>
              </div>
              
              {/* Вторая строка */}
              <div className="flex items-center gap-[12px] p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Icon name="location" className="w-5 h-5 text-[#0184F8]" />
                <span className="text-white text-[14px] font-inter font-medium">{currentEvent.location}</span>
              </div>
              <div className="flex items-center gap-[12px] p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <Icon name="language" className="w-5 h-5 text-[#0184F8]" />
                <span className="text-white text-[14px] font-inter font-medium">Язык: {currentEvent.language}</span>
              </div>
              
              {/* Третья строка */}
              <div className="flex items-center gap-[12px] p-2 rounded-lg bg-white/5 backdrop-blur-sm col-span-2">
                <Icon name="price" className="w-5 h-5 text-[#0184F8]" />
                <span className="text-white text-[14px] font-inter font-medium">{currentEvent.price}</span>
              </div>
            </div>
          </div>

          {/* Кнопка "Подробнее" */}
          <Link 
            href={`/${locale}/events/${currentEvent.id}`}
            className="group absolute left-[6px] top-[573px] w-[727px] h-[54px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 text-white text-[20px] font-inter font-bold uppercase group-hover:text-shadow-lg transition-all duration-300">Подробнее</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsSlider; 