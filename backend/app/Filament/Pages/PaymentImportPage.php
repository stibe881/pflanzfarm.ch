<?php

namespace App\Filament\Pages;

use App\Models\PaymentImport;
use App\Services\PaymentImporter;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

/** Bankdatei (camt.054/053) hochladen: bezahlte Rechnungen werden automatisch verbucht. */
class PaymentImportPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationGroup = 'Shop';

    protected static ?string $navigationLabel = 'Zahlungen importieren';

    protected static ?string $title = 'Zahlungen importieren';

    protected static ?string $slug = 'zahlungen-importieren';

    protected static ?int $navigationSort = 7;

    protected static string $view = 'filament.pages.payment-import';

    public ?array $data = [];

    public ?array $result = null;

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isTeam();
    }

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form->statePath('data')->schema([
            Forms\Components\FileUpload::make('file')->label('Bankdatei (camt.054 oder camt.053, XML)')
                ->helperText('Im E-Banking unter «Kontoauszüge/Gutschriften» als camt.054 (Sammelgutschrift QR-Rechnung) oder camt.053 herunterladen. Mehrere Dateien nacheinander hochladen.')
                ->acceptedFileTypes(['text/xml', 'application/xml', 'application/octet-stream', 'application/zip'])
                ->maxSize(10240)->storeFiles(false)->required(),
        ]);
    }

    public function import(PaymentImporter $importer): void
    {
        $file = $this->form->getState()['file'] ?? null;
        $file = is_array($file) ? reset($file) : $file;
        if (! $file instanceof TemporaryUploadedFile) {
            return;
        }

        try {
            $entries = $importer->parse((string) file_get_contents($file->getRealPath()));
        } catch (\Throwable $e) {
            Notification::make()->title('Datei konnte nicht gelesen werden')->body($e->getMessage())->danger()->send();

            return;
        }
        $rows = $importer->apply($entries);
        $paid = collect($rows)->filter(fn ($r) => str_starts_with($r['status'], 'bezahlt'))->count();

        PaymentImport::query()->create([
            'user_id' => auth()->id(),
            'filename' => $file->getClientOriginalName(),
            'entries' => count($rows),
            'matched' => $paid,
            'result' => $rows,
        ]);
        $this->result = $rows;
        $this->form->fill();

        Notification::make()->title(count($rows).' Gutschrift(en) gelesen, '.$paid.' Rechnung(en) als bezahlt verbucht')->success()->send();
    }

    public function getHistoryProperty()
    {
        return PaymentImport::query()->with('user')->latest()->limit(10)->get();
    }
}
