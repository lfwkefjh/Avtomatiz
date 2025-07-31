'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const Footer: React.FC = () => {
  const params = useParams();
  const locale = params?.locale as string || 'ru';

  const socialLinks = [
    { name: 'Telegram', icon: 'telegram', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'Facebook', icon: 'facebook', href: '#' },
  ];

  const navigationLinks = [
    { name: 'Ивенты', href: '/events' },
    { name: 'Сервисы', href: '/services' },
    { name: 'Селлеру', href: '/sellers' },
    { name: 'Парёнрам', href: '/partners' },
    { name: 'Новости', href: '/news' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <footer className="bg-[#18142E] text-white relative">
      <div className="max-w-[1920px] mx-auto h-[592px] relative">
        {/* Логотип */}
        <div className="absolute left-[157px] top-[85px]">
          <Link href={getLocalizedPath('/')}>
            <Image 
              src="/images/logo.png" 
              alt="Ассоциация селлеров Узбекистана" 
              width={286} 
              height={89}
              className="object-contain"
            />
          </Link>
        </div>

        {/* НАВИГАЦИЯ */}
        <div className="absolute left-[631px] top-[85px]">
          <h3 className="text-[#0184F8] text-[25px] font-normal leading-[30px] mb-[49px]">НАВИГАЦИЯ</h3>
          <div className="space-y-[11px]">
            {navigationLinks.map((link) => (
              <Link 
                key={link.name}
                href={getLocalizedPath(link.href)}
                className="block text-white text-xl leading-[24px] hover:text-[#0184F4] hover:underline transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* КОНТАКТЫ */}
        <div className="absolute left-[1047px] top-[85px]">
          <h3 className="text-[#0184F8] text-[25px] font-normal leading-[30px] mb-[49px]">КОНТАКТЫ</h3>
          <div className="space-y-[11px]">
            <a 
              href="tel:+998901111111"
              className="block text-white text-xl leading-[24px] hover:text-[#0184F4] transition-colors duration-200"
            >
              +998 90 111 11 11
            </a>
            <a 
              href="mailto:info@taibaleasing.com"
              className="block text-white text-xl leading-[24px] font-geist hover:text-[#0184F4] transition-colors duration-200"
            >
              info@taibaleasing.com
            </a>
            <div className="text-white text-xl leading-[24px]">Адрес:</div>
          </div>
        </div>

        {/* ВРЕМЯ РАБОТЫ */}
        <div className="absolute left-[1463px] top-[85px]">
          <h3 className="text-[#0184F8] text-[25px] font-normal leading-[30px] mb-[49px]">ВРЕМЯ РАБОТЫ</h3>
          <div className="text-white text-xl leading-[24px]">
            С 8:00 по 18:00 по будням
          </div>
        </div>

        {/* Социальные сети */}
        <div className="absolute left-[1049px] top-[363px] flex gap-[10px]">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="w-[50px] h-[50px] rounded-full bg-white/10 backdrop-blur-[50px] flex items-center justify-center hover:bg-white/20 transition-colors group"
            >
              {social.icon === 'telegram' && (
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              )}
              {social.icon === 'instagram' && (
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              )}
              {social.icon === 'facebook' && (
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* Разделитель */}
        <div className="absolute left-[3px] top-[469px] w-[1920px] h-px bg-[#0184F8]"></div>

        {/* Нижняя часть - исправляем позиционирование */}
        <div className="absolute bottom-0 left-0 right-0 h-[123px]">
          {/* Копирайт - сдвигаем левее чтобы не пересекалось с офертой */}
          <div className="absolute left-[58px] top-[40px] text-white text-xl leading-[24px] text-left max-w-[500px]">
            © 2025 Ассоциация селлеров Узбекистана. Все права защищены.
          </div>
          
          {/* Оферта - сдвигаем правее */}
          <Link href={getLocalizedPath('/offer')} className="absolute left-[650px] top-[45px] text-white text-xl leading-[24px] hover:text-[#0184F4] transition-colors">
            Оферта
          </Link>

          {/* Политика возврата средств */}
          <Link href={getLocalizedPath('/refund')} className="absolute left-[800px] top-[41px] text-white text-xl leading-[24px] hover:text-[#0184F4] transition-colors">
            Политика возврата средств
          </Link>

          {/* Политика конфиденциальности */}
          <Link href={getLocalizedPath('/privacy')} className="absolute left-[1135px] top-[41px] text-white text-xl leading-[24px] hover:text-[#0184F4] transition-colors">
            Политика конфиденциальности
          </Link>

          {/* Разработано с любовью */}
          <div className="absolute left-[1554px] top-[28px] text-white text-xl leading-[24px] text-center">
            Разработано с ❤️ для развития<br />
            e-commerce в Узбекистане
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 