FROM php:8.3-cli

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    supervisor \
    curl \
    libzip-dev \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Установка PHP расширений необходимых для Laravel
RUN docker-php-ext-install \
    pdo_mysql \
    zip \
    pcntl \
    bcmath

# Установка Redis расширения
RUN pecl install redis && docker-php-ext-enable redis

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создание директорий для логов
RUN mkdir -p /var/log/supervisor

# Копирование конфигурации supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Настройка рабочей директории
WORKDIR /var/www

# Запуск supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 