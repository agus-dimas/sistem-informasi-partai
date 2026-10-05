<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeMedia extends Model
{
    protected $table = 'customize_media';

    protected $fillable = [
        'media_section_tagline',
        'media_section_title',
        'media_section_description',
    ];
}
