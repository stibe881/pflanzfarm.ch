@php($chf = fn (int $cents) => number_format($cents / 100, 2, '.', "'"))
<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
    @include('pdf.partials.style')
</style>
</head>
<body>
<div class="accent-bar"><span></span></div>
<div class="page">
    @include('pdf.partials.letterhead')

    <h1>Gutschrift</h1>
    <table class="meta">
        <tr>
            <td><span class="label">Gutschrift-Nr.</span><span class="value">G-{{ $order->number }}</span></td>
            <td><span class="label">Datum</span><span class="value">{{ ($order->refunded_at ?? now())->format('d.m.Y') }}</span></td>
            <td><span class="label">Zu Rechnung</span><span class="value">{{ $order->number }} vom {{ $order->created_at->format('d.m.Y') }}</span></td>
            <td><span class="label">Grund</span><span class="value">Stornierung</span></td>
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
                    <td class="num">−{{ $chf($item->line_total) }}</td>
                </tr>
            @endforeach
            @foreach($order->summaryLines() as [$label, $amount])
                @if($amount)
                    <tr><td colspan="4">{{ $label }}</td><td class="num">{{ $amount > 0 ? '−' : '' }}{{ $chf(abs($amount)) }}</td></tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr class="grand"><td>Gutschrift CHF inkl. MWST</td><td class="num">−{{ $chf($order->refund_amount ?: $order->total) }}</td></tr>
    </table>

    <table class="terms">
        <tr>
            <td class="k">Rückzahlung</td>
            <td class="v">
                @if($order->payment_method === 'stripe')
                    Der Betrag wird auf das ursprüngliche Zahlungsmittel ({{ $order->paymentMethodLabel() }}) zurückerstattet. Je nach Bank dauert die Gutschrift 5–10 Arbeitstage.
                @else
                    Wir überweisen den Betrag auf Ihr Konto. Bitte teilen Sie uns dafür Ihre IBAN mit, falls wir sie noch nicht haben.
                @endif
            </td>
        </tr>
    </table>

    <div class="closing">Freundliche Grüsse<br>Pflanzfarm Steinmann</div>
</div>
@include('pdf.partials.footer')
</body>
</html>
