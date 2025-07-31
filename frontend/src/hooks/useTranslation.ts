'use client';

import { useLanguage } from '@/context/LanguageContext';

export type SupportedLocale = 'ru' | 'uz' | 'en';

export interface Translations {
  ru?: string;
  uz?: string; 
  en?: string;
}

export const useTranslation = () => {
  const { currentLocale } = useLanguage();

  const t = (translations: Translations, fallback = ''): string => {
    const locale = currentLocale as SupportedLocale;
    return translations[locale] || translations.ru || fallback;
  };

  return {
    locale: currentLocale as SupportedLocale,
    t
  };
}; 