<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<style>
  @page { margin: 22mm 18mm 20mm; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 10pt; color: #153c31; }
  h1 { font-size: 18pt; margin: 0 0 4mm; }
  .head { width: 100%; margin-bottom: 12mm; }
  .head td { vertical-align: top; }
  .muted { color: #4b6a5d; }
  table.items { width: 100%; border-collapse: collapse; margin-top: 6mm; }
  table.items th { text-align: left; border-bottom: 1px solid #153c31; padding: 2mm 1mm; font-size: 9pt; }
  table.items td { border-bottom: 1px solid #dfe6dc; padding: 2mm 1mm; }
  .r { text-align: right; }
  .total td { font-weight: bold; border-bottom: none; border-top: 1px solid #153c31; }
  .qr { margin-top: 10mm; border-top: 1px dashed #4b6a5d; padding-top: 6mm; }
  .qr td { vertical-align: top; }
</style>
</head>
<body>
<table class="head">
  <tr>
    <td>
      <strong>Pflanzfarm Steinmann</strong><br>
      Thomas Steinmann<br>
      Untergretti 2<br>
      6245 Ebersecken<br>
      <span class="muted">+41 79 336 14 95 · info@pflanzfarm.ch</span>
      @if($vat)<br><span class="muted">MWST-Nr. {{ $vat }}</span>@endif
    </td>
    <td class="r">
      {{ $order->name }}<br>
      @if($order->street){{ $order->street }}<br>{{ $order->postal_code }} {{ $order->city }}<br>@endif
      {{ $order->email }}
    </td>
  </tr>
</table>

<h1>Rechnung {{ $order->number }}</h1>
<div class="muted">
  Datum: {{ $order->created_at->format('d.m.Y') }} ·
  {{ $order->deliveryMethodLabel() }} ·
  Zahlung: {{ $order->paymentMethodLabel() }}
</div>

<table class="items">
  <tr><th>Artikel</th><th>Grösse / Sorte</th><th class="r">Menge</th><th class="r">Preis</th><th class="r">Betrag CHF</th></tr>
  @foreach($order->items as $item)
  <tr>
    <td>{{ $item->product_name }}</td>
    <td>{{ $item->variant_label }}</td>
    <td class="r">{{ $item->quantity }}</td>
    <td class="r">{{ number_format($item->unit_price / 100, 2, '.', "'") }}</td>
    <td class="r">{{ number_format($item->line_total / 100, 2, '.', "'") }}</td>
  </tr>
  @endforeach
  <tr><td colspan="4">Lieferung</td><td class="r">{{ number_format($order->shipping / 100, 2, '.', "'") }}</td></tr>
  <tr class="total"><td colspan="4">Total inkl. MWST</td><td class="r">{{ number_format($order->total / 100, 2, '.', "'") }}</td></tr>
</table>

<p>
@if($order->payment_status === 'bezahlt')
  Betrag dankend erhalten am {{ ($order->paid_at ?? $order->created_at)->format('d.m.Y') }}.
@elseif($order->payment_method === 'invoice')
  Zahlbar innert {{ $dueDays }} Tagen{{ $iban ? ' auf IBAN '.$iban : '' }}, Vermerk «{{ $order->number }}».
@elseif($order->payment_method === 'cash')
  Zahlbar bar bei der Abholung.
@endif
</p>
<p class="muted">Vielen Dank für Ihren Einkauf bei der Pflanzfarm Steinmann.</p>

@if($qr)
<table class="qr">
  <tr>
    <td style="width: 52mm"><img src="{{ $qr }}" style="width: 46mm; height: 46mm"></td>
    <td>
      <strong>Zahlteil</strong><br>
      Konto / Zahlbar an<br>{{ $iban }}<br>Pflanzfarm Steinmann, Untergretti 2, 6245 Ebersecken<br><br>
      Zusätzliche Informationen<br>Bestellung {{ $order->number }}<br><br>
      Betrag: CHF {{ number_format($order->total / 100, 2, '.', "'") }}
    </td>
  </tr>
</table>
@endif
</body>
</html>
