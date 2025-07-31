'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import GradientButton from '@/components/ui/GradientButton';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setSlideDirection('left');
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % events.length);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 800);
    }, 6000); // Переключение каждые 6 секунд

    return () => clearInterval(timer);
  }, [events.length, isAutoPlaying]);

  // Остановка автопроигрывания при взаимодействии
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Возобновить через 10 сек
  };

  // Обработчик клика по кружочкам
  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    pauseAutoPlay();
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
    
    pauseAutoPlay();
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
    
    pauseAutoPlay();
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

  // Анимационные варианты
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const infoVariants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? -500 : 500,
      opacity: 0,
    }),
  };

  return (
    <motion.div 
      ref={ref}
      className="absolute left-[121px] top-[2695px] w-[1681px] h-[897px]"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="relative w-full h-full">
        {/* Фон блока с анимацией */}
        <motion.div 
          className="absolute left-0 top-[151px] w-[1681px] h-[746px] bg-[rgba(25,21,52,0.85)] border border-[#2786CA] rounded-[20px] backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(39, 134, 202, 0.25)",
            borderColor: "#0184F8",
            transition: { duration: 0.3 }
          }}
        ></motion.div>
        
        {/* Заголовок с анимацией */}
        <motion.div 
          className="absolute left-[1px] top-0 w-[561px] h-[27px]"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase"
            whileHover={{ 
              color: "#0184F8",
              transition: { duration: 0.3 }
            }}
          >
            Мероприятия
          </motion.h2>
        </motion.div>
        
        {/* Анимированная линия */}
        <motion.div 
          className="absolute left-[3px] top-[27.5px] w-[151.5px] h-[1px] bg-white"
          variants={itemVariants}
          whileInView={{
            width: ["0px", "151.5px"],
            transition: { duration: 1, delay: 0.5 }
          }}
        ></motion.div>
        
        {/* Подзаголовок с градиентным эффектом */}
        <motion.div 
          className="absolute left-0 top-[36px] w-[547px] h-[58px]"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text"
            whileHover={{
              backgroundImage: "linear-gradient(45deg, #0184F8, #850191, #0184F8)",
              transition: { duration: 0.5 }
            }}
          >
            Ближайшие мероприятия
          </motion.h1>
        </motion.div>

        {/* Картинка мероприятия с улучшенными анимациями */}
        <motion.div 
          className="absolute left-[34px] top-[200px] w-[778px] h-[617px] rounded-[31px] border border-[#0D78EE] overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            borderColor: "#0184F8",
            boxShadow: "0 20px 40px -12px rgba(1, 132, 248, 0.4)",
            transition: { duration: 0.3 }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentSlide}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="relative w-full h-full"
            >
              <Image
                src={currentEvent.image}
                alt="Event Image"
                width={778}
                height={617}
                className="w-full h-full object-cover"
              />
              
              {/* Градиентный overlay для лучшей читаемости */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
              
              {/* Бейдж с улучшенной анимацией */}
              <motion.div 
                className="absolute left-[446px] top-[30px] w-[319px] h-[34px]"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <motion.div 
                  className="w-[305px] h-[34px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[14px] flex items-center justify-center backdrop-blur-sm"
                  whileHover={{
                    scale: 1.05,
                    backgroundImage: "linear-gradient(45deg, #0396FF, #9D05A8)",
                    boxShadow: "0 8px 25px -8px rgba(133, 1, 145, 0.6)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.span 
                    className="text-white text-[18px] font-inter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentEvent.badge}
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Кнопки навигации с улучшенными эффектами */}
          <motion.button
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group backdrop-blur-sm"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </motion.button>
          
          <motion.button
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group backdrop-blur-sm"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </motion.div>

        {/* Кружочки для навигации с улучшенными анимациями */}
        <motion.div 
          className="absolute left-[773px] top-[847px] w-[113.5px] h-[11px] flex gap-[9px]"
          variants={itemVariants}
        >
          {events.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`h-[11px] rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-[41.88px] rounded-[5.5px]' 
                  : 'bg-[#757575] w-[12.12px]'
              }`}
              whileHover={{ 
                scale: 1.2,
                backgroundColor: index === currentSlide ? "#0184F8" : "#ffffff",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            />
          ))}
        </motion.div>

        {/* Кнопки с улучшенными эффектами */}
        <motion.div variants={itemVariants} className="absolute left-[900px] top-[38px]">
          <GradientButton 
            href={`/${locale}/events`}
            className="w-[358px]"
          >
            Все мероприятия
          </GradientButton>
        </motion.div>
        
        <motion.div variants={itemVariants} className="absolute left-[1327px] top-[-19px]">
          <GradientButton 
            href={`/${locale}/calendar`}
            className="w-[354px]"
          >
            Календарь мероприятий
          </GradientButton>
        </motion.div>

        {/* Правая часть с информацией */}
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={`info-${currentSlide}`}
            custom={slideDirection}
            variants={infoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              staggerChildren: 0.1
            }}
            className="absolute left-[900px] top-[190px] w-[745px] h-[627px]"
          >
            {/* Заголовок события */}
            <motion.div 
              className="absolute left-0 top-0 w-[726px] h-[217px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1 
                className="text-[#0184F8] text-[60px] leading-[68.4px] font-franklin font-normal uppercase bg-gradient-to-r from-[#0184F8] to-[#850191] bg-clip-text text-transparent"
                whileHover={{
                  scale: 1.02,
                  backgroundImage: "linear-gradient(45deg, #0396FF, #9D05A8)",
                  transition: { duration: 0.3 }
                }}
              >
                {currentEvent.title}
              </motion.h1>
            </motion.div>

            {/* Описание */}
            <motion.div 
              className="absolute left-[4px] top-[223px] w-[735px] h-[92px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white text-[15px] leading-[18.15px] font-inter font-normal">
                {currentEvent.description}
              </p>
            </motion.div>

            {/* Скидка с анимированным счетчиком */}
            <motion.div 
              className="absolute left-[4px] top-[299px] w-[169px] h-[57px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">Скидка</span>
            </motion.div>
            
            <motion.div 
              className="absolute left-[94px] top-[335px] w-[208px] h-[128px]"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <span className="text-[110px] leading-[125px] font-franklin font-normal uppercase bg-gradient-to-br from-[#0B7BF1] to-[#850191] bg-clip-text text-transparent">
                {currentEvent.discount}
              </span>
            </motion.div>
            
            <motion.div 
              className="absolute left-[345px] top-[300px] w-[400px] h-[57px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-white text-[30px] leading-[34px] font-franklin font-normal uppercase">{currentEvent.discountText}</span>
            </motion.div>

            {/* Таймер с анимацией flip */}
            <motion.div 
              className="absolute left-[348px] top-[357px] w-[392px] h-[98px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex gap-[14px]">
                <AnimatedCounter 
                  value={currentEvent.days} 
                  label="Дней" 
                  delay={0.8}
                />
                <AnimatedCounter 
                  value={currentEvent.hours} 
                  label="Часов" 
                  delay={0.9}
                  className="w-[86px] h-[75px]"
                />
                <AnimatedCounter 
                  value={currentEvent.minutes} 
                  label="Минут" 
                  delay={1.0}
                  className="w-[86px] h-[75px]"
                />
                <AnimatedCounter 
                  value={currentEvent.seconds} 
                  label="Секунд" 
                  delay={1.1}
                />
              </div>
            </motion.div>

            {/* Детали события */}
            <motion.div 
              className="absolute left-[4px] top-[478px] w-[712px] h-[64px] space-y-[18px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div 
                className="flex items-center gap-[30px]"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white text-[12px] font-inter">📅</span>
                <span className="text-white text-[12px] font-inter">{currentEvent.date}</span>
                <span className="text-white text-[12px] font-inter">⏰</span>
                <span className="text-white text-[12px] font-inter">{currentEvent.time}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-[30px]"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white text-[12px] font-inter">📍</span>
                <span className="text-white text-[12px] font-inter">{currentEvent.location}</span>
                <span className="text-white text-[12px] font-inter">💬</span>
                <span className="text-white text-[12px] font-inter">{currentEvent.language}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-[30px]"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white text-[12px] font-inter">💳</span>
                <span className="text-white text-[12px] font-inter">{currentEvent.price}</span>
              </motion.div>
            </motion.div>

            {/* Кнопка регистрации */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute left-[6px] top-[573px]"
            >
              <GradientButton 
                href={`/${locale}/register`}
                className="w-[727px]"
                size="lg"
              >
                Зарегистрироваться
              </GradientButton>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EventsSlider; 