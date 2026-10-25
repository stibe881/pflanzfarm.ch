<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reference extends Model
{
    public const TAGS = ['Sichtschutz' => 'Sichtschutz', 'Gartenumbau' => 'Gartenumbau', 'Neubau' => 'Neubau', 'Pflege' => 'Pflege'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['tags' => 'array', 'on_homepage' => 'boolean', 'active' => 'boolean'];
    }
}
