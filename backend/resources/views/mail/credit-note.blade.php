<x-mail::message>
# Gutschrift zu Ihrer Bestellung

Guten Tag {{ $order->name }}

Ihre Bestellung **{{ $order->number }}** wurde storniert. Den Betrag von **CHF {{ number_format(($order->refund_amount ?: $order->total) / 100, 2, '.', "'") }}** erstatten wir Ihnen zurück.

@if($order->payment_method === 'stripe')
Die Rückzahlung erfolgt auf das ursprüngliche Zahlungsmittel ({{ $order->paymentMethodLabel() }}) und ist je nach Bank in 5–10 Arbeitstagen sichtbar.
@else
Bitte teilen Sie uns Ihre IBAN mit, falls wir sie noch nicht haben – wir überweisen den Betrag dann umgehend.
@endif

Die Gutschrift finden Sie im Anhang.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann
</x-mail::message>
