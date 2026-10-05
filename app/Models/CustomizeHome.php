<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeHome extends Model
{
    protected $table = 'customize_home';

    protected $fillable = [
        'home_section_tagline',
        'home_section_title',
        'home_section_description',
    ];
}
