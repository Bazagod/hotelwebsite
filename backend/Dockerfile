FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    libsqlite3-dev \
    && docker-php-ext-install pdo_mysql pdo_sqlite mbstring zip bcmath gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .
RUN php artisan config:clear

EXPOSE 8000

CMD ["sh", "-c", "php artisan migrate --seed --force 2>/dev/null; php artisan serve --host=0.0.0.0 --port=8000"]
