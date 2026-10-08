<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('sections')) {
            Schema::create('sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
                $table->string('key');
                $table->string('title')->nullable();
                $table->text('highlight')->nullable();
                $table->text('description')->nullable();
                $table->integer('sort_order')->default(1);
                $table->timestamps();

                $table->unique(['page_id', 'key']);
            });
        }

        $this->seedInitialPagesAndSections();
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
        Schema::dropIfExists('pages');
    }

    private function seedInitialPagesAndSections(): void
    {
        $now = now();

        // 1. Home Page
        if (!DB::table('pages')->where('slug', 'home')->exists()) {
            $homeId = DB::table('pages')->insertGetId([
                'name' => 'Home',
                'slug' => 'home',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $homeRow = Schema::hasTable('customize_home') ? DB::table('customize_home')->first() : null;
            DB::table('sections')->insert([
                'page_id' => $homeId,
                'key' => 'hero',
                'title' => $homeRow->home_section_title ?? 'Gerakan Politik Kebangsaan Untuk Indonesia',
                'highlight' => $homeRow->home_section_tagline ?? 'Partai Garuda',
                'description' => $homeRow->home_section_description ?? 'Partai Garuda hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia. Dan setiap kader kami adalah patriot-patriot bangsa yang selalu siap menyingsingkan lengan baju untuk mewujudkan cita-cita para pendiri Bangsa dan Negara Kesatuan Republik Indonesia.',
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 2. About Page
        if (!DB::table('pages')->where('slug', 'about')->exists()) {
            $aboutId = DB::table('pages')->insertGetId([
                'name' => 'About',
                'slug' => 'about',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $aboutRow = Schema::hasTable('customize_about_us') ? DB::table('customize_about_us')->first() : null;
            DB::table('sections')->insert([
                [
                    'page_id' => $aboutId,
                    'key' => 'hero',
                    'title' => $aboutRow->about_section_title ?? 'Gerakan Politik Kebangsaan Untuk Indonesia',
                    'highlight' => $aboutRow->about_section_tagline ?? 'About Us',
                    'description' => $aboutRow->about_section_description ?? 'Partai Garuda hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia.',
                    'sort_order' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $aboutId,
                    'key' => 'visi',
                    'title' => 'Visi',
                    'highlight' => $aboutRow->visi_section_tagline ?? 'Arah perjuangan kami dibangun di atas konstitusi, nilai kebangsaan, dan komitmen untuk menghadirkan dampak yang bisa dirasakan langsung oleh rakyat.',
                    'description' => null,
                    'sort_order' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $aboutId,
                    'key' => 'misi1',
                    'title' => 'Misi 1',
                    'highlight' => $aboutRow->misi1_section_tagline ?? 'Terwujudnya cita-cita nasional bangsa Indonesia sebagaimana dimaksud dalam PembukaanUndang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
                    'description' => null,
                    'sort_order' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $aboutId,
                    'key' => 'misi2',
                    'title' => 'Misi 2',
                    'highlight' => $aboutRow->misi2_section_tagline ?? 'Terwujudnya masyarakat demokratis yang adil dan sejahtera serta berkeyakinan pada Tuhan Yang Maha Esa, mencintai tanah air dan bangsa dalam bingkai Negara Kesatuan Republik Indonesia.',
                    'description' => null,
                    'sort_order' => 4,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $aboutId,
                    'key' => 'misi3',
                    'title' => 'Misi 3',
                    'highlight' => $aboutRow->misi3_section_tagline ?? 'Mewujudkan masyarakat kedaulatan rakyat dalam berdemokrasi, yang menjunjung tinggi nilai-nilai kebenaran dan hukum yang berlaku.',
                    'description' => null,
                    'sort_order' => 5,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $aboutId,
                    'key' => 'misi4',
                    'title' => 'Misi 4',
                    'highlight' => $aboutRow->misi4_section_tagline ?? 'Mewujudkan ekonomi kerakyatan yang berkeadilan.',
                    'description' => null,
                    'sort_order' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);
        }

        // 3. Media Page
        if (!DB::table('pages')->where('slug', 'media')->exists()) {
            $mediaId = DB::table('pages')->insertGetId([
                'name' => 'Media',
                'slug' => 'media',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $mediaRow = Schema::hasTable('customize_media') ? DB::table('customize_media')->first() : null;
            DB::table('sections')->insert([
                'page_id' => $mediaId,
                'key' => 'hero',
                'title' => $mediaRow->media_section_title ?? 'Highlight Media & Dokumentasi',
                'highlight' => $mediaRow->media_section_tagline ?? 'Media Center',
                'description' => $mediaRow->media_section_description ?? 'Ruang media ini menampilkan dokumentasi gerakan, pernyataan resmi, dan aktivitas lapangan sebagai bentuk transparansi kerja organisasi kepada publik.',
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
};
