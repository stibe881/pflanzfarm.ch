# Pflanzfarm – Installation und Betrieb

Die Website besteht aus zwei Teilen in diesem Repository:

| Ordner | Inhalt |
|---|---|
| `backend/` | Laravel 12: API, Adminbereich (`/admin`, Filament), Kundenkonten, Bestellungen, Stripe, Resend, Rechnungen |
| `frontend/` | Quellcode der Website (React-Bundle). `npm run build` schreibt JS/CSS nach `backend/public/assets` |

Laravel liefert alles unter einer Domain aus: die Website, die API unter `/api` und den Adminbereich unter `/admin`.

## Voraussetzungen auf dem Server

- PHP 8.3 mit den Erweiterungen `intl`, `gd`, `zip`, `pdo_mysql`, `mbstring`, `xml`, `bcmath`
- MySQL 8 oder MariaDB 10.6+
- Composer 2, Node.js 20+ (nur zum Bauen und Vorrendern)
- nginx oder Apache mit HTTPS (z. B. Let's Encrypt)

Geplant ist das Hosting bei Hetzner. Ein kleiner Cloud-Server (z. B. CX22) mit Ubuntu reicht; Shared Hosting mit SSH-Zugang und PHP 8.3 funktioniert ebenfalls.

## Erstinstallation

```bash
git clone https://github.com/stibe881/pflanzfarm.ch.git && cd pflanzfarm.ch/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env            # Werte ausfüllen, siehe unten
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force     # übernimmt Produkte, Referenzen, Ratgeber und Popups der bisherigen Website
php artisan storage:link
php artisan filament:optimize && php artisan optimize
php artisan pflanzfarm:team-user thomas@pflanzfarm.ch "Thomas Steinmann" --role=admin
```

Der letzte Befehl fragt ein Passwort ab (mind. 12 Zeichen, Gross-/Kleinbuchstaben und Zahl) und legt das erste Admin-Konto an. Weitere Team-Konten legt ein Admin danach im Adminbereich unter «Kunden & Team» an (Rolle «Team»).

Cron-Eintrag für den Newsletter-Versand (Warteschlange):

```
* * * * * cd /pfad/zu/pflanzfarm.ch/backend && php artisan schedule:run >> /dev/null 2>&1
```

### nginx

```nginx
server {
    server_name pflanzfarm.ch www.pflanzfarm.ch;
    root /pfad/zu/pflanzfarm.ch/backend/public;
    index index.php;
    client_max_body_size 10M;

    location / {
        # Vorgerenderte Seiten (z. B. /shop/index.html) direkt ausliefern, sonst Laravel
        try_files $uri $uri/index.html /index.php?$query_string;
    }
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }
    location /assets/ { expires 30d; access_log off; }
}
```

## Konfiguration (`backend/.env`)

| Variable | Wert |
|---|---|
| `APP_URL` | `https://pflanzfarm.ch` |
| `DB_*` | Zugangsdaten der MySQL-Datenbank |
| `RESEND_API_KEY` | API-Schlüssel von [resend.com](https://resend.com) |
| `MAIL_FROM_ADDRESS` | Absender, z. B. `shop@pflanzfarm.ch` (Domain muss bei Resend verifiziert sein) |
| `STRIPE_KEY`, `STRIPE_SECRET` | Schlüssel aus dem Stripe-Dashboard (zuerst mit Testschlüsseln `pk_test_…`/`sk_test_…` ausprobieren) |
| `STRIPE_WEBHOOK_SECRET` | Signatur-Geheimnis des Webhooks (siehe unten) |
| `SANCTUM_STATEFUL_DOMAINS` | `pflanzfarm.ch,www.pflanzfarm.ch` |

### Resend

1. Konto auf resend.com erstellen, Domain `pflanzfarm.ch` hinzufügen und die angezeigten DNS-Einträge (SPF, DKIM) beim Domain-Anbieter eintragen.
2. API-Schlüssel erstellen und als `RESEND_API_KEY` eintragen.

Über Resend laufen: Bestellbestätigung (mit Rechnung als PDF), Statusmails (bestätigt, geliefert, storniert), Hinweis an das Team bei neuen Bestellungen und Anfragen, Kontobestätigung, Passwort zurücksetzen, Newsletter-Bestätigung (Double-Opt-in) und Newsletter mit Abmeldelink.

### Stripe (Karte und TWINT)

1. Im Stripe-Dashboard unter *Einstellungen → Zahlungsmethoden* **TWINT** aktivieren (nur für Schweizer Konten in CHF verfügbar).
2. Unter *Entwickler → Webhooks* einen Endpunkt anlegen: `https://pflanzfarm.ch/stripe/webhook` mit den Ereignissen
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`.
3. Das Signatur-Geheimnis (`whsec_…`) als `STRIPE_WEBHOOK_SECRET` eintragen.

Ablauf: Bei «Karte oder TWINT» wird die Bestellung angelegt, der Bestand reserviert und die Kundschaft zu Stripe weitergeleitet. Erst nach bestätigter Zahlung gehen die Bestellmails raus. Bricht die Zahlung ab oder läuft sie nach 60 Minuten ab, wird die Bestellung storniert und der Bestand freigegeben. Erstattungen werden im Stripe-Dashboard ausgelöst.

## Website bauen und vorrendern

Nach Änderungen am Code in `frontend/`:

```bash
cd frontend
npm install
npx playwright install chromium   # einmalig, für das Vorrendern
npm run build                     # schreibt backend/public/assets/index-*.js|css und backend/resources/spa.html
npm run prerender -- https://pflanzfarm.ch   # optional: aktualisiert die vorgerenderten Seiten und sitemap.xml
```

Die vorgerenderten Seiten dienen Suchmaschinen und dem schnellen ersten Seitenaufbau. Die aktuellen Preise, Lagerbestände und Inhalte lädt die Website beim Aufruf immer live aus der API – Änderungen im Adminbereich sind also sofort sichtbar. Nach grösseren inhaltlichen Änderungen (neue Produkte, Ratgeber-Artikel) lohnt sich ein erneutes Vorrendern, damit Google die neuen Inhalte direkt sieht.

## Vor dem Livegang prüfen

- [ ] **AGB** (`/agb/`) sind ein Entwurf und müssen geprüft werden.
- [ ] **Datenschutzerklärung**: Hosting-Anbieter (Hetzner angenommen), Stripe, Resend, Google Analytics prüfen.
- [ ] **Einstellungen** im Admin: Lieferpauschale (Standard CHF 49.–), Gratis-Lieferung ab (Standard CHF 500.–), IBAN für QR-Rechnungen, MWST-Nummer, Öffnungszeiten, E-Mail für Benachrichtigungen.
- [ ] **Produkte**: Preise und Lagerbestand für alle Thuja-Grössen erfassen (aktuell ist nur 80–100 cm bestellbar), Lagerbestände aller Produkte prüfen.
- [ ] **Google Analytics**: Mess-ID in `frontend/src/app.js` (`pf_gaId`) eintragen und neu bauen.
- [ ] Testbestellung mit Stripe-Testkarte `4242 4242 4242 4242` und mit TWINT im Testmodus, danach Live-Schlüssel eintragen.
- [ ] DNS von `pflanzfarm.ch` auf den Server zeigen lassen; GitHub Pages danach abschalten.

## Tests

```bash
cd backend && php artisan test
```

Die Tests decken Adminzugriff, Bestellung mit Lagerreservierung, Stripe-Webhook (Zahlung, Ablauf), Rechnung mit QR-Code, Registrierung mit E-Mail-Bestätigung, Datenexport/-löschung, Newsletter mit Double-Opt-in und Abmeldung sowie das Kontaktformular ab.
