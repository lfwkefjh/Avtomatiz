// API для работы с FAQ и переводами
// Интеграция с Spatie Translation Loader в Laravel

import { FAQData, FAQTranslations } from '../mock/faqData';

// Базовый URL API (настраивается в .env)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Интерфейс ответа от Laravel API с Spatie Translation Loader
interface APIFAQResponse {
  id: string;
  slug: string;
  page: string;
  sort_order: number;
  is_active: boolean;
  button_url: string | null;
  created_at: string;
  updated_at: string;
  // Переводы от Spatie Translation Loader
  translations: {
    [locale: string]: {
      question: string;
      answer: string;
      meta_title: string;
      meta_description: string;
      button_text?: string;
      // A/B варианты тоже переводятся
      ab_variant_a_question?: string;
      ab_variant_a_button_text?: string;
      ab_variant_a_hypothesis?: string;
      ab_variant_b_question?: string;
      ab_variant_b_button_text?: string;
      ab_variant_b_hypothesis?: string;
    };
  };
}

// Класс для работы с FAQ API
export class FAQApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Получение всех FAQ для определенной страницы
  async getFAQsByPage(page: string, locale: string = 'ru'): Promise<FAQData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/faqs?page=${page}&locale=${locale}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: APIFAQResponse[] = await response.json();
      
      // Преобразуем API ответ в наш формат
      return apiData.map(this.transformAPIResponseToFAQData);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  }

  // Получение одного FAQ по ID
  async getFAQById(id: string, locale: string = 'ru'): Promise<FAQData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/faqs/${id}?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: APIFAQResponse = await response.json();
      return this.transformAPIResponseToFAQData(apiData);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      return null;
    }
  }

  // Создание нового FAQ (для админки)
  async createFAQ(faqData: Partial<FAQData>): Promise<FAQData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/faqs`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Добавьте токен аутентификации для админки
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(this.transformFAQDataToAPIRequest(faqData)),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: APIFAQResponse = await response.json();
      return this.transformAPIResponseToFAQData(apiData);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }
  }

  // Обновление FAQ (для админки)
  async updateFAQ(id: string, faqData: Partial<FAQData>): Promise<FAQData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(this.transformFAQDataToAPIRequest(faqData)),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: APIFAQResponse = await response.json();
      return this.transformAPIResponseToFAQData(apiData);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  }

  // Удаление FAQ (для админки)
  async deleteFAQ(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }

  // Получение доступных языков
  async getAvailableLocales(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/locales`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const locales: string[] = await response.json();
      return locales;
    } catch (error) {
      console.error('Error fetching locales:', error);
      return ['ru', 'en', 'uz']; // Fallback
    }
  }

  // Приватные методы для трансформации данных

  private transformAPIResponseToFAQData(apiData: APIFAQResponse): FAQData {
    const translations: FAQTranslations = {};

    // Преобразуем переводы из формата Spatie в наш формат
    Object.keys(apiData.translations).forEach(locale => {
      const apiTranslation = apiData.translations[locale];
      
      translations[locale] = {
        question: apiTranslation.question,
        answer: apiTranslation.answer,
        metaTitle: apiTranslation.meta_title,
        metaDescription: apiTranslation.meta_description,
        buttonText: apiTranslation.button_text || undefined,
      };

      // Если есть A/B варианты, добавляем их
      if (apiTranslation.ab_variant_a_question) {
        translations[locale].abTestVariants = {
          variant_a: {
            question: apiTranslation.ab_variant_a_question,
            buttonText: apiTranslation.ab_variant_a_button_text,
            hypothesis: apiTranslation.ab_variant_a_hypothesis || ''
          }
        };
      }

      if (apiTranslation.ab_variant_b_question) {
        if (!translations[locale].abTestVariants) {
          translations[locale].abTestVariants = {};
        }
        translations[locale].abTestVariants!.variant_b = {
          question: apiTranslation.ab_variant_b_question,
          buttonText: apiTranslation.ab_variant_b_button_text,
          hypothesis: apiTranslation.ab_variant_b_hypothesis || ''
        };
      }
    });

    return {
      id: apiData.id,
      slug: apiData.slug,
      page: apiData.page,
      sortOrder: apiData.sort_order,
      isActive: apiData.is_active,
      buttonUrl: apiData.button_url || undefined,
      translations
    };
  }

  private transformFAQDataToAPIRequest(faqData: Partial<FAQData>): any {
    const apiRequest: any = {
      slug: faqData.slug,
      page: faqData.page,
      sort_order: faqData.sortOrder,
      is_active: faqData.isActive,
      button_url: faqData.buttonUrl,
    };

    // Преобразуем переводы в формат для Spatie Translation Loader
    if (faqData.translations) {
      apiRequest.translations = {};
      
      Object.keys(faqData.translations).forEach(locale => {
        const translation = faqData.translations![locale];
        
        apiRequest.translations[locale] = {
          question: translation.question,
          answer: translation.answer,
          meta_title: translation.metaTitle,
          meta_description: translation.metaDescription,
          button_text: translation.buttonText,
        };

        // A/B варианты
        if (translation.abTestVariants?.variant_a) {
          apiRequest.translations[locale].ab_variant_a_question = translation.abTestVariants.variant_a.question;
          apiRequest.translations[locale].ab_variant_a_button_text = translation.abTestVariants.variant_a.buttonText;
          apiRequest.translations[locale].ab_variant_a_hypothesis = translation.abTestVariants.variant_a.hypothesis;
        }

        if (translation.abTestVariants?.variant_b) {
          apiRequest.translations[locale].ab_variant_b_question = translation.abTestVariants.variant_b.question;
          apiRequest.translations[locale].ab_variant_b_button_text = translation.abTestVariants.variant_b.buttonText;
          apiRequest.translations[locale].ab_variant_b_hypothesis = translation.abTestVariants.variant_b.hypothesis;
        }
      });
    }

    return apiRequest;
  }

  private getAuthToken(): string {
    // В реальном приложении токен должен браться из безопасного хранилища
    return localStorage.getItem('admin_token') || '';
  }
}

// Экспорт экземпляра для использования в компонентах
export const faqApiService = new FAQApiService();

// Хук для использования в React компонентах
export const useFAQApi = () => {
  return {
    getFAQsByPage: faqApiService.getFAQsByPage.bind(faqApiService),
    getFAQById: faqApiService.getFAQById.bind(faqApiService),
    createFAQ: faqApiService.createFAQ.bind(faqApiService),
    updateFAQ: faqApiService.updateFAQ.bind(faqApiService),
    deleteFAQ: faqApiService.deleteFAQ.bind(faqApiService),
    getAvailableLocales: faqApiService.getAvailableLocales.bind(faqApiService),
  };
}; 