<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeStruktur extends Model
{
    protected $table = 'customize_struktur';

    protected $fillable = [
        'struktur_section_tagline',
        'struktur_section_title',
        'struktur_section_description',
        'members',
    ];

    protected function casts(): array
    {
        return [
            'members' => 'array',
        ];
    }
}
