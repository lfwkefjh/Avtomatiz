'use client';

import React from 'react';

interface FAQStructuredDataProps {
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    slug?: string;
  }>;
  pageUrl?: string;
  organizationName?: string;
}

const FAQStructuredData: React.FC<FAQStructuredDataProps> = ({ 
  faqs, 
  pageUrl = '',
  organizationName = 'Ассоциация селлеров Узбекистана'
}) => {
  // Генерируем JSON-LD для FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "author": {
          "@type": "Organization",
          "name": organizationName
        }
      },
      // Добавляем URL для конкретного вопроса если есть slug
      ...(faq.slug && pageUrl && {
        "url": `${pageUrl}#${faq.slug}`
      })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

// Компонент для организации (добавляет доверие)
export const OrganizationStructuredData: React.FC<{
  name: string;
  url: string;
  logo?: string;
  description?: string;
}> = ({ name, url, logo, description }) => {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    ...(logo && { "logo": logo }),
    ...(description && { "description": description }),
    "sameAs": [
      "https://t.me/sellers_uzbekistan", // Telegram канал
      "https://instagram.com/sellers_uz", // Instagram
      // Добавьте другие соцсети
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(orgData, null, 2)
      }}
    />
  );
};

// Компонент для хлебных крошек
export const BreadcrumbStructuredData: React.FC<{
  items: Array<{ name: string; url: string }>;
}> = ({ items }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData, null, 2)
      }}
    />
  );
};

export default FAQStructuredData; 