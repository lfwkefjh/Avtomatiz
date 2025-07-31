import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PartnersPageProps {
  params: {
    locale: string;
  };
}

export default function PartnersPage({ params }: PartnersPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Партнеры</h1>
          <p className="text-xl text-gray-600 mb-12">
            Наши стратегические партнеры и спонсоры.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3 mx-auto"></div>
                  <h4 className="font-medium">Партнер {index + 1}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Станьте нашим партнером</h2>
            <p className="mb-6 opacity-90">
              Присоединяйтесь к экосистеме электронной коммерции Узбекистана
            </p>
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 