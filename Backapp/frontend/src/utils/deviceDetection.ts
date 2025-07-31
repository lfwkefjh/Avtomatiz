// Утилиты для детекции устройств и браузеров
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenSize: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      type: 'desktop',
      browser: 'unknown',
      os: 'unknown',
      screenSize: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.screen?.width || 1920;
  const screenHeight = window.screen?.height || 1080;

  // Улучшенное определение типа устройства
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent) && screenWidth <= 768;
  const isTablet = (/ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (screenWidth > 768 && screenWidth <= 1024)) && !isMobile;
  const isDesktop = !isMobile && !isTablet;

  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (isMobile) {
    deviceType = 'mobile';
  } else if (isTablet) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop'; // Явно устанавливаем desktop по умолчанию
  }

  // Определение браузера
  let browser = 'unknown';
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) browser = 'chrome';
  else if (userAgent.includes('firefox')) browser = 'firefox';
  else if (userAgent.includes('safari') && !userAgent.includes('chrome')) browser = 'safari';
  else if (userAgent.includes('edg')) browser = 'edge';
  else if (userAgent.includes('opera') || userAgent.includes('opr')) browser = 'opera';

  // Определение ОС
  let os = 'unknown';
  if (userAgent.includes('windows')) os = 'windows';
  else if (userAgent.includes('mac')) os = 'macos';
  else if (userAgent.includes('linux')) os = 'linux';
  else if (userAgent.includes('android')) os = 'android';
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'ios';

  return {
    type: deviceType,
    browser,
    os,
    screenSize: `${screenWidth}x${screenHeight}`,
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Получение краткой информации об устройстве для аналитики
export const getDeviceAnalytics = () => {
  // Гарантируем, что вызывается только на клиенте
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      device: 'desktop',
      browser: 'unknown',
      os: 'unknown',
      screenSize: 'unknown',
    };
  }

  const deviceInfo = getDeviceInfo();
  
  // Дополнительная проверка для предотвращения 'unknown'
  const deviceType = deviceInfo.type === 'desktop' || deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet' 
    ? deviceInfo.type 
    : 'desktop';
    
  return {
    device: deviceType,
    browser: deviceInfo.browser || 'unknown',
    os: deviceInfo.os || 'unknown',
    screenSize: deviceInfo.screenSize || 'unknown',
  };
}; 