<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeAboutUs extends Model
{
    protected $table = 'customize_about_us';

    protected $fillable = [
        'about_section_tagline',
        'about_section_title',
        'about_section_description',
        'visi_section_tagline',
        'misi1_section_tagline',
        'misi2_section_tagline',
        'misi3_section_tagline',
        'misi4_section_tagline',
    ];
}
