import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AssociationBlocks from '@/components/sections-main/AssociationBlocks';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20 min-h-screen bg-[#17101E]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-8">О нас</h1>
          
          <div className="max-w-4xl mx-auto mb-16">
            <div className="prose prose-lg mb-12">
              <p className="text-xl text-white/90 leading-relaxed">
                Ассоциация Селлеров Узбекистана — это профессиональное объединение, 
                созданное для поддержки и развития электронной коммерции в стране.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Наша миссия</h2>
                <p className="text-white/80">
                  Создание благоприятной экосистемы для развития электронной коммерции 
                  в Узбекистане через объединение профессионалов, обмен опытом и поддержку инноваций.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Наше видение</h2>
                <p className="text-white/80">
                  Узбекистан как ведущий региональный хаб электронной коммерции с процветающим 
                  сообществом профессиональных селлеров.
                </p>
              </div>
            </div>

            <div className="bg-[rgba(35,30,50,0.6)] rounded-lg p-8 mb-12 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-center text-white">Наши достижения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0184F4] mb-2">500+</div>
                  <div className="text-white/80">Участников</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0184F4] mb-2">50+</div>
                  <div className="text-white/80">Мероприятий</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0184F4] mb-2">100+</div>
                  <div className="text-white/80">Партнеров</div>
                </div>
              </div>
            </div>
          </div>

          {/* Блоки с анимациями: чем занимается и для кого */}
          <AssociationBlocks />
        </div>
      </div>
      <Footer />
    </>
  );
} 