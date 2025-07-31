import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ProfilePageProps {
  params: {
    locale: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = params;
  
  return (
    <>
      <Header locale={locale} />
      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Личный кабинет</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
              
              <h2 className="text-2xl font-bold mb-4">Добро пожаловать!</h2>
              <p className="text-gray-600 mb-8">
                Войдите в систему, чтобы получить доступ к личному кабинету 
                и всем возможностям ассоциации.
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                  Войти
                </button>
                <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                  Регистрация
                </button>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Преимущества участия:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Доступ к эксклюзивным мероприятиям</li>
                  <li>• Консультации от экспертов</li>
                  <li>• Networking с коллегами</li>
                  <li>• Специальные предложения от партнеров</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 