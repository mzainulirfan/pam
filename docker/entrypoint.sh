#!/usr/bin/env sh
set -e

mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

if [ ! -e public/storage ]; then
    php artisan storage:link >/dev/null 2>&1 || true
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    php artisan db:seed --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
