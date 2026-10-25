<x-mail::message>
# {{ $article->title }}

{{ $article->summary() }}

<x-mail::button :url="$url">
Ganzen Tipp lesen
</x-mail::button>

Brauchen Sie Unterstützung beim Schneiden oder Pflegen? Unser Gartenservice hilft gern: +41 79 336 14 95.

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann

<x-mail::subcopy>
Sie erhalten diesen saisonalen Tipp, weil Sie bei uns {{ $article->product?->name ?? 'Pflanzen' }} gekauft haben. [Keine Pflegetipps mehr erhalten]({{ $optOutUrl }})
</x-mail::subcopy>
</x-mail::message>
