<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ActivityLogResource\Pages;
use App\Filament\Support\Money;
use App\Models\ActivityLog;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

/** Nur lesbar: wer hat im Admin was geändert. */
class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-clock';

    protected static ?string $navigationGroup = 'Verwaltung';

    protected static ?string $modelLabel = 'Protokolleintrag';

    protected static ?string $pluralModelLabel = 'Änderungsprotokoll';

    protected static ?int $navigationSort = 90;

    public const TYPES = [
        'Product' => 'Produkt', 'ProductVariant' => 'Grösse / Lager', 'Order' => 'Bestellung', 'ShippingClass' => 'Versandklasse',
        'Popup' => 'Popup', 'Reference' => 'Referenz', 'GuideArticle' => 'Ratgeber', 'User' => 'Benutzer', 'Setting' => 'Einstellung',
        'NewsletterCampaign' => 'Newsletter',
    ];

    private const MONEY = ['price', 'total', 'subtotal', 'shipping', 'discount_total', 'refund_amount', 'free_delivery_from'];

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isAdmin();
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->modifyQueryUsing(fn ($query) => $query->with('user'))
            ->columns([
                Tables\Columns\TextColumn::make('created_at')->label('Zeit')->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('user.name')->label('Wer')->placeholder('System'),
                Tables\Columns\TextColumn::make('subject_type')->label('Bereich')->badge()->formatStateUsing(fn ($state) => self::TYPES[$state] ?? $state),
                Tables\Columns\TextColumn::make('subject_label')->label('Was')->searchable()->description(fn (ActivityLog $r) => $r->event),
                Tables\Columns\TextColumn::make('changes')->label('Änderungen')->wrap()
                    ->state(fn (ActivityLog $r) => self::describe($r))->html(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('subject_type')->label('Bereich')->options(self::TYPES),
                Tables\Filters\SelectFilter::make('user_id')->label('Wer')->relationship('user', 'name'),
                Tables\Filters\SelectFilter::make('event')->label('Aktion')->options(['erstellt' => 'erstellt', 'geändert' => 'geändert', 'gelöscht' => 'gelöscht']),
            ])
            ->actions([])
            ->bulkActions([]);
    }

    private static function describe(ActivityLog $r): HtmlString
    {
        $fmt = function ($key, $v) {
            if ($v === null || $v === '') {
                return '–';
            }
            if (in_array($key, self::MONEY, true) && is_numeric($v)) {
                return Money::format((int) $v);
            }
            if (is_bool($v) || in_array($key, ['active', 'pickup_only', 'price_on_request', 'is_default', 'stock_released'], true)) {
                return $v ? 'ja' : 'nein';
            }

            return is_scalar($v) ? (string) $v : json_encode($v, JSON_UNESCAPED_UNICODE);
        };
        $rows = collect($r->changes ?? [])->take(8)->map(function ($pair, $key) use ($r, $fmt) {
            [$old, $new] = array_pad((array) $pair, 2, null);

            return '<b>'.e($key).'</b>: '.($r->event === 'geändert' ? e($fmt($key, $old)).' → ' : '').e($fmt($key, $new));
        });
        if (count($r->changes ?? []) > 8) {
            $rows->push('…');
        }

        return new HtmlString('<span style="font-size:.8rem;line-height:1.5">'.$rows->join('<br>').'</span>');
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListActivityLogs::route('/')];
    }
}
