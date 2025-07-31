'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventsSliderProps {
  locale: string;
}

const EventsSlider: React.FC<EventsSliderProps> = ({ locale }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Данные мероприятий
  const events: Event[] = [
    {
      id: 1,
      title: "Второая международная конференция",
      description: "Второая международная конференция селлеров где селлеры расскажут как продавать свои товары по выгодным ценам без переплат и косиссий, покупай, продавай, находи парёнров все это ту...",
      image: "/images/events-image.png",
      badge: "Ежегодное событие",
      discount: "30%",
      discountText: "До поднятия цен",
      date: "25 - 28 марта 2025 г.",
      time: "С 10:00 до 18:00",
      location: "Улица бобура, дом 1 кв 9",
      language: "Язык: русский",
      price: "От 100 000 сумм",
      days: 6,
      hours: 20,
      minutes: 30,
      seconds: 15
    },
    {
      id: 2,
      title: "Мастер-класс по e-commerce",
      description: "Интенсивный мастер-класс для начинающих селлеров. Изучите основы электронной коммерции, маркетинговые стратегии и инструменты для роста продаж.",
      image: "/images/events-image.png",
      badge: "Новое событие",
      discount: "50%",
      discountText: "Для новых участников",
      date: "15 - 17 апреля 2025 г.",
      time: "С 14:00 до 20:00",
      location: "Центр инноваций, Ташкент",
      language: "Язык: узбекский",
      price: "От 75 000 сумм",
      days: 25,
      hours: 12,
      minutes: 45,
      seconds: 30
    },
    {
      id: 3,
      title: "Networking встреча селлеров",
      description: "Ежемесячная встреча для обмена опытом и установления деловых контактов. Отличная возможность найти партнеров и расширить свою сеть.",
      image: "/images/events-image.png",
      badge: "Регулярное событие",
      discount: "20%",
      discountText: "Для членов ассоциации",
      date: "5 мая 2025 г.",
      time: "С 18:00 до 22:00",
      location: "Бизнес-центр, Ташкент",
      language: "Язык: русский",
      price: "От 50 000 сумм",
      days: 45,
      hours: 8,
      minutes: 15,
      seconds: 45
    },
    {
      id: 4,
      title: "Конференция по цифровому маркетингу",
      description: "Крупнейшая конференция по цифровому маркетингу в Узбекистане. Эксперты поделятся последними трендами и стратегиями продвижения.",
      image: "/images/events-image.png",
      badge: "Премиум событие",
      discount: "40%",
      discountText: "Ранняя регистрация",
      date: "20 - 22 июня 2025 г.",
      time: "С 09:00 до 19:00",
      location: "Конгресс-холл, Ташкент",
      language: "Язык: английский",
      price: "От 200 000 сумм",
      days: 90,
      hours: 6,
      minutes: 20,
      seconds: 10
    },
    {
      id: 5,
      title: "Воркшоп по аналитике продаж",
      description: "Практический воркшоп по аналитике и оптимизации продаж. Научитесь читать данные и принимать обоснованные решения для роста бизнеса.",
      image: "/images/events-image.png",
      badge: "Экспертное событие",
      discount: "25%",
      discountText: "Для профессионалов",
      date: "10 июля 2025 г.",
      time: "С 11:00 до 17:00",
      location: "Академия бизнеса, Ташкент",
      language: "Язык: русский",
      price: "От 120 000 сумм",
      days: 110,
      hours: 14,
      minutes: 35,
      seconds: 25
    }
  ];

  const currentEvent = events[currentSlide];

  // Автоматическое переключение слайдов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000); // Переключение каждые 5 секунд

    return () => clearInterval(timer);
  }, [events.length]);

  // Обработчик клика по кружочкам
  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Обработчики для кнопок навигации
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  // Обработчики для свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
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
        <div className="absolute left-0 top-[151px] w-[1681px] h-[746px] bg-[rgba(25,21,52,0.85)] border border-[#2786CA] rounded-[20px]"></div>
        
        {/* Заголовок */}
        <div className="absolute left-[1px] top-0 w-[561px] h-[27px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">Мероприятия</h2>
        </div>
        
        {/* Линия */}
        <div className="absolute left-[3px] top-[27.5px] w-[151.5px] h-[1px] bg-white"></div>
        
        {/* Подзаголовок */}
        <div className="absolute left-0 top-[36px] w-[547px] h-[58px]">
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">Ближайшие мероприятия</h1>
        </div>

        {/* Картинка мероприятия */}
        <div 
          className="absolute left-[34px] top-[200px] w-[778px] h-[617px] rounded-[31px] border border-[#0D78EE] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={currentEvent.image}
            alt="Event Image"
            width={778}
            height={617}
            className="w-full h-full object-cover"
          />
          {/* Бейдж */}
          <div className="absolute left-[446px] top-[30px] w-[319px] h-[34px]">
            <div className="w-[305px] h-[34px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[14px] flex items-center justify-center">
              <span className="text-white text-[18px] font-inter">{currentEvent.badge}</span>
            </div>
          </div>

          {/* Кнопки навигации на картинке */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Кружочки для навигации */}
        <div className="absolute left-[773px] top-[847px] w-[113.5px] h-[11px] flex gap-[9px]">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-[12.12px] h-[11px] rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide 
                  ? 'bg-white w-[41.88px] rounded-[5.5px]' 
                  : 'bg-[#757575] hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Кнопки */}
        <Link 
          href={`/${locale}/events`}
          className="group absolute left-[900px] top-[38px] w-[358px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
        >
          {/* Градиентный overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Блик эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <span className="relative z-10 text-white text-[18px] font-inter font-semibold uppercase group-hover:text-shadow-lg transition-all duration-300">Все мероприятия</span>
        </Link>
        
        <Link 
          href={`/${locale}/calendar`}
          className="group absolute left-[1327px] top-[38px] w-[354px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
        >
          {/* Градиентный overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Блик эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <span className="relative z-10 text-white text-[18px] font-inter font-semibold uppercase group-hover:text-shadow-lg transition-all duration-300">Календарь мероприятий</span>
        </Link>

        {/* Правая часть с информацией */}
        <div className="absolute left-[900px] top-[190px] w-[745px] h-[627px]">
          {/* Заголовок события */}
          <div className="absolute left-0 top-0 w-[726px] h-[217px]">
            <h1 className="text-[#0184F8] text-[60px] leading-[68.4px] font-franklin font-normal uppercase">
              {currentEvent.title}
            </h1>
          </div>

          {/* Описание */}
          <div className="absolute left-[4px] top-[223px] w-[735px] h-[92px]">
            <p className="text-white text-[15px] leading-[18.15px] font-inter font-normal">
              {currentEvent.description}
            </p>
          </div>

          {/* Скидка */}
          <div className="absolute left-[4px] top-[299px] w-[169px] h-[57px]">
            <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">Скидка</span>
          </div>
          <div className="absolute left-[94px] top-[335px] w-[208px] h-[128px]">
            <span className="text-[110px] leading-[125px] font-franklin font-normal uppercase bg-gradient-to-br from-[#0B7BF1] to-[#850191] bg-clip-text text-transparent">{currentEvent.discount}</span>
          </div>
          <div className="absolute left-[345px] top-[300px] w-[400px] h-[57px]">
            <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">{currentEvent.discountText}</span>
          </div>

          {/* Таймер */}
          <div className="absolute left-[348px] top-[357px] w-[392px] h-[98px]">
            <div className="flex gap-[14px]">
              <div className="w-[87px] h-[75px] bg-[#3F3F3F] rounded-[8px] flex flex-col items-center justify-center">
                <span className="text-white text-[40px] font-franklin">{currentEvent.days.toString().padStart(2, '0')}</span>
                <span className="text-white text-[12px] font-inter">Дней</span>
              </div>
              <div className="w-[86px] h-[75px] bg-[#3F3F3F] rounded-[8px] flex flex-col items-center justify-center">
                <span className="text-white text-[40px] font-franklin">{currentEvent.hours.toString().padStart(2, '0')}</span>
                <span className="text-white text-[12px] font-inter">Часов</span>
              </div>
              <div className="w-[86px] h-[75px] bg-[#3F3F3F] rounded-[8px] flex flex-col items-center justify-center">
                <span className="text-white text-[40px] font-franklin">{currentEvent.minutes.toString().padStart(2, '0')}</span>
                <span className="text-white text-[12px] font-inter">Минут</span>
              </div>
              <div className="w-[87px] h-[75px] bg-[#3F3F3F] rounded-[8px] flex flex-col items-center justify-center">
                <span className="text-white text-[40px] font-franklin">{currentEvent.seconds.toString().padStart(2, '0')}</span>
                <span className="text-white text-[12px] font-inter">Секунд</span>
              </div>
            </div>
          </div>

          {/* Детали события */}
          <div className="absolute left-[4px] top-[478px] w-[712px] h-[64px] space-y-[18px]">
            <div className="flex items-center gap-[30px]">
              <span className="text-white text-[12px] font-inter">📅</span>
              <span className="text-white text-[12px] font-inter">{currentEvent.date}</span>
              <span className="text-white text-[12px] font-inter">⏰</span>
              <span className="text-white text-[12px] font-inter">{currentEvent.time}</span>
            </div>
            <div className="flex items-center gap-[30px]">
              <span className="text-white text-[12px] font-inter">📍</span>
              <span className="text-white text-[12px] font-inter">{currentEvent.location}</span>
              <span className="text-white text-[12px] font-inter">💬</span>
              <span className="text-white text-[12px] font-inter">{currentEvent.language}</span>
            </div>
            <div className="flex items-center gap-[30px]">
              <span className="text-white text-[12px] font-inter">💳</span>
              <span className="text-white text-[12px] font-inter">{currentEvent.price}</span>
            </div>
          </div>

          {/* Кнопка регистрации */}
          <Link 
            href={`/${locale}/register`}
            className="group absolute left-[6px] top-[573px] w-[727px] h-[54px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center relative overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            {/* Градиентный overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Блик эффект */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative z-10 text-white text-[20px] font-inter font-bold uppercase group-hover:text-shadow-lg transition-all duration-300">Зарегистрироваться</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsSlider; 