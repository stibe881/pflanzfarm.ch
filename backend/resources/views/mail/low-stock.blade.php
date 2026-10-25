<x-mail::message>
# Lagerbestand knapp

Folgende Grössen sind unter die Warngrenze gefallen:

<x-mail::table>
| Produkt | Grösse | Bestand |
|:--|:--|--:|
@foreach($variants as $v)
| {{ $v->product->name }} | {{ $v->label }} | **{{ $v->stock }}** |
@endforeach
</x-mail::table>

<x-mail::button :url="url('/admin/products')">
Lager im Admin anpassen
</x-mail::button>

Diese Meldung kommt einmal pro Unterschreitung. Wird der Bestand wieder aufgefüllt, ist die Warnung erneut aktiv.
</x-mail::message>
