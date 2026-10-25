<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderWorkflow;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Illuminate\Support\Collection;

/** Bestellungen als Board: Neu → Bestätigt → Geliefert, per Ziehen (oder Knopf auf dem Handy) weiterschieben. */
class OrderBoard extends Page
{
    protected static string $resource = OrderResource::class;

    protected static string $view = 'filament.pages.order-board';

    protected static ?string $title = 'Bestellungen';

    public bool $notify = true;

    public string $search = '';

    public const COLUMNS = ['neu' => 'Neu', 'bestaetigt' => 'Bestätigt', 'geliefert' => 'Geliefert / abgeholt (14 Tage)'];

    public function mount(): void
    {
        ListOrders::rememberView('board');
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('list')->label('Listen-Ansicht')->icon('heroicon-o-list-bullet')->color('gray')
                ->action(function () {
                    ListOrders::rememberView('liste');

                    return redirect(OrderResource::getUrl('index'));
                }),
            Actions\CreateAction::make()->label('Bestellung erfassen')->url(OrderResource::getUrl('create')),
        ];
    }

    /** @return array<string, Collection<int, Order>> */
    public function getColumnsProperty(): array
    {
        $q = trim($this->search);
        $base = Order::query()->where('payment_status', '!=', 'ausstehend')
            ->when($q !== '', fn ($w) => $w->where(fn ($x) => $x->where('number', 'like', "%{$q}%")->orWhere('name', 'like', "%{$q}%")->orWhere('city', 'like', "%{$q}%")));

        return [
            'neu' => (clone $base)->where('status', 'neu')->orderBy('created_at')->get(),
            'bestaetigt' => (clone $base)->where('status', 'bestaetigt')->orderByRaw('scheduled_date is null')->orderBy('scheduled_date')->orderBy('created_at')->get(),
            'geliefert' => (clone $base)->where('status', 'geliefert')->where('delivered_at', '>=', now()->subDays(14))->latest('delivered_at')->get(),
        ];
    }

    public function move(int $id, string $to): void
    {
        $order = Order::query()->findOrFail($id);
        if ($order->status === $to) {
            return;
        }
        $wf = app(OrderWorkflow::class);
        $ok = match (true) {
            $to === 'bestaetigt' && $order->status === 'neu' => $wf->confirm($order, notify: $this->notify),
            $to === 'geliefert' => $wf->deliver($order, notify: $this->notify),
            default => $wf->reopen($order, $to),
        };
        $mail = $this->notify && $order->email && in_array($to, ['bestaetigt', 'geliefert'], true) && $ok;
        Notification::make()
            ->title($ok ? $order->number.': '.Order::STATUSES[$to].($mail ? ' – E-Mail gesendet' : '') : $order->number.' kann nicht verschoben werden')
            ->{$ok ? 'success' : 'warning'}()->send();
    }
}
