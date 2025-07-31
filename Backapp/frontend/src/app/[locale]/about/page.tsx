import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">О нас</h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mb-12">
              <p className="text-xl text-gray-600 leading-relaxed">
                Ассоциация Селлеров Узбекистана — это профессиональное объединение, 
                созданное для поддержки и развития электронной коммерции в стране.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
                <p className="text-gray-600">
                  Создание благоприятной экосистемы для развития электронной коммерции 
                  в Узбекистане через объединение профессионалов, обмен опытом и поддержку инноваций.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Наше видение</h2>
                <p className="text-gray-600">
                  Узбекистан как ведущий региональный хаб электронной коммерции с процветающим 
                  сообществом профессиональных селлеров.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Наши достижения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Участников</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-gray-600">Мероприятий</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-gray-600">Партнеров</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 