/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/ru',
      },
      // Добавляем rewrite для шрифтов чтобы они не имели префикс локали
      {
        source: '/fornts/:path*',
        destination: '/fornts/:path*',
      },

      // Добавляем rewrite для изображений чтобы они не имели префикс локали
      {
        source: '/images/:path*',
        destination: '/images/:path*',
      },
      // Добавляем rewrite для видео чтобы они не имели префикс локали
      {
        source: '/videos/:path*',
        destination: '/videos/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/fornts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
