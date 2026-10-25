<x-mail::message>
# Ihre Bestellung {{ $order->number }}

Guten Tag {{ $order->name }}

@switch($order->status)
@case('bestaetigt')
Wir haben Ihre Bestellung bestätigt.
@break
@case('geliefert')
Ihre Bestellung wurde {{ $order->delivery_method === 'lieferung' ? 'geliefert' : 'abgeholt' }}. Wir wünschen Ihnen viel Freude mit Ihren Pflanzen!
@break
@case('storniert')
Ihre Bestellung wurde storniert.
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
