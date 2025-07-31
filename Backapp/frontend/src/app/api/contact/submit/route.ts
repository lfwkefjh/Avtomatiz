import { NextRequest, NextResponse } from 'next/server';

interface ContactRequest {
  name: string;
  phone: string;
  comment: string;
  locale: string;
  page: string;
  timestamp: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  comment: string;
  locale: string;
  page: string;
  timestamp: string;
  status: 'новая' | 'в обработке' | 'закрыта';
  createdAt: Date;
}

// Временное хранилище заявок (в продакшене будет база данных)
let submissions: ContactSubmission[] = [];
let nextId = 1;

// Telegram Bot настройки (в продакшене должны быть в переменных окружения)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

// Функция отправки в Telegram
async function sendToTelegram(submission: ContactSubmission) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    console.log('📱 Telegram не настроен. Сообщение:', formatTelegramMessage(submission));
    return { success: true, message: 'Отправлено в консоль (Telegram не настроен)' };
  }

  try {
    const message = formatTelegramMessage(submission);
    
    // Добавляем таймаут 5 секунд для Telegram API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📋 Взять в обработку', callback_data: `process_${submission.id}` },
              { text: '✅ Закрыть заявку', callback_data: `close_${submission.id}` }
            ]
          ]
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { success: true, message: 'Отправлено в Telegram' };
    } else {
      throw new Error(`Telegram API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Telegram send error:', error);
    return { success: false, message: 'Ошибка отправки в Telegram' };
  }
}

// Форматирование сообщения для Telegram
function formatTelegramMessage(submission: ContactSubmission): string {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tashkent'
    }).format(date);
  };

  const pageNames: Record<string, string> = {
    '/ru': 'Главная (RU)',
    '/en': 'Main (EN)', 
    '/uz': 'Asosiy (UZ)',
    '/ru/contacts': 'Контакты (RU)',
    '/en/contacts': 'Contacts (EN)',
    '/uz/contacts': 'Kontaktlar (UZ)'
  };

  const pageName = pageNames[submission.page] || submission.page;

  return `🔔 <b>Новая заявка на связь</b>

📋 <b>ID заявки:</b> №${submission.id}
👤 <b>Имя:</b> ${submission.name}
📞 <b>Телефон:</b> ${submission.phone}
${submission.comment ? `📝 <b>Комментарий:</b> ${submission.comment}` : ''}

🌐 <b>Заявка со страницы:</b> ${pageName}
📅 <b>Дата, время:</b> ${formatDate(submission.createdAt)}
📊 <b>Статус заявки:</b> ${submission.status}`;
}

// POST endpoint для обработки формы
export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    // Валидация данных
    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Валидация телефона
    const phoneRegex = /^\+998\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    if (!phoneRegex.test(body.phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Неверный формат номера телефона' },
        { status: 400 }
      );
    }

    // Создание заявки
    const submission: ContactSubmission = {
      id: nextId++,
      name: body.name.trim(),
      phone: body.phone.trim(),
      comment: body.comment?.trim() || '',
      locale: body.locale || 'ru',
      page: body.page || '/',
      timestamp: body.timestamp,
      status: 'новая',
      createdAt: new Date()
    };

    // Сохранение в "базу данных"
    submissions.push(submission);

    // Мгновенный ответ пользователю
    const response = NextResponse.json({
      success: true,
      id: submission.id,
      message: 'Заявка успешно отправлена',
      telegramStatus: 'Отправляется...'
    });

    // Отправка в Telegram в фоновом режиме (неблокирующая)
    sendToTelegram(submission)
      .then(telegramResult => {
        console.log('📋 Новая заявка:', {
          id: submission.id,
          name: submission.name,
          phone: submission.phone,
          comment: submission.comment || 'не указан',
          page: submission.page,
          telegramSent: telegramResult.success,
          telegramMessage: telegramResult.message
        });
      })
      .catch(error => {
        console.error('📱 Telegram отправка не удалась:', error);
        // Заявка все равно сохранена, просто Telegram не получил
      });

    return response;

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// GET endpoint для получения списка заявок (для админки)
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      submissions: submissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      total: submissions.length
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    
    return NextResponse.json(
      { error: 'Ошибка получения заявок' },
      { status: 500 }
    );
  }
} 