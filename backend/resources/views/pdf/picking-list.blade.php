<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
    @include('pdf.partials.style')
    .check { width: 9mm; text-align: center; }
    .box { display: inline-block; width: 3.6mm; height: 3.6mm; border: 0.6pt solid #555; }
    h2 { font-family: "DejaVu Serif", serif; font-size: 13pt; color: #153c31; margin: 9mm 0 3mm; }
    .order-block { margin-bottom: 5mm; page-break-inside: avoid; }
    .order-block .who { font-weight: bold; color: #111; }
</style>
</head>
<body>
<div class="accent-bar"><span></span></div>
<div class="page">
    <table class="head">
        <tr>
            <td><img src="{{ $logo }}" class="logo" alt="Pflanzfarm"></td>
            <td class="sender"><strong class="serif">Rüstliste</strong><br>{{ $date ? $date->translatedFormat('l, d.m.Y') : 'Auswahl vom '.now()->format('d.m.Y') }}<br>{{ $orders->count() }} {{ $orders->count() === 1 ? 'Bestellung' : 'Bestellungen' }}</td>
        </tr>
    </table>

    <h1 style="margin-top: 6mm">Rüstliste {{ $date ? $date->format('d.m.Y') : '(Auswahl)' }}</h1>

    <h2>Gesamtmenge</h2>
    <table class="items">
        <thead><tr><th class="check"></th><th style="width: 52%">Artikel</th><th style="width: 30%">Grösse / Sorte</th><th class="num">Menge</th></tr></thead>
        <tbody>
            @forelse($totals as $i => $row)
                <tr class="{{ $i % 2 ? 'alt' : '' }}">
                    <td class="check"><span class="box"></span></td>
                    <td class="product">{{ $row['product'] }}</td>
                    <td>{{ $row['variant'] }}</td>
                    <td class="num"><strong>{{ $row['quantity'] }}</strong></td>
                </tr>
            @empty
                <tr><td colspan="4" class="muted">Keine Bestellungen für diesen Tag.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>Nach Bestellung</h2>
    @foreach($orders as $order)
        <div class="order-block">
            <table class="terms" style="margin-top: 0">
                <tr>
                    <td class="k">{{ $order->number }}</td>
                    <td class="v">
                        <span class="who">{{ $order->name }}</span> · {{ $order->phone ?: $order->email }}<br>
                        {{ $order->deliveryMethodLabel() }}@if($order->delivery_method === 'lieferung'): {{ $order->street }}, {{ $order->postal_code }} {{ $order->city }}@endif
                        @if($order->scheduled_slot) · {{ $order->scheduled_slot }}@endif
                        @if($order->payment_method === 'cash' && $order->payment_status !== 'bezahlt') · <strong>bar CHF {{ number_format($order->total / 100, 2, '.', "'") }}</strong>@endif
                        <br>
                        @foreach($order->items as $item){{ $item->quantity }} × {{ $item->product_name }} ({{ $item->variant_label }})@if(! $loop->last), @endif @endforeach
                        @if($order->note)<br><span class="muted">Bemerkung: {{ $order->note }}</span>@endif
                    </td>
                </tr>
            </table>
        </div>
    @endforeach
</div>
</body>
</html>
