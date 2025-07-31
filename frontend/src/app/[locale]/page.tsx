'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventsSlider from '@/components/sections-main/EventsSlider';
import TrustSection from '@/components/sections-main/TrustSection';
import AdBannerSection from '@/components/sections-main/AdBannerSection';
import PartnersSlider from '@/components/ui/PartnersSlider';
import AccordionManager from '@/components/ui/AccordionManager';
import ContactForm from '@/components/ui/ContactForm';
import NewsList from '@/components/ui/NewsList';
import VideoBlock from '@/components/ui/VideoBlock';
import FAQStructuredData, { OrganizationStructuredData } from '@/components/seo/StructuredData';
import { getFAQsByPage } from '@/data/mock/faqData';


interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  // Получаем FAQ данные из моковых файлов для structured data с учетом локали
  const rawFaqData = getFAQsByPage('home', locale);
  
  // Преобразуем для structured data (нужен упрощенный формат)
  const faqData = rawFaqData.map(faq => {
    const translation = faq.translations[locale] || faq.translations['ru'];
    return {
      id: faq.id,
      slug: faq.slug,
      question: translation.question,
      answer: translation.answer
    };
  });

  return (
    <>
      {/* Structured Data для поисковиков */}
      <FAQStructuredData 
        faqs={faqData}
        pageUrl={`https://yoursite.com/${locale}`}
        organizationName="Ассоциация селлеров Узбекистана"
      />
      <OrganizationStructuredData
        name="Ассоциация селлеров Узбекистана"
        url="https://yoursite.com"
        logo="https://yoursite.com/images/logo.png"
        description="Объединяем селлеров Узбекистана для развития e-commerce и цифровой экономики"
      />
    <div className="relative w-full max-w-[1920px] h-[10700px] bg-[#17101E] mx-auto overflow-hidden">
      {/* Основной фон */}
      <div className="absolute inset-0 w-full h-[10700px] bg-[#17101E]" />

      {/* Header */}
      <Header locale={locale} />

      {/* BG картинка 2 - оптимизированная */}
      <div className="absolute left-0 top-[5928px] w-full h-[2000px] overflow-hidden">
        <Image
          src="/images/bg-image-2.png"
          alt="Background Image 2"
          width={1920}
          height={2000}
          className="w-full h-full object-cover object-center opacity-10"
          style={{ mixBlendMode: 'lighten' }}
          loading="lazy"
        />
      </div>

      {/* BG картинка 1 и эллипс - оптимизированная */}
      <div className="absolute left-0 top-[3380px] w-full h-[1800px] overflow-hidden">
        <Image
          src="/images/bg-image-1.png"
          alt="Background Image 1"
          width={1920}
          height={1800}
          className="w-full h-full object-cover object-center opacity-10"
          style={{ mixBlendMode: 'lighten' }}
          loading="lazy"
        />
        <div 
          className="absolute left-1/2 top-[60%] w-[1200px] h-[400px] rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            background: 'rgba(105, 29, 117, 0.12)',
            filter: 'blur(300px)'
          }}
        />
      </div>

      {/* Hero блок */}
      <div className="absolute left-[136px] top-[180px] w-[1797px] h-[989px]">
        {/* Картинка справа */}
        <div className="absolute left-[800px] top-[20px] w-[1079px] h-[999px]">
          {/* Свечение */}
          <div 
            className="absolute left-0 top-[10px] w-[1079px] h-[989px] rounded-full"
            style={{ 
              background: 'rgba(47, 22, 65, 0.35)',
              filter: 'blur(150px)'
            }}
          />
          {/* Главная картинка */}
          <div className="absolute left-[136px] top-0 w-[700px] h-[700px]">
            <Image
              src="/images/hero-image.png"
              alt="Hero Image"
              width={700}
              height={700}
              className="w-full h-full object-cover"
              style={{ mixBlendMode: 'lighten' }}
              priority
            />
          </div>
        </div>

        {/* Текстовый блок */}
        <div className="absolute left-0 top-[50px] w-[777px] h-[556px]">
          {/* Заголовок */}
          <div className="absolute left-[3px] top-0 w-[774px] h-[375px]">
            <h1 className="text-white text-[110px] leading-[125px] font-franklin font-normal uppercase">
              Ассоциация селлеров узбекистана
            </h1>
          </div>
          
          {/* Подзаголовок */}
          <div className="absolute left-0 top-[392px] w-[772px] h-[65px]">
            <p className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">
              вместе Выводим e-comerse вашего бизнеса на новый уровень.
            </p>
          </div>

          {/* Кнопки */}
          <div className="absolute left-0 top-[501px] flex gap-[30px]">
            <Link 
              href={`/${locale}/partners`}
              className="group w-[350px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-lg flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer"
            >
              {/* Градиентный overlay для hover эффекта */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Блик эффект */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10 text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase group-hover:text-shadow-lg transition-all duration-300">
                Стать партнёром
              </span>
            </Link>
            
            <Link 
              href={`/${locale}/sellers`}
              className="group w-[350px] h-[55px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-lg flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
            >
              {/* Градиентный overlay для hover эффекта */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Блик эффект */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10 text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase group-hover:text-shadow-lg transition-all duration-300">
                Начать продавать
              </span>
            </Link>
            </div>

          {/* Третья кнопка - Написать нам */}
          <div className="absolute left-0 top-[588px] w-[780px]">
            <a 
              href="#contact-form"
              className="group w-[730px] h-[55px] bg-gradient-to-r from-[#850191] to-[#0283F7] rounded-lg flex items-center justify-center relative overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer"
            >
              {/* Градиентный overlay для hover эффекта */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D05A8] to-[#0396FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Блик эффект */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
                              <span className="relative z-10 text-white text-[22px] leading-[26.4px] font-inter font-normal uppercase group-hover:text-shadow-lg transition-all duration-300">
                  Написать нам
                </span>
            </a>
          </div>
        </div>
      </div>

      {/* Секция О нас */}
      <div className="absolute left-[139px] top-[1149px] w-[1245px] h-[745px]">
        {/* Размытый круг */}
        <div 
          className="absolute left-[331px] top-0 w-[745px] h-[745px] rounded-full"
          style={{ 
            background: 'rgba(22, 35, 65, 0.35)',
            filter: 'blur(150px)'
          }}
        />
        
        {/* Заголовок О нас */}
        <div className="absolute left-0 top-[51px] w-[561px] h-[65px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">О нас</h2>
        </div>
        
        {/* Линия под заголовком */}
        <div className="absolute left-0 top-[77.5px] w-[70.5px] h-[1px] bg-white"></div>
        
        {/* Основной заголовок */}
        <div className="absolute left-0 top-[88px] w-[1065px] h-[341px]">
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">
            <span className="text-[#0184F4]">Ассоциация селлеров Узбекистана</span> — живая экосистема развития ицифрово пространство предпринимательства
          </h1>
        </div>

        {/* Описание */}
        <div className="absolute left-[422px] top-[290px] w-[823px] h-[165px]">
          <p className="text-white text-[20px] leading-[24.2px] font-inter font-normal">
            Ассоциация селлеров Узбекистана, объединяющая более 2000 участников по всей стране, — это часть масштабного проекта цифровой трансформации экономики, созданного для воплощения духа современного предпринимательства через образовательные программы, инновационные бизнес-практики и передовые технологии электронной коммерции. Здесь каждый предприниматель — от новичка до эксперта — находит поддержку, знания и возможности для реализации своих амбиций в динамично развивающемся мире электронной коммерции.
          </p>
        </div>
      </div>

      {/* Секция Развитие */}
      <div className="absolute left-[135px] top-[1779px] w-[1681px] h-[656px]">
        {/* Заголовок Развитие */}
        <div className="absolute left-[4px] top-0 w-[561px] h-[65px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">Развитие</h2>
        </div>
        
        {/* Линия под заголовком */}
        <div className="absolute left-[4px] top-[26px] w-[105px] h-[1px] bg-white"></div>
        
        {/* Основной заголовок секции */}
        <div className="absolute left-[4px] top-[32px] w-[1065px] h-[341px]">
          <h1 className="text-white text-[40px] leading-[45.4px] font-franklin font-normal uppercase">
            Помогаем в развитии <span className="text-[#0184F4]">вашего бизнеса</span>
          </h1>
        </div>
        
        {/* Описание */}
        <div className="absolute left-[900px] top-[37px] w-[781px] h-[165px]">
          <p className="text-white text-[20px] leading-[24.2px] font-inter font-normal">
            Мы помогаем селлерам и предпринимателям расти, масштабироваться и уверенно выходить на новые рынки. Каждое направление — это шаг к устойчивому и прибыльному бизнесу. Выберите интересующий блок, чтобы узнать, как мы можем быть полезны.
          </p>
        </div>

        {/* Блок Селлеру */}
        <div className="absolute left-0 top-[185px] w-[769px] h-[471px] group cursor-pointer">
          <div className="relative w-full h-full rounded-[46px] border border-[#0184F8] overflow-hidden transition-shadow duration-300 group-hover:shadow-[inset_0_0_32px_2px_rgba(1,132,244,0.7)]">
            {/* Фоновое изображение */}
            <Image
              src="/images/seller-background.png"
              alt="Seller Background"
              fill
              sizes="769px"
              className="object-cover opacity-60"
            />
            {/* Оверлей */}
            <div className="absolute inset-0 bg-[rgba(25,21,52,0.6)]"></div>

            
            {/* Контент */}
            <div className="relative z-10">
              {/* Иконка */}
              <div className="absolute left-[39px] top-[29px] w-[73px] h-[73px] bg-gradient-to-br from-[#0283F7] to-[#850191] rounded-lg flex items-center justify-center">
                <img src="/images/bag-happy.svg" alt="Селлеру" className="w-[32px] h-[32px]" />
              </div>
              
              {/* Заголовок */}
              <div className="absolute left-[134px] top-[53px] w-[186px] h-[65px]">
                <h3 className="text-white text-[35px] leading-[42.4px] font-inter font-bold group-hover:text-[#0184F4] transition-colors">Селлеру</h3>
              </div>
              
              {/* Подзаголовок */}
              <div className="absolute left-[39px] top-[129px] w-[476px] h-[41px]">
                <p className="text-white text-[20px] leading-[24.2px] font-inter font-bold">Станьте частью растущей экосистемы</p>
              </div>

              {/* Пункты списка */}
              <div className="absolute left-[90px] top-[178px] space-y-[38px]">
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Прямой доступ к целевой аудиотрии.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Совместные маретинговые компании.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Эксклюзивыне маркетинговые события.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Приоритетное размещение рекламы.</span>
                </div>
              </div>

              {/* Кнопка */}
              <div className="absolute left-[44px] top-[366px] w-[694px] h-[58px]">
                <Link 
                  href={`/${locale}/sellers`} 
                  className="group/btn flex items-center justify-center w-full h-full bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[15px] relative overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                >
                  {/* Градиентный overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Блик эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 text-white text-[18px] font-inter font-bold uppercase mr-4 group-hover/btn:text-shadow-lg transition-all duration-300">подробнее</span>
                  <img src="/images/arrow-right.svg" alt="arrow" className="relative z-10 w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Блок Партнёру */}
        <div className="absolute left-[900px] top-[185px] w-[781px] h-[471px] group cursor-pointer">
          <div className="relative w-full h-full rounded-[46px] border border-[#0184F8] overflow-hidden transition-shadow duration-300 group-hover:shadow-[inset_0_0_32px_2px_rgba(1,132,244,0.7)]">
            {/* Фоновое изображение */}
            <Image
              src="/images/partner-background.png"
              alt="Partner Background"
              fill
              sizes="781px"
              className="object-cover opacity-60"
            />
            {/* Оверлей */}
            <div className="absolute inset-0 bg-[rgba(25,21,52,0.6)]"></div>

            
            {/* Контент */}
            <div className="relative z-10">
              {/* Иконка */}
              <div className="absolute left-[34px] top-[29px] w-[73px] h-[73px] bg-gradient-to-br from-[#0283F7] to-[#850191] rounded-lg flex items-center justify-center">
                <img src="/images/handshake.svg" alt="Партнёру" className="w-[32px] h-[32px]" />
              </div>
              
              {/* Заголовок */}
              <div className="absolute left-[127px] top-[51px] w-[247px] h-[65px]">
                <h3 className="text-white text-[35px] leading-[42.4px] font-inter font-bold group-hover:text-[#0184F4] transition-colors">Партнёрам</h3>
              </div>
              
              {/* Подзаголовок */}
              <div className="absolute left-[34px] top-[129px] w-[408px] h-[37px]">
                <p className="text-white text-[20px] leading-[24.2px] font-inter font-bold">Станьте частью растущей экосистемы</p>
              </div>

              {/* Пункты списка */}
              <div className="absolute left-[85px] top-[178px] space-y-[38px]">
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Прямой доступ к целевой аудиотрии.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Совместные маретинговые компании.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Эксклюзивыне маркетинговые события.</span>
                </div>
                <div className="flex items-center gap-[35px]">
                  <img src="/images/star.svg" alt="star" className="w-6 h-6 flex-shrink-0" />
                  <span className="text-white text-[20px] font-inter font-bold">Приоритетное размещение рекламы.</span>
                </div>
              </div>

              {/* Кнопка */}
              <div className="absolute left-[39px] top-[366px] w-[694px] h-[58px]">
                <Link 
                  href={`/${locale}/partners`} 
                  className="group/btn flex items-center justify-center w-full h-full bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[15px] relative overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                >
                  {/* Градиентный overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Блик эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 text-white text-[18px] font-inter font-bold uppercase mr-4 group-hover/btn:text-shadow-lg transition-all duration-300">подробнее</span>
                  <img src="/images/arrow-right.svg" alt="arrow" className="relative z-10 w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ближайшие мероприятия блок */}
      <EventsSlider locale={locale} />

      {/* Секция Сотрудничества */}
      <PartnersSlider />

      {/* Рекламный баннер */}
      <AdBannerSection />

      {/* Доверие к нам */}
      <TrustSection />

      {/* Прошедшие мероприятия */}
      <div className="absolute left-[136px] top-[6359px]">
        <VideoBlock limit={8} />
      </div>

      {/* Новости */}
      <div className="absolute left-[134px] top-[7465px]">
        <NewsList limit={3} showAllButton={true} />
      </div>

      {/* FAQ */}
      <div className="absolute left-[2px] top-[8481px] w-[1813px] h-[815px]">
        {/* Размытый круг */}
        <div className="absolute left-0 top-0 w-[642px] h-[642px] rounded-full bg-[rgba(29,56,117,0.2)] pointer-events-none z-0" style={{ filter: 'blur(150px)' }}></div>
        
        {/* Заголовок */}
        <div className="absolute left-[133px] top-[33px] w-[50px] h-[36px]">
          <h2 className="text-white text-[20px] leading-[24.2px] font-inter font-normal uppercase">FAQ</h2>
        </div>
        <div className="absolute left-[132px] top-[69px] w-[547px] h-[58px]">
          <h1 className="text-[#0283F7] text-[40px] leading-[45.4px] font-franklin font-normal uppercase">Всё что хотели узнать</h1>
        </div>
        <div className="absolute left-[135px] top-[60.5px] w-[35px] h-[1px] bg-white"></div>

        {/* FAQ блок с использованием моковых данных */}
        <div className="absolute left-[135px] top-[197px] w-[1678px] z-10">
          <AccordionManager
            currentPage="home"
            />
        </div>
      </div>

      {/* Остались вопросы? - новая форма */}
      <ContactForm locale={locale} />

      {/* Footer */}
      <div className="absolute left-0 top-[10100px] w-[1923px] h-[592px]">
        <Footer />
      </div>
    </div>
    </>
  );
}
