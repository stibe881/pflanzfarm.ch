# Testumgebung

Mit der Testumgebung lassen sich alle Funktionen ausprobieren, bevor die Seite für Kundinnen und Kunden online geht:
Shop, Kasse, Zahlung, Kundenkonto, Adminbereich, E-Mails und Newsletter. **Nichts davon ist echt** – Zahlungen sind
simuliert und alle E-Mails landen in einem Test-Postfach statt bei den Empfängern.

## Starten (auf dem eigenen Computer)

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installieren und starten.
2. Dieses Repository herunterladen (auf GitHub «Code → Download ZIP», Branch `claude/eloquent-cori-d60cmk`) und entpacken.
3. Im entpackten Ordner ein Terminal öffnen und ausführen:

   ```bash
   docker compose up -d --build
   ```

   Der erste Start dauert einige Minuten. Danach:

| Was | Adresse |
|---|---|
| Website | http://localhost:8080 |
| Adminbereich | http://localhost:8080/admin |
| Test-Postfach (alle E-Mails) | http://localhost:8025 |

Stoppen: `docker compose down`. Alles auf Anfang zurücksetzen (Datenbank leeren): `docker compose down -v`.

## Test-Zugänge

| Rolle | E-Mail | Passwort |
|---|---|---|
| Administrator | `admin@pflanzfarm.test` | `Pflanzfarm-Test-2026` |
| Team | `team@pflanzfarm.test` | `Pflanzfarm-Test-2026` |
| Kunde (mit 2 Beispielbestellungen) | `kunde@pflanzfarm.test` | `Kunde-Test-2026` |

Die Testdaten enthalten zusätzlich Beispielpreise für drei weitere Thuja-Grössen, Beispiel-Versandklassen (Photinia als «Paket» CHF 12, Thuja 120–140 cm als «Grosslieferung» CHF 120, Thuja 140–160 cm nur Abholung), eine Beispiel-IBAN für QR-Rechnungen,
drei Bestellungen in verschiedenen Zuständen und einen Newsletter-Abonnenten. Diese Daten gibt es nur in der Testumgebung.

## Was du testen kannst

- [ ] **Shop**: Produkte, Grössen mit unterschiedlichem Preis, Merkliste (Herz), Hecken-Rechner
- [ ] **Warenkorb** bleibt nach dem Neuladen erhalten
- [ ] **Versandkosten**: Photinia allein (CHF 12), dazu eine Thuja 120–140 cm (es zählt die teuerste Klasse: CHF 120), dazu Thuja 140–160 cm (nur Abholung möglich)
- [ ] **Kasse als Gast** mit Lieferung und Rechnung → Danke-Seite → Rechnung (PDF mit QR-Zahlteil) → E-Mails im Test-Postfach
- [ ] **Karte/TWINT**: Es erscheint eine Test-Zahlungsseite mit «Zahlung erfolgreich» oder «Zahlung abbrechen»
- [ ] **Barzahlung** bei Abholung
- [ ] **Kundenkonto**: registrieren → Bestätigungsmail im Test-Postfach öffnen → Link klicken; anmelden, Bestellungen ansehen,
      Angaben ändern, Passwort vergessen, Daten herunterladen, Konto löschen
- [ ] **Mengenrabatt**: Im Admin bei Thuja «ab 25 Stück 5 %, ab 50 Stück 10 %» eintragen → Produktseite, Warenkorb, Kasse, Rechnung
- [ ] **Wunschtermin** in der Kasse (Datum + Vormittag/Nachmittag) → erscheint im Admin und wird beim Bestätigen vorgeschlagen
- [ ] **Suche** (Lupe oben): z. B. «hecke», «immergrün», «giessen»
- [ ] **Ratgeber**: Übersicht → eigene Seite pro Artikel (`/ratgeber/thuja-hecke-pflanzen/`)
- [ ] **Storno im Konto**: neue Bestellung als Kundin → unter «Meine Bestellungen» stornieren (nur solange nicht bestätigt)
- [ ] **Kontaktformular** und **Newsletter** (Bestätigungsmail im Test-Postfach)
- [ ] **Admin**: Bestellung bestätigen / als geliefert markieren / stornieren (Mails prüfen), Produkt mit neuer Grösse anlegen,
      Lager ändern, Popup mit Zeitraum anlegen, Referenz und Ratgeber-Artikel bearbeiten, Öffnungszeiten und Lieferkosten
      unter «Einstellungen» ändern, Newsletter schreiben und senden, Kundendaten exportieren und löschen
- [ ] **Admin, neu**: «Bestellung erfassen» (Telefon/vor Ort, auch ohne E-Mail) · beim Bestätigen Liefertermin setzen ·
      Filter «Termin: heute/morgen» · «Rüstliste» (PDF mit Gesamtmengen für einen Tag) · unter «Mehr»: Lieferschein,
      Zahlungserinnerung, Gutschrift · Stornieren mit «Betrag erstatten» · mehrere Bilder pro Produkt (Galerie) ·
      Newsletter mit Bild und «Versand planen», danach Statistik · Dashboard-Grafiken · «Änderungsprotokoll»
- [ ] **Lager-Warnung**: Bestand einer Grösse unter die Warngrenze (Einstellungen, Standard 10) bestellen → E-Mail ans Team
- [ ] **Zahlungserinnerungen**: In den Einstellungen Abstand und Anzahl festlegen; manuell testen mit
      `docker compose exec app php artisan pflanzfarm:zahlungserinnerungen`

## Echte Stripe-Testzahlung (optional)

Statt der simulierten Zahlung kann auch Stripe im Testmodus verwendet werden (inkl. echter TWINT-Testseite):

1. Kostenloses Konto auf stripe.com, im Testmodus die Schlüssel kopieren.
2. Neben `docker-compose.yml` eine Datei `.env` anlegen:
   ```
   STRIPE_FAKE=false
   STRIPE_KEY=pk_test_...
   STRIPE_SECRET=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Den Webhook lokal weiterleiten mit der [Stripe CLI](https://docs.stripe.com/stripe-cli):
   `stripe listen --forward-to localhost:8080/stripe/webhook` (gibt das `whsec_…` aus).
4. `docker compose up -d` und mit der Testkarte `4242 4242 4242 4242` bezahlen.

## Testumgebung im Internet (für mehrere Personen)

Dieselbe Testumgebung läuft auch auf einem Server, z. B. unter `test.pflanzfarm.ch`. Dafür in der `.env` neben
`docker-compose.yml` setzen:

```
APP_URL=https://test.pflanzfarm.ch
APP_KEY=base64:...                 # eigener Schlüssel: php -r "echo 'base64:'.base64_encode(random_bytes(32));"
SANCTUM_STATEFUL_DOMAINS=test.pflanzfarm.ch
SITE_PASSWORD=ein-gemeinsames-passwort   # schützt die ganze Seite mit Passwort, Suchmaschinen bleiben draussen
MAILPIT_AUTH=test:ein-passwort           # schützt das Test-Postfach
TEST_ADMIN_PASSWORD=ein-eigenes-passwort
```

Davor einen Webserver mit HTTPS (z. B. Caddy oder nginx) auf Port 8080 bzw. 8025 weiterleiten.

## Dem Kunden zeigen (öffentliche Adresse über deinen Computer)

Damit der Kunde die Testumgebung über das Internet sieht, gibt es einen eingebauten Tunnel (Cloudflare, kostenlos,
ohne Konto). Er funktioniert, solange dein Computer läuft und Docker gestartet ist.

1. Neben `docker-compose.yml` eine Datei `.env` anlegen (oder ergänzen) mit einem Passwort für die ganze Seite:
   ```
   SITE_PASSWORD=Gartentest-2026
   ```
2. Starten:
   ```
   docker compose --profile demo up -d --build
   docker compose logs tunnel
   ```
3. Im Log steht eine Adresse wie `https://irgendwas.trycloudflare.com`. Diese Adresse und das Passwort dem Kunden
   schicken. Beim Öffnen fragt der Browser nach Benutzername und Passwort – der Benutzername ist beliebig.

Die Adresse ändert sich bei jedem Neustart des Tunnels. Beenden: `docker compose --profile demo down`.

Gut zu wissen:
- Der Kunde kann alles ausprobieren: Shop, Kasse (Zahlung simuliert), Konto, Kontaktformular. Für den Admin gibst du
  ihm die Test-Zugänge von oben.
- E-Mails landen weiterhin nur in deinem Test-Postfach (http://localhost:8025), nicht beim Kunden.
- Für eine dauerhafte Testadresse ohne laufenden Computer: siehe «Testumgebung im Internet» oben.
