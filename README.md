# Тестовое задание: Laravel + Vue.js

Небольшое приложение каталога товаров:

- публичная часть с просмотром списка товаров и карточки товара;
- админка с авторизацией по токену (Sanctum) и CRUD по товарам;
- API на Laravel + Inertia + Vue 3.

---

## Запуск проекта


### Docker

1. Склонировать репозиторий и перейти в папку проекта


2. Собрать и поднять контейнеры:  
    `docker compose build`  
    `docker compose up -d`


3. Выполнить первоначальную настройку внутри контейнера `app`:  
    `docker compose exec app bash`


4. Перейти в папку проекта и выполнить следующие команды:  
    `cp .env.example .env`  
    `composer install`  
    `php artisan key:generate`  
    `php artisan migrate --seed`


5. Собрать фронтенд:  
    `npm install`  
    `npm run dev`


6. Адрес приложения и авторизация:  
    `http://localhost:8000`  
   `admin@example.com`  
   `12345`

---

### Open Server

Подготовленная конфигурация для Open Server версии 6 и выше находится в папке `.osp`
