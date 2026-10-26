# Testbetrieb auf Hetzner-Webhosting (pflanzfarm.gross-ict.ch)

Diese Anleitung bringt die Testversion auf `https://pflanzfarm.gross-ict.ch` – mit Passwortschutz, gelbem Hinweis
«Testumgebung», simulierter Zahlung und ohne E-Mail-Versand. Zeitaufwand: ca. 30 Minuten.

## 1. Vorbereitung in konsoleH

1. **PHP-Version**: Für die Subdomain PHP **8.5** einstellen (Einstellungen → PHP-Konfiguration).
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
- `SITE_PASSWORD` – optional: Passwort für die ganze Seite. Leer lassen = keine Passwortabfrage (Google nimmt die Testseite dank Testmodus trotzdem nicht auf)
- `TEST_ADMIN_PASSWORD` – Passwort für `admin@pflanzfarm.test`

Speichern (Ctrl+O, Enter, Ctrl+X) und das Skript erneut starten:

```
sh backend/deploy/install.sh
```

Das Skript sucht automatisch PHP 8.5 auf dem Server (z. B. `php85` oder `php8.5`) und prüft die nötigen Erweiterungen. Findet es keine, zeigt es die vorhandenen PHP-Programme an; dann z. B. `PHP=/usr/bin/php85 sh backend/deploy/install.sh`. Dieselbe PHP-Version auch im Cronjob verwenden.

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

(Wie beim Skript ggf. die PHP-8.5-Variante, z. B. `php85` statt `php`.) Er verschickt Newsletter-Mails aus der Warteschlange, startet geplante Newsletter und verschickt werktags um 8.30 Uhr fällige Zahlungserinnerungen.

## 6. Testen

- `https://pflanzfarm.gross-ict.ch` öffnen (nur falls `SITE_PASSWORD` gesetzt ist, fragt der Browser nach dem Passwort, Benutzername beliebig)
- Oben steht der gelbe Balken «Testumgebung»
- Admin: `https://pflanzfarm.gross-ict.ch/admin` mit `admin@pflanzfarm.test` und deinem `TEST_ADMIN_PASSWORD`

Solange Resend und Stripe nicht eingerichtet sind, werden E-Mails nur in `backend/storage/logs/laravel.log`
protokolliert und Zahlungen mit Karte/TWINT simuliert. Einrichten: siehe Abschnitt 7.

## 7. E-Mail (Resend) und Zahlung (Stripe) einrichten

Alles läuft über einen geführten Befehl, der die Schlüssel abfragt, in `backend/.env` schreibt,
die Webhooks automatisch anlegt und am Schluss alles prüft:

```
cd ~/public_html/pflanzfarm
sh backend/deploy/artisan.sh pflanzfarm:einrichten
```

**Vorbereitung bei Resend** (resend.com, kostenlos bis 3000 Mails/Monat)
1. Konto anlegen, unter *API Keys* einen Schlüssel mit **Full access** erstellen (beginnt mit `re_`).
2. Absender-Domain: Am besten gleich **pflanzfarm.ch** verwenden (Absender z. B. `shop@pflanzfarm.ch`) –
   dann bleibt beim späteren Domainwechsel alles gleich. Der Befehl legt die Domain bei Resend an und zeigt
   die DNS-Einträge (TXT/MX für `send.pflanzfarm.ch` und `resend._domainkey.pflanzfarm.ch`). Diese beim
   Domain-Anbieter von pflanzfarm.ch eintragen; die bestehende Website und Postfächer sind davon nicht betroffen.
   Hast du (noch) keinen Zugriff auf die DNS von pflanzfarm.ch, für den Test eine eigene Domain nehmen,
   z. B. `shop@gross-ict.ch`.
3. Auf der Testseite kann der Befehl alle Mails an **eine** Adresse umleiten (`MAIL_REDIRECT_TO`) –
   praktisch, damit beim Testen keine Mails an fremde Adressen gehen.

**Vorbereitung bei Stripe** (stripe.com)
1. Konto anlegen (Land Schweiz, Währung CHF). Für die Testseite oben rechts auf **Testmodus** schalten.
2. *Entwickler → API-Schlüssel*: den **Geheimschlüssel** `sk_test_…` kopieren (auf der Testseite sind
   Live-Schlüssel gesperrt).
3. *Einstellungen → Zahlungsmethoden*: **TWINT** aktivieren. Ist TWINT nicht aktiv, bietet der Shop
   automatisch nur Karte an.
4. Den Webhook musst du **nicht** selbst anlegen – das macht der Befehl.

**Prüfen** jederzeit mit
```
sh backend/deploy/artisan.sh pflanzfarm:status --testmail=deine@adresse.ch
```
oder im Admin unter *Verwaltung → Systemstatus* (mit Knopf «Test-E-Mail senden»).

**Testzahlung:** Kreditkarte `4242 4242 4242 4242`, beliebiges künftiges Ablaufdatum, beliebige CVC.
TWINT erscheint im Testmodus als Testseite mit «Autorisieren / Ablehnen». Bezahlte Testbestellungen
sieht man im Stripe-Dashboard (Testmodus) und im Admin als «bezahlt»; Stornieren mit «Betrag erstatten»
bucht die Testzahlung zurück.

Ein Sicherheitsnetz gleicht offene Zahlungen alle 15 Minuten mit Stripe ab (z. B. falls ein Webhook ausbleibt);
dafür muss der Cronjob aus Abschnitt 5 laufen.

## Aktualisieren nach Änderungen

```
ssh BENUTZER@SERVER.your-server.de
cd ~/public_html/pflanzfarm
git pull
sh backend/deploy/install.sh
```

Datenbank und Uploads bleiben dabei erhalten.

## Später: Livegang auf pflanzfarm.ch

1. In konsoleH die Domain **pflanzfarm.ch** (und www.pflanzfarm.ch) auf den Ordner `public_html/pflanzfarm/backend/public`
   zeigen lassen und das SSL-Zertifikat (Let's Encrypt) aktivieren.
2. Testdaten entfernen (Testbestellungen, Testkunden, Konten mit @pflanzfarm.test – Produkte, Bilder, Texte und
   Einstellungen bleiben):
   ```
   sh backend/deploy/artisan.sh pflanzfarm:testdaten-entfernen
   ```
   Vorher ein echtes Admin-Konto anlegen: `sh backend/deploy/artisan.sh pflanzfarm:team-user name@pflanzfarm.ch "Vorname Name" --role=admin`
3. Domain umstellen und Testbetrieb beenden (gelber Balken weg, Google darf indexieren, echte Zahlungen):
   ```
   sh backend/deploy/artisan.sh pflanzfarm:domain pflanzfarm.ch --live
   ```
4. Stripe auf **Live** umstellen (im Dashboard den Testmodus ausschalten, Konto vollständig verifizieren,
   Live-Schlüssel `sk_live_…`) und Webhooks für die neue Domain anlegen:
   ```
   sh backend/deploy/artisan.sh pflanzfarm:einrichten
   ```
   Resend bleibt gleich, wenn schon die Domain pflanzfarm.ch verwendet wird. Absender-Name ohne «(Test)» setzen.
5. `sh backend/deploy/install.sh` und zum Schluss `pflanzfarm:status` – alles sollte grün sein.
6. Die alte Testadresse pflanzfarm.gross-ict.ch in konsoleH entfernen oder auf pflanzfarm.ch weiterleiten.
