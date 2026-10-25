<?php

namespace App\Observers;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** Protokolliert Änderungen des Teams im Admin: wer hat wann Preis, Lager, Status usw. geändert. */
class ActivityObserver
{
    private const IGNORED = ['password', 'remember_token', 'access_token', 'created_at', 'updated_at', 'low_stock_notified_at'];

    public function created(Model $model): void
    {
        $this->log($model, 'erstellt', collect($model->getAttributes())->except(self::IGNORED)
            ->filter(fn ($v) => $v !== null && $v !== '')->map(fn ($v) => [null, $v])->all());
    }

    public function updated(Model $model): void
    {
        $changes = collect($model->getChanges())->except(self::IGNORED)
            ->map(fn ($new, $key) => [$model->getRawOriginal($key), $new])
            ->reject(fn ($pair) => $pair[0] == $pair[1])->all();
        if ($changes) {
            $this->log($model, 'geändert', $changes);
        }
    }

    public function deleted(Model $model): void
    {
        $this->log($model, 'gelöscht', []);
    }

    private function log(Model $model, string $event, array $changes): void
    {
        $user = auth()->user();
        if (! $user || ! method_exists($user, 'isTeam') || ! $user->isTeam()) {
            return;
        }
        $short = fn ($v) => is_string($v) ? Str::limit($v, 200) : (is_array($v) ? Str::limit(json_encode($v, JSON_UNESCAPED_UNICODE), 200) : $v);

        ActivityLog::query()->create([
            'user_id' => $user->id,
            'subject_type' => class_basename($model),
            'subject_id' => $model->getKey(),
            'subject_label' => Str::limit(self::label($model), 160),
            'event' => $event,
            'changes' => collect($changes)->map(fn ($p) => [$short($p[0]), $short($p[1])])->all(),
        ]);
    }

    private static function label(Model $model): string
    {
        if ($model instanceof \App\Models\ProductVariant) {
            return ($model->product?->name ?? 'Produkt').' – '.$model->label;
        }

        foreach (['number', 'name', 'title', 'label', 'key', 'subject', 'email'] as $attr) {
            if (filled($model->getAttribute($attr))) {
                return (string) $model->getAttribute($attr);
            }
        }

        return '#'.$model->getKey();
    }
}
