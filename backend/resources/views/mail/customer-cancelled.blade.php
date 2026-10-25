<x-mail::message>
# Bestellung storniert

**{{ $order->name }}** hat die Bestellung **{{ $order->number }}** (CHF {{ number_format($order->total / 100, 2, '.', "'") }}) im Kundenkonto storniert. Der Lagerbestand wurde wieder freigegeben.

@if($order->payment_status === 'erstattet')
Der bezahlte Betrag wurde {{ $order->payment_method === 'stripe' ? 'über Stripe automatisch erstattet' : 'als Gutschrift ausgestellt – bitte zurücküberweisen' }}.
@endif

<x-mail::button :url="url('/admin/orders/'.$order->id)">
Bestellung im Admin öffnen
</x-mail::button>
</x-mail::message>
