export interface TrustItem {
  id: string;
  order: number;
  image: string;
  title: {
    ru: string;
    en: string;
    uz: string;
  };
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

export const trustData: TrustItem[] = [
  {
    id: "experienced-team",
    order: 1,
    image: "/images/bg-image-1.png",
    title: {
      ru: "Опытная команда организаторов, спикеры реальные селлеры с огромным опытом",
      en: "Experienced team of organizers, speakers are real sellers with huge experience",
      uz: "Tajribali tashkilotchilar jamoasi, ma'ruzachilar katta tajribaga ega haqiqiy sotuvchilar"
    },
    metaTitle: {
      ru: "Опытная команда - Avtomatiz",
      en: "Experienced Team - Avtomatiz",
      uz: "Tajribali Jamoa - Avtomatiz"
    },
    metaDescription: {
      ru: "Наша команда состоит из опытных организаторов и спикеров-селлеров с многолетним опытом в сфере продаж и маркетинга",
      en: "Our team consists of experienced organizers and speaker-sellers with years of experience in sales and marketing",
      uz: "Bizning jamoamiz ko'p yillik sotuv va marketing tajribaga ega tajribali tashkilotchilar va ma'ruzachilardan iborat"
    }
  },
  {
    id: "market-experience",
    order: 2,
    image: "/images/bg-image-2.png",
    title: {
      ru: "Более 3 лет на рынке",
      en: "More than 3 years in the market",
      uz: "Bozorda 3 yildan ortiq"
    },
    metaTitle: {
      ru: "3+ лет опыта - Avtomatiz",
      en: "3+ Years Experience - Avtomatiz",
      uz: "3+ Yil Tajriba - Avtomatiz"
    },
    metaDescription: {
      ru: "Более трех лет успешной работы на рынке образовательных и бизнес-мероприятий в Узбекистане",
      en: "More than three years of successful work in the educational and business events market in Uzbekistan",
      uz: "O'zbekistonda ta'lim va biznes tadbirlari bozorida uch yildan ortiq muvaffaqiyatli faoliyat"
    }
  },
  {
    id: "large-events",
    order: 3,
    image: "/images/partnerships-image.png",
    title: {
      ru: "Проводим мероприятия на 2000+ людей",
      en: "We conduct events for 2000+ people",
      uz: "2000+ kishi uchun tadbirlar o'tkazamiz"
    },
    metaTitle: {
      ru: "Крупные мероприятия 2000+ - Avtomatiz",
      en: "Large Events 2000+ - Avtomatiz",
      uz: "Yirik Tadbirlar 2000+ - Avtomatiz"
    },
    metaDescription: {
      ru: "Организуем и проводим масштабные мероприятия для аудитории свыше 2000 человек с высоким уровнем сервиса",
      en: "We organize and conduct large-scale events for audiences over 2000 people with high level service",
      uz: "2000 dan ortiq tinglovchilar uchun yuqori xizmat darajasi bilan yirik tadbirlarni tashkil etamiz"
    }
  },
  {
    id: "advantage-4",
    order: 4,
    image: "/images/seller-background.png",
    title: {
      ru: "Преимущество 4",
      en: "Advantage 4",
      uz: "Ustunlik 4"
    },
    metaTitle: {
      ru: "Четвертое преимущество - Avtomatiz",
      en: "Fourth Advantage - Avtomatiz",
      uz: "To'rtinchi Ustunlik - Avtomatiz"
    },
    metaDescription: {
      ru: "Подробное описание четвертого ключевого преимущества нашей компании в сфере организации мероприятий",
      en: "Detailed description of the fourth key advantage of our company in event organization",
      uz: "Tadbir tashkil etish sohasida kompaniyamizning to'rtinchi asosiy ustunligining batafsil tavsifi"
    }
  },
  {
    id: "government-cooperation",
    order: 5,
    image: "/images/partner-background.png",
    title: {
      ru: "Сотрудничаем с гос. органами",
      en: "We cooperate with government agencies",
      uz: "Davlat organlari bilan hamkorlik qilamiz"
    },
    metaTitle: {
      ru: "Сотрудничество с госорганами - Avtomatiz",
      en: "Government Cooperation - Avtomatiz",
      uz: "Davlat Hamkorligi - Avtomatiz"
    },
    metaDescription: {
      ru: "Официальное сотрудничество с государственными органами и учреждениями Узбекистана",
      en: "Official cooperation with government agencies and institutions of Uzbekistan",
      uz: "O'zbekiston davlat organlari va muassasalari bilan rasmiy hamkorlik"
    }
  },
  {
    id: "advantage-6",
    order: 6,
    image: "/images/events-image.png",
    title: {
      ru: "Преимущество 6",
      en: "Advantage 6",
      uz: "Ustunlik 6"
    },
    metaTitle: {
      ru: "Шестое преимущество - Avtomatiz",
      en: "Sixth Advantage - Avtomatiz",
      uz: "Oltinchi Ustunlik - Avtomatiz"
    },
    metaDescription: {
      ru: "Описание шестого важного преимущества нашей деятельности в организации бизнес-событий",
      en: "Description of the sixth important advantage of our business event organization activities",
      uz: "Biznes tadbirlarini tashkil etish faoliyatimizning oltinchi muhim ustunligining tavsifi"
    }
  }
];

// Функция для получения отсортированных данных
export const getSortedTrustData = (): TrustItem[] => {
  return trustData.sort((a, b) => a.order - b.order);
};

// Функция для получения размеров блоков
export const getTrustItemDimensions = (position: number) => {
  const positions = {
    1: { width: 825, height: 309, className: 'col-span-2' },
    2: { width: 393, height: 309, className: 'col-span-1' },
    3: { width: 401, height: 309, className: 'col-span-1' },
    4: { width: 395, height: 324, className: 'col-span-1' },
    5: { width: 395, height: 324, className: 'col-span-1' },
    6: { width: 821, height: 324, className: 'col-span-2' }
  };
  
  return positions[position as keyof typeof positions] || positions[1];
}; 