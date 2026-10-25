#!/bin/sh
# Installation bzw. Aktualisierung auf Hetzner-Webhosting (per SSH ausführen).
# Aufruf aus dem Repository-Ordner:  sh backend/deploy/install.sh
# PHP-Version wählbar, z. B.:          PHP=php8.3 sh backend/deploy/install.sh
set -e
cd "$(dirname "$0")/.."
# Neueste verfügbare PHP-Version suchen (Hetzner hat je nach Server z. B. php83 oder php8.3 zusätzlich zu php)
if [ -z "$PHP" ]; then
  PHP=php
  for c in php8.4 php84 php8.3 php83 /usr/bin/php8.4 /usr/bin/php8.3; do
    if command -v "$c" >/dev/null 2>&1; then PHP="$c"; break; fi
  done
fi

echo "PHP: $($PHP -r 'echo PHP_VERSION;') ($PHP)"
$PHP -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);' || {
  echo "Es wird PHP 8.2 oder neuer benötigt. Versuche z. B.: PHP=php82 sh backend/deploy/install.sh"; exit 1; }

MISSING=$($PHP -r 'echo implode(" ", array_filter(["intl","gd","zip","pdo_mysql","mbstring","dom","fileinfo","openssl"], fn($e) => !extension_loaded($e)));')
if [ -n "$MISSING" ]; then
  echo "Fehlende PHP-Erweiterungen: $MISSING"
  echo "Bitte in konsoleH unter PHP-Konfiguration aktivieren und das Skript erneut starten."
  exit 1
fi

# Composer bei Bedarf lokal herunterladen
if command -v composer >/dev/null 2>&1; then
  COMPOSER="composer"
else
  [ -f composer.phar ] || $PHP -r "copy('https://getcomposer.org/download/latest-stable/composer.phar', 'composer.phar');"
  COMPOSER="$PHP composer.phar"
fi
$COMPOSER install --no-dev --optimize-autoloader --no-interaction

if [ ! -f .env ]; then
  cp deploy/env.staging .env
  echo ""
  echo ">>> backend/.env wurde angelegt. Bitte Datenbank, SITE_PASSWORD und TEST_ADMIN_PASSWORD eintragen"
  echo ">>> (z. B. mit: nano backend/.env) und das Skript danach erneut ausführen."
  exit 0
fi
if grep -q '=ÄNDERN' .env; then
  echo "In backend/.env stehen noch Platzhalter «ÄNDERN». Bitte zuerst ausfüllen."; exit 1
fi
grep -q '^APP_KEY=base64' .env || $PHP artisan key:generate --force

$PHP artisan migrate --force
if [ "$($PHP artisan tinker --execute 'echo App\Models\Product::count();' 2>/dev/null | tail -n1)" = "0" ]; then
  $PHP artisan db:seed --force
  if grep -q '^PFLANZFARM_TEST_MODE=true' .env; then
    $PHP artisan db:seed --class=TestDataSeeder --force || echo "Hinweis: Testdaten nicht vollständig angelegt."
  fi
fi
$PHP artisan storage:link >/dev/null 2>&1 || true
$PHP artisan optimize
$PHP artisan filament:optimize >/dev/null 2>&1 || true
chmod -R ug+rwX storage bootstrap/cache

echo ""
echo "Fertig. Website: $(grep '^APP_URL=' .env | cut -d= -f2)   Admin: …/admin"
