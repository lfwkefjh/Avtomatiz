export interface AdBannerItem {
  id: string;
  order: number;
  type: 'image' | 'gif' | 'webm';
  // Страница, на которой показывать баннер
  page: 'home' | 'events' | 'services' | 'sellers' | 'partners' | 'news' | 'about' | 'contacts' | 'all';
  // Ресурсы для десктопа
  desktop: {
    ru: string;
    en: string;
    uz: string;
    width: number;
    height: number;
  };
  // Ресурсы для мобилки  
  mobile: {
    ru: string;
    en: string;
    uz: string;
    width: number;
    height: number;
  };
  // Длительность отображения (в секундах)
  duration: number;
  // Ссылка при клике (опционально)
  link?: string;
  // Открывать в новой вкладке
  openInNewTab?: boolean;
  // Alt текст
  alt: {
    ru: string;
    en: string;
    uz: string;
  };
  // Meta данные для SEO и аналитики
  metaTitle: {
    ru: string;
    en: string;
    uz: string;
  };
  metaDescription: {
    ru: string;
    en: string;
    uz: string;
  };
  // Активен ли баннер
  isActive: boolean;
}

export const adBannerData: AdBannerItem[] = [
  {
    id: "banner-main-promo",
    order: 1,
    type: "image",
    page: "home",
    desktop: {
      ru: "/images/events-image.png",
      en: "/images/events-image.png",
      uz: "/images/events-image.png",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/images/ad-banner-mobile-1.jpg",
      en: "/images/ad-banner-mobile-1.jpg", 
      uz: "/images/ad-banner-mobile-1.jpg",
      width: 375,
      height: 200
    },
    duration: 5,
    link: "https://avtomatiz.uz/events",
    openInNewTab: false,
    alt: {
      ru: "Главный рекламный баннер Avtomatiz",
      en: "Main promotional banner Avtomatiz",
      uz: "Avtomatiz asosiy reklama banneri"
    },
    metaTitle: {
      ru: "Рекламный баннер - Avtomatiz",
      en: "Promotional Banner - Avtomatiz", 
      uz: "Reklama Banneri - Avtomatiz"
    },
    metaDescription: {
      ru: "Главный рекламный баннер с акциями и предложениями от Avtomatiz",
      en: "Main promotional banner with offers and promotions from Avtomatiz",
      uz: "Avtomatiz dan takliflar va aksiyalar bilan asosiy reklama banneri"
    },
    isActive: true
  },
  {
    id: "banner-animated-gif",
    order: 2, 
    type: "gif",
    page: "home",
    desktop: {
      ru: "/images/T47J.gif",
      en: "/images/T47J.gif",
      uz: "/images/T47J.gif",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/images/T47J.gif",
      en: "/images/T47J.gif",
      uz: "/images/T47J.gif",
      width: 375, 
      height: 200
    },
    duration: 8,
    link: "https://avtomatiz.uz/seller",
    openInNewTab: false,
    alt: {
      ru: "Анимированный баннер для селлеров",
      en: "Animated banner for sellers",
      uz: "Sotuvchilar uchun animatsion banner"
    },
    metaTitle: {
      ru: "Анимированный баннер - Avtomatiz",
      en: "Animated Banner - Avtomatiz",
      uz: "Animatsion Banner - Avtomatiz"
    },
    metaDescription: {
      ru: "Анимированный GIF баннер с предложениями для селлеров",
      en: "Animated GIF banner with offers for sellers", 
      uz: "Sotuvchilar uchun takliflar bilan animatsion GIF banner"
    },
    isActive: true
  },
  {
    id: "banner-video-webm",
    order: 3,
    type: "webm",
    page: "home", 
    desktop: {
      ru: "/videos/sample-5s.webm",
      en: "/videos/sample-5s.webm",
      uz: "/videos/sample-5s.webm",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/videos/sample-5s.webm",
      en: "/videos/sample-5s.webm",
      uz: "/videos/sample-5s.webm",
      width: 375,
      height: 200
    },
    duration: 12,
    link: "https://avtomatiz.uz/partner", 
    openInNewTab: true,
    alt: {
      ru: "Видео баннер для партнеров",
      en: "Video banner for partners",
      uz: "Hamkorlar uchun video banner"
    },
    metaTitle: {
      ru: "Видео баннер - Avtomatiz",
      en: "Video Banner - Avtomatiz",
      uz: "Video Banner - Avtomatiz" 
    },
    metaDescription: {
      ru: "Промо видео баннер с информацией о партнерской программе",
      en: "Promotional video banner with partnership program information",
      uz: "Hamkorlik dasturi haqida ma'lumot bilan promo video banner"
    },
    isActive: true
  },
  {
    id: "banner-special-offer",
    order: 4,
    type: "image",
    page: "home",
    desktop: {
      ru: "/images/partnerships-image.png",
      en: "/images/partnerships-image.png",
      uz: "/images/partnerships-image.png",
      width: 1673, 
      height: 363
    },
    mobile: {
      ru: "/images/partnerships-image.png",
      en: "/images/partnerships-image.png",
      uz: "/images/partnerships-image.png",
      width: 375,
      height: 200
    },
    duration: 1, // Специальное предложение - показываем 1 секунду  
    link: "https://avtomatiz.uz/special-offer",
    openInNewTab: true,
    alt: {
      ru: "Специальное предложение Avtomatiz",
      en: "Special offer Avtomatiz", 
      uz: "Avtomatiz maxsus taklifi"
    },
    metaTitle: {
      ru: "Специальное предложение - Avtomatiz",
      en: "Special Offer - Avtomatiz",
      uz: "Maxsus Taklif - Avtomatiz"
    },
    metaDescription: {
      ru: "Ограниченное по времени специальное предложение от Avtomatiz",
      en: "Limited time special offer from Avtomatiz",
      uz: "Avtomatiz dan cheklangan vaqtli maxsus taklif"
    },
    isActive: true
  },
  {
    id: "banner-events-promo",
    order: 5,
    type: "image",
    page: "events",
    desktop: {
      ru: "/images/seller-background.png",
      en: "/images/seller-background.png",
      uz: "/images/seller-background.png",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/images/seller-background.png",
      en: "/images/seller-background.png",
      uz: "/images/seller-background.png",
      width: 375,
      height: 200
    },
    duration: 8,
    link: "https://avtomatiz.uz/events/upcoming",
    openInNewTab: false,
    alt: {
      ru: "Промо баннер мероприятий",
      en: "Events promo banner",
      uz: "Tadbirler promo banneri"
    },
    metaTitle: {
      ru: "Ближайшие мероприятия - Avtomatiz",
      en: "Upcoming Events - Avtomatiz",
      uz: "Yaqin Tadbirler - Avtomatiz"
    },
    metaDescription: {
      ru: "Узнайте о предстоящих мероприятиях и конференциях",
      en: "Learn about upcoming events and conferences",
      uz: "Kutilayotgan tadbirlar va konferentsiyalar haqida bilib oling"
    },
    isActive: true
  },
  {
    id: "banner-partners-special",
    order: 6,
    type: "image",
    page: "partners",
    desktop: {
      ru: "/images/partners-banner.png",
      en: "/images/partners-banner.png",
      uz: "/images/partners-banner.png",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/images/partners-banner-mobile.png",
      en: "/images/partners-banner-mobile.png",
      uz: "/images/partners-banner-mobile.png",
      width: 375,
      height: 200
    },
    duration: 10,
    link: "https://avtomatiz.uz/partners/join",
    openInNewTab: true,
    alt: {
      ru: "Специальное предложение для партнеров",
      en: "Special offer for partners",
      uz: "Hamkorlar uchun maxsus taklif"
    },
    metaTitle: {
      ru: "Станьте партнером - Avtomatiz",
      en: "Become a Partner - Avtomatiz",
      uz: "Hamkor bo'ling - Avtomatiz"
    },
    metaDescription: {
      ru: "Присоединяйтесь к нашей партнерской программе и развивайте бизнес вместе",
      en: "Join our partnership program and grow your business together",
      uz: "Bizning hamkorlik dasturimizga qo'shiling va biznesni birgalikda rivojlantiring"
    },
    isActive: true
  },
  {
    id: "banner-global-promo",
    order: 7,
    type: "image",
    page: "all",
    desktop: {
      ru: "/images/partnerships-image.png",
      en: "/images/partnerships-image.png",
      uz: "/images/partnerships-image.png",
      width: 1673,
      height: 363
    },
    mobile: {
      ru: "/images/partnerships-image.png",
      en: "/images/partnerships-image.png",
      uz: "/images/partnerships-image.png",
      width: 375,
      height: 200
    },
    duration: 15,
    link: "https://avtomatiz.uz/global-campaign",
    openInNewTab: true,
    alt: {
      ru: "Глобальная кампания Avtomatiz",
      en: "Global Avtomatiz campaign",
      uz: "Avtomatiz global kampaniyasi"
    },
    metaTitle: {
      ru: "Глобальная кампания - Avtomatiz",
      en: "Global Campaign - Avtomatiz",
      uz: "Global Kampaniya - Avtomatiz"
    },
    metaDescription: {
      ru: "Участвуйте в нашей глобальной кампании и получите эксклюзивные возможности",
      en: "Join our global campaign and get exclusive opportunities",
      uz: "Bizning global kampaniyamizda ishtirok eting va eksklyuziv imkoniyatlarga ega bo'ling"
    },
    isActive: true
  }
];

// Функция для получения активных баннеров, отсортированных по order
export const getActiveBanners = (page?: string): AdBannerItem[] => {
  return adBannerData
    .filter(banner => 
      banner.isActive && (page ? banner.page === page || banner.page === 'all' : true)
    )
    .sort((a, b) => a.order - b.order);
};

// Функция для получения баннера по ID
export const getBannerById = (id: string): AdBannerItem | undefined => {
  return adBannerData.find(banner => banner.id === id);
};

// Функция для получения баннеров по странице
export const getBannersByPage = (page: string): AdBannerItem[] => {
  return adBannerData
    .filter(banner => 
      banner.isActive && (banner.page === page || banner.page === 'all')
    )
    .sort((a, b) => a.order - b.order);
};

// Константы для настройки баннера
export const AD_BANNER_CONFIG = {
  // Длительность по умолчанию (если не указана)
  DEFAULT_DURATION: 10,
  // Минимальная длительность
  MIN_DURATION: 1,
  // Максимальная длительность  
  MAX_DURATION: 30,
  // Тип анимации переходов
  TRANSITION_TYPE: 'fade', // 'fade' | 'slide' | 'zoom'
  // Длительность анимации перехода (мс)
  TRANSITION_DURATION: 800,
  // Пауза при наведении
  PAUSE_ON_HOVER: true,
  // Показывать индикаторы
  SHOW_INDICATORS: true,
  // Показывать стрелки навигации
  SHOW_NAVIGATION: false,
  // Автозапуск
  AUTOPLAY: true
} as const; 