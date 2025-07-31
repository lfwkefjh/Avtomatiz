export interface PartnerItem {
  id: string;
  order: number;
  // Основная информация
  title: {
    ru: string;
    en: string;
    uz: string;
  };
  category: {
    ru: string;
    en: string;
    uz: string;
  };
  description: {
    ru: string;
    en: string;
    uz: string;
  };
  // Изображения
  mainImage: {
    ru: string;
    en: string;
    uz: string;
    width: number;
    height: number;
  };
  // Ссылка на страницу партнера
  partnerUrl?: string;
  // Открывать в новой вкладке
  openInNewTab?: boolean;
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
  // Активен ли партнер
  isActive: boolean;
}

export const partnersData: PartnerItem[] = [
  {
    id: "partner-1",
    order: 1,
    title: {
      ru: "SELLER TOP",
      en: "SELLER TOP",
      uz: "SELLER TOP"
    },
    category: {
      ru: "IT сервис",
      en: "IT Service",
      uz: "IT xizmat"
    },
    description: {
      ru: "Наша платформа помогает селлерам - помогаем селлерам и предпринимателям расти, масштабироваться и уверенно выходить на новые рынки. Каждое направление — это шаг к устойчивому и прибыльному бизнесу. Выберите интересующий блок, чтобы узнать, как мы можем быть полезны.",
      en: "Our platform helps sellers - we help sellers and entrepreneurs grow, scale and confidently enter new markets. Each direction is a step towards a sustainable and profitable business. Choose the block you are interested in to learn how we can be useful.",
      uz: "Bizning platforma sotuvchilarga yordam beradi - sotuvchilar va tadbirkorlarga o'sish, kengayish va yangi bozorlarga ishonchli kirishda yordam beramiz. Har bir yo'nalish barqaror va foydali biznesga qadam. Qanday foydali bo'lishimiz mumkinligini bilish uchun sizni qiziqtirgan blokni tanlang."
    },
    mainImage: {
      ru: "/images/partnerships-image.png",
      en: "/images/partnerships-image.png",
      uz: "/images/partnerships-image.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://sellertop.com",
    openInNewTab: true,
    metaTitle: {
      ru: "SELLER TOP - IT сервис для селлеров",
      en: "SELLER TOP - IT Service for Sellers",
      uz: "SELLER TOP - Sotuvchilar uchun IT xizmat"
    },
    metaDescription: {
      ru: "SELLER TOP помогает селлерам расти и масштабироваться. Узнайте больше о наших IT сервисах для предпринимателей.",
      en: "SELLER TOP helps sellers grow and scale. Learn more about our IT services for entrepreneurs.",
      uz: "SELLER TOP sotuvchilarga o'sish va kengayishda yordam beradi. Tadbirkorlar uchun IT xizmatlarimiz haqida ko'proq ma'lumot oling."
    },
    isActive: true
  },
  {
    id: "partner-2",
    order: 2,
    title: {
      ru: "MARKETPLACE PRO",
      en: "MARKETPLACE PRO",
      uz: "MARKETPLACE PRO"
    },
    category: {
      ru: "E-commerce",
      en: "E-commerce",
      uz: "E-commerce"
    },
    description: {
      ru: "Профессиональная платформа для создания и управления онлайн-магазинами. Мы предоставляем все необходимые инструменты для успешной торговли в интернете, включая аналитику, маркетинг и логистику.",
      en: "Professional platform for creating and managing online stores. We provide all the necessary tools for successful online trading, including analytics, marketing and logistics.",
      uz: "Onlayn do'konlarni yaratish va boshqarish uchun professional platforma. Biz muvaffaqiyatli onlayn savdosi uchun barcha zarur vositalarni taqdim etamiz, jumladan tahlil, marketing va logistika."
    },
    mainImage: {
      ru: "/images/Parnter_4.png",
      en: "/images/Parnter_4.png",
      uz: "/images/Parnter_4.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://marketplacepro.com",
    openInNewTab: true,
    metaTitle: {
      ru: "MARKETPLACE PRO - E-commerce платформа",
      en: "MARKETPLACE PRO - E-commerce Platform",
      uz: "MARKETPLACE PRO - E-commerce platformasi"
    },
    metaDescription: {
      ru: "MARKETPLACE PRO - профессиональная платформа для создания онлайн-магазинов. Все инструменты для успешной торговли.",
      en: "MARKETPLACE PRO - professional platform for creating online stores. All tools for successful trading.",
      uz: "MARKETPLACE PRO - onlayn do'konlarni yaratish uchun professional platforma. Muvaffaqiyatli savdosi uchun barcha vositalar."
    },
    isActive: true
  },
  {
    id: "partner-3",
    order: 3,
    title: {
      ru: "LOGISTICS HUB",
      en: "LOGISTICS HUB",
      uz: "LOGISTICS HUB"
    },
    category: {
      ru: "Логистика",
      en: "Logistics",
      uz: "Logistika"
    },
    description: {
      ru: "Инновационные решения для логистики и доставки. Мы оптимизируем ваши транспортные маршруты, снижаем затраты и повышаем эффективность доставки. Наша система работает 24/7 для обеспечения бесперебойной работы.",
      en: "Innovative solutions for logistics and delivery. We optimize your transport routes, reduce costs and increase delivery efficiency. Our system works 24/7 to ensure uninterrupted operation.",
      uz: "Logistika va yetkazib berish uchun innovatsion yechimlar. Biz transport marshrutlaringizni optimallashtiramiz, xarajatlarni kamaytiramiz va yetkazib berish samaradorligini oshiramiz. Bizning tizim uzluksiz ishlashni ta'minlash uchun 24/7 ishlaydi."
    },
    mainImage: {
      ru: "/images/partnerships-image-3.png",
      en: "/images/partnerships-image-3.png",
      uz: "/images/partnerships-image-3.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://logisticshub.com",
    openInNewTab: true,
    metaTitle: {
      ru: "LOGISTICS HUB - Логистические решения",
      en: "LOGISTICS HUB - Logistics Solutions",
      uz: "LOGISTICS HUB - Logistika yechimlari"
    },
    metaDescription: {
      ru: "LOGISTICS HUB предоставляет инновационные решения для логистики и доставки. Оптимизация маршрутов и снижение затрат.",
      en: "LOGISTICS HUB provides innovative solutions for logistics and delivery. Route optimization and cost reduction.",
      uz: "LOGISTICS HUB logistika va yetkazib berish uchun innovatsion yechimlarni taqdim etadi. Marshrutlarni optimallashtirish va xarajatlarni kamaytirish."
    },
    isActive: true
  },
  {
    id: "partner-4",
    order: 4,
    title: {
      ru: "PAYMENT GATEWAY",
      en: "PAYMENT GATEWAY",
      uz: "PAYMENT GATEWAY"
    },
    category: {
      ru: "Платежи",
      en: "Payments",
      uz: "To'lovlar"
    },
    description: {
      ru: "Безопасные платежные решения для вашего бизнеса. Мы обеспечиваем надежную обработку транзакций, поддержку множественных валют и интеграцию с популярными платежными системами.",
      en: "Secure payment solutions for your business. We provide reliable transaction processing, multi-currency support and integration with popular payment systems.",
      uz: "Biznesingiz uchun xavfsiz to'lov yechimlari. Biz ishonchli tranzaksiyalarni qayta ishlash, ko'p valyuta qo'llab-quvvatlash va mashhur to'lov tizimlari bilan integratsiyani ta'minlaymiz."
    },
    mainImage: {
      ru: "/images/partnerships-image-4.png",
      en: "/images/partnerships-image-4.png",
      uz: "/images/partnerships-image-4.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://paymentgateway.com",
    openInNewTab: true,
    metaTitle: {
      ru: "PAYMENT GATEWAY - Платежные решения",
      en: "PAYMENT GATEWAY - Payment Solutions",
      uz: "PAYMENT GATEWAY - To'lov yechimlari"
    },
    metaDescription: {
      ru: "PAYMENT GATEWAY предоставляет безопасные платежные решения для бизнеса.",
      en: "PAYMENT GATEWAY provides secure payment solutions for business.",
      uz: "PAYMENT GATEWAY biznes uchun xavfsiz to'lov yechimlarini taqdim etadi."
    },
    isActive: true
  },
  {
    id: "partner-5",
    order: 5,
    title: {
      ru: "CLOUD STORAGE",
      en: "CLOUD STORAGE",
      uz: "CLOUD STORAGE"
    },
    category: {
      ru: "Облачные технологии",
      en: "Cloud Technologies",
      uz: "Bulut texnologiyalari"
    },
    description: {
      ru: "Надежное облачное хранилище для ваших данных. Мы обеспечиваем высокую безопасность, быстрый доступ и масштабируемость для растущего бизнеса.",
      en: "Reliable cloud storage for your data. We provide high security, fast access and scalability for growing businesses.",
      uz: "Ma'lumotlaringiz uchun ishonchli bulut saqlash. Biz o'sib borayotgan bizneslar uchun yuqori xavfsizlik, tez kirish va kengayish imkoniyatini ta'minlaymiz."
    },
    mainImage: {
      ru: "/images/partnerships-image-5.png",
      en: "/images/partnerships-image-5.png",
      uz: "/images/partnerships-image-5.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://cloudstorage.com",
    openInNewTab: true,
    metaTitle: {
      ru: "CLOUD STORAGE - Облачные решения",
      en: "CLOUD STORAGE - Cloud Solutions",
      uz: "CLOUD STORAGE - Bulut yechimlari"
    },
    metaDescription: {
      ru: "CLOUD STORAGE предоставляет надежное облачное хранилище для ваших данных.",
      en: "CLOUD STORAGE provides reliable cloud storage for your data.",
      uz: "CLOUD STORAGE ma'lumotlaringiz uchun ishonchli bulut saqlashni taqdim etadi."
    },
    isActive: true
  },
  {
    id: "partner-6",
    order: 6,
    title: {
      ru: "AI ANALYTICS",
      en: "AI ANALYTICS",
      uz: "AI ANALYTICS"
    },
    category: {
      ru: "Искусственный интеллект",
      en: "Artificial Intelligence",
      uz: "Sun'iy intellekt"
    },
    description: {
      ru: "Передовые решения в области искусственного интеллекта для анализа данных. Мы помогаем бизнесу принимать обоснованные решения на основе данных.",
      en: "Advanced artificial intelligence solutions for data analysis. We help businesses make data-driven decisions.",
      uz: "Ma'lumotlarni tahlil qilish uchun zamonaviy sun'iy intellekt yechimlari. Biz bizneslarga ma'lumotlarga asoslangan qarorlar qabul qilishda yordam beramiz."
    },
    mainImage: {
      ru: "/images/partnerships-image-6.png",
      en: "/images/partnerships-image-6.png",
      uz: "/images/partnerships-image-6.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://aianalytics.com",
    openInNewTab: true,
    metaTitle: {
      ru: "AI ANALYTICS - ИИ решения",
      en: "AI ANALYTICS - AI Solutions",
      uz: "AI ANALYTICS - AI yechimlari"
    },
    metaDescription: {
      ru: "AI ANALYTICS предоставляет передовые решения в области искусственного интеллекта.",
      en: "AI ANALYTICS provides advanced artificial intelligence solutions.",
      uz: "AI ANALYTICS sun'iy intellekt sohasida zamonaviy yechimlarni taqdim etadi."
    },
    isActive: true
  },
  {
    id: "partner-7",
    order: 7,
    title: {
      ru: "CYBER SECURITY",
      en: "CYBER SECURITY",
      uz: "CYBER SECURITY"
    },
    category: {
      ru: "Кибербезопасность",
      en: "Cybersecurity",
      uz: "Kiberxavfsizlik"
    },
    description: {
      ru: "Комплексные решения в области кибербезопасности для защиты вашего бизнеса от современных угроз. Мы обеспечиваем круглосуточный мониторинг и быструю реакцию на инциденты.",
      en: "Comprehensive cybersecurity solutions to protect your business from modern threats. We provide 24/7 monitoring and rapid incident response.",
      uz: "Biznesingizni zamonaviy tahdidlardan himoya qilish uchun keng qamrovli kiberxavfsizlik yechimlari. Biz 24/7 monitoring va tezkor voqea reaksiyasini ta'minlaymiz."
    },
    mainImage: {
      ru: "/images/partnerships-image-7.png",
      en: "/images/partnerships-image-7.png",
      uz: "/images/partnerships-image-7.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://cybersecurity.com",
    openInNewTab: true,
    metaTitle: {
      ru: "CYBER SECURITY - Кибербезопасность",
      en: "CYBER SECURITY - Cybersecurity",
      uz: "CYBER SECURITY - Kiberxavfsizlik"
    },
    metaDescription: {
      ru: "CYBER SECURITY предоставляет комплексные решения в области кибербезопасности.",
      en: "CYBER SECURITY provides comprehensive cybersecurity solutions.",
      uz: "CYBER SECURITY kiberxavfsizlik sohasida keng qamrovli yechimlarni taqdim etadi."
    },
    isActive: true
  },
  {
    id: "partner-8",
    order: 8,
    title: {
      ru: "MOBILE APP",
      en: "MOBILE APP",
      uz: "MOBILE APP"
    },
    category: {
      ru: "Мобильные приложения",
      en: "Mobile Applications",
      uz: "Mobil ilovalar"
    },
    description: {
      ru: "Разработка современных мобильных приложений для iOS и Android. Мы создаем интуитивные интерфейсы и обеспечиваем высокую производительность приложений.",
      en: "Development of modern mobile applications for iOS and Android. We create intuitive interfaces and ensure high application performance.",
      uz: "iOS va Android uchun zamonaviy mobil ilovalarni ishlab chiqish. Biz intuitiv interfeyslar yaratamiz va ilovalarning yuqori ishlashini ta'minlaymiz."
    },
    mainImage: {
      ru: "/images/partnerships-image-8.png",
      en: "/images/partnerships-image-8.png",
      uz: "/images/partnerships-image-8.png",
      width: 796,
      height: 347
    },
    partnerUrl: "https://mobileapp.com",
    openInNewTab: true,
    metaTitle: {
      ru: "MOBILE APP - Мобильные решения",
      en: "MOBILE APP - Mobile Solutions",
      uz: "MOBILE APP - Mobil yechimlar"
    },
    metaDescription: {
      ru: "MOBILE APP разрабатывает современные мобильные приложения для iOS и Android.",
      en: "MOBILE APP develops modern mobile applications for iOS and Android.",
      uz: "MOBILE APP iOS va Android uchun zamonaviy mobil ilovalarni ishlab chiqadi."
    },
    isActive: true
  }
];

export const getActivePartners = (): PartnerItem[] => {
  return partnersData
    .filter(partner => partner.isActive)
    .sort((a, b) => a.order - b.order);
};

export const getPartnerById = (id: string): PartnerItem | undefined => {
  return partnersData.find(partner => partner.id === id);
}; 