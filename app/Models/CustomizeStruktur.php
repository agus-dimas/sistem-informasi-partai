<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeStruktur extends Model
{
    protected $table = 'customize_struktur';

    protected $fillable = [
        'members',
    ];

    protected function casts(): array
    {
        return [
            'members' => 'array',
        ];
    }
}
