{{-- Fusszeile mit Kontakt, IBAN und MWST-Nummer --}}
@php($iban = $iban ?? \App\Models\Setting::get('iban'))
@php($vat = $vat ?? \App\Models\Setting::get('vat_number'))
<table class="footer footer-plain">
    <tr>
        <td><strong>Pflanzfarm Steinmann</strong><br>Untergretti 2, 6245 Ebersecken</td>
        <td>+41 79 336 14 95<br>info@pflanzfarm.ch · pflanzfarm.ch</td>
        <td>@if($iban)IBAN {{ $iban }}<br>@endif @if($vat)MWST-Nr. {{ $vat }}@endif</td>
    </tr>
</table>
