// FAQ Analytics System
// Система для отслеживания взаимодействий с FAQ, A/B тестирования и создания аудиторий

// Типы данных
interface FAQTrackingData {
  id: string;
  slug: string;
  question: string;
  page: string;
  isOpen: boolean;
  userId?: string;
  sessionId: string;
  timestamp?: number;
  userAgent?: string;
  referrer?: string;
  action?: string;        // 'faq_click' или 'button_click'
  buttonUrl?: string;     // URL кнопки если клик по кнопке
  buttonText?: string;    // Текст кнопки если клик по кнопке
  viewportSize?: string;  // Размер экрана пользователя
  device?: string;        // Тип устройства (desktop/mobile/tablet)
}

export class FAQAnalytics {
  private baseUrl = '/api/analytics';

  // 📊 Отслеживание кликов по FAQ
  async trackFAQClick(data: FAQTrackingData) {
    const trackingData: FAQTrackingData = {
      ...data,
      timestamp: data.timestamp || Date.now(),
      userAgent: data.userAgent || navigator.userAgent,
      referrer: data.referrer || document.referrer,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      device: this.getDeviceType()
    };

    // Отправляем в нашу аналитику
    await this.sendToAnalytics('faq_interaction', trackingData);

    // Отправляем в Google Analytics
    this.sendToGoogleAnalytics('faq_click', trackingData);

    // Отправляем в Facebook Pixel
    this.sendToFacebookPixel('faq_interaction', trackingData);

    console.log('📊 FAQ Analytics:', trackingData);
  }

  // 🎯 A/B тестирование вопросов
  getABTestVariant(faqId: string): 'control' | 'variant_a' | 'variant_b' {
    // Получаем или создаем уникальный ID пользователя
    const userId = this.getUserId();
    
    // Простой алгоритм распределения на основе hash
    const hash = this.simpleHash(userId + faqId);
    const variant = hash % 3;
    
    switch (variant) {
      case 0: return 'control';
      case 1: return 'variant_a';
      case 2: return 'variant_b';
      default: return 'control';
    }
  }

  // 📈 Отслеживание конверсий
  async trackConversion(data: {
    faqId: string;
    conversionType: 'form_submit' | 'button_click' | 'page_visit' | 'download';
    value?: number;
    currency?: string;
  }) {
    const conversionData = {
      ...data,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };

    await this.sendToAnalytics('conversion', conversionData);
    this.sendToGoogleAnalytics('conversion', conversionData);
  }

  // 🏷️ Создание аудиторий для таргетинга
  createAudience(faqInteractions: Array<{
    id: string;
    clicks: number;
    timeSpent: number;
  }>) {
    const audienceProfile = {
      userId: this.getUserId(),
      interests: this.analyzeInterests(faqInteractions),
      engagement: this.calculateEngagement(faqInteractions),
      stage: this.determineCustomerStage(faqInteractions),
      timestamp: Date.now()
    };

    // Сохраняем профиль для таргетинга
    if (typeof window !== 'undefined') {
      localStorage.setItem('audience_profile', JSON.stringify(audienceProfile));
    }
    
    // Отправляем в рекламные системы
    this.sendToFacebookPixel('audience_update', audienceProfile);
    this.sendToGoogleAds('audience_update', audienceProfile);

    return audienceProfile;
  }

  // 🎨 Получение персонализированного контента
  getPersonalizedContent(faqId: string) {
    const profile = this.getAudienceProfile();
    const variant = this.getABTestVariant(faqId);

    // Персонализация на основе интересов
    if (profile?.interests.includes('membership')) {
      return {
        cta: 'Присоединяйтесь к 2000+ успешных селлеров!',
        urgency: 'Ограниченное предложение до конца месяца',
        variant: variant
      };
    }

    if (profile?.interests.includes('events')) {
      return {
        cta: 'Зарегистрируйтесь на ближайшее мероприятие',
        urgency: 'Осталось 15 мест',
        variant: variant
      };
    }

    // Возвращаем null если нет подходящего персонализированного контента
    return null;
  }

  // 📊 Получение статистики популярности
  async getFAQPopularityStats(period: 'day' | 'week' | 'month' = 'week') {
    try {
      const response = await fetch(`${this.baseUrl}/faq-stats?period=${period}`);
      const stats = await response.json();
      
      return {
        mostPopular: stats.top_questions || [],
        leastPopular: stats.bottom_questions || [],
        conversionRates: stats.conversion_rates || {},
        avgTimeSpent: stats.avg_time_spent || {},
        bounceRates: stats.bounce_rates || {}
      };
    } catch (error) {
      console.error('Failed to fetch FAQ stats:', error);
      return null;
    }
  }

  // Приватные методы
  private async sendToAnalytics(event: string, data: any) {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  private sendToGoogleAnalytics(event: string, data: any) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        faq_id: data.id,
        faq_slug: data.slug,
        is_open: data.isOpen,
        page: data.page,
        custom_parameter_1: data.variant || 'default'
      });
    }
  }

  private sendToFacebookPixel(event: string, data: any) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', event, {
        faq_id: data.id,
        content_category: data.page,
        value: data.isOpen ? 1 : 0
      });
    }
  }

  private sendToGoogleAds(event: string, data: any) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'audience_update', {
        send_to: 'AW-CONVERSION_ID', // Замените на ваш ID
        custom_parameter: data.stage
      });
    }
  }

  private getUserId(): string {
    // Проверяем что мы на клиентской стороне
    if (typeof window === 'undefined') {
      return 'server_user_' + Math.random().toString(36).substr(2, 9);
    }
    
    if (typeof window === 'undefined') {
      // На сервере возвращаем временный ID
      return 'ssr_user_' + Math.random().toString(36).substr(2, 9);
    }
    
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private analyzeInterests(interactions: Array<{ id: string; clicks: number }>) {
    return interactions
      .filter(i => i.clicks > 2)
      .map(i => i.id);
  }

  private calculateEngagement(interactions: Array<{ timeSpent: number }>) {
    const totalTime = interactions.reduce((sum, i) => sum + i.timeSpent, 0);
    const avgTime = totalTime / interactions.length;
    
    if (avgTime > 60) return 'high';
    if (avgTime > 30) return 'medium';
    return 'low';
  }

  private determineCustomerStage(interactions: Array<{ id: string }>) {
    const membershipClicks = interactions.filter(i => i.id === 'membership').length;
    const benefitsClicks = interactions.filter(i => i.id === 'benefits').length;
    
    if (membershipClicks > 3) return 'ready_to_join';
    if (benefitsClicks > 2) return 'considering';
    return 'awareness';
  }

  private getAudienceProfile() {
    if (typeof window === 'undefined') {
      // На сервере возвращаем null
      return null;
    }
    
    const profile = localStorage.getItem('audience_profile');
    return profile ? JSON.parse(profile) : null;
  }
}

// Экспортируем экземпляр для использования
export const faqAnalytics = new FAQAnalytics();

// Хук для React компонентов
export const useFAQAnalytics = () => {
  return {
    trackClick: faqAnalytics.trackFAQClick.bind(faqAnalytics),
    getVariant: faqAnalytics.getABTestVariant.bind(faqAnalytics),
    trackConversion: faqAnalytics.trackConversion.bind(faqAnalytics),
    getPersonalizedContent: faqAnalytics.getPersonalizedContent.bind(faqAnalytics)
  };
}; 