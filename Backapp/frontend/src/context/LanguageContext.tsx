'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageContextType {
  currentLocale: string;
  isChanging: boolean;
  changeLanguage: (newLocale: string) => Promise<void>;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: string;
}

// Интерфейс для состояния FAQ
interface LanguageChangeState {
  scrollPosition: number;
  openFAQs: string[];
  timestamp: number;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLocale 
}) => {
  const [currentLocale, setCurrentLocale] = useState(initialLocale);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const availableLanguages = [
    { code: 'ru', name: 'RU', flag: '/images/ru.svg' },
    { code: 'uz', name: 'UZ', flag: '/images/uz.svg' },
    { code: 'en', name: 'EN', flag: '/images/gb.svg' },
  ];

  // Обновляем текущий язык при изменении URL
  useEffect(() => {
    const pathLocale = pathname.split('/')[1];
    if (pathLocale && ['ru', 'uz', 'en'].includes(pathLocale) && pathLocale !== currentLocale) {
      setCurrentLocale(pathLocale);
    }
  }, [pathname, currentLocale, initialLocale]);

  // Функция смены языка без перезагрузки
  const changeLanguage = async (newLocale: string): Promise<void> => {
    if (newLocale === currentLocale || isChanging) return;
    
    try {
      setIsChanging(true);
      
      // Сохраняем состояние перед сменой
      const scrollPosition = window.scrollY;
      const openFAQs: string[] = [];
      
      // Сохраняем открытые FAQ
      document.querySelectorAll('[data-accordion-id]').forEach((element) => {
        const id = element.getAttribute('data-accordion-id');
        const isOpen = element.getAttribute('aria-expanded') === 'true';
        if (id && isOpen) {
          openFAQs.push(id);
        }
      });
      
      // Сохраняем данные в sessionStorage для восстановления
      const stateToSave: LanguageChangeState = {
        scrollPosition,
        openFAQs,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('languageChangeState', JSON.stringify(stateToSave));
      
      // Анимация затемнения
      document.body.style.transition = 'opacity 0.3s ease-in-out';
      document.body.style.opacity = '0.7';
      
      // Небольшая пауза для анимации
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Обновляем состояние языка
      setCurrentLocale(newLocale);
      
      // Меняем URL без перезагрузки
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
      window.history.pushState({}, '', newPath);
      
      // Сохраняем выбранный язык
      localStorage.setItem('preferred-locale', newLocale);
      
      // Возвращаем нормальную прозрачность
      await new Promise(resolve => setTimeout(resolve, 100));
      document.body.style.opacity = '1';
      
      // Восстанавливаем состояние после небольшой задержки
      setTimeout(() => {
        restoreState(stateToSave);
        setIsChanging(false);
      }, 200);
      
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
      document.body.style.opacity = '1';
    }
  };

  // Функция восстановления состояния (оптимизированная)
  const restoreState = (state: LanguageChangeState) => {
    try {
      // Восстанавливаем открытые FAQ с debounce
              const restoreFAQs = () => {
          state.openFAQs.forEach(faqId => {
            const button = document.querySelector(`[data-accordion-id="${faqId}"] button`) as HTMLButtonElement;
            if (button && !button.getAttribute('aria-expanded')) {
              button.click();
            }
          });
        };

      // Восстанавливаем позицию скролла
      const restoreScroll = () => {
        if (state.scrollPosition > 0) {
          window.scrollTo({ top: state.scrollPosition, behavior: 'smooth' });
        }
      };

      // Выполняем восстановление поэтапно
      setTimeout(restoreFAQs, 100);
      setTimeout(restoreScroll, 200);
      
      // Убираем состояние
      sessionStorage.removeItem('languageChangeState');
      
    } catch (error) {
      console.error('Error restoring state:', error);
      sessionStorage.removeItem('languageChangeState');
    }
  };

  const contextValue: LanguageContextType = {
    currentLocale,
    isChanging,
    changeLanguage,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 