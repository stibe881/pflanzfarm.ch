<?php

namespace App\Filament\Support;

use Filament\Forms\Components\TextInput;

/** Beträge werden in Rappen gespeichert und im Admin in Franken erfasst. */
class Money
{
    public static function input(string $name, string $label): TextInput
    {
        return TextInput::make($name)
            ->label($label)
            ->prefix('CHF')
            ->numeric()
            ->minValue(0)
            ->step(0.05)
            ->formatStateUsing(fn ($state) => $state === null ? null : number_format($state / 100, 2, '.', ''))
            ->dehydrateStateUsing(fn ($state) => (int) round(((float) $state) * 100));
    }

    public static function format(?int $cents): string
    {
        return 'CHF '.number_format(($cents ?? 0) / 100, 2, '.', "'");
    }
}
