import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface NewsPageProps {
  params: {
    locale: string;
  };
}

export default function NewsPage({ params }: NewsPageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Новости</h1>
          <p className="text-xl text-gray-600 mb-12">
            Последние новости из мира электронной коммерции Узбекистана.
          </p>
          
          <div className="space-y-8">
            {Array.from({ length: 6 }, (_, index) => (
              <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gradient-primary"></div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded mr-3">
                        E-commerce
                      </span>
                      <span className="text-sm text-gray-500">5 дней назад</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-3">
                      Заголовок новости {index + 1}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Краткое описание новости и её основных моментов. Важная информация для участников ассоциации.
                    </p>
                    <button className="text-primary font-medium hover:underline">
                      Читать полностью →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 