FROM php:8.3-fpm

# Аргументы сборки
ARG WWWGROUP=1000
ARG NODE_VERSION=18

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libicu-dev \
    libpq-dev \
    libxpm-dev \
    libvpx-dev \
    unzip \
    supervisor \
    cron \
    nano \
    vim \
    htop \
    && rm -rf /var/lib/apt/lists/*

# Установка PHP расширений
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
        sockets

# Установка Redis расширения
RUN pecl install redis && docker-php-ext-enable redis

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Установка Node.js (для сборки фронтенда если нужно)
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# Создание пользователя
RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

# Копирование PHP конфигурации
COPY php.ini /usr/local/etc/php/php.ini

# Копирование оптимизированной конфигурации PHP-FPM
COPY fpm-pool.conf /usr/local/etc/php-fpm.d/www.conf

# Настройка рабочей директории
WORKDIR /var/www

# Создание необходимых директорий
RUN mkdir -p /var/www/storage/logs
RUN mkdir -p /var/www/storage/app/public
RUN mkdir -p /var/www/storage/framework/cache
RUN mkdir -p /var/www/storage/framework/sessions
RUN mkdir -p /var/www/storage/framework/views

# Настройка прав доступа
RUN chown -R sail:sail /var/www
RUN chmod -R 755 /var/www/storage

# Переключение на пользователя sail
USER sail

EXPOSE 9000

# Запуск PHP-FPM
CMD ["php-fpm"] 