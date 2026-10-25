<x-mail::message>
# Wie geht es Ihren neuen Pflanzen?

Guten Tag {{ $order->name }}

Vor kurzem haben Ihre Pflanzen bei Ihnen ein neues Zuhause gefunden. Die ersten Wochen sind entscheidend fürs Anwachsen – hier unsere wichtigsten Tipps:

@foreach($articles as $article)
**[{{ $article->title }}]({{ url('/ratgeber/'.$article->slug.'/') }})**<br>
{{ $article->summary() }}

@endforeach
Haben Sie Fragen oder sieht eine Pflanze nicht gut aus? Rufen Sie uns an unter +41 79 336 14 95 oder antworten Sie einfach auf diese E-Mail.

@if($reviewUrl)
Waren Sie zufrieden mit uns? Über eine kurze Google-Bewertung freuen wir uns als kleiner Familienbetrieb sehr.

<x-mail::button :url="$reviewUrl">
Bewertung schreiben
</x-mail::button>
@endif

Freundliche Grüsse<br>
Ihre Pflanzfarm Steinmann

<x-mail::subcopy>
Sie erhalten diese E-Mail, weil Sie bei uns eingekauft haben. [Keine Pflegetipps mehr erhalten]({{ $optOutUrl }})
</x-mail::subcopy>
</x-mail::message>
