<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideArticle extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['published' => 'boolean', 'remind_months' => 'array'];
    }

    /** @return array<int, string> Absätze */
    public function paragraphs(): array
    {
        return array_values(array_filter(array_map('trim', preg_split("/\R\s*\R/", (string) $this->body))));
    }

    public function summary(): string
    {
        return $this->excerpt ?: \Illuminate\Support\Str::limit($this->paragraphs()[0] ?? '', 180);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
