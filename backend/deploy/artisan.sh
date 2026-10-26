#!/bin/sh
# Laravel-Befehle mit dem richtigen PHP ausführen, z. B.:
#   sh backend/deploy/artisan.sh pflanzfarm:einrichten
#   sh backend/deploy/artisan.sh pflanzfarm:status --testmail=ich@example.ch
#   sh backend/deploy/artisan.sh pflanzfarm:domain pflanzfarm.ch --live
set -e
cd "$(dirname "$0")/.."
. deploy/php.sh >/dev/null
exec $PHP artisan "$@"
