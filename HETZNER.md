# Testbetrieb auf Hetzner-Webhosting (pflanzfarm.gross-ict.ch)

Diese Anleitung bringt die Testversion auf `https://pflanzfarm.gross-ict.ch` – mit Passwortschutz, gelbem Hinweis
«Testumgebung», simulierter Zahlung und ohne E-Mail-Versand. Zeitaufwand: ca. 30 Minuten.

## 1. Vorbereitung in konsoleH

1. **PHP-Version**: Für die Subdomain PHP **8.2 oder neuer** einstellen (Einstellungen → PHP-Konfiguration).
2. **Datenbank**: Unter «Datenbanken → MySQL» eine neue Datenbank anlegen. Notiere Datenbankname, Benutzer, Passwort
   und den angezeigten **Host** (z. B. `localhost` oder `sqlXXX.your-server.de`).
3. **SSH**: Unter «Zugangsdaten» den SSH-Zugang aktivieren bzw. die Zugangsdaten notieren.
4. **SSL**: Für `pflanzfarm.gross-ict.ch` ein Let's-Encrypt-Zertifikat aktivieren.

## 2. Code auf den Server holen (per SSH)

Unter Windows in der Eingabeaufforderung (Benutzer und Server aus konsoleH):

```
ssh BENUTZER@SERVER.your-server.de
```

Auf dem Server:

```
cd ~/public_html/pflanzfarm
ls -la                      # muss leer sein; eine Standard-index.html von Hetzner vorher löschen
git clone -b claude/eloquent-cori-d60cmk https://github.com/stibe881/pflanzfarm.ch.git .
```

Das Repository ist privat: Git fragt nach Benutzername (dein GitHub-Name) und Passwort. Als Passwort ein
**GitHub-Token** verwenden: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained token,
nur Repository `pflanzfarm.ch`, Berechtigung «Contents: Read-only».

## 3. Installieren

```
sh backend/deploy/install.sh
```

Beim ersten Lauf legt das Skript `backend/.env` an und stoppt. Datei öffnen und alle `ÄNDERN` ausfüllen:

```
nano backend/.env
```

- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` – aus Schritt 1
- `SITE_PASSWORD` – Passwort für die ganze Seite (das gibst du dem Kunden)
- `TEST_ADMIN_PASSWORD` – Passwort für `admin@pflanzfarm.test`

Speichern (Ctrl+O, Enter, Ctrl+X) und das Skript erneut starten:

```
sh backend/deploy/install.sh
```

Das Skript sucht automatisch die neueste PHP-Version auf dem Server (mindestens 8.2) und prüft die nötigen Erweiterungen.

## 4. Webverzeichnis auf `backend/public` zeigen lassen

Die Website muss aus dem Unterordner `backend/public` ausgeliefert werden – sonst wären Konfigurationsdateien
erreichbar.

**Variante A (empfohlen):** In konsoleH das Verzeichnis der Subdomain ändern auf
`/public_html/pflanzfarm/backend/public`.

**Variante B**, falls sich das Verzeichnis nicht ändern lässt: Im Ordner `~/public_html/pflanzfarm` eine Datei
`.htaccess` mit diesem Inhalt anlegen:

```
RewriteEngine On
RewriteRule ^(.*)$ backend/public/$1 [L]
```

## 5. Cronjob für Hintergrundaufgaben

In konsoleH unter «Cronjobs» einen Eintrag anlegen, der jede Minute (oder so oft wie möglich) läuft:

```
php ~/public_html/pflanzfarm/backend/artisan schedule:run
```

(Wie beim Skript ggf. `php83` statt `php`.) Er verschickt Newsletter-Mails aus der Warteschlange.

## 6. Testen

- `https://pflanzfarm.gross-ict.ch` öffnen → der Browser fragt nach dem Passwort (`SITE_PASSWORD`, Benutzername beliebig)
- Oben steht der gelbe Balken «Testumgebung»
- Admin: `https://pflanzfarm.gross-ict.ch/admin` mit `admin@pflanzfarm.test` und deinem `TEST_ADMIN_PASSWORD`

E-Mails werden in diesem Testbetrieb **nicht verschickt**, sondern in `backend/storage/logs/laravel.log` protokolliert.
Für echte Test-Mails in `backend/.env` `MAIL_MAILER=resend` und `RESEND_API_KEY=...` setzen
(Absender-Domain bei Resend verifizieren) und `sh backend/deploy/install.sh` erneut ausführen.

## Aktualisieren nach Änderungen

```
ssh BENUTZER@SERVER.your-server.de
cd ~/public_html/pflanzfarm
git pull
sh backend/deploy/install.sh
```

Datenbank und Uploads bleiben dabei erhalten.

## Später: Livegang auf pflanzfarm.ch

Für den echten Betrieb in `backend/.env` umstellen: `APP_ENV=production`, `APP_URL=https://pflanzfarm.ch`,
`PFLANZFARM_TEST_MODE=false`, `STRIPE_FAKE=false`, `SITE_PASSWORD=` (leer), Stripe- und Resend-Schlüssel eintragen,
eigene Datenbank ohne Testdaten. Details in [DEPLOY.md](DEPLOY.md).
