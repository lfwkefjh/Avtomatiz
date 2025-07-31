import { NextRequest, NextResponse } from 'next/server';

// Простая база данных в памяти (в production используйте реальную БД)
let analyticsData: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // Поддерживаем два формата: { event, data } и плоский объект
    let event: string;
    let data: any;
    
    if (requestData.data) {
      // Формат FAQ: { event: "название", data: {...} }
      event = requestData.event;
      data = requestData.data;
    } else {
      // Плоский формат (новости): { event: "название", newsId: "...", ... }
      event = requestData.event;
      data = { ...requestData };
      delete data.event; // Убираем event из data
    }
    
    // Добавляем метаданные
    const trackingEntry = {
      id: Math.random().toString(36).substr(2, 9),
      event,
      data,
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      createdAt: Date.now()
    };

    // Сохраняем в "базу данных"
    analyticsData.push(trackingEntry);
    
    // Ограничиваем размер массива (последние 1000 записей)
    if (analyticsData.length > 1000) {
      analyticsData = analyticsData.slice(-1000);
    }

    // Универсальное логгирование для разных типов событий
    if (event.startsWith('news_')) {
      console.log('📊 News Analytics tracked:', {
        event,
        newsId: data.newsId,
        newsTitle: data.newsTitle,
        category: data.category,
        locale: data.locale
      });
    } else if (event === 'faq_interaction') {
      console.log('📊 FAQ Analytics tracked:', {
        event,
        faqId: data.id,
        isOpen: data.isOpen,
        page: data.page,
        device: data.device
      });
    } else {
      console.log('📊 Analytics tracked:', {
        event,
        data
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics tracked successfully',
      entryId: trackingEntry.id
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}

// GET endpoint для получения статистики
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';
    const faqId = searchParams.get('faqId');

    // Фильтруем данные по периоду
    const now = Date.now();
    const periodMs = {
      'day': 24 * 60 * 60 * 1000,
      'week': 7 * 24 * 60 * 60 * 1000, 
      'month': 30 * 24 * 60 * 60 * 1000
    }[period] || 7 * 24 * 60 * 60 * 1000;

    // Фильтруем FAQ данные
    const faqFilteredData = analyticsData.filter(entry => 
      now - entry.createdAt < periodMs &&
      entry.event === 'faq_interaction' &&
      (!faqId || entry.data.id === faqId)
    );

    // Фильтруем новостные данные
    const newsFilteredData = analyticsData.filter(entry => 
      now - entry.createdAt < periodMs &&
      entry.event.startsWith('news_')
    );

    const videoFilteredData = analyticsData.filter(entry => 
      now - entry.createdAt < periodMs &&
      entry.event.startsWith('video_')
    );

    // Группируем статистику по FAQ
    const faqStats: Record<string, any> = {};
    
    faqFilteredData.forEach((entry: any) => {
      const { id, isOpen, device, page } = entry.data;
      
      if (!faqStats[id]) {
        faqStats[id] = {
          id,
          totalClicks: 0,
          openClicks: 0,
          closeClicks: 0,
          devices: { mobile: 0, tablet: 0, desktop: 0 },
          pages: {},
          conversionRate: 0
        };
      }

      faqStats[id].totalClicks++;
      
      if (isOpen) {
        faqStats[id].openClicks++;
      } else {
        faqStats[id].closeClicks++;
      }

      if (device) {
        faqStats[id].devices[device]++;
      }

      if (page) {
        faqStats[id].pages[page] = (faqStats[id].pages[page] || 0) + 1;
      }
    });

    // Вычисляем показатели
    Object.values(faqStats).forEach((stats: any) => {
      stats.conversionRate = stats.totalClicks > 0 
        ? (stats.openClicks / stats.totalClicks * 100).toFixed(1)
        : 0;
    });

    // Сортируем по популярности
    const sortedStats = Object.values(faqStats)
      .sort((a: any, b: any) => b.totalClicks - a.totalClicks);

    // Группируем статистику по новостям
    const newsStats: Record<string, any> = {};
    
    newsFilteredData.forEach((entry: any) => {
      const { newsId, newsTitle, category, locale, device, browser, os } = entry.data;
      
      if (newsId && !newsStats[newsId]) {
        newsStats[newsId] = {
          id: newsId,
          title: newsTitle || 'Unknown',
          category: category || 'Unknown',
          totalViews: 0,
          totalHovers: 0,
          totalClicks: 0,
          locales: {},
          events: {},
          devices: {},
          browsers: {},
          operatingSystems: {}
        };
      }

      if (newsId) {
        // Подсчитываем события
        newsStats[newsId].events[entry.event] = (newsStats[newsId].events[entry.event] || 0) + 1;
        
        // Подсчитываем локали
        if (locale) {
          newsStats[newsId].locales[locale] = (newsStats[newsId].locales[locale] || 0) + 1;
        }

        // Подсчитываем устройства
        if (device) {
          newsStats[newsId].devices[device] = (newsStats[newsId].devices[device] || 0) + 1;
        }

        // Подсчитываем браузеры
        if (browser) {
          newsStats[newsId].browsers[browser] = (newsStats[newsId].browsers[browser] || 0) + 1;
        }

        // Подсчитываем ОС
        if (os) {
          newsStats[newsId].operatingSystems[os] = (newsStats[newsId].operatingSystems[os] || 0) + 1;
        }

        // Подсчитываем типы событий
        if (entry.event === 'news_card_view') {
          newsStats[newsId].totalViews++;
        } else if (entry.event === 'news_card_hover') {
          newsStats[newsId].totalHovers++;
        } else if (entry.event === 'news_card_click') {
          newsStats[newsId].totalClicks++;
        }
      }
    });

    const sortedNewsStats = Object.values(newsStats)
      .sort((a: any, b: any) => b.totalViews - a.totalViews);

    // Группируем статистику по видео
    const videoStats: Record<string, any> = {};
    
    videoFilteredData.forEach((entry: any) => {
      const { videoId, videoTitle, videoType, locale, device, browser, os, watchTime, stopReason } = entry.data;
      
      if (videoId && !videoStats[videoId]) {
        videoStats[videoId] = {
          id: videoId,
          title: videoTitle || 'Unknown',
          type: videoType || 'Unknown',
          totalViews: 0,
          totalHovers: 0,
          totalPlays: 0,
          totalStops: 0,
          locales: {},
          events: {},
          devices: {},
          browsers: {},
          operatingSystems: {},
          watchTimeStats: {
            totalWatchTime: 0,
            avgWatchTime: 0,
            maxWatchTime: 0,
            minWatchTime: Infinity
          },
          stopReasons: {} // причины остановки видео
        };
      }

      if (videoId) {
        // Подсчитываем события
        videoStats[videoId].events[entry.event] = (videoStats[videoId].events[entry.event] || 0) + 1;
        
        // Подсчитываем локали
        if (locale) {
          videoStats[videoId].locales[locale] = (videoStats[videoId].locales[locale] || 0) + 1;
        }

        // Подсчитываем устройства
        if (device) {
          videoStats[videoId].devices[device] = (videoStats[videoId].devices[device] || 0) + 1;
        }

        // Подсчитываем браузеры
        if (browser) {
          videoStats[videoId].browsers[browser] = (videoStats[videoId].browsers[browser] || 0) + 1;
        }

        // Подсчитываем ОС
        if (os) {
          videoStats[videoId].operatingSystems[os] = (videoStats[videoId].operatingSystems[os] || 0) + 1;
        }

        // Подсчитываем типы событий
        if (entry.event === 'video_card_hover') {
          videoStats[videoId].totalHovers++;
        } else if (entry.event === 'video_play') {
          videoStats[videoId].totalPlays++;
        } else if (entry.event === 'video_stop') {
          videoStats[videoId].totalStops++;
          
          // Подсчитываем причины остановки
          if (stopReason) {
            videoStats[videoId].stopReasons[stopReason] = (videoStats[videoId].stopReasons[stopReason] || 0) + 1;
          }
          
          // Обрабатываем статистику просмотра
          if (typeof watchTime === 'number') {
            const currentStats = videoStats[videoId].watchTimeStats;
            currentStats.totalWatchTime += watchTime;
            currentStats.maxWatchTime = Math.max(currentStats.maxWatchTime, watchTime);
            currentStats.minWatchTime = Math.min(currentStats.minWatchTime, watchTime);
          }
          
          // Логика процента просмотра убрана по просьбе пользователя
        }
      }
    });

    // Вычисляем средние значения для видео (процент просмотра убран)
    Object.values(videoStats).forEach((stats: any) => {
      if (stats.totalStops > 0) {
        stats.watchTimeStats.avgWatchTime = stats.watchTimeStats.totalWatchTime / stats.totalStops;
        if (stats.watchTimeStats.minWatchTime === Infinity) {
          stats.watchTimeStats.minWatchTime = 0;
        }
      }
    });

    const sortedVideoStats = Object.values(videoStats)
      .sort((a: any, b: any) => b.totalPlays - a.totalPlays);

    return NextResponse.json({
      success: true,
      period,
      totalEntries: faqFilteredData.length + newsFilteredData.length + videoFilteredData.length,
      faqStats: sortedStats,
      topQuestions: sortedStats.slice(0, 5),
      newsStats: sortedNewsStats,
      topNews: sortedNewsStats.slice(0, 5),
      videoStats: sortedVideoStats,
      topVideos: sortedVideoStats.slice(0, 5),
      summary: {
        totalInteractions: faqFilteredData.length,
        uniqueFAQs: Object.keys(faqStats).length,
        avgClicksPerFAQ: faqFilteredData.length / Math.max(Object.keys(faqStats).length, 1),
        deviceBreakdown: [...faqFilteredData, ...newsFilteredData, ...videoFilteredData].reduce((acc: any, entry: any) => {
          const device = entry.data.device || 'unknown';
          acc[device] = (acc[device] || 0) + 1;
          return acc;
        }, {}),
        newsInteractions: newsFilteredData.length,
        uniqueNews: Object.keys(newsStats).length,
        totalNewsViews: Object.values(newsStats).reduce((sum: number, news: any) => sum + news.totalViews, 0),
        totalNewsHovers: Object.values(newsStats).reduce((sum: number, news: any) => sum + news.totalHovers, 0),
        videoInteractions: videoFilteredData.length,
        uniqueVideos: Object.keys(videoStats).length,
        totalVideoPlays: Object.values(videoStats).reduce((sum: number, video: any) => sum + video.totalPlays, 0),
        totalVideoStops: Object.values(videoStats).reduce((sum: number, video: any) => sum + video.totalStops, 0)
      }
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Дополнительный endpoint для получения статистики FAQ
export async function PUT(request: NextRequest) {
  try {
    // Очистить аналитику (для тестирования)
    analyticsData = [];
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics data cleared' 
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear analytics' },
      { status: 500 }
    );
  }
} 