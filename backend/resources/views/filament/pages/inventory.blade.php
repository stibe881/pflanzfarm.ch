<x-filament-panels::page>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <div style="flex:1;min-width:220px">
            <x-filament::input.wrapper prefix-icon="heroicon-m-magnifying-glass">
                <x-filament::input type="search" wire:model.live.debounce.300ms="search" placeholder="Pflanze, Grösse oder Artikelnummer" />
            </x-filament::input.wrapper>
        </div>
        <label style="display:flex;gap:8px;align-items:center;font-size:.875rem">
            <x-filament::input.checkbox wire:model.live="onlyOpen" />
            Nur nicht gezählte (30 Tage)
        </label>
        <x-filament::button wire:click="saveAll" icon="heroicon-m-check">Alle Eingaben speichern</x-filament::button>
    </div>

    <p style="font-size:.8rem;opacity:.7;margin:-4px 0 0">Gezählte Menge eintragen und mit ✓ speichern. «Stimmt» übernimmt den angezeigten Bestand als gezählt. Jede Änderung steht im Änderungsprotokoll.</p>

    @forelse($this->variants as $product => $variants)
        <x-filament::section :heading="$product" compact>
            <div style="display:grid;gap:10px">
                @foreach($variants as $v)
                    <div wire:key="v-{{ $v->id }}" style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(127,127,127,.15)">
                        <div>
                            <div style="font-weight:600">{{ $v->label }} @unless($v->active)<span style="font-size:.75rem;opacity:.6">(nicht bestellbar)</span>@endunless</div>
                            <div style="font-size:.78rem;opacity:.7">
                                System: <strong>{{ $v->stock }}</strong>
                                · {{ $v->counted_at ? 'gezählt '.$v->counted_at->format('d.m.Y') : 'noch nie gezählt' }}
                                @if($v->waiting) · <span style="color:#c2410c">{{ $v->waiting }} warten auf Nachschub</span>@endif
                            </div>
                        </div>
                        <div style="display:flex;gap:6px;align-items:center">
                            <div style="width:96px">
                                <x-filament::input.wrapper>
                                    <x-filament::input type="number" inputmode="numeric" min="0" wire:model="counts.{{ $v->id }}" wire:keydown.enter="save({{ $v->id }})" placeholder="{{ $v->stock }}" />
                                </x-filament::input.wrapper>
                            </div>
                            <x-filament::icon-button icon="heroicon-m-check" wire:click="save({{ $v->id }})" label="Speichern" color="success" size="lg" />
                            <x-filament::button size="sm" color="gray" wire:click="confirm({{ $v->id }})">Stimmt</x-filament::button>
                        </div>
                    </div>
                @endforeach
            </div>
        </x-filament::section>
    @empty
        <x-filament::section>Nichts gefunden.</x-filament::section>
    @endforelse
</x-filament-panels::page>
