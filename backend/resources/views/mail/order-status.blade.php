<x-mail::message>
# Ihre Bestellung {{ $order->number }}

Guten Tag {{ $order->name }}

@switch($order->status)
@case('bestaetigt')
Wir haben Ihre Bestellung bestätigt.
@if($order->scheduled_date)

**{{ $order->delivery_method === 'lieferung' ? 'Liefertermin' : 'Abholtermin' }}: {{ $order->scheduled_date->locale('de_CH')->isoFormat('dddd, D. MMMM YYYY') }}{{ $order->scheduled_slot && $order->scheduled_slot !== 'egal' ? ', '.\App\Models\Order::SLOTS[$order->scheduled_slot] : '' }}**
@endif
@break
@case('geliefert')
Ihre Bestellung wurde {{ $order->delivery_method === 'lieferung' ? 'geliefert' : 'abgeholt' }}. Wir wünschen Ihnen viel Freude mit Ihren Pflanzen!
@break
@case('storniert')
Ihre Bestellung wurde storniert.
@if($order->payment_status === 'erstattet')
Den bezahlten Betrag erstatten wir Ihnen zurück, die Gutschrift erhalten Sie in einer separaten E-Mail.
@endif
@break
@default
Der Status Ihrer Bestellung lautet: {{ $order->statusLabel() }}.
@endswitch

@if($note)
{{ $note }}
@endif

Bei Fragen erreichen Sie uns unter +41 79 336 14 95 oder info@pflanzfarm.ch.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann
</x-mail::message>
