<x-mail::message>
# Freundliche Zahlungserinnerung

Guten Tag {{ $order->name }}

Bestimmt ist es Ihnen entgangen: Die Rechnung **{{ $order->number }}** vom {{ $order->created_at->format('d.m.Y') }} über **CHF {{ number_format($order->total / 100, 2, '.', "'") }}** war am {{ $order->dueDate()->format('d.m.Y') }} fällig.

Wir bitten Sie, den Betrag in den nächsten 10 Tagen zu überweisen. Die Rechnung mit QR-Zahlteil finden Sie nochmals im Anhang.

Falls Sie bereits bezahlt haben, betrachten Sie diese E-Mail bitte als gegenstandslos. Bei Fragen erreichen Sie uns unter +41 79 336 14 95.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann
</x-mail::message>
