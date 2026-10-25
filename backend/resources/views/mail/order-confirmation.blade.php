<x-mail::message>
# Vielen Dank für Ihre Bestellung

Guten Tag {{ $order->name }}

Wir haben Ihre Bestellung **{{ $order->number }}** erhalten.
@if($order->payment_method === 'stripe')
Ihre Zahlung ist bei uns eingegangen.
@elseif($order->payment_method === 'invoice')
Die Rechnung finden Sie im Anhang.
@else
Sie bezahlen bar bei der Abholung.
@endif
Wir melden uns, sobald wir Ihre Bestellung bestätigt und den {{ $order->delivery_method === 'lieferung' ? 'Liefertermin' : 'Abholtermin' }} festgelegt haben.

<x-mail::table>
| Artikel | Menge | Betrag |
|:--|:--:|--:|
@foreach($order->items as $item)
| {{ $item->product_name }} ({{ $item->variant_label }}) | {{ $item->quantity }} | CHF {{ number_format($item->line_total / 100, 2, '.', "'") }} |
@endforeach
| Lieferung | | CHF {{ number_format($order->shipping / 100, 2, '.', "'") }} |
| **Total inkl. MWST** | | **CHF {{ number_format($order->total / 100, 2, '.', "'") }}** |
</x-mail::table>

**{{ $order->deliveryMethodLabel() }}**
@if($order->delivery_method === 'lieferung')
an {{ $order->street }}, {{ $order->postal_code }} {{ $order->city }}
@else
bei der Pflanzfarm, Untergretti 2, 6245 Ebersecken
@endif

**Zahlung:** {{ $order->paymentMethodLabel() }}

Bei Fragen erreichen Sie uns unter +41 79 336 14 95 oder info@pflanzfarm.ch.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann
</x-mail::message>
