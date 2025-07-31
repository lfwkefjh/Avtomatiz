# Task 1: Настройка Docker + PHP 8.3 + PostgreSQL + Redis + Nginx

## 📋 ОПИСАНИЕ ЗАДАЧИ
Настройка полной Docker инфраструктуры для платформы ассоциации селлеров с расчетом на 100 одновременных пользователей.

## 🎯 ЦЕЛИ
- ✅ Настроить PHP 8.3 с необходимыми расширениями
- ✅ Настроить PostgreSQL 15 с оптимизацией
- ✅ Настроить Redis для кэширования и очередей
- ✅ Настроить Nginx с оптимизацией для 100 пользователей
- ✅ Настроить Supervisor для Laravel Queue
- ✅ Настроить MailHog для разработки

## 🏗️ КОМПОНЕНТЫ

### 1. PHP 8.3 Container
```dockerfile
FROM php:8.3-fpm

# Системные зависимости для 100 пользователей
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    libfreetype6-dev libjpeg62-turbo-dev libicu-dev libpq-dev \
    unzip supervisor cron nano vim htop

# PHP расширения для оптимальной производительности
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_pgsql mbstring exif pcntl bcmath \
        gd zip intl opcache sockets

# Redis расширение для кэширования
RUN pecl install redis && docker-php-ext-enable redis

# OPcache оптимизация для 100 пользователей
RUN echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini
RUN echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/opcache.ini
RUN echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini
```

### 2. PostgreSQL 15 Container
```yaml
postgres:
  image: postgres:15
  environment:
    POSTGRES_DB: ${DB_DATABASE}
    POSTGRES_USER: ${DB_USERNAME}
    POSTGRES_PASSWORD: ${DB_PASSWORD}
  # Оптимизация для 100 пользователей
  command: >
    postgres
    -c max_connections=200
    -c shared_buffers=256MB
    -c effective_cache_size=1GB
    -c work_mem=4MB
    -c maintenance_work_mem=64MB
    -c checkpoint_completion_target=0.9
    -c wal_buffers=16MB
    -c default_statistics_target=100
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
```

### 3. Redis Container
```yaml
redis:
  image: redis:7-alpine
  # Оптимизация для 100 пользователей
  command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
  volumes:
    - redis_data:/data
```

### 4. Nginx Container
```nginx
# Оптимизация для 100 одновременных пользователей
worker_processes auto;
worker_connections 1024;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Основные настройки
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 10M;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Кэширование статических файлов
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1w;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    upstream php {
        server php:9000;
        keepalive 32;
    }
}
```

### 5. Supervisor для очередей
```ini
[supervisord]
nodaemon=true
user=root

[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
directory=/var/www
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/worker.log
stopwaitsecs=3600

[program:laravel-scheduler]
process_name=%(program_name)s
command=sh -c 'while [ true ]; do php /var/www/artisan schedule:run; sleep 60; done'
directory=/var/www
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/scheduler.log
```

## ⚙️ DOCKER-COMPOSE КОНФИГУРАЦИЯ

```yaml
version: '3.8'

services:
  nginx:
    build: ./docker/nginx
    container_name: sellercom-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - .:/var/www
      - ./storage/app/public:/var/www/public/storage
    depends_on:
      - php
    networks:
      - sellercom

  php:
    build: ./docker/php
    container_name: sellercom-php
    volumes:
      - .:/var/www
      - ./storage:/var/www/storage
    environment:
      - CONTAINER_ROLE=app
    depends_on:
      - postgres
      - redis
    networks:
      - sellercom

  postgres:
    image: postgres:15
    container_name: sellercom-postgres
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    command: >
      postgres
      -c max_connections=200
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c work_mem=4MB
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - sellercom

  redis:
    image: redis:7-alpine
    container_name: sellercom-redis
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - sellercom

  supervisor:
    build: ./docker/supervisor
    container_name: sellercom-supervisor
    volumes:
      - .:/var/www
    depends_on:
      - postgres
      - redis
    networks:
      - sellercom

  mailhog:
    image: mailhog/mailhog:latest
    container_name: sellercom-mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    networks:
      - sellercom

volumes:
  postgres_data:
  redis_data:

networks:
  sellercom:
    driver: bridge
```

## 🔧 ОПТИМИЗАЦИИ ДЛЯ 100 ПОЛЬЗОВАТЕЛЕЙ

### PHP-FPM настройки:
```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.process_idle_timeout = 10s
pm.max_requests = 500

; Память
memory_limit = 256M
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 60
max_input_vars = 3000
```

### PostgreSQL оптимизации:
```sql
-- Расширения для полнотекстового поиска
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Настройки производительности
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET log_min_duration_statement = 1000;
```

### Redis конфигурация:
```conf
# Максимальная память для кэша
maxmemory 512mb
maxmemory-policy allkeys-lru

# Персистентность
save 900 1
save 300 10
save 60 10000

# Производительность
tcp-keepalive 60
timeout 300
```

## 📊 МОНИТОРИНГ И ЛОГИРОВАНИЕ

### Логи контейнеров:
```bash
# Просмотр логов всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f php
docker-compose logs -f nginx
docker-compose logs -f postgres
```

### Мониторинг ресурсов:
```bash
# Использование ресурсов контейнерами
docker stats

# Проверка состояния сервисов
docker-compose ps
```

## ✅ КРИТЕРИИ ГОТОВНОСТИ

- [ ] Все контейнеры запускаются без ошибок
- [ ] PHP 8.3 с необходимыми расширениями работает
- [ ] PostgreSQL принимает подключения
- [ ] Redis доступен для кэширования
- [ ] Nginx обслуживает статические файлы
- [ ] Supervisor управляет очередями Laravel
- [ ] Логирование настроено корректно
- [ ] Производительность оптимизирована для 100 пользователей

## 🚨 ИЗВЕСТНЫЕ ПРОБЛЕМЫ

1. **GD расширение**: Убрать `--with-xpm --with-vpx` для совместимости
2. **Права доступа**: Настроить корректные права для storage
3. **Memory limits**: Увеличить для обработки изображений
4. **Connection limits**: PostgreSQL должен поддерживать 200 подключений

## 📋 СЛЕДУЮЩИЕ ШАГИ

После завершения Task 1:
- Переход к Task 2: Создание миграций БД
- Настройка Laravel .env файла
- Проверка всех подключений
- Запуск первых миграций

## 🔄 СТАТУС ВЫПОЛНЕНИЯ

**Текущий статус**: 🔄 В процессе
**Прогресс**: 80% - Docker контейнеры собираются, требуется установка Composer зависимостей
**Последнее обновление**: 16.07.2025 01:40
**Следующий шаг**: Установка Laravel зависимостей после сборки PHP 8.3 