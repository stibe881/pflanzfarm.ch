@php
    $chf = fn (int $cents) => number_format($cents / 100, 2, '.', "'");
    $paid = $order->payment_status === 'bezahlt';
@endphp
<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
    @include('pdf.partials.style')
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
    @include('pdf.partials.letterhead')
    <h1>Rechnung</h1>

    <table class="meta">
        <tr>
            <td><span class="label">Rechnungsnummer</span><span class="value">{{ $order->number }}</span></td>
            <td><span class="label">Datum</span><span class="value">{{ $order->created_at->format('d.m.Y') }}</span></td>
            <td><span class="label">{{ $order->delivery_method === 'lieferung' ? 'Lieferung' : 'Abholung' }}</span><span class="value">{{ $order->scheduled_date ? $order->scheduled_date->format('d.m.Y') : ($order->delivery_method === 'lieferung' ? 'an Ihre Adresse' : 'in Ebersecken') }}</span></td>
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
                    <td class="product">{{ $item->product_name }}@if($item->discount_percent)<br><span class="muted" style="font-weight: normal">Mengenrabatt {{ $item->discount_percent }} % (statt {{ $chf($item->list_price) }})</span>@endif</td>
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
        @if($order->discount_total)
            <tr><td class="muted">davon Mengenrabatt</td><td class="num muted">−{{ $chf($order->discount_total) }}</td></tr>
        @endif
        <tr><td>{{ $order->delivery_method === 'lieferung' ? 'Lieferung' : 'Abholung' }}</td><td class="num">{{ $order->shipping ? $chf($order->shipping) : 'gratis' }}</td></tr>
        <tr class="grand"><td>Total CHF inkl. MWST</td><td class="num">{{ $chf($order->total) }}</td></tr>
    </table>

    <table class="terms">
        @if($paid)
            <tr><td class="k">Zahlung</td><td class="v">Erhalten am {{ ($order->paid_at ?? $order->created_at)->format('d.m.Y') }}, {{ $order->paymentMethodLabel() }}</td></tr>
        @elseif($order->payment_method === 'invoice')
            <tr><td class="k">Zahlbar bis</td><td class="v"><strong>{{ $dueDate->format('d.m.Y') }}</strong> ({{ $dueDays }} Tage netto)</td></tr>
            <tr><td class="k">Zahlungsart</td><td class="v">{{ $qrBill ? 'Einzahlung mit QR-Zahlteil (Seite 2)' : ($iban ? 'Überweisung auf IBAN '.$iban : 'Überweisung') }}</td></tr>
            <tr><td class="k">Vermerk</td><td class="v">{{ $order->number }}</td></tr>
        @elseif($order->payment_method === 'cash')
            <tr><td class="k">Zahlung</td><td class="v">Bar bei Abholung in Ebersecken</td></tr>
        @else
            <tr><td class="k">Zahlung</td><td class="v">{{ $order->paymentMethodLabel() }}, noch nicht bestätigt</td></tr>
        @endif
    </table>

    @if($order->note)
        <p class="muted" style="margin-top: 4mm">Ihre Bemerkung: {{ $order->note }}</p>
    @endif

    <div class="closing">Freundliche Grüsse<br>Pflanzfarm Steinmann</div>
</div>

@include('pdf.partials.footer')

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
