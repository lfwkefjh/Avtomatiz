// Типы для Google Analytics
declare global {
  function gtag(...args: any[]): void;
  function fbq(...args: any[]): void;
  
  interface Window {
    gtag: typeof gtag;
    fbq: typeof fbq;
    dataLayer: any[];
  }
}

export {}; 