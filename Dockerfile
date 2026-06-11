FROM node:20-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY public ./public
COPY vite.config.js tsconfig.json tailwind.config.js postcss.config.js ./
RUN npm run build

FROM php:8.3-cli-alpine AS app

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    curl \
    libpq-dev \
    libzip-dev \
    oniguruma-dev \
    sqlite-dev \
    unzip \
    zip \
    && docker-php-ext-install \
    bcmath \
    mbstring \
    pdo_mysql \
    pdo_pgsql \
    pdo_sqlite \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --optimize-autoloader

COPY . .
COPY --from=assets /app/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/koyeb-entrypoint

RUN chmod +x /usr/local/bin/koyeb-entrypoint \
    && mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && composer dump-autoload --optimize \
    && APP_ENV=production APP_DEBUG=false php artisan package:discover --ansi

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV PORT=8000

EXPOSE 8000

ENTRYPOINT ["koyeb-entrypoint"]
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
