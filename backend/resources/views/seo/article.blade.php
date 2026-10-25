{{-- Serverseitige Fassung für Suchmaschinen und ohne JavaScript; die App ersetzt sie beim Laden. --}}
<main id="main-content" class="seo-page">
    <nav><a href="/">Startseite</a> › <a href="/ratgeber/">Ratgeber</a> › {{ $article->title }}</nav>
    <article>
        <h1>{{ $article->title }}</h1>
        @foreach($article->paragraphs() as $p)<p>{{ $p }}</p>@endforeach
        @if($article->product)<p><a href="/produkt/{{ $article->product->slug }}/">{{ $article->product->name }} im Shop ansehen</a></p>@endif
    </article>
</main>
<script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
