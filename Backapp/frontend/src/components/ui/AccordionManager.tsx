'use client';

import React from 'react';
import AccordionItem from './AccordionItem';
import { getFAQsByPage, getTranslatedFAQ, type FAQData } from '@/data/mock/faqData';
import { useLanguage } from '@/context/LanguageContext';

interface AccordionManagerProps {
  currentPage: string;
}

const AccordionManager: React.FC<AccordionManagerProps> = ({ currentPage }) => {
  // Используем Language Context
  const { currentLocale, isChanging } = useLanguage();
  
  // Получаем FAQ для текущей страницы из моковых данных
  const rawFAQs = getFAQsByPage(currentPage, currentLocale);
  
  // Получаем переведенные FAQ для текущей локали
  const translatedFAQs = rawFAQs.map(faq => {
    const translatedFAQ = getTranslatedFAQ(faq, currentLocale);
    return {
      ...faq,
      ...translatedFAQ
    };
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 AccordionManager:', { 
      currentPage,
      locale: currentLocale,
      isChanging,
      totalFAQs: translatedFAQs.length,
      withButtons: translatedFAQs.filter(faq => faq.buttonText).length,
      withoutButtons: translatedFAQs.filter(faq => !faq.buttonText).length,
      withABVariants: rawFAQs.filter(faq => faq.translations[currentLocale]?.abTestVariants).length
    });
  }

  return (
    <div className={`space-y-[20px] transition-opacity duration-300 ${
      isChanging ? 'opacity-70' : 'opacity-100'
    }`}>
      {translatedFAQs.map((faq) => (
        <AccordionItem
          key={`${faq.id}-${currentLocale}`} // Добавляем локаль в key для пересоздания при смене языка
          id={faq.id}
          slug={faq.slug}
          question={faq.question}
          answer={faq.answer}
          page={faq.page}
          metaTitle={faq.metaTitle}
          metaDescription={faq.metaDescription}
          sortOrder={faq.sortOrder}
          buttonText={faq.buttonText}
          buttonUrl={faq.buttonUrl}
          locale={currentLocale}
        />
      ))}
    </div>
  );
};

export default AccordionManager; 