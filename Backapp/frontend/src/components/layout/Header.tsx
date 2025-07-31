'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  locale: string;
}

const Header: React.FC<HeaderProps> = ({ locale }) => {
  // Header mounted
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const isStickyRef = useRef(false); // <--- добавляем ref
  const staticLanguageMenuRef = useRef<HTMLDivElement>(null);
  const stickyLanguageMenuRef = useRef<HTMLDivElement>(null);

  // Используем Language Context
  const { currentLocale, isChanging, changeLanguage, availableLanguages } = useLanguage();

  const currentLanguage = availableLanguages.find(lang => lang.code === currentLocale) || availableLanguages[0];

  // Language sync

  // Функция для смены языка через контекст
  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale || isChanging) return;
    
    try {
      // Закрываем меню языков
      setIsLanguageMenuOpen(false);
      
      // Используем функцию смены языка из контекста
      await changeLanguage(newLocale);
      
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Следим за изменением isSticky и обновляем ref
  useEffect(() => {
    isStickyRef.current = isSticky;
  }, [isSticky]);

  // Мгновенный триггер скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const upperHeaderHeight = 40; // Высота только верхнего блока контактов
      const shouldBeSticky = scrollPosition > upperHeaderHeight;
      // Сравниваем с ref, а не с isSticky
      if (shouldBeSticky !== isStickyRef.current) {
        console.log(`Scroll: ${scrollPosition}px, Sticky: ${shouldBeSticky}`);
        setIsSticky(shouldBeSticky);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие меню языков при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const staticMenu = staticLanguageMenuRef.current;
      const stickyMenu = stickyLanguageMenuRef.current;
      
      if (isLanguageMenuOpen && 
          staticMenu && !staticMenu.contains(target) &&
          stickyMenu && !stickyMenu.contains(target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  // Компонент навигационной строки
  const NavigationRow = ({ isSticky: sticky }: { isSticky: boolean }) => (
    <div className={`absolute left-0 ${sticky ? 'top-[15px]' : 'top-[80px]'} w-[1681px] h-[60px]`}>
      {/* Логотип */}
      <div className="absolute left-0 top-[6px] w-[130px] h-[40px]">
        <Link href={`/${locale}`} className="block w-full h-full hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/logo.png"
            alt="Sellers Association Logo"
            width={130}
            height={40}
            className="w-full h-full object-contain"
            priority
          />
        </Link>
      </div>

      {/* Навигация */}
      <div className="absolute left-[188px] top-[14px] w-[1029px] h-[23px]">
        {/* Ивенты */}
        <div className="absolute left-0 top-0 w-[85px] h-[23px]">
          <Link
            href={`/${locale}/events`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            Ивенты
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Сервисы */}
        <div className="absolute left-[137px] top-0 w-[113px] h-[23px]">
          <Link
            href={`/${locale}/services`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            Сервисы
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* селлеру */}
        <div className="absolute left-[302px] top-0 w-[95px] h-[23px]">
          <Link
            href={`/${locale}/sellers`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            селлеру
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* парёнрам */}
        <div className="absolute left-[449px] top-0 w-[152px] h-[23px]">
          <Link
            href={`/${locale}/partners`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            парёнрам
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Новости */}
        <div className="absolute left-[613px] top-0 w-[134px] h-[23px]">
          <Link
            href={`/${locale}/news`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            Новости
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* О нас */}
        <div className="absolute left-[764px] top-0 w-[89px] h-[23px]">
          <Link
            href={`/${locale}/about`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            О нас
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Контакты */}
        <div className="absolute left-[877px] top-0 w-[152px] h-[23px]">
          <Link
            href={`/${locale}/contacts`}
            className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase hover:text-[#0184F4] transition-all duration-300 relative group"
          >
            Контакты
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0184F4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      {/* Блок языков */}
              <div className="absolute left-[1220px] top-0 w-[80px] h-[178px]" ref={sticky ? stickyLanguageMenuRef : staticLanguageMenuRef}>
          {/* Кнопка выбора языка */}
          <div className="absolute left-[1px] top-0 w-[79px] h-[47px]">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="w-[79px] h-[47px] border-2 border-[#0283F7] rounded-[7px] bg-transparent backdrop-blur-sm flex items-center justify-center hover:bg-[#31303D]/80 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              width={24}
              height={23}
              className="absolute left-[15.59px] top-[12px] rounded-sm"
            />
            <svg 
              className="absolute left-[54.05px] top-[13px] w-[16.63px] h-[19px] text-[#0283F7] stroke-[1.5px]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

                  {/* Выпадающее меню языков */}
          {isLanguageMenuOpen && (
            <div className="absolute left-0 top-[51px] w-[80px] h-[127px] bg-[rgba(49,48,61,0.95)] border-2 border-[#077DF0] rounded-[11px] overflow-hidden backdrop-blur-sm z-10 shadow-2xl shadow-blue-500/20 animate-in slide-in-from-top-2 duration-300">
            {/* RU */}
            <div className="absolute left-[43px] top-[18px] w-[25px] h-[23px]">
              <button
                onClick={() => handleLanguageChange('ru')}
                className={`text-[18px] leading-[23.4px] font-inter font-normal transition-all duration-300 ${
                  currentLocale === 'ru' 
                    ? 'text-[#0283F7] cursor-default' 
                    : 'text-white hover:text-[#0283F7] hover:scale-110 cursor-pointer'
                } ${isChanging ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentLocale === 'ru' || isChanging}
              >
                {isChanging && currentLocale !== 'ru' ? (
                  <div className="inline-flex items-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    RU
                  </div>
                ) : (
                  'RU'
                )}
              </button>
            </div>
            <Image
              src="/images/ru.svg"
              alt="RU"
              width={23}
              height={23}
              className="absolute left-[10px] top-[18px] rounded-sm"
            />

            {/* UZ */}
            <div className="absolute left-[43px] top-[57px] w-[23px] h-[23px]">
              <button
                onClick={() => handleLanguageChange('uz')}
                className={`text-[18px] leading-[23.4px] font-inter font-normal transition-all duration-300 ${
                  currentLocale === 'uz' 
                    ? 'text-[#0283F7] cursor-default' 
                    : 'text-white hover:text-[#0283F7] hover:scale-110 cursor-pointer'
                } ${isChanging ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentLocale === 'uz' || isChanging}
              >
                {isChanging && currentLocale !== 'uz' ? (
                  <div className="inline-flex items-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    UZ
                  </div>
                ) : (
                  'UZ'
                )}
              </button>
            </div>
            <Image
              src="/images/uz.svg"
              alt="UZ"
              width={23}
              height={23}
              className="absolute left-[10px] top-[57px] rounded-sm"
            />

            {/* EN */}
            <div className="absolute left-[43px] top-[96px] w-[25px] h-[23px]">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[18px] leading-[23.4px] font-inter font-normal transition-all duration-300 ${
                  currentLocale === 'en' 
                    ? 'text-[#0283F7] cursor-default' 
                    : 'text-white hover:text-[#0283F7] hover:scale-110 cursor-pointer'
                } ${isChanging ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentLocale === 'en' || isChanging}
              >
                {isChanging && currentLocale !== 'en' ? (
                  <div className="inline-flex items-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    EN
                  </div>
                ) : (
                  'EN'
                )}
              </button>
            </div>
            <Image
              src="/images/gb.svg"
              alt="EN"
              width={23}
              height={23}
              className="absolute left-[10px] top-[96px] rounded-sm"
            />
          </div>
        )}
      </div>

      {/* Кнопка звонка */}
      <div className="absolute left-[1322px] top-0 w-[47px] h-[47px]">
        <a
          href="tel:+998901111111"
          className="w-[47px] h-[47px] border-4 border-[#0283F7] rounded-full flex items-center justify-center hover:scale-110 hover:bg-[#0283F7]/10 transition-all duration-300"
        >
          <svg 
            className="w-5 h-5 text-[#0283F7]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>

      {/* Кнопка регистрации */}
      <div className="absolute left-[1394px] top-0 w-[287px] h-[47px]">
        <button className="w-[287px] h-[47px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[8px] flex items-center justify-center hover:scale-105 transition-all duration-300">
          <span className="text-white text-[16px] leading-[19.4px] font-inter font-normal uppercase px-[12px]">
            Зарегестрироваться / войти
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Визуальный индикатор состояния для отладки */}
      
      {/* Отступ 30px сверху */}
      <div className="h-[30px]"></div>
      
      {/* Статический хедер */}
      <div className="relative w-[1681px] h-[260px] mx-auto">
        {/* Верхний блок хедера */}
        <div className="absolute left-[3px] top-0 w-[1674px] h-[50px] z-20">
          {/* Время работы */}
          <div className="absolute left-0 top-[14px] w-[384px] h-[23px]">
            <span className="text-white text-[18px] leading-[21.8px] font-inter font-normal">
              <span className="text-[#0184F4] font-bold">Время работы:</span> будние дни с 9:00 до 18:00
            </span>
          </div>

          {/* Адрес */}
          <div className="absolute left-[448px] top-[14px] w-[451px] h-[23px]">
            <span className="text-white text-[18px] leading-[21.8px] font-inter font-normal">
              <span className="text-[#0184F4] font-bold">Адресс:</span> Масив водник, Улица рохат, дом 1.
            </span>
          </div>

          {/* Телефон */}
          <div className="absolute left-[911px] top-[14px] w-[426px] h-[23px]">
            <span className="text-white text-[18px] leading-[21.8px] font-inter font-normal">
              <span className="text-[#0184F4] font-bold">Телефон для связи:</span> +998 90 111 11 11
            </span>
          </div>

          {/* Социальные сети */}
          <div className="absolute left-[1391px] top-0 w-[283px] h-[50px] z-20">
            {/* Заголовок "Соц сети:" */}
            <div className="absolute left-0 top-[14px] w-[278px] h-[23px]">
              <span className="text-[#0184F4] text-[18px] leading-[21.8px] font-inter font-bold">Соц сети:</span>
            </div>

            {/* Telegram */}
            <div className="absolute left-[113px] top-0 w-[50px] h-[50px] z-30">
              <a 
                href="https://t.me/Romankimtelegram" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[50px] h-[50px] rounded-full bg-white/10 backdrop-blur-[50px] flex items-center justify-center hover:scale-125 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 relative z-30"
              >
                <div className="w-[27px] h-[27px] flex items-center justify-center">
                  <svg className="w-[21.93px] h-[19.7px] text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Instagram */}
            <div className="absolute left-[173px] top-0 w-[50px] h-[50px] z-30">
              <a 
                href="https://www.instagram.com/uz_sellerclub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[50px] h-[50px] rounded-full bg-white/10 backdrop-blur-[50px] flex items-center justify-center hover:scale-125 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-pink-500/20 relative z-30"
              >
                <div className="w-[27px] h-[27px] flex items-center justify-center">
                  <svg className="w-[21.08px] h-[21.08px] text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Facebook */}
            <div className="absolute left-[233px] top-0 w-[50px] h-[50px] z-30">
              <a 
                href="https://www.facebook.com/groups/659109726259237" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[50px] h-[50px] rounded-full bg-white/10 backdrop-blur-[50px] flex items-center justify-center hover:scale-125 hover:bg-white/20 transition-all duration-300 cursor-pointer relative z-30"
              >
                <div className="w-[29.41px] h-[31px] flex items-center justify-center">
                  <svg className="w-[23.25px] h-[23.25px] text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Нижний блок хедера - навигация */}
        <NavigationRow isSticky={false} />
      </div>

      {/* Sticky хедер - только навигационная строка */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isSticky 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(23, 16, 30, 0.98) 0%, rgba(49, 48, 61, 0.98) 100%)',
          borderBottom: '1px solid rgba(2, 131, 247, 0.2)',
          pointerEvents: isSticky ? 'auto' : 'none'
        }}
      >
        <div className="relative w-[1681px] h-[80px] mx-auto">
          <NavigationRow isSticky={true} />
        </div>
      </div>
    </>
  );
};

export default Header; 