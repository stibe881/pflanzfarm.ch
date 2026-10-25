<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PopupResource\Pages;
use App\Models\Popup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Carbon;
use Illuminate\Support\HtmlString;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class PopupResource extends Resource
{
    protected static ?string $model = Popup::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationGroup = 'Inhalte';

    protected static ?string $modelLabel = 'Popup';

    protected static ?string $pluralModelLabel = 'Saisonale Popups';

    public static function form(Form $form): Form
    {
        return $form->columns(5)->schema([
            Forms\Components\Section::make('Inhalt und Zeitraum')->columnSpan(['default' => 5, 'xl' => 3])->columns(2)->schema([
                Forms\Components\TextInput::make('title')->label('Titel')->required()->maxLength(80)->live(debounce: 400),
                Forms\Components\TextInput::make('cta_label')->label('Knopf-Beschriftung')->required()->maxLength(40)->live(debounce: 400),
                Forms\Components\Textarea::make('text')->label('Text')->required()->rows(3)->maxLength(300)->columnSpanFull()->live(debounce: 400),
                Forms\Components\Select::make('cta_target')->label('Knopf führt zu')->options(Popup::TARGETS)->required()->default('shop')->live(),
                Forms\Components\Select::make('pages')->label('Anzeigen auf')->options(Popup::PAGES)->required()->default('startseite')->live(),
                Forms\Components\DatePicker::make('starts_at')->label('Sichtbar ab')->native(false)->displayFormat('d.m.Y')->live(),
                Forms\Components\DatePicker::make('ends_at')->label('Sichtbar bis')->native(false)->displayFormat('d.m.Y')->afterOrEqual('starts_at')->live(),
                Forms\Components\TextInput::make('delay')->label('Verzögerung (Sekunden)')->numeric()->minValue(0)->maxValue(30)->default(1)->live(debounce: 400),
                Forms\Components\Toggle::make('active')->label('Aktiv')->default(true)->inline(false)->live(),
                Forms\Components\FileUpload::make('image')->label('Bild')->image()->imageEditor()->disk('public')->directory('popups')->maxSize(5120)->columnSpanFull()->live(),
                Forms\Components\Placeholder::make('hint')->label('')->columnSpanFull()
                    ->content('Es wird jeweils das aktive Popup gezeigt, dessen Zeitraum das heutige Datum enthält – pro Besuch einmal.'),
            ]),
            Forms\Components\Section::make('Live-Vorschau')->columnSpan(['default' => 5, 'xl' => 2])
                ->extraAttributes(['style' => 'position: sticky; top: 5rem;'])
                ->headerActions([
                    Forms\Components\Actions\Action::make('toggleMobile')
                        ->label(fn (Forms\Get $get) => $get('preview_mobile') ? 'Desktop-Ansicht' : 'Handy-Ansicht')
                        ->icon(fn (Forms\Get $get) => $get('preview_mobile') ? 'heroicon-m-computer-desktop' : 'heroicon-m-device-phone-mobile')
                        ->link()
                        ->action(fn (Forms\Get $get, Forms\Set $set) => $set('preview_mobile', ! $get('preview_mobile'))),
                ])
                ->schema([
                    Forms\Components\Hidden::make('preview_mobile')->default(false)->dehydrated(false),
                    Forms\Components\Placeholder::make('preview')->hiddenLabel()->content(fn (Forms\Get $get) => new HtmlString(view('filament.forms.popup-preview', self::previewData($get))->render())),
                ]),
        ]);
    }

    /** Werte aus dem Formular für die Vorschau aufbereiten (inkl. frisch hochgeladenem Bild). */
    private static function previewData(Forms\Get $get): array
    {
        $image = null;
        foreach ((array) $get('image') as $file) {
            if ($file instanceof TemporaryUploadedFile) {
                try {
                    $image = $file->temporaryUrl();
                } catch (\Throwable) {
                    $image = null;
                }
            } elseif (is_string($file) && $file !== '') {
                $image = str_starts_with($file, '/assets/') ? $file : '/storage/'.ltrim($file, '/');
            }
        }

        $today = now()->startOfDay();
        $from = $get('starts_at') ? Carbon::parse($get('starts_at'))->startOfDay() : null;
        $until = $get('ends_at') ? Carbon::parse($get('ends_at'))->endOfDay() : null;
        $live = (bool) $get('active') && (! $from || $from->lte($today)) && (! $until || $until->gte($today));

        return [
            'title' => $get('title'),
            'text' => $get('text'),
            'cta' => $get('cta_label'),
            'image' => $image,
            'target' => Popup::TARGETS[$get('cta_target')] ?? '–',
            'pages' => Popup::PAGES[$get('pages')] ?? '–',
            'delay' => (int) ($get('delay') ?? 1),
            'live' => $live,
            'mobile' => (bool) $get('preview_mobile'),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('starts_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('')->disk('public'),
                Tables\Columns\TextColumn::make('title')->label('Titel')->searchable(),
                Tables\Columns\TextColumn::make('starts_at')->label('Ab')->date('d.m.Y'),
                Tables\Columns\TextColumn::make('ends_at')->label('Bis')->date('d.m.Y'),
                Tables\Columns\TextColumn::make('live')->label('Jetzt sichtbar')->state(fn (Popup $record) => Popup::query()->current()->whereKey($record->id)->exists() ? 'Ja' : 'Nein')
                    ->badge()->color(fn ($state) => $state === 'Ja' ? 'success' : 'gray'),
                Tables\Columns\ToggleColumn::make('active')->label('Aktiv'),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\ReplicateAction::make()->label('Duplizieren'), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPopups::route('/'),
            'create' => Pages\CreatePopup::route('/create'),
            'edit' => Pages\EditPopup::route('/{record}/edit'),
        ];
    }
}
