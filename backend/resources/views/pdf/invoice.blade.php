@php
    $chf = fn (int $cents) => number_format($cents / 100, 2, '.', "'");
    $paid = $order->payment_status === 'bezahlt';
@endphp
<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
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

    .note { margin-top: 8mm; padding: 3.4mm 4mm; border-left: 1.2mm solid #c98164; background: #f7f5f0; color: #1f2523; }
    .note strong { display: block; margin-bottom: 0.8mm; color: #111; }
    .thanks { margin-top: 6mm; font-family: "DejaVu Serif", serif; font-size: 10.5pt; color: #153c31; }

    .footer { position: absolute; left: 20mm; width: 172mm; font-size: 6.8pt; color: #6b7069; border-top: 0.5pt solid #c9cfca; padding-top: 2mm; }
    .footer td { vertical-align: top; padding-right: 6mm; }
    .footer-plain { bottom: 16mm; }
    .footer-qr { bottom: 110mm; }

    /* Swiss-QR-Zahlteil auf Seite 2: 210 × 105 mm am unteren Rand, Masse gemäss SIX-Vorgabe */
    .qr-page { page-break-before: always; position: relative; height: 296mm; }
    .qr-intro { padding: 16mm 18mm 0 20mm; }
    .qr-intro h2 { font-family: "DejaVu Serif", serif; font-size: 15pt; margin: 6mm 0 2mm; color: #153c31; }
    .qr-bill { position: absolute; left: 0; bottom: 0; width: 210mm; height: 105mm; border-top: 0.5pt dashed #000; color: #000; font-family: "DejaVu Sans", sans-serif; }
    .qr-bill * { color: #000; }
    .qr-bill .abs { position: absolute; }
    .qr-receipt { left: 0; top: 0; width: 62mm; height: 105mm; border-right: 0.5pt dashed #000; }
    .qr-title { font-weight: bold; font-size: 11pt; }
    .qr-receipt .h { font-weight: bold; font-size: 6pt; line-height: 9pt; }
    .qr-receipt .t { font-size: 8pt; line-height: 9pt; margin-bottom: 9pt; }
    .qr-pay .h { font-weight: bold; font-size: 8pt; line-height: 11pt; }
    .qr-pay .t { font-size: 10pt; line-height: 11pt; margin-bottom: 11pt; }
    .qr-cut { font-size: 7pt; text-align: center; width: 210mm; left: 0; top: -4mm; }
</style>
</head>
<body>
<div class="accent-bar"><span></span></div>
<div class="page">
    <table class="head">
        <tr>
            <td><img src="{{ $logo }}" class="logo" alt="Pflanzfarm"></td>
            <td class="sender">
                <strong class="serif">Pflanzfarm Steinmann</strong><br>
                Thomas Steinmann · Untergretti 2 · 6245 Ebersecken<br>
                +41 79 336 14 95 · info@pflanzfarm.ch · pflanzfarm.ch
            </td>
        </tr>
    </table>

    <table class="address-row">
        <tr>
            <td></td>
            <td class="recipient">
                <div class="sender-line">Pflanzfarm Steinmann, Untergretti 2, 6245 Ebersecken</div>
                {{ $order->name }}<br>
                @if($order->street)
                    {{ $order->street }}<br>{{ $order->postal_code }} {{ $order->city }}
                @else
                    {{ $order->email }}
                @endif
            </td>
        </tr>
    </table>

    <h1>Rechnung</h1>
    <div class="muted">Vielen Dank für Ihre Bestellung bei der Pflanzfarm.</div>

    <table class="meta">
        <tr>
            <td><span class="label">Rechnungsnummer</span><span class="value">{{ $order->number }}</span></td>
            <td><span class="label">Datum</span><span class="value">{{ $order->created_at->format('d.m.Y') }}</span></td>
            <td><span class="label">{{ $order->delivery_method === 'lieferung' ? 'Lieferung' : 'Abholung' }}</span><span class="value">{{ $order->delivery_method === 'lieferung' ? 'an Ihre Adresse' : 'in Ebersecken' }}</span></td>
            <td><span class="label">Zahlung</span><span class="value">{{ $order->paymentMethodLabel() }}</span></td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 44%">Artikel</th>
                <th style="width: 22%">Grösse / Sorte</th>
                <th class="num" style="width: 10%">Menge</th>
                <th class="num" style="width: 12%">Preis</th>
                <th class="num" style="width: 12%">CHF</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $i => $item)
                <tr class="{{ $i % 2 ? 'alt' : '' }}">
                    <td class="product">{{ $item->product_name }}</td>
                    <td>{{ $item->variant_label }}</td>
                    <td class="num">{{ $item->quantity }}</td>
                    <td class="num">{{ $chf($item->unit_price) }}</td>
                    <td class="num">{{ $chf($item->line_total) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Zwischensumme</td><td class="num">{{ $chf($order->subtotal) }}</td></tr>
        <tr><td>{{ $order->delivery_method === 'lieferung' ? 'Lieferung' : 'Abholung' }}</td><td class="num">{{ $order->shipping ? $chf($order->shipping) : 'gratis' }}</td></tr>
        <tr class="grand"><td>Total CHF inkl. MWST</td><td class="num">{{ $chf($order->total) }}</td></tr>
    </table>

    <div class="note">
        @if($paid)
            <strong>Bezahlt – vielen Dank</strong>
            Betrag dankend erhalten am {{ ($order->paid_at ?? $order->created_at)->format('d.m.Y') }} ({{ $order->paymentMethodLabel() }}).
        @elseif($order->payment_method === 'invoice')
            <strong>Zahlbar bis {{ $dueDate->format('d.m.Y') }}</strong>
            Bitte überweisen Sie den Betrag innert {{ $dueDays }} Tagen{{ $qrBill ? ' mit dem QR-Zahlteil auf Seite 2' : ($iban ? ' auf IBAN '.$iban : '') }}, Vermerk «{{ $order->number }}».
        @elseif($order->payment_method === 'cash')
            <strong>Barzahlung bei Abholung</strong>
            Bitte bezahlen Sie den Betrag bei der Abholung in Ebersecken.
        @else
            <strong>Zahlung ausstehend</strong>
            Die Zahlung mit {{ $order->paymentMethodLabel() }} ist noch nicht bestätigt.
        @endif
    </div>

    @if($order->note)
        <p class="muted" style="margin-top: 4mm">Ihre Bemerkung: {{ $order->note }}</p>
    @endif

    <div class="thanks">Wir wünschen Ihnen viel Freude mit Ihren Pflanzen.</div>
</div>

<table class="footer footer-plain">
    <tr>
        <td><strong>Pflanzfarm Steinmann</strong><br>Untergretti 2, 6245 Ebersecken</td>
        <td>+41 79 336 14 95<br>info@pflanzfarm.ch · pflanzfarm.ch</td>
        <td>@if($iban)IBAN {{ $iban }}<br>@endif @if($vat)MWST-Nr. {{ $vat }}@endif</td>
    </tr>
</table>

@if($qrBill)
<div class="qr-page">
    <div class="accent-bar"><span></span></div>
    <div class="qr-intro">
        <img src="{{ $logo }}" style="height: 15mm" alt="Pflanzfarm">
        <h2>Zahlteil zu Rechnung {{ $order->number }}</h2>
        <div class="muted">Bitte bezahlen Sie mit dem QR-Code in Ihrer Banking-App oder am Postschalter bis {{ $dueDate->format('d.m.Y') }}. Betrag: CHF {{ $chf($order->total) }}.</div>
    </div>

    <div class="qr-bill">
        <div class="abs qr-cut">Vor der Einzahlung abzutrennen</div>
        {{-- Empfangsschein --}}
        <div class="abs qr-receipt">
            <div class="abs qr-title" style="left: 5mm; top: 5mm">Empfangsschein</div>
            <div class="abs" style="left: 5mm; top: 12mm; width: 52mm">
                <div class="h">Konto / Zahlbar an</div>
                <div class="t">{{ $qrBill['account'] }}<br>{!! implode('<br>', array_map('e', $qrBill['creditor'])) !!}</div>
                @if($qrBill['reference'])
                    <div class="h">Referenz</div>
                    <div class="t">{{ $qrBill['reference'] }}</div>
                @endif
                <div class="h">Zahlbar durch</div>
                <div class="t">{!! $qrBill['debtor'] ? implode('<br>', array_map('e', $qrBill['debtor'])) : '&nbsp;' !!}</div>
            </div>
            <div class="abs" style="left: 5mm; top: 68mm; width: 52mm">
                <table style="width: 100%"><tr>
                    <td style="width: 14mm; padding: 0"><div class="h">Währung</div><div class="t" style="margin: 0">CHF</div></td>
                    <td style="padding: 0"><div class="h">Betrag</div><div class="t" style="margin: 0">{{ $qrBill['amount'] }}</div></td>
                </tr></table>
            </div>
            <div class="abs h" style="right: 5mm; top: 82mm; font-weight: bold; font-size: 6pt">Annahmestelle</div>
        </div>

        {{-- Zahlteil --}}
        <div class="abs qr-pay" style="left: 62mm; top: 0; width: 148mm; height: 105mm">
            <div class="abs qr-title" style="left: 5mm; top: 5mm">Zahlteil</div>
            <img class="abs" src="{{ $qrBill['qr'] }}" style="left: 5mm; top: 17mm; width: 46mm; height: 46mm">
            <div class="abs" style="left: 5mm; top: 68mm; width: 46mm">
                <table style="width: 100%"><tr>
                    <td style="width: 16mm; padding: 0"><div class="h">Währung</div><div class="t" style="margin: 0">CHF</div></td>
                    <td style="padding: 0"><div class="h">Betrag</div><div class="t" style="margin: 0">{{ $qrBill['amount'] }}</div></td>
                </tr></table>
            </div>
            <div class="abs" style="left: 56mm; top: 5mm; width: 87mm">
                <div class="h">Konto / Zahlbar an</div>
                <div class="t">{{ $qrBill['account'] }}<br>{!! implode('<br>', array_map('e', $qrBill['creditor'])) !!}</div>
                @if($qrBill['reference'])
                    <div class="h">Referenz</div>
                    <div class="t">{{ $qrBill['reference'] }}</div>
                @endif
                <div class="h">Zusätzliche Informationen</div>
                <div class="t">{{ $qrBill['info'] }}</div>
                <div class="h">Zahlbar durch</div>
                <div class="t">{!! $qrBill['debtor'] ? implode('<br>', array_map('e', $qrBill['debtor'])) : '&nbsp;' !!}</div>
            </div>
        </div>
    </div>
</div>
@endif
</body>
</html>
