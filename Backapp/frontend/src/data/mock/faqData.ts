// Моковые данные FAQ для разработки и тестирования
// В продакшене эти данные будут приходить из API/базы данных с Spatie Translation Loader

export interface FAQTranslations {
  [locale: string]: {
    question: string;
    answer: string;
    metaTitle: string;
    metaDescription: string;
    buttonText?: string;
    // A/B тестирование тоже может быть переведено
    abTestVariants?: {
      variant_a?: {
        question: string;
        buttonText?: string;
        hypothesis: string;
      };
      variant_b?: {
        question: string;
        buttonText?: string;
        hypothesis: string;
      };
    };
  };
}

export interface FAQData {
  id: string;
  slug: string;
  page: string;
  sortOrder: number;
  isActive: boolean;
  buttonUrl?: string;
  // Переводы для всех языков
  translations: FAQTranslations;
}

export const mockFAQData: FAQData[] = [
  {
    id: "membership",
    slug: "kak-stat-chlenom-associacii-sellerov-uzbekistana",
    page: "home",
    sortOrder: 1,
    isActive: true,
    buttonUrl: "/membership/apply",
    translations: {
      // Русский язык
      ru: {
        question: "Как стать членом Ассоциации селлеров Узбекистана?",
        answer: "Для вступления в Ассоциацию необходимо заполнить заявку на нашем сайте, предоставить документы о регистрации бизнеса и пройти собеседование с нашими специалистами. После одобрения заявки вы получите доступ к эксклюзивным возможностям, включая участие в мероприятиях, доступ к базе партнеров и поддержку в развитии вашего бизнеса.",
        metaTitle: "Как стать членом Ассоциации селлеров Узбекистана | Пошаговое руководство",
        metaDescription: "Узнайте как вступить в Ассоциацию селлеров Узбекистана. Подробное руководство по подаче заявки, документам и собеседованию для членства.",
        buttonText: "Подать заявку на членство",
        abTestVariants: {
          variant_a: {
            question: "⚡ Как быстро стать членом Ассоциации селлеров? (Подача заявки за 5 минут)",
            buttonText: "Быстрая подача заявки",
            hypothesis: "Добавление срочности и конкретного времени увеличит конверсию на 25%"
          },
          variant_b: {
            question: "🚀 Хотите присоединиться к 2000+ успешных селлеров Узбекистана?",
            buttonText: "Присоединиться сейчас",
            hypothesis: "Социальное доказательство и призыв к действию повысят CTR на 30%"
          }
        }
      },
      // Английский язык
      en: {
        question: "How to become a member of the Uzbekistan Sellers Association?",
        answer: "To join the Association, you need to fill out an application on our website, provide business registration documents and go through an interview with our specialists. After approval of the application, you will get access to exclusive opportunities, including participation in events, access to the partner base and support in business development.",
        metaTitle: "How to become a member of Uzbekistan Sellers Association | Step-by-step guide",
        metaDescription: "Learn how to join the Uzbekistan Sellers Association. Detailed guide on application submission, documents and membership interview.",
        buttonText: "Apply for membership",
        abTestVariants: {
          variant_a: {
            question: "⚡ How to quickly become a member of the Sellers Association? (Application in 5 minutes)",
            buttonText: "Quick application",
            hypothesis: "Adding urgency and specific time will increase conversion by 25%"
          },
          variant_b: {
            question: "🚀 Want to join 2000+ successful sellers of Uzbekistan?",
            buttonText: "Join now",
            hypothesis: "Social proof and call to action will increase CTR by 30%"
          }
        }
      },
      // Узбекский язык
      uz: {
        question: "O'zbekiston sotuvchilar uyushmasiga a'zo bo'lish uchun nima qilish kerak?",
        answer: "Uyushmaga a'zo bo'lish uchun bizning saytimizda ariza to'ldirish, biznes ro'yxatga olish hujjatlarini taqdim etish va mutaxassislarimiz bilan suhbat o'tish kerak. Ariza tasdiqlangandan so'ng, siz eksklyuziv imkoniyatlarga ega bo'lasiz, jumladan tadbirlarda qatnashish, hamkorlar bazasiga kirish va biznesni rivojlantirishda yordam olish.",
        metaTitle: "O'zbekiston sotuvchilar uyushmasiga a'zo bo'lish | Bosqichma-bosqich qo'llanma",
        metaDescription: "O'zbekiston sotuvchilar uyushmasiga qanday qo'shilishni bilib oling. Ariza berish, hujjatlar va a'zolik suhbati bo'yicha batafsil qo'llanma.",
        buttonText: "A'zolik uchun ariza berish",
        abTestVariants: {
          variant_a: {
            question: "⚡ Sotuvchilar uyushmasiga tezda a'zo bo'lish uchun? (5 daqiqada ariza)",
            buttonText: "Tezkor ariza",
            hypothesis: "Shoshilinchlik va aniq vaqt qo'shish konversiyani 25% ga oshiradi"
          },
          variant_b: {
            question: "🚀 O'zbekistonning 2000+ muvaffaqiyatli sotuvchilariga qo'shilmoqchimisiz?",
            buttonText: "Hoziroq qo'shiling",
            hypothesis: "Ijtimoiy dalil va harakatga chaqirish CTR ni 30% ga oshiradi"
          }
        }
      }
    }
  },
  {
    id: "benefits",
    slug: "preimushchestva-uchastnikov-associacii-sellerov",
    page: "home",
    sortOrder: 2,
    isActive: true,
    buttonUrl: "/benefits",
    translations: {
      ru: {
        question: "Какие преимущества получают участники ассоциации?",
        answer: "Участники получают прямой доступ к целевой аудитории, участие в совместных маркетинговых кампаниях, эксклюзивные маркетинговые события, приоритетное размещение рекламы, образовательные программы и нетворкинг с другими предпринимателями. Также предоставляется поддержка в масштабировании бизнеса и выходе на новые рынки.",
        metaTitle: "Преимущества участников Ассоциации селлеров Узбекистана",
        metaDescription: "Полный список преимуществ и возможностей для участников Ассоциации селлеров Узбекистана. Эксклюзивные программы и поддержка бизнеса.",
        buttonText: "Изучить все преимущества",
        abTestVariants: {
          variant_a: {
            question: "💰 Какие эксклюзивные преимущества вы получите как участник?",
            buttonText: "Посмотреть эксклюзивные бонусы",
            hypothesis: "Персонализация ('вы получите') увеличит вовлеченность на 20%"
          },
          variant_b: {
            question: "🏆 Почему 95% участников довольны преимуществами ассоциации?",
            buttonText: "Узнать секрет успеха",
            hypothesis: "Статистика доверия привлечет больше кликов на 35%"
          }
        }
      },
      en: {
        question: "What benefits do association members receive?",
        answer: "Members get direct access to target audience, participation in joint marketing campaigns, exclusive marketing events, priority ad placement, educational programs and networking with other entrepreneurs. Support is also provided in scaling business and entering new markets.",
        metaTitle: "Benefits of Uzbekistan Sellers Association members",
        metaDescription: "Complete list of benefits and opportunities for Uzbekistan Sellers Association members. Exclusive programs and business support.",
        buttonText: "Explore all benefits",
        abTestVariants: {
          variant_a: {
            question: "💰 What exclusive benefits will you get as a member?",
            buttonText: "View exclusive bonuses",
            hypothesis: "Personalization ('you will get') will increase engagement by 20%"
          },
          variant_b: {
            question: "🏆 Why are 95% of members satisfied with association benefits?",
            buttonText: "Learn the secret of success",
            hypothesis: "Trust statistics will attract more clicks by 35%"
          }
        }
      },
      uz: {
        question: "Uyushma a'zolari qanday afzalliklarni oladilar?",
        answer: "A'zolar maqsadli auditoriyaga to'g'ridan-to'g'ri kirish, qo'shma marketing kampaniyalarida qatnashish, eksklyuziv marketing tadbirlari, reklama joylashtirishda ustuvorlik, ta'lim dasturlari va boshqa tadbirkorlar bilan tarmoq o'rnatish imkoniyatiga ega bo'ladilar. Bundan tashqari, biznesni kengaytirish va yangi bozorlarga chiqishda yordam beriladi.",
        metaTitle: "O'zbekiston sotuvchilar uyushmasi a'zolarining afzalliklari",
        metaDescription: "O'zbekiston sotuvchilar uyushmasi a'zolari uchun afzalliklar va imkoniyatlarning to'liq ro'yxati. Eksklyuziv dasturlar va biznes yordami.",
        buttonText: "Barcha afzalliklarni o'rganish",
        abTestVariants: {
          variant_a: {
            question: "💰 A'zo sifatida qanday eksklyuziv afzalliklarni olasiz?",
            buttonText: "Eksklyuziv bonuslarni ko'rish",
            hypothesis: "Shaxsiylashtirish ('siz olasiz') faollikni 20% ga oshiradi"
          },
          variant_b: {
            question: "🏆 Nega a'zolarning 95% i uyushma afzalliklaridan mamnun?",
            buttonText: "Muvaffaqiyat sirini bilib oling",
            hypothesis: "Ishonch statistikasi 35% ga ko'proq klik jalb qiladi"
          }
        }
      }
    }
  },
  {
    id: "events",
    slug: "meropriyatiya-associacii-sellerov-uzbekistana",
    page: "home",
    sortOrder: 3,
    isActive: true,
    buttonUrl: "https://events.sellersassociation.uz",
    translations: {
      ru: {
        question: "Как часто проводятся мероприятия и где можно узнать о них?",
        answer: "Мы проводим мероприятия ежемесячно, включая мастер-классы, конференции, нетворкинг-встречи и выставки. Информация о предстоящих событиях публикуется на нашем сайте, в социальных сетях и рассылается участникам ассоциации. Также вы можете подписаться на нашу рассылку, чтобы быть в курсе всех новостей и мероприятий.",
        metaTitle: "Мероприятия Ассоциации селлеров Узбекистана | Календарь событий",
        metaDescription: "Регулярные мероприятия для селлеров Узбекистана: мастер-классы, конференции, нетворкинг. Как узнать о предстоящих событиях.",
        buttonText: "Посмотреть календарь событий",
        abTestVariants: {
          variant_a: {
            question: "🎉 Как не пропустить эксклюзивные мероприятия для селлеров?",
            buttonText: "Подписаться на уведомления",
            hypothesis: "FOMO (страх упустить) заставит больше людей подписаться"
          },
          variant_b: {
            question: "📅 Когда следующее крутое мероприятие? (Регистрация уже открыта)",
            buttonText: "Зарегистрироваться на событие",
            hypothesis: "Срочность + конкретное действие увеличат регистрации на 40%"
          }
        }
      },
      en: {
        question: "How often are events held and where can I learn about them?",
        answer: "We hold events monthly, including masterclasses, conferences, networking meetings and exhibitions. Information about upcoming events is published on our website, social media and sent to association members. You can also subscribe to our newsletter to stay updated on all news and events.",
        metaTitle: "Uzbekistan Sellers Association Events | Event Calendar",
        metaDescription: "Regular events for Uzbekistan sellers: masterclasses, conferences, networking. How to learn about upcoming events.",
        buttonText: "View event calendar",
        abTestVariants: {
          variant_a: {
            question: "🎉 How not to miss exclusive events for sellers?",
            buttonText: "Subscribe to notifications",
            hypothesis: "FOMO (fear of missing out) will make more people subscribe"
          },
          variant_b: {
            question: "📅 When is the next cool event? (Registration is already open)",
            buttonText: "Register for event",
            hypothesis: "Urgency + specific action will increase registrations by 40%"
          }
        }
      },
      uz: {
        question: "Tadbirlar qanchalik tez-tez o'tkaziladi va ular haqida qayerdan ma'lumot olish mumkin?",
        answer: "Biz har oy tadbirlar o'tkazamiz, jumladan master-klasslar, konferentsiyalar, tarmoq uchrashuvlari va ko'rgazmalar. Kelgusi tadbirlar haqida ma'lumot bizning saytimizda, ijtimoiy tarmoqlarda e'lon qilinadi va uyushma a'zolariga yuboriladi. Shuningdek, barcha yangiliklar va tadbirlardan xabardor bo'lish uchun bizning yangiliklar ro'yxatiga obuna bo'lishingiz mumkin.",
        metaTitle: "O'zbekiston sotuvchilar uyushmasi tadbirlari | Tadbirlar kalendari",
        metaDescription: "O'zbekiston sotuvchilari uchun muntazam tadbirlar: master-klasslar, konferentsiyalar, tarmoq. Kelgusi tadbirlar haqida qanday bilib olish.",
        buttonText: "Tadbirlar kalendarini ko'rish",
        abTestVariants: {
          variant_a: {
            question: "🎉 Sotuvchilar uchun eksklyuziv tadbirlarni qo'ldan boy bermaslik uchun?",
            buttonText: "Xabarnomaga obuna bo'lish",
            hypothesis: "FOMO (qo'ldan boy berish qo'rquvi) ko'proq odamlarni obuna bo'lishga majbur qiladi"
          },
          variant_b: {
            question: "📅 Keyingi ajoyib tadbir qachon? (Ro'yxatdan o'tish allaqachon ochiq)",
            buttonText: "Tadbirga ro'yxatdan o'tish",
            hypothesis: "Shoshilinchlik + aniq harakat ro'yxatdan o'tishni 40% ga oshiradi"
          }
        }
      }
    }
  }
];

// Функция для получения FAQ по странице с учетом локали
export const getFAQsByPage = (page: string, locale: string = 'ru'): FAQData[] => {
  return mockFAQData
    .filter(faq => faq.page === page && faq.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

// Функция для получения переведенного FAQ
export const getTranslatedFAQ = (faq: FAQData, locale: string = 'ru') => {
  const translation = faq.translations[locale] || faq.translations['ru']; // Fallback на русский
  return {
    ...faq,
    ...translation
  };
};

// Функция для получения A/B варианта вопроса с учетом локали
export const getQuestionVariant = (
  faq: FAQData, 
  variant: 'control' | 'variant_a' | 'variant_b',
  locale: string = 'ru'
): string => {
  const translation = faq.translations[locale] || faq.translations['ru'];
  
  if (variant === 'control') {
    return translation.question;
  }
  
  // Ищем полные данные FAQ по ID в mockFAQData
  const fullFAQData = mockFAQData.find(mockFaq => mockFaq.id === faq.id);
  const fullTranslation = fullFAQData?.translations[locale] || fullFAQData?.translations['ru'];
  
  if (!fullTranslation?.abTestVariants) {
    return translation.question;
  }
  
  if (variant === 'variant_a' && fullTranslation.abTestVariants.variant_a) {
    return fullTranslation.abTestVariants.variant_a.question;
  }
  
  if (variant === 'variant_b' && fullTranslation.abTestVariants.variant_b) {
    return fullTranslation.abTestVariants.variant_b.question;
  }
  
  return translation.question;
};

// Функция для получения A/B варианта кнопки с учетом локали
export const getButtonVariant = (
  faq: FAQData, 
  variant: 'control' | 'variant_a' | 'variant_b',
  locale: string = 'ru'
): string | undefined => {
  const translation = faq.translations[locale] || faq.translations['ru'];
  
  if (variant === 'control') {
    return translation.buttonText;
  }
  
  // Ищем полные данные FAQ по ID в mockFAQData
  const fullFAQData = mockFAQData.find(mockFaq => mockFaq.id === faq.id);
  const fullTranslation = fullFAQData?.translations[locale] || fullFAQData?.translations['ru'];
  
  if (!fullTranslation?.abTestVariants) {
    return translation.buttonText;
  }
  
  if (variant === 'variant_a' && fullTranslation.abTestVariants.variant_a?.buttonText) {
    return fullTranslation.abTestVariants.variant_a.buttonText;
  }
  
  if (variant === 'variant_b' && fullTranslation.abTestVariants.variant_b?.buttonText) {
    return fullTranslation.abTestVariants.variant_b.buttonText;
  }
  
  return translation.buttonText;
}; 