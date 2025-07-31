'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getSortedTrustData, getTrustItemDimensions } from '@/data/mock/trustData';
import TrustCard from '@/components/ui/TrustCard';

interface TrustTranslations {
  ru: {
    trust: string;
    trustTitle: string;
  };
  en: {
    trust: string;
    trustTitle: string;
  };
  uz: {
    trust: string;
    trustTitle: string;
  };
}

const translations: TrustTranslations = {
  ru: {
    trust: "ДОВЕРИЕ",
    trustTitle: "НА ЧЁМ СТРОИТЬСЯ ДОВЕРИЕ К НАМ"
  },
  en: {
    trust: "TRUST",
    trustTitle: "WHAT OUR TRUST IS BUILT ON"
  },
  uz: {
    trust: "ISHONCH",
    trustTitle: "BIZGA NISBATAN ISHONCH NIMAGA ASOSLANGAN"
  }
};

export default function TrustSection() {
  const { currentLocale } = useLanguage();
  const { t } = useTranslation();
  
  const trustData = getSortedTrustData();

  // Позиции блоков (как в оригинальном коде)
  const positions = [
    { left: 8, top: 158 },     // блок 1
    { left: 859, top: 158 },   // блок 2  
    { left: 1279, top: 158 },  // блок 3
    { left: 8, top: 496 },     // блок 4
    { left: 438, top: 496 },   // блок 5
    { left: 862, top: 491 },   // блок 6
  ];

  return (
    <div className="absolute left-[128px] top-[5234px] w-[1683px] h-[820px]">
      {/* Заголовок */}
      <div className="absolute left-[8px] top-0 w-[561px] h-[65px]">
        <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">
          {t({ ru: translations.ru.trust, en: translations.en.trust, uz: translations.uz.trust })}
        </h2>
      </div>
      
      <div className="absolute left-[7px] top-[34px] w-[718px] h-[58px]">
        <h1 className="text-[#3B82F6] text-[40px] leading-[45.4px] font-franklin font-normal uppercase">
          {t({ ru: translations.ru.trustTitle, en: translations.en.trustTitle, uz: translations.uz.trustTitle })}
        </h1>
      </div>
      
      <div className="absolute left-[10px] top-[27.5px] w-[92px] h-[1px] bg-white"></div>

      {/* Блоки преимуществ */}
      <div className="relative">
        {trustData.map((trust, index) => {
          const dimensions = getTrustItemDimensions(trust.order);
          const position = positions[index] || positions[0];
          
          return (
            <TrustCard
              key={trust.id}
              trust={trust}
              dimensions={dimensions}
              position={position}
            />
          );
        })}
      </div>
    </div>
  );
} 