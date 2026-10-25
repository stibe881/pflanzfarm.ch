{{-- Serverseitige Fassung für Suchmaschinen und ohne JavaScript; die App ersetzt sie beim Laden. --}}
<main id="main-content" class="seo-page">
    <nav><a href="/">Startseite</a> › <a href="/shop/">Shop</a> › {{ $product->name }}</nav>
    <h1>{{ $product->name }}</h1>
    @if($product->latin)<p><em>{{ $product->latin }}</em></p>@endif
    @if($image)<img src="{{ $image }}" alt="{{ $product->name }}" width="800">@endif
    @if($product->description)<p>{{ $product->description }}</p>@endif
    @if($product->price_on_request)
        <p>Preis auf Anfrage – <a href="/kontakt/">Kontakt aufnehmen</a></p>
    @else
        <table>
            <thead><tr><th>Grösse</th><th>Preis</th><th>Verfügbarkeit</th></tr></thead>
            <tbody>
            @foreach($variants as $v)
                <tr><td>{{ $v->label }}</td><td>CHF {{ number_format($v->price / 100, 2, '.', "'") }}</td><td>{{ $v->stock > 0 ? 'an Lager' : 'ausverkauft' }}</td></tr>
            @endforeach
            </tbody>
        </table>
        @if($product->volume_discounts)
            <p>Mengenrabatt: @foreach(collect($product->volume_discounts)->sortBy('min_qty') as $t)ab {{ $t['min_qty'] }} Stück {{ $t['percent'] }} %@if(! $loop->last), @endif @endforeach</p>
        @endif
    @endif
    @if($product->traits)<ul>@foreach($product->traits as $t)<li>{{ $t }}</li>@endforeach</ul>@endif
    <p>Pflanzfarm Steinmann, Untergretti 2, 6245 Ebersecken LU · +41 79 336 14 95 · Lieferung in die ganze Schweiz oder Abholung.</p>
</main>
<script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
