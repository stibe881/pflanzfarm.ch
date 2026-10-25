@php($money = fn ($c) => 'CHF '.number_format($c / 100, 2, '.', "'"))
<x-filament-panels::page>
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
        <div style="flex:1;min-width:220px;max-width:420px">
            <x-filament::input.wrapper prefix-icon="heroicon-m-magnifying-glass">
                <x-filament::input type="search" wire:model.live.debounce.300ms="search" placeholder="Nummer, Name oder Ort" />
            </x-filament::input.wrapper>
        </div>
        <label style="display:flex;gap:8px;align-items:center;font-size:.875rem">
            <x-filament::input.checkbox wire:model.live="notify" />
            Beim Verschieben die Kundschaft per E-Mail informieren
        </label>
    </div>

    <div class="pf-board" x-data="{ over: null }">
        @foreach(\App\Filament\Resources\OrderResource\Pages\OrderBoard::COLUMNS as $status => $label)
            @php($orders = $this->columns[$status])
            <section class="pf-board__col" :class="over === '{{ $status }}' && 'pf-board__col--over'"
                x-on:dragover.prevent="over = '{{ $status }}'" x-on:dragleave="over = null"
                x-on:drop.prevent="over = null; $wire.move(+$event.dataTransfer.getData('text/plain'), '{{ $status }}')">
                <header><b>{{ $label }}</b> <span>{{ $orders->count() }}</span></header>
                @forelse($orders as $o)
                    <article class="pf-card" wire:key="o-{{ $o->id }}" draggable="true"
                        x-on:dragstart="$event.dataTransfer.setData('text/plain', '{{ $o->id }}')">
                        <div class="pf-card__top">
                            <a href="{{ \App\Filament\Resources\OrderResource::getUrl('view', ['record' => $o]) }}"><b>{{ $o->number }}</b></a>
                            <span>{{ $money($o->total) }}</span>
                        </div>
                        <div>{{ $o->name }} @if($o->city)<span class="pf-muted">· {{ $o->city }}</span>@endif</div>
                        <div class="pf-card__meta">
                            <x-filament::badge size="sm" :color="$o->delivery_method === 'lieferung' ? 'info' : 'gray'">{{ $o->delivery_method === 'lieferung' ? 'Lieferung' : 'Abholung' }}</x-filament::badge>
                            <x-filament::badge size="sm" :color="$o->payment_status === 'bezahlt' ? 'success' : 'warning'">{{ $o->paymentStatusLabel() }}</x-filament::badge>
                            @if($o->planting)<x-filament::badge size="sm" color="primary">Pflanzservice</x-filament::badge>@endif
                        </div>
                        <div class="pf-muted">
                            @if($o->scheduled_date)
                                Termin {{ $o->scheduled_date->locale('de_CH')->isoFormat('dd D.M.') }}{{ $o->scheduled_slot && $o->scheduled_slot !== 'egal' ? ', '.(\App\Models\Order::SLOTS[$o->scheduled_slot] ?? '') : '' }}
                            @elseif($o->preferred_date)
                                Wunsch {{ $o->preferred_date->locale('de_CH')->isoFormat('dd D.M.') }}
                            @else
                                bestellt {{ $o->created_at->format('d.m.') }}
                            @endif
                        </div>
                        <div class="pf-card__actions">
                            @if($status === 'neu')
                                <x-filament::button size="xs" color="success" wire:click="move({{ $o->id }}, 'bestaetigt')">Bestätigen →</x-filament::button>
                            @elseif($status === 'bestaetigt')
                                <x-filament::button size="xs" color="gray" wire:click="move({{ $o->id }}, 'neu')">← Neu</x-filament::button>
                                <x-filament::button size="xs" wire:click="move({{ $o->id }}, 'geliefert')">Geliefert →</x-filament::button>
                            @else
                                <x-filament::button size="xs" color="gray" wire:click="move({{ $o->id }}, 'bestaetigt')">← Zurück</x-filament::button>
                            @endif
                        </div>
                    </article>
                @empty
                    <p class="pf-muted" style="padding:8px">Keine Bestellungen</p>
                @endforelse
            </section>
        @endforeach
    </div>

    <style>
        .pf-board { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start; }
        .pf-board__col { background: rgba(127,127,127,.07); border-radius: 12px; padding: 10px; min-height: 200px; display: grid; gap: 10px; align-content: start; transition: background .15s; }
        .pf-board__col--over { background: rgba(36,73,58,.15); outline: 2px dashed rgba(36,73,58,.5); }
        .pf-board__col header { display: flex; justify-content: space-between; padding: 4px 6px; font-size: .9rem; }
        .pf-board__col header span { opacity: .6; }
        .pf-card { background: #fff; border: 1px solid rgba(127,127,127,.2); border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; font-size: .85rem; cursor: grab; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
        .dark .pf-card { background: rgb(24 24 27); }
        .pf-card:active { cursor: grabbing; }
        .pf-card__top { display: flex; justify-content: space-between; gap: 8px; }
        .pf-card__meta { display: flex; flex-wrap: wrap; gap: 4px; }
        .pf-card__actions { display: flex; gap: 6px; justify-content: flex-end; }
        .pf-muted { opacity: .65; font-size: .8rem; }
        @media (max-width: 900px) { .pf-board { grid-template-columns: 1fr; } }
    </style>
</x-filament-panels::page>
