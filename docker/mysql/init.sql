-- Инициализация базы данных Sellercom
-- Этот файл выполняется при первом запуске MySQL контейнера

-- Убеждаемся что используется правильная кодировка
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Создание базы данных если не существует
CREATE DATABASE IF NOT EXISTS `sellercom` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Использование созданной базы данных
USE `sellercom`;

-- Создание пользователя для приложения (если не существует)
CREATE USER IF NOT EXISTS 'sellercom'@'%' IDENTIFIED BY 'sellercom123';

-- Предоставление всех прав на базу данных
GRANT ALL PRIVILEGES ON `sellercom`.* TO 'sellercom'@'%';

-- Обновление привилегий
FLUSH PRIVILEGES;

-- Логирование инициализации
SELECT 'Database sellercom initialized successfully' AS Status; 