{{-- Gemeinsame Gestaltung aller PDF-Dokumente (Rechnung, Gutschrift, Lieferschein, Rüstliste) --}}
    /* Farben und Schriften wie auf pflanzfarm.ch */
    @page { margin: 0; }
    body { margin: 0; font-family: "DejaVu Sans", sans-serif; font-size: 8.6pt; line-height: 1.5; color: #1f2523; }
    .page { padding: 14mm 18mm 0 20mm; }
    .serif { font-family: "DejaVu Serif", serif; }
    .muted { color: #6b7069; }
    .accent-bar { height: 3mm; background: #153c31; }
    .accent-bar span { display: block; height: 3mm; width: 38mm; background: #c98164; }

    table { border-collapse: collapse; }
    .head { width: 100%; }
    .head td { vertical-align: top; }
    .logo { height: 22mm; }
    .sender { text-align: right; font-size: 7.6pt; line-height: 1.55; color: #555b57; }
    .sender strong { font-size: 9.6pt; color: #153c31; }

    /* Adressfeld passend für Fensterkuverts (Fenster rechts) */
    .address-row { width: 100%; margin-top: 9mm; }
    .address-row td { vertical-align: top; }
    .sender-line { font-size: 6.4pt; color: #6b7069; border-bottom: 0.3pt solid #c9cfca; padding-bottom: 1mm; margin-bottom: 2mm; }
    .recipient { width: 85mm; font-size: 9.6pt; line-height: 1.5; color: #111; }

    h1 { font-family: "DejaVu Serif", serif; font-size: 22pt; font-weight: bold; margin: 11mm 0 1mm; letter-spacing: -0.3pt; color: #153c31; }
    .meta { width: 100%; margin: 4mm 0 7mm; border-top: 0.6pt solid #153c31; border-bottom: 0.6pt solid #d9ddd9; }
    .meta td { padding: 2.4mm 3.2mm; vertical-align: top; width: 25%; }
    .meta .label { display: block; font-size: 6.4pt; text-transform: uppercase; letter-spacing: 0.6pt; color: #6b7069; margin-bottom: 0.6mm; }
    .meta .value { font-weight: bold; color: #111; }

    .items { width: 100%; }
    .items th { background: #f1f3f0; color: #153c31; border-bottom: 0.8pt solid #153c31; font-size: 7pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; padding: 2.2mm 2.4mm; text-align: left; }
    .items td { padding: 2.6mm 2.4mm; border-bottom: 0.4pt solid #e3e6e3; vertical-align: top; color: #1f2523; }
    .items tr.alt td { background: #fafaf8; }
    .items .num { text-align: right; white-space: nowrap; }
    .items .product { font-weight: bold; color: #111; }

    .totals { width: 82mm; margin: 4mm 0 0 auto; }
    .totals td { padding: 1.6mm 2.4mm; }
    .totals .num { text-align: right; white-space: nowrap; }
    .totals .grand td { border-top: 1pt solid #153c31; color: #153c31; font-weight: bold; font-size: 11pt; padding: 2.8mm 2.4mm; }

    .terms { width: 100%; margin-top: 9mm; border-top: 0.5pt solid #c9cfca; }
    .terms td { padding: 1.5mm 0; vertical-align: top; }
    .terms .k { width: 34mm; color: #6b7069; }
    .terms .v { color: #1f2523; }
    .closing { margin-top: 8mm; color: #1f2523; line-height: 1.6; }

    .footer { position: absolute; left: 20mm; width: 172mm; font-size: 6.8pt; color: #6b7069; border-top: 0.5pt solid #c9cfca; padding-top: 2mm; }
    .footer td { vertical-align: top; padding-right: 6mm; }
    .footer-plain { bottom: 16mm; }
    .footer-qr { bottom: 110mm; }

