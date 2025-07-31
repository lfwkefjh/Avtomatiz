import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface EventsPageProps {
  params: {
    locale: string;
  };
}

export default function EventsPage({ params }: EventsPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Мероприятия</h1>
          <p className="text-xl text-gray-600 mb-12">
            Здесь будут отображаться предстоящие мероприятия ассоциации.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-primary"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Мероприятие {item}</h3>
                  <p className="text-gray-600 mb-4">
                    Описание мероприятия и его основных целей.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">25 января 2024</span>
                    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors">
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 