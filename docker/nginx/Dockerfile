FROM nginx:alpine

# Установка дополнительных пакетов
RUN apk add --no-cache \
    curl \
    vim

# Копирование конфигурации
COPY nginx.conf /etc/nginx/nginx.conf

# Создание директорий
RUN mkdir -p /var/log/nginx /var/cache/nginx

# Настройка прав доступа
RUN chown -R nginx:nginx /var/log/nginx /var/cache/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"] 