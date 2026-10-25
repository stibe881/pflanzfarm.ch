<?php

namespace App\Observers;

use App\Services\ImageOptimizer;
use Illuminate\Database\Eloquent\Model;

/** Neue Uploads (Bild, Galerie) beim Speichern optimieren. */
class ImageObserver
{
    public function saved(Model $model): void
    {
        $optimizer = app(ImageOptimizer::class);
        foreach (['image', 'gallery', 'before_image'] as $attr) {
            if ($model->wasChanged($attr) || $model->wasRecentlyCreated) {
                foreach ((array) $model->getAttribute($attr) as $path) {
                    $optimizer->optimize(is_string($path) ? $path : null);
                }
            }
        }
    }
}
