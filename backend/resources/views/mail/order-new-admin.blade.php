<x-mail::message>
# Neue Bestellung {{ $order->number }}

**{{ $order->name }}** · {{ $order->email }} · {{ $order->phone ?: 'kein Telefon' }}

{{ $order->deliveryMethodLabel() }}@if($order->delivery_method === 'lieferung'): {{ $order->street }}, {{ $order->postal_code }} {{ $order->city }}@endif
· Zahlung: {{ $order->paymentMethodLabel() }} ({{ $order->paymentStatusLabel() }})

<x-mail::table>
| Artikel | Menge | Betrag |
|:--|:--:|--:|
@foreach($order->items as $item)
| {{ $item->product_name }} ({{ $item->variant_label }}) | {{ $item->quantity }} | CHF {{ number_format($item->line_total / 100, 2, '.', "'") }} |
@endforeach
| **Total** | | **CHF {{ number_format($order->total / 100, 2, '.', "'") }}** |
</x-mail::table>

@if($order->note)
**Bemerkung:** {{ $order->note }}
@endif

<x-mail::button :url="url('/admin/orders/'.$order->id)">
Im Adminbereich öffnen
</x-mail::button>
</x-mail::message>
