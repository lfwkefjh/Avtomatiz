'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, type SupportedLocale } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'dropdown';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { currentLocale, isChanging, changeLanguage, supportedLocales } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (locale: SupportedLocale) => {
    setIsDropdownOpen(false);
    await changeLanguage(locale);
  };

  // Compact вариант - только флаги
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {Object.entries(supportedLocales).map(([locale, info]) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale as SupportedLocale)}
            disabled={isChanging}
            className={`
              relative text-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50
              ${currentLocale === locale 
                ? 'scale-110 filter drop-shadow-lg' 
                : 'opacity-70 hover:opacity-100'
              }
              ${isChanging ? 'animate-pulse' : ''}
            `}
            title={info.name}
          >
            {info.flag}
            {currentLocale === locale && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown вариант
  if (variant === 'dropdown') {
    const currentLangInfo = supportedLocales[currentLocale];
    
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isChanging}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 bg-white
            transition-all duration-300 hover:border-blue-400 hover:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isChanging ? 'animate-pulse' : ''}
          `}
        >
          <span className="text-xl">{currentLangInfo.flag}</span>
          <span className="font-medium text-gray-700">{currentLangInfo.code.toUpperCase()}</span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown меню */}
        <div className={`
          absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50
          transition-all duration-300 origin-top
          ${isDropdownOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
          }
        `}>
          {Object.entries(supportedLocales).map(([locale, info]) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale as SupportedLocale)}
              disabled={isChanging || locale === currentLocale}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors duration-200
                first:rounded-t-lg last:rounded-b-lg
                ${locale === currentLocale 
                  ? 'bg-blue-50 text-blue-600 cursor-default' 
                  : 'hover:bg-gray-50 text-gray-700'
                }
                disabled:opacity-50
              `}
            >
              <span className="text-lg">{info.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{info.name}</div>
                <div className="text-sm text-gray-500">{info.code.toUpperCase()}</div>
              </div>
              {locale === currentLocale && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default вариант - кнопки с названиями
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Object.entries(supportedLocales).map(([locale, info]) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale as SupportedLocale)}
          disabled={isChanging}
          className={`
            relative flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300
            ${currentLocale === locale
              ? 'bg-blue-100 text-blue-600 shadow-sm scale-105' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }
            ${isChanging ? 'animate-pulse opacity-50' : 'hover:scale-105'}
            disabled:cursor-not-allowed
          `}
        >
          <span className="text-lg">{info.flag}</span>
          <span className="hidden sm:inline">{info.name}</span>
          <span className="sm:hidden">{info.code.toUpperCase()}</span>
          
          {/* Индикатор активного языка */}
          {currentLocale === locale && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-blue-500 rounded-full"></div>
          )}
        </button>
      ))}
      
      {/* Индикатор загрузки */}
      {isChanging && (
        <div className="ml-2 flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 