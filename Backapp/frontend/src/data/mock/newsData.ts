export interface NewsItem {
  id: string;
  title: {
    ru: string;
    en: string;
    uz: string;
  };
  excerpt: {
    ru: string;
    en: string;
    uz: string;
  };
  content: {
    ru: string;
    en: string;
    uz: string;
  };
  image: string;
  date: string;
  slug: string;
  category: {
    ru: string;
    en: string;
    uz: string;
  };
  featured: boolean;
  tags: string[];
  sortOrder: number;
  // Метаданные для SEO
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
}

export const newsData: NewsItem[] = [
  {
    id: "news-001",
    title: {
      ru: "Селлеры ассоциации провели мероприятие",
      en: "Association sellers held an event",
      uz: "Assotsiatsiya sotuvchilari tadbir o'tkazdi"
    },
    excerpt: {
      ru: "В рамках 4-го Исламского банковского и финансового форума стран СНГ, организованного Центром исламского банкинга и экономики «АлХуда» 16 июня...",
      en: "Within the framework of the 4th Islamic Banking and Financial Forum of CIS countries, organized by the Islamic Banking and Economics Center 'AlHuda' on June 16...",
      uz: "MDH mamlakatlarining 4-Islom banking va moliya forumi doirasida, 'AlHuda' Islom banking va iqtisodiyot markazi tomonidan 16-iyun kuni tashkil etilgan..."
    },
    content: {
      ru: "Подробная статья о важном событии в мире исламского банкинга и финансов. Мероприятие собрало ведущих экспертов отрасли для обсуждения актуальных вопросов развития исламских финансовых услуг в регионе.",
      en: "Detailed article about an important event in the world of Islamic banking and finance. The event brought together leading industry experts to discuss current issues in the development of Islamic financial services in the region.",
      uz: "Islom banking va moliya sohasidagi muhim voqea haqida batafsil maqola. Tadbir mintaqada islom moliya xizmatlarini rivojlantirish masalalarini muhokama qilish uchun sohaning yetakchi ekspertlarini yig'di."
    },
    image: "/images/events-image.png",
    date: "2025-06-17",
    slug: "sellers-association-event",
    category: {
      ru: "События",
      en: "Events", 
      uz: "Tadbirlar"
    },
    featured: true,
    tags: ["банкинг", "форум", "финансы"],
    sortOrder: 1,
    metaTitle: {
      ru: "Селлеры ассоциации провели мероприятие | Новости Avtomatiz",
      en: "Association sellers held an event | Avtomatiz News",
      uz: "Assotsiatsiya sotuvchilari tadbir o'tkazdi | Avtomatiz yangiliklari"
    },
    metaDescription: {
      ru: "Узнайте о важном событии в мире исламского банкинга. 4-й Исламский банковский форум стран СНГ собрал ведущих экспертов отрасли.",
      en: "Learn about an important event in the world of Islamic banking. The 4th Islamic Banking Forum of CIS countries brought together leading industry experts.",
      uz: "Islom banking sohasidagi muhim voqea haqida bilib oling. MDH mamlakatlarining 4-Islom banking forumi sohaning yetakchi ekspertlarini yig'di."
    }
  },
  {
    id: "news-002",
    title: {
      ru: "Новые партнерства в сфере электронной коммерции",
      en: "New partnerships in e-commerce",
      uz: "Elektron tijoratda yangi hamkorliklar"
    },
    excerpt: {
      ru: "Ассоциация заключила стратегические соглашения с ведущими технологическими компаниями для развития цифровой экономики в Узбекистане...",
      en: "The association has concluded strategic agreements with leading technology companies to develop the digital economy in Uzbekistan...",
      uz: "Assotsiatsiya O'zbekistonda raqamli iqtisodiyotni rivojlantirish uchun yetakchi texnologiya kompaniyalari bilan strategik shartnomalar imzoladi..."
    },
    content: {
      ru: "Детальный обзор новых партнерских соглашений и их влияния на развитие электронной коммерции в регионе. Анализ возможностей для местных предпринимателей.",
      en: "Detailed overview of new partnership agreements and their impact on e-commerce development in the region. Analysis of opportunities for local entrepreneurs.",
      uz: "Yangi hamkorlik shartnomalarining batafsil sharhi va ularning mintaqada elektron tijoratni rivojlantirishga ta'siri. Mahalliy tadbirkorlar uchun imkoniyatlarni tahlil qilish."
    },
    image: "/images/partnerships-image.png",
    date: "2025-06-15",
    slug: "new-ecommerce-partnerships",
    category: {
      ru: "Партнерства",
      en: "Partnerships",
      uz: "Hamkorliklar"
    },
    featured: true,
    tags: ["партнерство", "технологии", "развитие"],
    sortOrder: 2,
    metaTitle: {
      ru: "Новые партнерства в электронной коммерции | Avtomatiz",
      en: "New e-commerce partnerships | Avtomatiz",
      uz: "Elektron tijoratda yangi hamkorliklar | Avtomatiz"
    },
    metaDescription: {
      ru: "Стратегические соглашения с технологическими компаниями для развития цифровой экономики Узбекистана. Новые возможности для предпринимателей.",
      en: "Strategic agreements with technology companies to develop Uzbekistan's digital economy. New opportunities for entrepreneurs.",
      uz: "O'zbekiston raqamli iqtisodiyotini rivojlantirish uchun texnologiya kompaniyalari bilan strategik shartnomalar. Tadbirkorlar uchun yangi imkoniyatlar."
    }
  },
  {
    id: "news-003",
    title: {
      ru: "Итоги прошедших мероприятий ассоциации",
      en: "Results of past association events",
      uz: "Assotsiatsiya o'tgan tadbirlari yakunlari"
    },
    excerpt: {
      ru: "Обзор ключевых достижений и результатов мероприятий, проведенных ассоциацией в первом полугодии 2025 года...",
      en: "Overview of key achievements and results of events held by the association in the first half of 2025...",
      uz: "2025 yilning birinchi yarmida assotsiatsiya tomonidan o'tkazilgan tadbirlarning asosiy yutuqlari va natijalari sharhi..."
    },
    content: {
      ru: "Подробный анализ достигнутых результатов и планы на будущее. Статистика участников, обратная связь и влияние на развитие отрасли.",
      en: "Detailed analysis of achieved results and future plans. Participant statistics, feedback and impact on industry development.",
      uz: "Erishilgan natijalarning batafsil tahlili va kelajak rejalari. Ishtirokchilar statistikasi, fikr-mulohazalar va sohani rivojlantirishga ta'siri."
    },
    image: "/images/past-events-bg.png",
    date: "2025-06-10",
    slug: "past-events-results",
    category: {
      ru: "Отчеты",
      en: "Reports",
      uz: "Hisobotlar"
    },
    featured: true,
    tags: ["отчет", "результаты", "анализ"],
    sortOrder: 3,
    metaTitle: {
      ru: "Итоги мероприятий ассоциации 2025 | Avtomatiz",
      en: "Association events results 2025 | Avtomatiz",
      uz: "Assotsiatsiya tadbirlari yakunlari 2025 | Avtomatiz"
    },
    metaDescription: {
      ru: "Подробный анализ результатов мероприятий ассоциации в первом полугодии 2025 года. Статистика, достижения и планы на будущее.",
      en: "Detailed analysis of association events results in the first half of 2025. Statistics, achievements and future plans.",
      uz: "2025 yilning birinchi yarmida assotsiatsiya tadbirlarining natijalarini batafsil tahlil. Statistika, yutuqlar va kelajak rejalari."
    }
  },
  {
    id: "news-004",
    title: {
      ru: "Цифровая трансформация малого бизнеса",
      en: "Digital transformation of small business",
      uz: "Kichik biznesni raqamli transformatsiyasi"
    },
    excerpt: {
      ru: "Как современные технологии помогают малому и среднему бизнесу выходить на новые рынки и увеличивать прибыль...",
      en: "How modern technologies help small and medium businesses enter new markets and increase profits...",
      uz: "Zamonaviy texnologiyalar kichik va o'rta biznesga yangi bozorlarga chiqish va foyda oshirishga qanday yordam beradi..."
    },
    content: {
      ru: "Практические советы по внедрению цифровых решений в малом бизнесе. Кейсы успешных компаний и рекомендации экспертов.",
      en: "Practical advice on implementing digital solutions in small business. Success stories and expert recommendations.",
      uz: "Kichik biznesda raqamli yechimlarni joriy etish bo'yicha amaliy maslahatlar. Muvaffaqiyatli kompaniyalar va ekspertlar tavsiyalari."
    },
    image: "/images/partnerships-image.png",
    date: "2025-06-08",
    slug: "digital-transformation-small-business",
    category: {
      ru: "Технологии",
      en: "Technology",
      uz: "Texnologiyalar"
    },
    featured: false,
    tags: ["цифровизация", "бизнес", "инновации"],
    sortOrder: 4,
    metaTitle: {
      ru: "Цифровая трансформация малого бизнеса | Avtomatiz",
      en: "Digital transformation of small business | Avtomatiz",
      uz: "Kichik biznesni raqamli transformatsiyasi | Avtomatiz"
    },
    metaDescription: {
      ru: "Узнайте как современные технологии помогают малому бизнесу выходить на новые рынки. Практические советы и кейсы успешных компаний.",
      en: "Learn how modern technologies help small businesses enter new markets. Practical advice and success stories of companies.",
      uz: "Zamonaviy texnologiyalar kichik biznesga qanday yordam berishini bilib oling. Amaliy maslahatlar va muvaffaqiyatli kompaniyalar hikoylari."
    }
  },
  {
    id: "news-005",
    title: {
      ru: "Развитие экспорта через электронные платформы",
      en: "Export development through electronic platforms",
      uz: "Elektron platformalar orqali eksportni rivojlantirish"
    },
    excerpt: {
      ru: "Новые возможности для узбекских производителей на международных маркетплейсах и в цифровой торговле...",
      en: "New opportunities for Uzbek producers on international marketplaces and in digital trade...",
      uz: "O'zbek ishlab chiqaruvchilari uchun xalqaro savdo maydonchalarida va raqamli savdoda yangi imkoniyatlar..."
    },
    content: {
      ru: "Анализ экспортных возможностей через цифровые каналы. Обзор международных платформ и стратегии выхода на глобальные рынки.",
      en: "Analysis of export opportunities through digital channels. Overview of international platforms and strategies for entering global markets.",
      uz: "Raqamli kanallar orqali eksport imkoniyatlarini tahlil qilish. Xalqaro platformalar sharhi va global bozorlarga kirish strategiyalari."
    },
    image: "/images/bg-image-1.png",
    date: "2025-06-05",
    slug: "export-development-electronic-platforms",
    category: {
      ru: "Экспорт",
      en: "Export",
      uz: "Eksport"
    },
    featured: false,
    tags: ["экспорт", "платформы", "международная торговля"],
    sortOrder: 5,
    metaTitle: {
      ru: "Развитие экспорта через электронные платформы | Avtomatiz",
      en: "Export development through electronic platforms | Avtomatiz",
      uz: "Elektron platformalar orqali eksportni rivojlantirish | Avtomatiz"
    },
    metaDescription: {
      ru: "Новые возможности для узбекских производителей на международных маркетплейсах. Стратегии выхода на глобальные рынки через цифровые каналы.",
      en: "New opportunities for Uzbek producers on international marketplaces. Strategies for entering global markets through digital channels.",
      uz: "O'zbek ishlab chiqaruvchilari uchun xalqaro savdo maydonchalarida yangi imkoniyatlar. Raqamli kanallar orqali global bozorlarga kirish strategiyalari."
    }
  },
  {
    id: "news-006",
    title: {
      ru: "Искусственный интеллект в финансовых услугах",
      en: "Artificial intelligence in financial services",
      uz: "Moliya xizmatlarida sun'iy intellekt"
    },
    excerpt: {
      ru: "Революционные изменения в банковской сфере благодаря внедрению технологий машинного обучения и искусственного интеллекта...",
      en: "Revolutionary changes in banking sector through implementation of machine learning and artificial intelligence technologies...",
      uz: "Mashinali o'rganish va sun'iy intellekt texnologiyalarini joriy etish orqali bank sohasidagi inqilobiy o'zgarishlar..."
    },
    content: {
      ru: "Обзор применения ИИ в банковской сфере, автоматизация процессов кредитования, персонализация услуг и повышение безопасности транзакций.",
      en: "Overview of AI application in banking sector, automation of lending processes, service personalization and transaction security enhancement.",
      uz: "Bank sohasida AI qo'llanishining sharhi, kredit jarayonlarini avtomatlashtirish, xizmatlarni shaxsiylashtirish va tranzaksiya xavfsizligini oshirish."
    },
    image: "/images/bg-image-2.png",
    date: "2025-06-01",
    slug: "ai-in-financial-services",
    category: {
      ru: "Технологии",
      en: "Technology",
      uz: "Texnologiyalar"
    },
    featured: true,
    tags: ["ИИ", "финансы", "банкинг", "инновации"],
    sortOrder: 6,
    metaTitle: {
      ru: "ИИ в финансовых услугах | Avtomatiz Технологии",
      en: "AI in financial services | Avtomatiz Technology",
      uz: "Moliya xizmatlarida AI | Avtomatiz Texnologiyalar"
    },
    metaDescription: {
      ru: "Революционные изменения в банковской сфере с ИИ. Автоматизация кредитования, персонализация услуг и повышение безопасности транзакций.",
      en: "Revolutionary changes in banking with AI. Lending automation, service personalization and enhanced transaction security.",
      uz: "AI bilan bank sohasidagi inqilobiy o'zgarishlar. Kredit berishni avtomatlashtirish, xizmatlarni shaxsiylashtirish va tranzaksiya xavfsizligini oshirish."
    }
  }
];

// Функция для получения рекомендуемых новостей
export const getFeaturedNews = (limit: number = 3): NewsItem[] => {
  return newsData
    .filter(news => news.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
};

// Функция для получения новостей по категории
export const getNewsByCategory = (category: string, locale: string = 'ru'): NewsItem[] => {
  return newsData.filter(news => 
    news.category[locale as keyof typeof news.category].toLowerCase().includes(category.toLowerCase())
  );
};

// Функция для поиска новостей
export const searchNews = (query: string, locale: string = 'ru'): NewsItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return newsData.filter(news => 
    news.title[locale as keyof typeof news.title].toLowerCase().includes(lowercaseQuery) ||
    news.excerpt[locale as keyof typeof news.excerpt].toLowerCase().includes(lowercaseQuery) ||
    news.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 