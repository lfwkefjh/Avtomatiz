import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ServicesPageProps {
  params: {
    locale: string;
  };
}

export default function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Услуги</h1>
          <p className="text-xl text-gray-600 mb-12">
            Комплекс услуг для участников ассоциации.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Консультации по e-commerce',
              'Юридическая поддержка',
              'Маркетинговые решения',
              'Техническая поддержка',
              'Обучение и тренинги',
              'Networking мероприятия'
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{service}</h3>
                <p className="text-gray-600 mb-4">
                  Подробное описание услуги и её преимуществ для участников.
                </p>
                <button className="text-primary font-medium hover:underline">
                  Узнать больше →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 