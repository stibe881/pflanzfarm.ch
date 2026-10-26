<x-filament-panels::page>
    @php($colors = ['ok' => 'success', 'warn' => 'warning', 'fail' => 'danger'])
    @php($labels = ['ok' => 'in Ordnung', 'warn' => 'Hinweis', 'fail' => 'Problem'])
    @foreach(collect($rows)->groupBy('area') as $area => $items)
        <x-filament::section :heading="$area">
            <div style="display:grid;gap:12px">
                @foreach($items as $r)
                    <div style="display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:start">
                        <x-filament::badge :color="$colors[$r['status']]">{{ $labels[$r['status']] }}</x-filament::badge>
                        <div>
                            <div style="font-weight:600;font-size:.9rem">{{ $r['title'] }}</div>
                            @if($r['detail'])<div style="font-size:.82rem;opacity:.75;overflow-wrap:anywhere">{{ $r['detail'] }}</div>@endif
                        </div>
                    </div>
                @endforeach
            </div>
        </x-filament::section>
    @endforeach
    <p style="font-size:.8rem;opacity:.7">Einrichten und Domain wechseln geht per SSH: <code>php artisan pflanzfarm:einrichten</code> bzw. <code>php artisan pflanzfarm:domain pflanzfarm.ch --live</code>. Details in HETZNER.md.</p>
</x-filament-panels::page>
