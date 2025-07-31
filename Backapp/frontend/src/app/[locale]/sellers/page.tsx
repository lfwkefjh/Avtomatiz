import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface SellersPageProps {
  params: {
    locale: string;
  };
}

export default function SellersPage({ params }: SellersPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Селлеры</h1>
          <p className="text-xl text-gray-600 mb-12">
            Каталог участников ассоциации селлеров Узбекистана.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gradient-primary"></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Селлер {index + 1}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Специализация на продаже электроники и гаджетов.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Электроника
                    </span>
                    <button className="text-primary text-sm hover:underline">
                      Профиль
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