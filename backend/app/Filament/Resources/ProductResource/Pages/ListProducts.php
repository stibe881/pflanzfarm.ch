<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductCsv;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ListProducts extends ListRecords
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ActionGroup::make([
                Actions\Action::make('prices')->label('Preise anpassen …')->icon('heroicon-o-receipt-percent')
                    ->form([
                        Forms\Components\Select::make('category')->label('Kategorie')->options(Product::CATEGORIES)->placeholder('alle Produkte'),
                        Forms\Components\TextInput::make('percent')->label('Änderung')->numeric()->required()->suffix('%')
                            ->helperText('z. B. 5 für +5 % oder -10 für −10 %')->minValue(-90)->maxValue(200),
                        Forms\Components\Select::make('round')->label('Runden auf')->required()->default(10)
                            ->options([5 => '5 Rappen', 10 => '10 Rappen', 50 => '50 Rappen', 100 => 'ganze Franken']),
                    ])
                    ->modalDescription('Gilt für alle Grössen mit Preis. Jede Änderung steht im Änderungsprotokoll.')
                    ->action(function (array $data) {
                        $n = app(ProductCsv::class)->adjustPrices($data['category'] ?? null, (float) $data['percent'], (int) $data['round']);
                        Notification::make()->title("{$n} Preise angepasst")->success()->send();
                    }),
                Actions\Action::make('export')->label('Export (Excel/CSV)')->icon('heroicon-o-arrow-down-tray')
                    ->action(fn () => response()->streamDownload(fn () => print(app(ProductCsv::class)->export()), 'pflanzfarm-produkte-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8'])),
                Actions\Action::make('import')->label('Import (Preise und Lager) …')->icon('heroicon-o-arrow-up-tray')
                    ->form([
                        Forms\Components\FileUpload::make('file')->label('CSV-Datei')->storeFiles(false)->required()
                            ->acceptedFileTypes(['text/csv', 'text/plain', 'application/vnd.ms-excel', 'application/csv'])
                            ->helperText('Zuerst exportieren, in Excel Preise/Lager ändern, als CSV speichern und hier hochladen. Leere Zellen bleiben unverändert. Neue Zeilen mit bestehendem produkt_slug werden als neue Grösse angelegt.'),
                    ])
                    ->action(function (array $data) {
                        $file = is_array($data['file']) ? reset($data['file']) : $data['file'];
                        $content = $file instanceof TemporaryUploadedFile ? (string) file_get_contents($file->getRealPath()) : '';
                        $r = app(ProductCsv::class)->import($content);
                        Notification::make()
                            ->title("{$r['updated']} aktualisiert, {$r['created']} neu, {$r['unchanged']} unverändert")
                            ->body($r['errors'] ? implode("\n", array_slice($r['errors'], 0, 8)).(count($r['errors']) > 8 ? "\n…" : '') : null)
                            ->{$r['errors'] ? 'warning' : 'success'}()->persistent((bool) $r['errors'])->send();
                    }),
            ])->label('Werkzeuge')->icon('heroicon-m-wrench-screwdriver')->button()->color('gray'),
            Actions\CreateAction::make(),
        ];
    }
}
