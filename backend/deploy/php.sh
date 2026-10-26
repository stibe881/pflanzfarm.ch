# Wird von install.sh und artisan.sh eingebunden: passendes PHP 8.5 finden (Hetzner hat z. B. php85 zusätzlich zu php)
if [ -z "$PHP" ]; then
  PHP=php
  for c in php8.5 php85 /usr/bin/php8.5 /usr/bin/php85 /usr/local/bin/php85 /opt/php85/bin/php; do
    if command -v "$c" >/dev/null 2>&1; then PHP="$c"; break; fi
  done
fi

echo "PHP: $($PHP -r 'echo PHP_VERSION;') ($PHP)"
$PHP -r 'exit(version_compare(PHP_VERSION, "8.5.0", ">=") ? 0 : 1);' || {
  echo "Es wird PHP 8.5 oder neuer benötigt."
  echo "Verfügbare PHP-Versionen auf diesem Server:"
  ls /usr/bin/php* /usr/local/bin/php* /opt/php*/bin/php 2>/dev/null | sed 's/^/  /'
  echo "Dann z. B.: PHP=/pfad/zu/php85 sh backend/deploy/install.sh"
  exit 1; }
