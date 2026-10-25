{{-- Live-Vorschau der Einstellungen im Look der Website --}}
@php
    $serif = "Iowan Old Style, Baskerville, 'Palatino Linotype', Palatino, Georgia, serif";
    $chf = fn ($v) => 'CHF '.number_format((float) $v, 2, '.', "'");
    $card = 'border:1px solid #dfe6dc; border-radius:8px; background:#fff; padding:16px 18px; color:#153c31;';
    $label = 'font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; margin:0 0 8px;';
@endphp
<div style="display:grid; gap:18px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size:13px;">

    <div>
        <p style="{{ $label }}">Kontaktseite</p>
        <div style="{{ $card }}">
            <h3 style="font-family:{{ $serif }}; font-size:20px; margin:0 0 10px; color:#153c31;">Öffnungszeiten</h3>
            @forelse($hours as $row)
                <div style="display:flex; gap:8px; margin-bottom:8px;">
                    <span style="color:#c98164;">◷</span>
                    <span><strong>{{ $row['label'] ?? '' }}</strong><br>{{ $row['value'] ?? '' }}</span>
                </div>
            @empty
                <div style="color:#b45309;">Keine Öffnungszeiten erfasst – auf der Website erscheint dann nichts.</div>
            @endforelse
            @if($note)
                <p style="margin:8px 0 0; color:#24493a; line-height:1.55;">{{ $note }}</p>
            @endif
        </div>
    </div>

    <div>
        <p style="{{ $label }}">Kasse – Beispiel mit Warenkorb {{ $chf($example) }} (Standardklasse)</p>
        <div style="{{ $card }} background:#f3f0e8;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Zwischensumme</span><strong>{{ $chf($example) }}</strong></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Lieferung</span><span>{{ $shippingExample > 0 ? $chf($shippingExample) : 'gratis' }}</span></div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid #dfe6dc; padding-top:8px; font-weight:700;"><span>Total inkl. MWST</span><span>{{ $chf($example + $shippingExample) }}</span></div>
            <p style="margin:8px 0 0; color:#4b6a5d; font-size:12px;">
                {{ $free > 0 ? 'Gratis-Lieferung ab '.$chf($free).'. ' : 'Lieferung wird immer berechnet. ' }}Abholung in Ebersecken ist immer gratis.
            </p>
            <div style="margin-top:10px; font-size:12px; color:#24493a;">
                Versandklassen:
                @foreach($classes as [$cn, $cp, $cd])
                    <span style="display:inline-block; margin:2px 4px 0 0; padding:2px 8px; border-radius:999px; background:#fff; border:1px solid #dfe6dc;">{{ $cn }} {{ $chf($cp) }}{{ $cd ? ' · Standard' : '' }}</span>
                @endforeach
            </div>
            <div style="display:grid; gap:6px; margin-top:12px;">
                @foreach($methods as [$name, $hint])
                    <div style="display:flex; gap:10px; padding:9px 12px; border:1px solid #cbd6c8; border-radius:6px; background:#fff;">
                        <span style="width:14px; height:14px; border-radius:50%; border:2px solid #153c31; flex:none; margin-top:2px;"></span>
                        <span><strong>{{ $name }}</strong><br><span style="color:#4b6a5d; font-size:12px;">{{ $hint }}</span></span>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <div>
        <p style="{{ $label }}">Rechnung</p>
        <div style="{{ $card }}">
            <table style="width:100%; border-collapse:collapse; border-top:1px solid #d9ddd9; margin-bottom:12px; color:#1f2523;">
                <tr><td style="padding:6px 0; width:110px; color:#6b7069;">Zahlbar bis</td><td style="padding:6px 0;"><strong>{{ $dueDate }}</strong> ({{ $dueDays }} Tage netto)</td></tr>
                <tr><td style="padding:6px 0; color:#6b7069;">Zahlungsart</td><td style="padding:6px 0;">{{ in_array($ibanStatus, ['ok', 'qr']) ? 'Einzahlung mit QR-Zahlteil (Seite 2)' : 'Überweisung' }}</td></tr>
                <tr><td style="padding:6px 0; color:#6b7069;">Vermerk</td><td style="padding:6px 0;">PF-2026-0001</td></tr>
            </table>
            <div style="font-size:11px; color:#4b6a5d; border-top:1px solid #b9cbb3; padding-top:6px;">
                <strong>Pflanzfarm Steinmann</strong> · Untergretti 2, 6245 Ebersecken
                @if($iban) · IBAN {{ $iban }}@endif
                @if($vat) · MWST-Nr. {{ $vat }}@endif
            </div>
            <div style="margin-top:12px; padding:8px 10px; border-radius:6px; font-size:12px; {{ match($ibanStatus) { 'ok', 'qr' => 'background:#dcfce7; color:#166534;', 'empty' => 'background:#f3f4f6; color:#4b5563;', default => 'background:#fee2e2; color:#991b1b;' } }}">
                @switch($ibanStatus)
                    @case('ok') ✓ IBAN gültig – Rechnungen erhalten einen Swiss-QR-Zahlteil. @break
                    @case('qr') ✓ QR-IBAN erkannt – Rechnungen erhalten einen QR-Zahlteil mit QR-Referenz. @break
                    @case('empty') Ohne IBAN enthält die Rechnung keinen QR-Zahlteil. @break
                    @default ✕ Diese IBAN ist ungültig. Bitte prüfen – sonst fehlt der QR-Zahlteil.
                @endswitch
            </div>
        </div>
    </div>

    <div>
        <p style="{{ $label }}">Benachrichtigungen</p>
        <div style="{{ $card }}">Neue Bestellungen und Anfragen gehen an <strong>{{ $notify ?: '–' }}</strong>.</div>
    </div>
</div>
