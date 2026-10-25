<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
    @page { margin: 0; }
    body { margin: 0; font-family: "DejaVu Sans", sans-serif; color: #1f2523; }
    .card { position: relative; height: 148mm; width: 210mm; background: #faf9f5; }
    .band { position: absolute; left: 0; top: 0; bottom: 0; width: 62mm; background: #153c31; color: #fff; }
    .band img { width: 36mm; margin: 14mm 0 0 13mm; background: #faf9f5; border-radius: 3mm; padding: 2mm; }
    .band .contact { position: absolute; left: 13mm; bottom: 12mm; font-size: 7.4pt; line-height: 1.6; color: #dce5d8; }
    .accent { position: absolute; left: 62mm; top: 0; width: 3mm; height: 148mm; background: #c98164; }
    .content { position: absolute; left: 78mm; top: 16mm; right: 14mm; }
    .eyebrow { font-size: 8pt; letter-spacing: 1.2pt; text-transform: uppercase; color: #6b7069; }
    h1 { font-family: "DejaVu Serif", serif; font-size: 30pt; color: #153c31; margin: 2mm 0 6mm; letter-spacing: -0.5pt; }
    .amount { font-family: "DejaVu Serif", serif; font-size: 34pt; font-weight: bold; color: #153c31; }
    .for { font-size: 11pt; margin: 4mm 0 8mm; }
    .code { display: inline-block; border: 0.8pt dashed #153c31; padding: 3mm 6mm; font-size: 15pt; font-weight: bold; letter-spacing: 1.5pt; font-family: "DejaVu Sans Mono", monospace; }
    .terms { margin-top: 8mm; font-size: 7.6pt; line-height: 1.6; color: #555b57; }
</style>
</head>
<body>
<div class="card">
    <div class="band">
        <img src="{{ $logo }}" alt="Pflanzfarm">
        <div class="contact">Pflanzfarm Steinmann<br>Untergretti 2<br>6245 Ebersecken<br>+41 79 336 14 95<br>pflanzfarm.ch</div>
    </div>
    <div class="accent"></div>
    <div class="content">
        <div class="eyebrow">Pflanzfarm Steinmann</div>
        <h1>Geschenkgutschein</h1>
        <div class="amount">CHF {{ number_format($coupon->value / 100, 2, '.', "'") }}</div>
        <div class="for">@if($coupon->recipient)für {{ $coupon->recipient }}@else&nbsp;@endif</div>
        <div class="eyebrow" style="margin-bottom: 2mm">Gutschein-Code</div>
        <div class="code">{{ $coupon->code }}</div>
        <div class="terms">
            Einlösbar im Online-Shop auf pflanzfarm.ch (Code in der Kasse eingeben) oder vor Ort in Ebersecken.
            Ein Restbetrag bleibt für die nächste Bestellung gültig. Keine Barauszahlung.
            @if($coupon->valid_until)<br>Gültig bis {{ $coupon->valid_until->format('d.m.Y') }}.@endif
        </div>
    </div>
</div>
</body>
</html>
