<x-filament-panels::page>
    <form wire:submit="import" style="display:grid;gap:16px">
        {{ $this->form }}
        <div><x-filament::button type="submit" icon="heroicon-m-arrow-up-tray">Importieren und verbuchen</x-filament::button></div>
    </form>

    @if($result !== null)
        <x-filament::section heading="Ergebnis">
            @if(! count($result))
                <p>In der Datei waren keine Gutschriften.</p>
            @else
                <div style="overflow-x:auto">
                    <table style="width:100%;font-size:.85rem;border-collapse:collapse">
                        <thead><tr style="text-align:left;opacity:.7"><th style="padding:6px">Datum</th><th style="padding:6px">Betrag</th><th style="padding:6px">Von</th><th style="padding:6px">Referenz / Mitteilung</th><th style="padding:6px">Bestellung</th><th style="padding:6px">Status</th></tr></thead>
                        <tbody>
                        @foreach($result as $r)
                            <tr style="border-top:1px solid rgba(127,127,127,.2)">
                                <td style="padding:6px">{{ $r['date'] ? \Illuminate\Support\Carbon::parse($r['date'])->format('d.m.Y') : '–' }}</td>
                                <td style="padding:6px;white-space:nowrap">CHF {{ number_format($r['amount'] / 100, 2, '.', "'") }}</td>
                                <td style="padding:6px">{{ $r['debtor'] ?? '–' }}</td>
                                <td style="padding:6px;font-size:.75rem">{{ $r['reference'] ?: \Illuminate\Support\Str::limit($r['text'], 60) ?: '–' }}</td>
                                <td style="padding:6px;font-weight:600">{{ $r['order'] ?? '–' }}</td>
                                <td style="padding:6px">
                                    <x-filament::badge :color="str_starts_with($r['status'], 'bezahlt') ? 'success' : ($r['status'] === 'bereits bezahlt' ? 'gray' : 'warning')">{{ $r['status'] }}</x-filament::badge>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
                <p style="font-size:.8rem;opacity:.7;margin-top:10px">Nicht zugeordnete Zahlungen und zu tiefe Beträge bitte von Hand prüfen und bei der Bestellung «Zahlung erhalten» klicken.</p>
            @endif
        </x-filament::section>
    @endif

    @if($this->history->isNotEmpty())
        <x-filament::section heading="Letzte Importe" collapsible :collapsed="$result !== null">
            <table style="width:100%;font-size:.85rem">
                @foreach($this->history as $h)
                    <tr style="border-top:1px solid rgba(127,127,127,.2)">
                        <td style="padding:6px">{{ $h->created_at->format('d.m.Y H:i') }}</td>
                        <td style="padding:6px">{{ $h->filename }}</td>
                        <td style="padding:6px">{{ $h->entries }} Gutschriften, {{ $h->matched }} verbucht</td>
                        <td style="padding:6px;opacity:.7">{{ $h->user?->name }}</td>
                    </tr>
                @endforeach
            </table>
        </x-filament::section>
    @endif
</x-filament-panels::page>
