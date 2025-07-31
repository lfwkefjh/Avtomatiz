'use client';

import React, { useState, useEffect } from 'react';

interface FAQStat {
  id: string;
  totalClicks: number;
  openClicks: number;
  closeClicks: number;
  devices: { mobile: number; tablet: number; desktop: number };
  pages: Record<string, number>;
  conversionRate: string;
}

interface NewsStat {
  id: string;
  title: string;
  category: string;
  totalViews: number;
  totalHovers: number;
  totalClicks: number;
  locales: Record<string, number>;
  events: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
}

interface VideoStat {
  id: string;
  title: string;
  type: string;
  totalPlays: number;
  totalHovers: number;
  totalStops: number;
  locales: Record<string, number>;
  events: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  watchTimeStats: {
    totalWatchTime: number;
    avgWatchTime: number;
    maxWatchTime: number;
    minWatchTime: number;
  };
  stopReasons: Record<string, number>;
}

interface AnalyticsData {
  success: boolean;
  period: string;
  totalEntries: number;
  faqStats: FAQStat[];
  topQuestions: FAQStat[];
  newsStats: NewsStat[];
  topNews: NewsStat[];
  videoStats: VideoStat[];
  topVideos: VideoStat[];
  summary: {
    totalInteractions: number;
    uniqueFAQs: number;
    avgClicksPerFAQ: number;
    deviceBreakdown: Record<string, number>;
    newsInteractions: number;
    uniqueNews: number;
    totalNewsViews: number;
    totalNewsHovers: number;
    videoInteractions: number;
    uniqueVideos: number;
    totalVideoPlays: number;
    totalVideoStops: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/track?period=${period}`);
      const data = await response.json();
      console.log('📊 Analytics API Response:', data);
      console.log('📰 News Stats:', data.newsStats);
      console.log('📈 Summary:', data.summary);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAnalytics = async () => {
    try {
      await fetch('/api/analytics/track', { method: 'PUT' });
      await fetchAnalytics();
    } catch (error) {
      console.error('Failed to clear analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17101E] p-8 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка аналитики...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17101E] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📊 Аналитика сайта</h1>
          <p className="text-gray-300">Полная статистика взаимодействий: FAQ, новости, видео, устройства</p>
        </div>

        {/* Контролы */}
        <div className="mb-8 flex gap-4">
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {p === 'day' && 'День'}
                {p === 'week' && 'Неделя'}
                {p === 'month' && 'Месяц'}
              </button>
            ))}
          </div>
          
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔄 Обновить
          </button>
          
          <button
            onClick={clearAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Очистить данные
          </button>
        </div>

        {analytics && (
          <>
            {/* Общая статистика FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1F1B2E] rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-gray-300 text-sm mb-2">FAQ взаимодействий</h3>
                <p className="text-3xl font-bold text-white">{analytics.summary.totalInteractions}</p>
              </div>
              
              <div className="bg-[#1F1B2E] rounded-lg p-6 border border-green-500/20">
                <h3 className="text-gray-300 text-sm mb-2">Уникальных FAQ</h3>
                <p className="text-3xl font-bold text-white">{analytics.summary.uniqueFAQs}</p>
              </div>
              
              <div className="bg-[#1F1B2E] rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-gray-300 text-sm mb-2">Среднее кликов на FAQ</h3>
                <p className="text-3xl font-bold text-white">{analytics.summary.avgClicksPerFAQ.toFixed(1)}</p>
              </div>
              
              <div className="bg-[#1F1B2E] rounded-lg p-6 border border-yellow-500/20">
                <h3 className="text-gray-300 text-sm mb-2">Топ устройство</h3>
                <p className="text-3xl font-bold text-white">
                  {Object.entries(analytics.summary.deviceBreakdown)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>

            {/* Статистика новостей */}
            {analytics.summary && (analytics.summary.newsInteractions > 0 || analytics.newsStats?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1F1B2E] rounded-lg p-6 border border-orange-500/20">
                  <h3 className="text-gray-300 text-sm mb-2">Новостных событий</h3>
                  <p className="text-3xl font-bold text-white">{analytics.summary?.newsInteractions || 0}</p>
                </div>
                
                <div className="bg-[#1F1B2E] rounded-lg p-6 border border-cyan-500/20">
                  <h3 className="text-gray-300 text-sm mb-2">Уникальных новостей</h3>
                  <p className="text-3xl font-bold text-white">{analytics.summary?.uniqueNews || 0}</p>
                </div>
                
                <div className="bg-[#1F1B2E] rounded-lg p-6 border border-pink-500/20">
                  <h3 className="text-gray-300 text-sm mb-2">Просмотров новостей</h3>
                  <p className="text-3xl font-bold text-white">{analytics.summary?.totalNewsViews || 0}</p>
                </div>
                
                <div className="bg-[#1F1B2E] rounded-lg p-6 border border-indigo-500/20">
                  <h3 className="text-gray-300 text-sm mb-2">Наведений на новости</h3>
                  <p className="text-3xl font-bold text-white">{analytics.summary?.totalNewsHovers || 0}</p>
                </div>
              </div>
            )}

            {/* Топ вопросы */}
            <div className="bg-[#1F1B2E] rounded-lg p-6 mb-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">🏆 Топ вопросы</h2>
              
              {analytics.topQuestions.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topQuestions.map((faq, index) => (
                    <div key={faq.id} className="flex items-center justify-between p-4 bg-[#2A2438] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-400">#{index + 1}</div>
                        <div>
                          <h3 className="font-semibold text-white">{faq.id}</h3>
                          <p className="text-sm text-gray-400">
                            {faq.totalClicks} кликов | {faq.conversionRate}% открытий
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-bold">{faq.openClicks}</p>
                          <p className="text-gray-400">Открытий</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-400 font-bold">{faq.closeClicks}</p>
                          <p className="text-gray-400">Закрытий</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Нет данных для отображения. Попробуйте взаимодействовать с FAQ на главной странице.
                </p>
              )}
            </div>

            {/* Отладочная информация */}
            <div className="bg-[#1F1B2E] rounded-lg p-6 mb-8 border border-yellow-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">🐛 Debug Info</h2>
              <pre className="text-green-400 text-sm overflow-auto">
                {JSON.stringify({
                  hasNewsStats: !!analytics.newsStats,
                  newsStatsLength: analytics.newsStats?.length || 0,
                  hasTopNews: !!analytics.topNews,
                  topNewsLength: analytics.topNews?.length || 0,
                  newsInteractions: analytics.summary?.newsInteractions || 0,
                  uniqueNews: analytics.summary?.uniqueNews || 0
                }, null, 2)}
              </pre>
            </div>

            {/* Топ новости */}
            {analytics.newsStats && analytics.newsStats.length > 0 && (
              <div className="bg-[#1F1B2E] rounded-lg p-6 mb-8 border border-orange-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">📰 Топ новости</h2>
                
                <div className="space-y-4">
                  {analytics.newsStats.slice(0, 5).map((news, index) => (
                    <div key={news.id} className="flex items-center justify-between p-4 bg-[#2A2438] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-orange-400">#{index + 1}</div>
                        <div>
                          <h3 className="font-semibold text-white">{news.title}</h3>
                          <p className="text-sm text-gray-400">
                            {news.category} | {news.totalViews} просмотров
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-bold">{news.totalViews}</p>
                          <p className="text-gray-400">Просмотров</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-bold">{news.totalHovers}</p>
                          <p className="text-gray-400">Наведений</p>
                        </div>
                        <div className="text-center">
                          <p className="text-purple-400 font-bold">{news.totalClicks}</p>
                          <p className="text-gray-400">Кликов</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {analytics.topNews.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Данных о новостях пока нет. Взаимодействуйте с новостями для сбора статистики.
                  </p>
                )}
              </div>
            )}

            {/* Статистика видео */}
            {analytics.summary && (analytics.summary.videoInteractions > 0 || analytics.videoStats?.length > 0) && (
              <div className="bg-[#1F1B2E] rounded-lg p-6 mb-8 border border-red-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">🎥 Статистика видео</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-400">{analytics.summary?.videoInteractions || 0}</div>
                    <div className="text-gray-400">Взаимодействий с видео</div>
                  </div>
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-400">{analytics.summary?.uniqueVideos || 0}</div>
                    <div className="text-gray-400">Уникальных видео</div>
                  </div>
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-400">{analytics.summary?.totalVideoPlays || 0}</div>
                    <div className="text-gray-400">Запусков видео</div>
                  </div>
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-400">{Math.round(analytics.summary?.avgWatchPercentage || 0)}%</div>
                    <div className="text-gray-400">Средний процент просмотра</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-400">{analytics.summary?.totalCompletedViews || 0}</div>
                    <div className="text-gray-400">Полных просмотров (&gt;80%)</div>
                  </div>
                  <div className="bg-[#2A2438] p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-cyan-400">{analytics.summary?.totalVideoStops || 0}</div>
                    <div className="text-gray-400">Остановок видео</div>
                  </div>
                </div>
              </div>
            )}

            {/* Топ видео */}
            {analytics.videoStats && analytics.videoStats.length > 0 && (
              <div className="bg-[#1F1B2E] rounded-lg p-6 mb-8 border border-red-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">🎬 Топ видео</h2>
                
                <div className="space-y-4">
                  {analytics.videoStats.slice(0, 5).map((video, index) => (
                    <div key={video.id} className="flex items-center justify-between p-4 bg-[#2A2438] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-red-400">#{index + 1}</div>
                        <div>
                          <h3 className="font-semibold text-white">{video.title}</h3>
                          <p className="text-sm text-gray-400">
                            {video.type} | {video.totalPlays} запусков | {Math.round(video.watchPercentageStats.avgPercentage)}% просмотра
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-bold">{video.totalPlays}</p>
                          <p className="text-gray-400">Запусков</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-bold">{video.totalHovers}</p>
                          <p className="text-gray-400">Наведений</p>
                        </div>
                        <div className="text-center">
                          <p className="text-yellow-400 font-bold">{Math.round(video.watchPercentageStats.avgPercentage)}%</p>
                          <p className="text-gray-400">Процент</p>
                        </div>
                        <div className="text-center">
                          <p className="text-purple-400 font-bold">{video.watchPercentageStats.completedViews}</p>
                          <p className="text-gray-400">Полных</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {analytics.topVideos?.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Данных о видео пока нет. Взаимодействуйте с видео для сбора статистики.
                  </p>
                )}
              </div>
            )}

            {/* Детальная статистика */}
            <div className="bg-[#1F1B2E] rounded-lg p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">📱 Общая статистика по устройствам</h2>
              <p className="text-gray-400 mb-4">Данные по всем взаимодействиям: FAQ, новости, видео</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analytics.summary.deviceBreakdown).map(([device, count]) => (
                  <div key={device} className="bg-[#2A2438] rounded-lg p-4 text-center">
                    <h3 className="text-lg font-semibold text-white capitalize">{device}</h3>
                    <p className="text-2xl font-bold text-blue-400">{count}</p>
                    <p className="text-sm text-gray-400">
                      {((count / (analytics.summary.totalInteractions + (analytics.summary?.videoInteractions || 0) + (analytics.summary?.newsInteractions || 0))) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Подсказки для использования */}
            <div className="mt-8 bg-[#1F1B2E] rounded-lg p-6 border border-green-500/20">
              <h2 className="text-xl font-bold text-white mb-4">💡 Как использовать эти данные:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">📈 Для маркетинга:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Создавайте рекламу на основе популярных вопросов</li>
                    <li>• A/B тестируйте формулировки вопросов</li>
                    <li>• Настраивайте таргетинг по интересам</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">🎯 Для продукта:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Добавляйте новый контент по популярным темам</li>
                    <li>• Улучшайте ответы с низкой конверсией</li>
                    <li>• Оптимизируйте под популярные устройства</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 