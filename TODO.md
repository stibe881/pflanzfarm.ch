# Prototyp-Umfang

- [x] **Frontend-Shop als realistische Vorschau:** Eine hochwertige Startseite mit Shop- und Gartenprojekt-Einstieg, Kategorien, Produktkarten, einer sichtbaren Referenzsektion und eigenständigen Pflanzen-/Projektbildern. Navigation, Shop-Suche, Filter, Produktdetail und Referenzarchiv müssen in der Browser-Vorschau bedienbar sein.

- [x] **Warenkorb und Produktinteraktion:** Produktvarianten, Mengenwahl und „In den Warenkorb“ aktualisieren Warenkorbzähler, Zwischensumme und Warenkorbansicht im Browser. Die Daten sind ausdrücklich Demo-Daten und lösen keine Zahlung aus.

- [x] **Admin-Backend als Betriebsansicht:** Ein eigener klickbarer Bereich zeigt Dashboard, Produkte, Bestellungen, Lager, Referenzen und Popup-Verwaltung mit schweizerischen CHF-Formaten, nachvollziehbaren Statuswerten und realistischen Beispieldaten.

- [x] **Popup im Backend steuerbar:** Im Admin können Titel, Text, CTA, Zielseite, Verzögerung, Häufigkeit sowie Start- und Enddatum bearbeitet und das Popup aktiviert/deaktiviert werden. Die Popup-Vorschau lässt sich selbst bei deaktivierter Kampagne gezielt im Frontend testen und schliessen.

- [x] **Originale Pflanzfarm-Assets und Bildoptimierung:** Header, Favicon und Projektmetadaten verwenden das Logo von pflanzfarm.ch. Das Hero-Bild entspricht der aktuellen Startseite; sichtbare Produkt- und Gartenmotive sind den dazugehörigen Artikeln bzw. Website-Motiven zugeordnet. Für Hero, Produkte und Referenzen werden grössenabhängige WebP-Varianten mit `srcset`, aussagekräftigen Alternativtexten und Lazy Loading für nachgelagerte Bilder ausgeliefert.

- [x] **Responsive und zugängliche Vorschau:** Die wichtigsten Bereiche funktionieren auf Desktop und Mobilansicht, haben sichtbare Fokuszustände und nutzen einen klaren Schliessen-Mechanismus für das Modal.

- [x] **Lauffähige Übergabe:** Vite-Entwicklungsserver, Routenmanifest und TypeScript-Build laufen fehlerfrei. Die Vorschau wird in Manus geöffnet, ohne Veröffentlichung oder Produktivdeployment.

- [x] **Designbereinigung der Startseite:** Keine Inter-, Geist-, Space-Grotesk- oder Instrument-Serif-Schriftstapel; lesbarer Fliesstext erfüllt mindestens WCAG AA auf seinen jeweiligen Hintergründen. Dekorative Verläufe werden entfernt, Kategoriekacheln zeigen echte Produkt- oder Baumschulbilder statt generischer Top-Icons und wiederholte, gesperrte Grossbuchstaben-Eyebrows über Abschnittsüberschriften entfallen.

- [x] **Newsletter-Redaktion und Resend-Vorbereitung:** Im Admin gibt es eine klickbare Newsletter-Ansicht mit festem Pflanzfarm-Layout und einer Live-Vorschau. Betreff, Preheader, Überschrift, Text, Bildquelle samt Alternativtext, CTA-Text, Ziel-URL und ein optionaler Zusatzblock sind bearbeitbar. Test- und Kampagnenversand dürfen im statischen Prototypen nicht fälschlich eine echte Zustellung behaupten. Die Planung beschreibt die spätere sichere Laravel-/Resend-Integration mit verifizierter Domain, serverseitigem API-Schlüssel, Zustellwebhooks, Einwilligung und Abmeldung.

- [x] **Über-uns-Seite:** Eine neue Route `/ueber-uns` vermittelt Gründung, Familienbetrieb und Pflanzenkompetenz auf Basis der bestehenden Pflanzfarm-Seite. Sie nutzt die vier Originalfotos von Thomas Steinmann, Susan Steinmann, Hans Steinmann und David Müller mit passenden Alternativtexten, stellt die Teamrollen dar und verlinkt funktionsfähig zu Shop und Referenzen.

- [x] **Social-Media-Verlinkungen:** WhatsApp, Instagram und Facebook sind im globalen Footer und auf der Über-uns-Seite als klar benannte externe Links mit den vorgegebenen Zieladressen eingebunden. Externe Links öffnen sicher in einem neuen Tab und erhalten aussagekräftige Labels.

- [x] **Kontrastkorrektur für Lesetext:** Alle Lesetexte im Frontend und Admin verwenden auf ihrem tatsächlichen Hintergrund mindestens WCAG-AA-Kontrast. Sekundäre Grautöne werden für lesbaren Fliesstext auf die dunkle Markenfarbe angehoben, ohne Layout, Bildmaterial oder Interaktionen zu verändern.

- [x] **Admin-Verwaltung der Kundschaft:** Ausschliesslich im Admin-Bereich steht eine durchsuchbare Personenliste bereit. Die Detailansicht zeigt Kontaktangaben, Kommunikationsstatus, Kennzahlen und Bestellhistorie. Kontakt-E-Mail, Telefonnummer und Adresse sind mit klarer Demo-Kennzeichnung bearbeitbar; für die spätere Laravel-/MySQL-Version ist der Zugriff auf `admin` begrenzt und die Speicherung geschützter Kundendaten vorgesehen.

- [x] **Datenschutz, Impressum und Consent:** Von jeder öffentlichen Seite sind Datenschutz, Impressum und Cookie-Einstellungen erreichbar. Die Datenschutzerklärung beschreibt nur tatsächlich genutzte Datenflüsse des Prototyps, deaktiviert optionale Analyse standardmässig und erfragt eine Wahl vor optionaler lokaler Speicherung. Das Impressum enthält die gesicherten Anbieter- und Kontaktangaben; fehlende rechtliche Unternehmensangaben bleiben bis zur Verifikation als Produktionsblocker dokumentiert.
- [x] **WCAG 2.2 AA-Härtung:** Die öffentliche Oberfläche erhält Sprunglink, sichtbare Tastaturfokusse, beschriftete Eingabeelemente, sinnvolle Landmarken, dynamische Seitentitel, Fokus nach virtuellen Seitenwechseln, reduzierte Bewegung, zugängliche Referenzkarten und bedienbare Consent-Dialoge mit Fokusmanagement. Die ausdrücklich als Demo bezeichnete Admin-Ansicht ist über den Footer erreichbar und wird nicht als Authentifizierung ausgegeben; der Produktivplan schreibt einen serverseitig geschützten `admin`-Zugang vor.

- [ ] **Produktivfreigabe für Datenschutz und WCAG:** Vor einem Live-Shop müssen Rechtsform sowie gegebenenfalls Handelsregister-/UID-/Mehrwertsteuerangaben, reale Hetzner-/Stripe-/Resend-Datenflüsse, Auftragsbearbeitungen, mögliche Auslandübermittlungen, Aufbewahrungsfristen und die endgültige Datenschutzinformation verbindlich geprüft werden. Der Laravel-Admin benötigt serverseitige Anmeldung, Rollen/Rechte, sichere Sitzungen, CSRF-Schutz, Audit-Protokollierung und echte Datenspeicherung ausserhalb des Browser-Bundles. Ein manueller WCAG-2.2-AA-Test mit Tastatur, Screenreader und realen Checkout-Formularen ist vor der Freigabe erforderlich.

- [x] **Admin-Bildmarke:** Die Seitenleiste der Verwaltung zeigt das originale Pflanzfarm-Logo als vollständig sichtbare, kontrastreiche Bildmarke statt eines unpassenden Platzhalters.

- [x] **GitHub-Quellcode-Übergabe:** Der interaktive, statische Prototyp liegt vollständig im öffentlichen Repository `stibe881/pflanzfarm.ch` auf `main`. Asset-URLs, interne Navigation und Direktaufrufe der öffentlichen Unterseiten sind für `/pflanzfarm.ch/` vorbereitet. Die Einrichtung und Auslösung von GitHub Pages erfolgt auf Benutzerwunsch manuell in GitHub. GitHub Pages stellt nur die Demo bereit; Laravel, MySQL, Stripe und Resend verbleiben für den späteren Serverbetrieb.

- [x] **GitHub-Pages-Fehlerbehebung:** Der fertig gebaute Vite-Output wird als eigenständiger Branch `gh-pages` bereitgestellt. Dieser Branch enthält nur statische Dateien aus `dist`, einschliesslich `.nojekyll` und dem SPA-Fallback `404.html`. Nach der Umstellung der GitHub-Pages-Quelle auf `gh-pages` / `/(root)` lädt `https://stibe881.github.io/pflanzfarm.ch/` ohne eine 404-Anfrage für `src/main.tsx`; direkte Aufrufe öffentlicher Unterseiten funktionieren ebenfalls.

- [x] **Footer-Navigation am Seitenanfang:** Jeder interne Link im Footer führt beim Seitenwechsel oder erneutem Aufruf derselben Seite sichtbar an den Seitenanfang. Die Korrektur gilt auch für GitHub Pages und darf die Zugänglichkeit des Fokusmanagements nicht beeinträchtigen.

- [x] **Footer-Link zur Verwaltung:** Der Footer enthält einen gut erkennbaren Link `Verwaltung (Demo)`, der zur Admin-Route führt. Der Link erhält eine eindeutige Beschriftung, funktioniert auf GitHub Pages und darf keine echte Anmeldung oder den Schutz realer Daten vortäuschen.
