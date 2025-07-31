'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ContactFormData {
  name: string;
  phone: string;
  comment: string;
}

interface ContactFormProps {
  locale: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ locale }) => {
  const { currentLocale } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    comment: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  // Переводы для формы
  const translations = {
    ru: {
      title: 'Остались вопросы?',
      subtitle: 'Оставьте свои данные, и наш менеджер свяжется с вами в ближайшее время',
      nameLabel: 'Имя или название компании',
      phonePlaceholder: '+998 (__) ___-__-__',
      commentLabel: 'Комментарий (необязательно)',
      commentPlaceholder: 'Расскажите подробнее о вашем вопросе...',
      submitButton: 'Отправить заявку',
      agreement: 'Нажимая кнопку «Отправить заявку», я соглашаюсь с политикой в отношении обработки персональных данных',
      successMessage: '✅ Заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.',
      errorMessage: '❌ Ошибка отправки. Попробуйте еще раз или свяжитесь с нами по телефону.',
      nameRequired: 'Введите имя или название компании',
      phoneRequired: 'Введите номер телефона',
      phoneInvalid: 'Неверный формат номера телефона'
    },
    en: {
      title: 'Have questions?',
      subtitle: 'Leave your details and our manager will contact you soon',
      nameLabel: 'Name or company name',
      phonePlaceholder: '+998 (__) ___-__-__',
      commentLabel: 'Comment (optional)',
      commentPlaceholder: 'Tell us more about your question...',
      submitButton: 'Submit request',
      agreement: 'By clicking "Submit request", I agree to the personal data processing policy',
      successMessage: '✅ Request sent successfully! Our manager will contact you soon.',
      errorMessage: '❌ Sending error. Please try again or contact us by phone.',
      nameRequired: 'Enter name or company name',
      phoneRequired: 'Enter phone number',
      phoneInvalid: 'Invalid phone number format'
    },
    uz: {
      title: 'Savollaringiz bormi?',
      subtitle: 'Ma\'lumotlaringizni qoldiring, menejerimiz yaqin orada siz bilan bog\'lanadi',
      nameLabel: 'Ism yoki kompaniya nomi',
      phonePlaceholder: '+998 (__) ___-__-__',
      commentLabel: 'Izoh (ixtiyoriy)',
      commentPlaceholder: 'Savolingiz haqida batafsil aytib bering...',
      submitButton: 'Ariza yuborish',
      agreement: '"Ariza yuborish" tugmasini bosish orqali men shaxsiy ma\'lumotlarni qayta ishlash siyosatiga roziman',
      successMessage: '✅ Ariza muvaffaqiyatli yuborildi! Menejerimiz yaqin orada siz bilan bog\'lanadi.',
      errorMessage: '❌ Yuborishda xatolik. Yana urinib ko\'ring yoki telefon orqali bog\'laning.',
      nameRequired: 'Ism yoki kompaniya nomini kiriting',
      phoneRequired: 'Telefon raqamini kiriting',
      phoneInvalid: 'Telefon raqami formati noto\'g\'ri'
    }
  };

  const t = translations[currentLocale as keyof typeof translations] || translations.ru;

  // Popup state management

  // Валидация телефона
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+998\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('998')) {
      const phoneDigits = digits.slice(3);
      if (phoneDigits.length <= 2) {
        return `+998 (${phoneDigits}`;
      } else if (phoneDigits.length <= 5) {
        return `+998 (${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2)}`;
      } else if (phoneDigits.length <= 7) {
        return `+998 (${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 5)}-${phoneDigits.slice(5)}`;
      } else {
        return `+998 (${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 5)}-${phoneDigits.slice(5, 7)}-${phoneDigits.slice(7, 9)}`;
      }
    } else if (digits.length > 0) {
      return `+998 (${digits.slice(0, 2)}`;
    }
    return '+998 (';
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    if (field === 'phone') {
      value = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Убираем ошибку при начале ввода
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.phoneRequired;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t.phoneInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Form submission started - page should NOT reload!');
    
    if (!validateForm() || isSubmitting) {
      e.preventDefault(); // Дополнительная защита
      console.log('❌ Form validation failed or already submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale: currentLocale,
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setPopupType('success');
        setPopupMessage(t.successMessage);
        setFormData({ name: '', phone: '', comment: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setPopupType('error');
      setPopupMessage(t.errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
      console.log('✅ Form submission completed - popup should be visible!');
      
      // Автоматически скрыть popup через 5 секунд
      setTimeout(() => {
        setShowPopup(false);
        console.log('⏰ Popup hidden after 5 seconds');
      }, 5000);
    }
  };

  return (
    <>
      <div id="contact-form" className="absolute left-[121px] top-[9477px] w-[1681px] h-[450px]">
        <form 
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
              handleSubmit(e as React.FormEvent);
            }
          }}
          className="relative w-full h-full"
        >
          {/* Заголовок */}
          <div className="absolute left-0 top-0 w-[636px] h-[65px]">
            <h1 className="text-white text-[48px] leading-[57.6px] font-geist font-bold uppercase">
              {t.title}
            </h1>
          </div>

          {/* Подзаголовок */}
          <div className="absolute left-[853px] top-[3px] w-[454px] h-[54px]">
            <p className="text-white text-[20px] leading-[24.2px] font-inter font-normal">
              {t.subtitle}
            </p>
          </div>

          {/* Поле имени */}
          <div className="absolute left-[3px] top-[117px] w-[828px] h-[81px]">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t.nameLabel}
              className={`w-full h-full bg-[#18142E] border ${
                errors.name ? 'border-red-500' : 'border-[#0184F8]'
              } rounded-[16px] backdrop-blur-[50px] px-[38px] text-white text-[20px] font-inter placeholder:text-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#0396FF] transition-colors`}
            />
            {errors.name && (
              <div className="absolute -bottom-6 left-0 text-red-400 text-sm">
                {errors.name}
              </div>
            )}
          </div>

          {/* Поле телефона */}
          <div className="absolute left-[853px] top-[117px] w-[828px] h-[81px]">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t.phonePlaceholder}
              className={`w-full h-full bg-[#18142E] border ${
                errors.phone ? 'border-red-500' : 'border-[#0184F8]'
              } rounded-[16px] backdrop-blur-[50px] px-[38px] text-white text-[20px] font-inter placeholder:text-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#0396FF] transition-colors`}
            />
            {errors.phone && (
              <div className="absolute -bottom-6 left-0 text-red-400 text-sm">
                {errors.phone}
              </div>
            )}
          </div>

          {/* Поле комментария */}
          <div className="absolute left-[3px] top-[218px] w-[1678px] h-[81px]">
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full h-full bg-[#18142E] border border-[#0184F8] rounded-[16px] backdrop-blur-[50px] px-[38px] py-[24px] text-white text-[20px] font-inter placeholder:text-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#0396FF] transition-colors resize-none"
              rows={1}
            />
          </div>

          {/* Кнопка отправки */}
          <button 
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              if (isSubmitting) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className={`group absolute left-[3px] top-[319px] w-[1678px] h-[81px] bg-gradient-to-r from-[#0283F7] to-[#850191] rounded-[16px] flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/30'
            }`}
          >
            {/* Градиентный overlay */}
            {!isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0396FF] to-[#9D05A8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            
            {/* Блик эффект */}
            {!isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
            
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                <span className="text-white text-[20px] font-inter font-bold">Отправка...</span>
              </div>
            ) : (
              <>
                <span className="relative z-10 text-white text-[20px] font-inter font-bold mr-4 group-hover:text-shadow-lg transition-all duration-300">
                  {t.submitButton}
                </span>
                <span className="relative z-10 text-white group-hover:translate-x-2 transition-transform duration-300">→</span>
              </>
            )}
          </button>

          {/* Согласие */}
          <div className="absolute left-[354px] top-[428px] w-[977px] h-[21px]">
            <p className="text-white text-[16px] leading-[19.2px] font-geist font-normal text-center">
              {t.agreement}
            </p>
          </div>


        </form>
      </div>

      {/* Popup уведомление - вынесен за пределы формы для лучшего отображения */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className={`relative w-[500px] max-w-[90vw] p-8 rounded-2xl border-4 transform transition-all duration-300 ${
            popupType === 'success' 
              ? 'bg-[#0D1B2A] border-green-400 shadow-green-500/30 shadow-2xl ring-4 ring-green-500/20' 
              : 'bg-[#2A0A0A] border-red-400 shadow-red-500/30 shadow-2xl ring-4 ring-red-500/20'
          } scale-100 opacity-100`}>
            
            {/* Кнопка закрытия */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Иконка */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              popupType === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {popupType === 'success' ? (
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Сообщение */}
            <p className="text-white text-center text-lg leading-relaxed">
              {popupMessage}
            </p>

            {/* Кнопка OK */}
            <button
              onClick={() => setShowPopup(false)}
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                popupType === 'success'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm; 