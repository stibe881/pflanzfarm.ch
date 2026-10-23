# Pflanzfarm – Interaktiver Shop- und Admin-Prototyp

## Ziel und Abgrenzung

Der Prototyp demonstriert das Kundenerlebnis eines neuen Pflanzfarm-Shops und die zentralen Verwaltungsbereiche als klickbare Webanwendung. Er zeigt Navigation, Produktentdeckung, Warenkorb, Referenzen, Website-Popup und Newsletter-Redaktion in realistischen Abläufen. Produkte, Kennzahlen und Empfängerdaten sind Demo-Daten im Browser. MySQL, Laravel, Stripe, Benutzerkonten, E-Mail-Versand und ein echter Checkout sind noch nicht Teil dieser statischen Vorschau.

## Umsetzung

Die Vorschau ist eine statische React-/TypeScript-Anwendung mit Vite. React State bildet Warenkorb, Filter, Navigation, Admin-Bereiche, Popup-Konfiguration und Newsletter-Entwürfe nach. Ein späterer Laravel-Aufbau auf dem Hetzner-Webhosting ersetzt diesen Browserzustand durch Datenbankmodelle, serverseitige Aktionen und Rollen.

Das Logo, Favicon, Hero- sowie sichtbare Produkt- und Gartenbilder stammen auf ausdrücklichen Wunsch aus den öffentlich eingebundenen Originalassets von pflanzfarm.ch. Lokale Originaldateien dienen als Fallback; responsive WebP-Varianten werden per `srcset` ausgeliefert.

## Gestaltung

Die Gestaltung verbindet tiefes Tannengrün, Creme, Salbei und einen zurückhaltenden Terrakotta-Akzent. Fliesstext verwendet einen plattformnahen Systemschriftstapel. Überschriften verwenden eine klassische Buchschrift aus `Iowan Old Style`, Baskerville und Palatino. Lesetexte sind auf ihren jeweiligen Hintergründen kontraststark nach WCAG AA gestaltet.

Die Oberfläche arbeitet mit klaren Flächen, echten Pflanzen- und Gartenbildern sowie einer ruhigen, redaktionellen Hierarchie. Dekorative Verläufe und wiederholte Grossbuchstaben-Eyebrows entfallen. Sortimentsbereiche zeigen echte Bildinhalte statt generischer Icon-Kacheln.

## Klickbare Bereiche

Das Frontend umfasst Startseite, Shop, Produktdetail, Warenkorb und Referenzarchiv. Navigation, Kategorie- und Merkmalsfilter, Produktsuche, Variantenwahl, Mengensteuerung und Warenkorb sind bedienbar.

Der Admin-Bereich umfasst Übersicht, Produkte, Bestellungen, Lager, Referenzen, Website-Popup und Newsletter. Das Popup kann Titel, Text, CTA, Zielseite, Verzögerung, Häufigkeit, Start- und Enddatum steuern und sich im Frontend testen lassen.

Die Newsletter-Redaktion hält das Markendesign fest: Logo, Farben, Struktur und Fussbereich sind vorgegeben. Bearbeitbar sind Betreff, Preheader, Überschrift, Textblöcke, Bildquelle inklusive Alternativtext, CTA-Text und Ziel-URL sowie ein optionaler Zusatzblock. Ein Live-Preview zeigt die E-Mail in der bekannten Pflanzfarm-Gestaltung. Die Schaltflächen für Test- und Kampagnenversand sind im Prototypen eindeutig als Demo markiert und versenden nichts.

## Resend in der Laravel-Produktivphase

Der spätere Versand läuft ausschliesslich über eine serverseitige Laravel-Aktion auf Hetzner. Der Resend-API-Schlüssel wird als `RESEND_API_KEY` ausserhalb des Git-Repositories und nie im Browser gespeichert. Resend verlangt eine verifizierte Absenderdomain und einen API-Schlüssel, bevor E-Mails versendet werden können. Der Versand-Endpunkt unterstützt Absender, Empfangende, Betreff, HTML, Text-Fallback, Anhänge, Tags und einen Idempotenzschlüssel. Quellen: [Resend Einführung](https://resend.com/docs/introduction) und [E-Mail-Versand](https://resend.com/docs/api-reference/emails/send-email).

Laravel speichert Newsletter-Entwürfe, Inhaltsblöcke, Kampagnen, Einwilligungen, Abmeldungen und Versandereignisse in MySQL. Versandaufträge gehen in eine Queue und erhalten eindeutige Idempotenzschlüssel. Webhooks werden signaturgeprüft entgegengenommen, protokollieren Zustellung, Öffnung, Klick, Bounce und Beschwerden und unterdrücken betroffene Adressen. Für Marketing-E-Mails enthält jedes Template einen klaren Abmeldelink und die zugrunde liegende Einwilligung wird dokumentiert. Resend beschreibt dafür Webhooks und die Abmeldeunterstützung in der [Webhook-Dokumentation](https://resend.com/docs/webhooks/introduction) und den [Abmeldehinweisen](https://resend.com/docs/knowledge-base/should-i-add-an-unsubscribe-link).

## Struktur

- `src/main.tsx`: React-Einstieg, UI-Zustände und klickbare Admin- und Shop-Ansichten
- `src/styles.css`: Designsystem, responsive Layouts, Shop und Admin
- `public/assets/`: Originalassets der bestehenden Website und responsive WebP-Varianten
- `public/manus-routes.json`: Routenmanifest für die Vorschau
- `research/resend-notes.md`: Quellenbasis für die spätere Resend-Anbindung
- `TODO.md`: Ergebnisorientierte Projektaufgaben

## Materiale Grenzen

Die Vorschau enthält keine echten Empfänger*innen, keine Zustellungen und keine Zugangsdaten. Vor dem Produktivversand müssen Absenderdomain, Resend-API-Schlüssel, Abmeldefluss, Einwilligungsverwaltung, Datenschutztexte und Webhook-Endpunkt in Laravel eingerichtet und geprüft werden.

## Über uns

Die neue Über-uns-Seite übernimmt die faktische Grundlage der bestehenden Pflanzfarm-Seite: Gründung durch Thomas Steinmann im Jahr 2020, Familienbetrieb, Pflanzenangebot für Privatpersonen und Unternehmen in der ganzen Schweiz sowie Kompetenz aus Garten- und Landschaftsbau. Die Seite verwendet die vier öffentlich eingebundenen Originalfotos von Thomas Steinmann, Susan Steinmann, Hans Steinmann und David Müller. Eine ruhige, eigenständige Seitenstruktur verbindet einen persönlichen Einstieg, den Betriebsabschnitt, fachliche Schwerpunkte, die Teamvorstellung und einen klaren Einstieg in Shop oder Gartenprojekt. Teamrollen werden sachlich und ohne unnötige geschlechtsspezifische Formulierungen dargestellt.

## Verwaltung der Kundschaft

Die Admin-Ansicht erhält einen ausschliesslich innerhalb des Verwaltungsbereichs sichtbaren Bereich für die Kundschaft. Eine durchsuchbare Liste öffnet pro Person eine Detailansicht mit Kontaktangaben, Kommunikationsstatus, Kennzahlen und vollständiger Bestellhistorie. Kontakt-E-Mail, Telefonnummer und Adresse lassen sich im Prototypen bearbeiten; alle Werte sind lokale Demo-Daten und werden nicht persistent gespeichert. In der Laravel-/MySQL-Produktivphase liegen diese Daten in geschützten Kunden-, Adress- und Bestelltabellen. Der Zugriff wird serverseitig auf die Rolle `admin` begrenzt und bearbeitende Aktionen werden nachvollziehbar protokolliert.

## Datenschutz, Impressum und Barrierefreiheit

Die öffentliche Website erhält eigene Routen für Datenschutz, Impressum und Barrierefreiheit, die im Footer von jeder Seite erreichbar sind. Nicht notwendige Plattform-Analyse wird deaktiviert. Eine zugängliche Consent-Ansicht speichert ausschliesslich die Wahl zur optionalen Funktionsspeicherung; solange keine Einwilligung vorliegt, setzt die Popup-Frequenz keine dauerhaften Browser-Speicherwerte. Externe soziale Netzwerke werden weiterhin nur durch einen Klick geöffnet und nicht als Tracking-Plugin eingebunden.

Die Datenschutzerklärung dokumentiert den tatsächlichen Stand des Prototyps und die vorgesehenen Datenflüsse des Live-Shops getrennt: Laravel/MySQL bei Hetzner für Bestellungen und Kundenkonten, Stripe für Zahlungen sowie Resend für Newsletter. Vor Produktivstart wird sie mit Auftragsbearbeitungsverträgen, Speicherfristen, Empfängerstaaten, Rechtsgrundlagen und den tatsächlich aktivierten Dienstleistern abgeglichen. Der statische Prototyp besitzt keine echte Authentifizierung; der spätere Laravel-Adminbereich wird serverseitig auf `admin` begrenzt, protokolliert Zugriffe und verwendet sichere Sitzungen.

Die WCAG-2.2-AA-Härtung umfasst Sprunglink, Landmarken, gut sichtbaren Fokus, native Formlabels, dialogfähige Consent-Bedienung, reduzierte Bewegung, ausreichende Zielgrössen und eine Barrierefreiheitserklärung. Ein automatisierter Check und ein manueller Tastatur- und Screenreader-Test sind vor der Live-Schaltung erforderlich. Vollständige Rechtssicherheit kann erst nach Bereitstellung der verantwortlichen Person, Rechtsform, Handelsregister-/UID-Angaben falls vorhanden, konkreten Aufbewahrungsfristen und abgeschlossenen Dienstleisterverträgen bestätigt werden.

Im Prototypen sind zusätzlich dynamische Seitentitel, Fokus nach dem virtuellen Seitenwechsel, zugängliche Namen für Suche und Mengeneingaben, fokusverwaltete Dialoge, eine versionierte lokale Consent-Wahl und semantisch tastaturbedienbare Referenzkarten umgesetzt. Die Admin-Demo ist auf ausdrücklichen Wunsch über einen klar bezeichneten Footer-Link erreichbar; sie bleibt jedoch bis zur Laravel-Phase ausdrücklich keine Zugangskontrolle und darf nie reale Kundendaten als Client-Bundle ausliefern.

## GitHub Pages

Der interaktive Prototyp wird zusätzlich im öffentlichen Repository `stibe881/pflanzfarm.ch` bereitgestellt. Die über `pnpm-lock.yaml` fixierten Abhängigkeiten und der Befehl `pnpm build:github-pages` erzeugen den auslieferbaren `dist`-Ordner. Da der automatisch angelegte GitHub-Pages-Workflow keinen Vite-Build durchführt, wird der geprüfte `dist`-Ordner zusätzlich in den statischen Branch `gh-pages` übertragen. GitHub Pages muss in den Repository-Einstellungen auf den Branch `gh-pages` und den Ordner `/(root)` zeigen.

Der Produktionsbuild erhält für GitHub Pages die Repository-Basis `/pflanzfarm.ch/`; die lokale Manus-Vorschau bleibt unverändert unter `/` lauffähig. Ein eigener `404.html`-Fallback führt Direktaufrufe wie `/pflanzfarm.ch/produkt/thuja-smaragd` zurück in die Single-Page-Anwendung. Die interne Navigation behält den Repository-Präfix bei. Bei späteren Änderungen wird zuerst `pnpm build:github-pages` auf `main` ausgeführt und danach der neue `dist`-Inhalt nach `gh-pages` übertragen. GitHub Pages liefert ausschliesslich diese statische Demo aus und ersetzt weder den späteren Laravel-/MySQL-Backendbetrieb noch Stripe- oder Resend-Serverlogik.

### Newsletter-Bildblock

Die Redaktion enthält eine zugängliche Dropzone für JPG-, PNG- und WebP-Dateien bis 5 MB sowie eine Dateiauswahl, eine direkte Vorschau, eine Auswahl vorhandener Pflanzenmotive und einen editierbaren Alternativtext. Im statischen Prototyp werden neue Dateien nur als lokale Browser-Vorschau verarbeitet und nicht versendet oder gespeichert. In der Laravel-Produktionsphase werden Uploads serverseitig nach Dateityp, Grösse und Zugriff geprüft, in einem nicht öffentlichen Speicher abgelegt und erst danach als Resend-kompatible E-Mail-Medien verwendet.

## Dynamischere Bedienung

Die statische Vorschau wird zu einer reaktionsfreudigeren Oberfläche ausgebaut, ohne den ruhigen, fachlich geprägten Charakter der Pflanzfarm zu verlieren. Auf allen öffentlichen und administrativen Ansichten erhalten Inhaltsbereiche eine einmalige, kurze Einblendung beim Erreichen des Sichtbereichs. Der Header reagiert auf die Scrollposition; beim Navigieren erscheinen Ansichten sanft und die Seite bleibt am Seitenanfang. Diese Bewegungen sind funktional – sie zeigen Orientierung, Hierarchie und Zustandswechsel – statt dauerhaft dekorativ zu laufen.

Im Shop werden Ergebniszahl, Sortierung, Filter und aktive Auswahl unmittelbar sichtbar aktualisiert. Produktkarten erhalten einen zugänglichen Merken-Schalter; das Hinzufügen in den Warenkorb löst eine klare Rückmeldung und eine kurze Zähleranimation aus. Die Produktdetailseite erhält aufklappbare, inhaltlich echte Bereiche für Pflanzanleitung, Lieferung und Pflege. Das Referenzarchiv wird nach Projektart filterbar. Die Newsletter-Anmeldung validiert im Prototypen die E-Mail-Adresse und zeigt nach erfolgreicher Demo-Anmeldung einen beständigen Bestätigungszustand.

Auch die Verwaltungsdemo erhält die gleiche Reaktionsqualität: Kennzahlen und Diagrammbalken bauen sich beim Anzeigen auf, die Bereichsnavigation erhält sichtbare Zustandswechsel und Inhaltskarten werden gestaffelt eingeblendet. Alle Animationen beachten `prefers-reduced-motion`; in diesem Modus bleiben Inhalte ohne Verzögerung vollständig sichtbar und die Bedienung unverändert. Die neue Bewegung verwendet weder automatische Datenübermittlung noch zusätzliche Tracker und verändert keine Datenschutz- oder Backend-Abgrenzung.

## Hero-Video mit Mitarbeitenden

Der bestätigte Hero-Clip mit drei anonymen Mitarbeitenden wird als stummer, 720p-H.264-Hintergrund für die Desktop-Startseite eingesetzt. Er wird vor der Auslieferung als kurzer, nahtloser Rücklauf-Loop kodiert: Die Kamera bewegt sich in der zweiten Clip-Hälfte auf ihrer eigenen Bahn sanft zurück zum exakten Startbild. Dadurch beginnt die nächste Wiedergabe ohne harten Sprung oder sichtbare Doppelbelichtung. Die Quelldatei bleibt im Ordner `video-proposals/` unverändert erhalten; die komprimierte Webfassung liegt in `public/assets/`.

Das Hero verwendet ein modernes `video`-Element mit `autoplay`, `muted`, `loop`, `playsInline` und `preload="metadata"`; es enthält keine Tonspur und keine Steuerung. Das Video wird auf Desktop und Mobilgeräten wiedergegeben. Ein aus dem Video abgeleitetes Poster wird als AVIF- und WebP-Variante in 768 px und 1280 px erzeugt und im statischen Bild-Fallback mittels `picture` und `srcset` ausgeliefert. Nur bei `prefers-reduced-motion: reduce` wird das Video gar nicht gerendert und die responsive Bildversion bleibt sichtbar. Die Textüberlagerung, der bestehende Kontrast-Schatten und die Hero-Bedienung bleiben unverändert.
