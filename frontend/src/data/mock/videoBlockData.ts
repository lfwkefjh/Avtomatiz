export interface VideoBlockItem {
  id: string;
  title: {
    ru: string;
    en: string;
    uz: string;
  };
  videoUrl: string; // YouTube URL или локальный файл
  videoType: 'youtube' | 'local';
  thumbnail?: string; // Custom превью: для локальных обязательно, для YouTube опционально (если есть - используется вместо автозагрузки)
  duration?: string; // Продолжительность для локальных (для YouTube автоматически)
  date: string;
  featured: boolean;
  sortOrder: number;
}

export const videoBlockData: VideoBlockItem[] = [
  {
    id: "video-001",
    title: {
      ru: "4-й Исламский банковский форум стран СНГ",
      en: "4th Islamic Banking Forum of CIS Countries", 
      uz: "MDH mamlakatlarining 4-Islom banking forumi"
    },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "youtube",
    date: "2025-06-16",
    featured: true,
    sortOrder: 1
  },
  {
    id: "video-002", 
    title: {
      ru: "Цифровая трансформация финансовых услуг",
      en: "Digital Transformation of Financial Services",
      uz: "Moliya xizmatlarini raqamli transformatsiyasi"
    },
    videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    videoType: "youtube",
    thumbnail: "/images/partnerships-image.png", // Custom превью вместо YouTube автозагрузки
    date: "2025-05-20",
    featured: true,
    sortOrder: 2
  },
  {
    id: "video-003",
    title: {
      ru: "Международная торговля и экспорт",
      en: "International Trade and Export",
      uz: "Xalqaro savdo va eksport"
    },
    videoUrl: "/videos/trade-conference.mp4",
    videoType: "local",
    thumbnail: "/images/events-image.png",
    duration: "1:30:00",
    date: "2025-04-10",
    featured: true,
    sortOrder: 3
  },
  {
    id: "video-004",
    title: {
      ru: "Развитие малого и среднего бизнеса",
      en: "Small and Medium Business Development", 
      uz: "Kichik va o'rta biznesni rivojlantirish"
    },
    videoUrl: "/videos/business-seminar.mp4",
    videoType: "local",
    thumbnail: "/images/bg-image-1.png",
    duration: "2:00:00", 
    date: "2025-03-25",
    featured: true,
    sortOrder: 4
  },
  {
    id: "video-005",
    title: {
      ru: "Блокчейн технологии в торговле",
      en: "Blockchain Technologies in Trade",
      uz: "Savdoda blokcheyn texnologiyalari" 
    },
    videoUrl: "/videos/blockchain-seminar.mp4",
    videoType: "local",
    thumbnail: "/images/partnerships-image.png", 
    duration: "2:15:00",
    date: "2025-02-20",
    featured: true,
    sortOrder: 5
  },
  {
    id: "video-006",
    title: {
      ru: "Инновации в электронной коммерции",
      en: "E-commerce Innovations",
      uz: "Elektron tijoratdagi innovatsiyalar"
    },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "youtube",
    thumbnail: "/images/bg-image-2.png", // Custom превью вместо YouTube автозагрузки
    date: "2025-01-15",
    featured: true,
    sortOrder: 6
  },
  {
    id: "video-007",
    title: {
      ru: "Мастер-класс по экспорту товаров",
      en: "Export Masterclass",
      uz: "Tovarlarni eksport qilish bo'yicha master-klass"
    },
    videoUrl: "/videos/export-masterclass.mp4",
    videoType: "local",
    thumbnail: "/images/bg-image-1.png",
    duration: "1:45:00",
    date: "2024-12-20",
    featured: true,
    sortOrder: 7
  },
  {
    id: "video-008",
    title: {
      ru: "Успешные стартапы Узбекистана",
      en: "Successful Startups of Uzbekistan",
      uz: "O'zbekistonning muvaffaqiyatli startaplari"
    },
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoType: "youtube",
    date: "2024-11-10",
    featured: true,
    sortOrder: 8
  }
];

// Функция для получения видео
export const getFeaturedVideos = (limit: number = 8): VideoBlockItem[] => {
  return videoBlockData
    .filter(video => video.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, Math.min(limit, 8)); // Максимум 8 видео
};

// Функция получения YouTube ID из URL
export const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Функция получения превью YouTube с множественными fallback вариантами
export const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeId(url);
  if (videoId) {
    // Используем default.jpg как самый надежный вариант (всегда существует)
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
  }
  return '/images/past-events-bg.png'; // fallback
};

// Альтернативная функция для получения превью высокого качества (с fallback)
export const getYouTubeThumbnailHQ = (url: string): string => {
  const videoId = getYouTubeId(url);
  if (videoId) {
    // Попробуем mqdefault, но если не загрузится - есть fallback в компоненте
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return '/images/past-events-bg.png'; // fallback
};

// Функция получения embed URL для YouTube
export const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  }
  return url;
};

// Функция проверки наличия custom превью
export const hasCustomThumbnail = (video: VideoBlockItem): boolean => {
  return !!video.thumbnail;
};

// Функция получения превью с приоритетом (custom → fallback → автозагрузка)
export const getVideoThumbnail = (video: VideoBlockItem): string => {
  if (video.videoType === 'youtube') {
    // Приоритет: custom превью → fallback картинка → автозагрузка с YouTube (только как последний резерв)
    return video.thumbnail || '/images/past-events-bg.png';
  } else {
    // Для локальных видео custom превью обязательно, иначе fallback
    return video.thumbnail || '/images/past-events-bg.png';
  }
}; 