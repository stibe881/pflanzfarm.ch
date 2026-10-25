@php($chf = fn (int $cents) => number_format($cents / 100, 2, '.', "'"))
<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
    @include('pdf.partials.style')
    .check { width: 9mm; text-align: center; }
    .box { display: inline-block; width: 3.6mm; height: 3.6mm; border: 0.6pt solid #555; }
    .sign { width: 100%; margin-top: 16mm; }
    .sign td { width: 50%; padding-right: 10mm; vertical-align: bottom; }
    .sign .line { border-top: 0.5pt solid #555; padding-top: 1.5mm; color: #6b7069; font-size: 7.4pt; }
</style>
</head>
<body>
@foreach($orders as $order)
{{-- jede Seite eigener Rahmen, damit Fusszeile und QR-Code (absolut positioniert) auf der richtigen Seite landen --}}
<div style="position: relative; height: 296mm; overflow: hidden;{{ $loop->last ? '' : ' page-break-after: always;' }}">
<div class="accent-bar"><span></span></div>
<div class="page">
    @include('pdf.partials.letterhead')

    @if(! empty($qr[$order->id]))
        <img src="{{ $qr[$order->id] }}" alt="" style="position: absolute; right: 18mm; top: 62mm; width: 20mm; height: 20mm">
        <div style="position: absolute; right: 14mm; top: 83mm; width: 28mm; text-align: center; font-size: 5.6pt; color: #6b7069">Im Admin öffnen</div>
    @endif
    <h1>{{ $order->delivery_method === 'lieferung' ? 'Lieferschein' : 'Abholschein' }}</h1>
    <table class="meta">
        <tr>
            <td><span class="label">Bestellung</span><span class="value">{{ $order->number }}</span></td>
            <td><span class="label">{{ $order->delivery_method === 'lieferung' ? 'Liefertermin' : 'Abholtermin' }}</span><span class="value">{{ $order->scheduled_date?->format('d.m.Y') ?? 'nach Absprache' }}{{ $order->scheduled_slot ? ', '.$order->scheduled_slot : '' }}</span></td>
            <td><span class="label">Telefon</span><span class="value">{{ $order->phone ?: '–' }}</span></td>
            <td><span class="label">Zahlung</span><span class="value">{{ $order->payment_status === 'bezahlt' ? 'bezahlt' : $order->paymentMethodLabel() }}</span></td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th class="check"></th>
                <th style="width: 50%">Artikel</th>
                <th style="width: 30%">Grösse / Sorte</th>
                <th class="num">Menge</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $i => $item)
                <tr class="{{ $i % 2 ? 'alt' : '' }}">
                    <td class="check"><span class="box"></span></td>
                    <td class="product">{{ $item->product_name }}</td>
                    <td>{{ $item->variant_label }}</td>
                    <td class="num"><strong>{{ $item->quantity }}</strong></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if($order->planting)
        <table class="terms"><tr><td class="k">Pflanzservice</td><td class="v"><strong>Ja – Pflanzen vor Ort einpflanzen</strong></td></tr></table>
    @endif
    @if($order->payment_method === 'cash' && $order->payment_status !== 'bezahlt')
        <table class="terms"><tr><td class="k">Bar zu bezahlen</td><td class="v"><strong>CHF {{ $chf($order->total) }}</strong></td></tr></table>
    @endif
    @if($order->note)
        <table class="terms"><tr><td class="k">Bemerkung</td><td class="v">{{ $order->note }}</td></tr></table>
    @endif

    <table class="sign">
        <tr>
            <td><div class="line">Ware vollständig und in gutem Zustand erhalten – Datum</div></td>
            <td><div class="line">Unterschrift</div></td>
        </tr>
    </table>
</div>
@include('pdf.partials.footer')
</div>
@endforeach
</body>
</html>
