{{-- Briefkopf mit Logo, Absender und Adressfeld für Fensterkuverts. Erwartet \$logo und \$order. --}}
    <table class="head">
        <tr>
            <td><img src="{{ $logo }}" class="logo" alt="Pflanzfarm"></td>
            <td class="sender">
                <strong class="serif">Pflanzfarm Steinmann</strong><br>
                Thomas Steinmann · Untergretti 2 · 6245 Ebersecken<br>
                +41 79 336 14 95 · info@pflanzfarm.ch · pflanzfarm.ch
            </td>
        </tr>
    </table>

    <table class="address-row">
        <tr>
            <td></td>
            <td class="recipient">
                <div class="sender-line">Pflanzfarm Steinmann, Untergretti 2, 6245 Ebersecken</div>
                {{ $order->name }}<br>
                @if($order->street)
                    {{ $order->street }}<br>{{ $order->postal_code }} {{ $order->city }}
                @else
                    {{ $order->email }}
                @endif
            </td>
        </tr>
    </table>

