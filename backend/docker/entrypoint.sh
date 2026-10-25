#!/bin/sh
# Bereitet die App beim Start vor: Schlüssel, Datenbank, Bilder, Testdaten.
set -e
cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi
if [ -z "$APP_KEY" ] && ! grep -q '^APP_KEY=base64' .env; then
  php artisan key:generate --force
fi

echo "Warte auf die Datenbank …"
i=0
until php artisan db:show >/dev/null 2>&1; do
  i=$((i+1)); [ $i -gt 60 ] && echo "Datenbank nicht erreichbar" && exit 1; sleep 2
done

php artisan migrate --force
if [ "$(php artisan tinker --execute 'echo App\Models\Product::count();' 2>/dev/null | tail -n1)" = "0" ]; then
  php artisan db:seed --force
  if [ "$PFLANZFARM_TEST_MODE" = "true" ]; then
    php artisan db:seed --class=TestDataSeeder --force
  fi
fi
php artisan storage:link >/dev/null 2>&1 || true
chown -R www-data:www-data storage bootstrap/cache
php artisan optimize >/dev/null
php artisan filament:optimize >/dev/null 2>&1 || true

exec "$@"
