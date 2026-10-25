<x-mail::message>
# Gute Nachricht: wieder an Lager

**{{ $variant->product->name }}** in der Grösse **{{ $variant->label }}** ist wieder verfügbar – zurzeit {{ $variant->stock }} Stück.

<x-mail::button :url="$url">
Jetzt ansehen
</x-mail::button>

Sie erhalten diese E-Mail einmalig, weil Sie sich auf unserer Website dafür eingetragen haben. Weitere Mails schicken wir Ihnen dazu nicht.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann
</x-mail::message>
