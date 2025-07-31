'use client';

import React, { useState, useEffect } from 'react';
import { useFAQAnalytics } from '@/lib/analytics';
import { getQuestionVariant, getButtonVariant, mockFAQData } from '@/data/mock/faqData';
import { getDeviceAnalytics } from '@/utils/deviceDetection';

// Интерфейс убран - логика перенесена в LanguageContext

interface AccordionItemProps {
  id?: string;
  slug?: string;
  question: string;
  answer: string;
  page?: string;
  metaTitle?: string;
  metaDescription?: string;
  isOpenDefault?: boolean;
  sortOrder?: number;
  buttonText?: string;
  buttonUrl?: string;
  locale?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  id, 
  slug, 
  question, 
  answer, 
  page, 
  metaTitle, 
  metaDescription, 
  isOpenDefault = false, 
  sortOrder,
  buttonText,
  buttonUrl,
  locale = 'ru'
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [openTime, setOpenTime] = useState<number | null>(null);
  
  const { trackClick, getVariant, getPersonalizedContent } = useFAQAnalytics();
  const [personalizedContent, setPersonalizedContent] = useState<any>(null);
  
  // Получаем A/B тест вариант для этого пользователя
  const variant = id ? getVariant(id) : 'control';
  
  // Получаем персонализированный контент только в браузере
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const content = getPersonalizedContent(id);
      setPersonalizedContent(content);
    }
  }, [id, getPersonalizedContent]);

  // Для избежания гидратации используем оригинальный вопрос до загрузки персонализации
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Эта логика теперь обрабатывается в LanguageContext
  // useEffect убран так как восстановление состояния происходит в контексте

  // Аналитика ховера FAQ
  const trackFAQHover = () => {
    if (typeof window !== 'undefined' && id) {
      const deviceInfo = getDeviceAnalytics();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'faq_hover',
          faqId: id,
          question: question,
          locale: locale,
          timestamp: new Date().toISOString(),
          ...deviceInfo
        })
      }).catch(console.error);
    }
  };

  const handleClick = async () => {
    const newState = !isOpen;
    setIsOpen(newState);

    // Отслеживание времени чтения
    if (newState) {
      setOpenTime(Date.now());
    } else if (openTime) {
      const timeSpent = Date.now() - openTime;
      setOpenTime(null);
      
      // Логируем только если пользователь читал дольше 5 секунд
      if (timeSpent > 5000) {
        console.log(`⏱️ Time spent on FAQ ${id}:`, timeSpent / 1000, 'seconds');
      }
    }

    // Отправка аналитики
    if (id && slug && page) {
      try {
        await trackClick({
          id,
          slug,
          question,
          page,
          isOpen: newState,
          sessionId: getSessionId(),
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    }

    // Debug лог для разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 FAQ clicked:', { 
        id, 
        slug, 
        page, 
        isOpen: newState, 
        variant,
        locale,
        personalizedContent: personalizedContent ? 'yes' : 'no',
        hasButton: buttonUrl ? 'yes' : 'no'
      });
    }
  };

  const getSessionId = (): string => {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('faq_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('faq_session_id', sessionId);
    }
    return sessionId;
  };

  // Получаем вариант вопроса для A/B теста из моковых данных
  const getDisplayQuestion = () => {
    if (!id) return question;
    
    // До гидратации показываем оригинальный вопрос
    if (!isClient) return question;
    
    // Ищем FAQ в моковых данных и получаем вариант для текущей локали
    const mockFAQ = mockFAQData.find(faq => faq.id === id);
    if (mockFAQ) {
      return getQuestionVariant(mockFAQ, variant, locale);
    }
    
    return question;
  };

  // Получаем вариант кнопки для A/B теста из моковых данных
  const getDisplayButtonText = () => {
    if (!id || !buttonText) return buttonText;
    
    // До гидратации показываем оригинальный текст кнопки
    if (!isClient) return buttonText;
    
    // Ищем FAQ в моковых данных и получаем вариант для текущей локали
    const mockFAQ = mockFAQData.find(faq => faq.id === id);
    if (mockFAQ) {
      return getButtonVariant(mockFAQ, variant, locale);
    }
    
    return buttonText;
  };

  // Обработка клика по кнопке действия
  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Аналитика клика по кнопке
    if (id && buttonUrl) {
      try {
        await trackClick({
          id,
          slug: slug || '',
          question,
          page: page || '',
          isOpen: true,
          sessionId: getSessionId(),
          timestamp: Date.now(),
          action: 'button_click',
          buttonUrl,
          buttonText: getDisplayButtonText()
        });
      } catch (error) {
        console.error('Button click tracking failed:', error);
      }
    }

    // Debug лог
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Button clicked:', { 
        id, 
        buttonText: getDisplayButtonText(), 
        buttonUrl,
        variant,
        locale
      });
    }

    // Открытие ссылки
    if (buttonUrl) {
      // Если ссылка внешняя, открываем в новой вкладке
      if (buttonUrl.startsWith('http')) {
        window.open(buttonUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Если внутренняя ссылка, переходим в той же вкладке
        window.location.href = buttonUrl;
      }
    }
  };

  return (
    <div 
      className={`w-full mb-4 rounded-2xl border border-[#2A4BFF] transition-all duration-300 hover:border-[#0396FF] hover:scale-[1.02] hover:shadow-[inset_0_0_20px_1px_rgba(1,132,244,0.4)] hover:z-50 relative ${
        isOpen ? 'bg-[#313A5A]' : 'bg-[#18142E]'
      }`}
      onMouseEnter={trackFAQHover}
    >
      <button
        className={`w-full flex items-center justify-between px-8 py-6 text-left focus:outline-none text-white cursor-pointer transition-all duration-300 ${
          isOpen ? 'bg-[#313A5A] rounded-t-2xl' : 'bg-[#18142E] rounded-2xl'
        }`}
        onClick={handleClick}
        type="button"
        data-accordion-id={id}
        data-slug={slug}
        data-page={page}
        data-sort-order={sortOrder}
        data-ab-variant={isClient ? variant : 'control'}
        data-meta-title={metaTitle}
        data-meta-description={metaDescription}
        data-has-button={buttonUrl ? 'true' : 'false'}
      >
        <span className="text-[22px] leading-[28px] font-franklin">
          {getDisplayQuestion()}
        </span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#2A4BFF] bg-gradient-to-br from-[#2A4BFF] to-[#C84BFF] text-white text-2xl transition-transform duration-300">
          <span className={`inline-block transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}>+</span>
        </span>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-8 pb-6 pt-2 text-[18px] leading-[24px] text-white/90 bg-[#313A5A] rounded-b-2xl">
          {answer}
          
          {/* Кнопка действия - показываем только если есть buttonUrl */}
          {buttonUrl && buttonText && (
            <div className="mt-6">
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2A4BFF] to-[#C84BFF] text-white font-franklin font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#2A4BFF]/25 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2A4BFF]/50"
              >
                <span>{getDisplayButtonText()}</span>
                <svg 
                  className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Персонализированный контент - показываем только если есть и после гидратации */}
          {personalizedContent && isOpen && isClient && (
            <div className="mt-4 p-3 bg-gradient-to-r from-[#0283F7]/20 to-[#850191]/20 rounded-lg border border-[#0283F7]/30">
              <p className="text-[#0283F7] font-semibold text-[16px] mb-2">
                {personalizedContent.cta}
              </p>
              {personalizedContent.urgency && (
                <p className="text-yellow-400 text-[14px]">
                  ⚡ {personalizedContent.urgency}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem; 