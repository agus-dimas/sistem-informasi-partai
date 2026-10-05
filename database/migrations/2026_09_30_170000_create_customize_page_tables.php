<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customize_home', function (Blueprint $table) {
            $table->id();
            $table->string('home_section_tagline')->nullable();
            $table->string('home_section_title')->nullable();
            $table->text('home_section_description')->nullable();
            $table->timestamps();
        });

        Schema::create('customize_about_us', function (Blueprint $table) {
            $table->id();
            $table->string('about_section_tagline')->nullable();
            $table->string('about_section_title')->nullable();
            $table->text('about_section_description')->nullable();
            $table->text('visi_section_tagline')->nullable();
            $table->text('misi1_section_tagline')->nullable();
            $table->text('misi2_section_tagline')->nullable();
            $table->text('misi3_section_tagline')->nullable();
            $table->text('misi4_section_tagline')->nullable();
            $table->timestamps();
        });

        Schema::create('customize_struktur', function (Blueprint $table) {
            $table->id();
            $table->json('members')->nullable();
            $table->timestamps();
        });

        Schema::create('customize_media', function (Blueprint $table) {
            $table->id();
            $table->string('media_section_tagline')->nullable();
            $table->string('media_section_title')->nullable();
            $table->text('media_section_description')->nullable();
            $table->timestamps();
        });

        $legacy = Schema::hasTable('site_settings')
            ? DB::table('site_settings')->pluck('value', 'key')->all()
            : [];

        $this->copyLegacyPage($legacy, 'customize_home', [
            'home_section_tagline',
            'home_section_title',
            'home_section_description',
        ]);

        $this->copyLegacyPage($legacy, 'customize_about_us', [
            'about_section_tagline',
            'about_section_title',
            'about_section_description',
            'visi_section_tagline',
            'misi1_section_tagline',
            'misi2_section_tagline',
            'misi3_section_tagline',
            'misi4_section_tagline',
        ]);

        $members = json_decode($legacy['struktur_board_members'] ?? '[]', true);

        if (is_array($members) && $members !== []) {
            DB::table('customize_struktur')->insert([
                'members' => json_encode($members),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->copyLegacyPage($legacy, 'customize_media', [
            'media_section_tagline',
            'media_section_title',
            'media_section_description',
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('customize_media');
        Schema::dropIfExists('customize_struktur');
        Schema::dropIfExists('customize_about_us');
        Schema::dropIfExists('customize_home');
    }

    private function copyLegacyPage(array $legacy, string $table, array $keys): void
    {
        $values = array_intersect_key($legacy, array_flip($keys));

        if ($values === []) {
            return;
        }

        DB::table($table)->insert($values + [
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
