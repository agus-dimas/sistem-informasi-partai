<?php

namespace App\Services;

use App\Models\Page;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

class ContentService
{
    /**
     * Default content values for fallback if pages/sections do not exist in DB yet.
     */
    protected array $defaults = [
        'home' => [
            'hero' => [
                'title' => 'Gerakan Politik Kebangsaan Untuk Indonesia',
                'highlight' => 'Partai Garuda',
                'description' => 'Partai Garuda hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia. Dan setiap kader kami adalah patriot-patriot bangsa yang selalu siap menyingsingkan lengan baju untuk mewujudkan cita-cita para pendiri Bangsa dan Negara Kesatuan Republik Indonesia.',
            ],
        ],
        'about' => [
            'hero' => [
                'title' => 'Gerakan Politik Kebangsaan Untuk Indonesia',
                'highlight' => 'About Us',
                'description' => 'Partai Garuda hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia.',
            ],
            'identity' => [
                'title' => 'Identitas Partai Garuda untuk kedaulatan bangsa',
                'highlight' => 'Menyatukan Semangat, Menguatkan Indonesia',
                'description' => 'Atribut partai Garuda mencerminkan nilai, jati diri, dan semangat perjuangan untuk bangsa dan rakyat. Setiap elemen lambang menegaskan komitmen partai dalam mengawal kedaulatan dan kesejahteraan masyarakat.',
            ],
            'visi' => [
                'title' => 'Visi',
                'highlight' => 'Arah perjuangan kami dibangun di atas konstitusi, nilai kebangsaan, dan komitmen untuk menghadirkan dampak yang bisa dirasakan langsung oleh rakyat.',
                'description' => null,
            ],
            'misi1' => [
                'title' => 'Misi 1',
                'highlight' => 'Terwujudnya cita-cita nasional bangsa Indonesia sebagaimana dimaksud dalam PembukaanUndang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
                'description' => null,
            ],
            'misi2' => [
                'title' => 'Misi 2',
                'highlight' => 'Terwujudnya masyarakat demokratis yang adil dan sejahtera serta berkeyakinan pada Tuhan Yang Maha Esa, mencintai tanah air dan bangsa dalam bingkai Negara Kesatuan Republik Indonesia.',
                'description' => null,
            ],
            'misi3' => [
                'title' => 'Misi 3',
                'highlight' => 'Mewujudkan masyarakat kedaulatan rakyat dalam berdemokrasi, yang menjunjung tinggi nilai-nilai kebenaran dan hukum yang berlaku.',
                'description' => null,
            ],
            'misi4' => [
                'title' => 'Misi 4',
                'highlight' => 'Mewujudkan ekonomi kerakyatan yang berkeadilan.',
                'description' => null,
            ],
        ],
        'media' => [
            'hero' => [
                'title' => 'Highlight Media & Dokumentasi',
                'highlight' => 'Media Center',
                'description' => 'Ruang media ini menampilkan dokumentasi gerakan, pernyataan resmi, dan aktivitas lapangan sebagai bentuk transparansi kerja organisasi kepada publik.',
            ],
        ],
    ];

    /**
     * Dapatkan seluruh content dari sebuah halaman (slug)
     */
    public function getPage(string $pageSlug): array
    {
        $page = Page::with('sections')->where('slug', $pageSlug)->first();
        $defaultsForPage = $this->defaults[$pageSlug] ?? [];

        if (!$page) {
            return $defaultsForPage;
        }

        $sections = [];
        foreach ($page->sections as $sec) {
            $sections[$sec->key] = [
                'title' => $sec->title ?? ($defaultsForPage[$sec->key]['title'] ?? null),
                'highlight' => $sec->highlight ?? ($defaultsForPage[$sec->key]['highlight'] ?? null),
                'description' => $sec->description ?? ($defaultsForPage[$sec->key]['description'] ?? null),
            ];
        }

        foreach ($defaultsForPage as $key => $defaultSec) {
            if (!isset($sections[$key])) {
                $sections[$key] = $defaultSec;
            }
        }

        return $sections;
    }

    /**
     * Dapatkan content dari section tertentu pada sebuah halaman
     */
    public function getSection(string $pageSlug, string $sectionKey): array
    {
        $pageData = $this->getPage($pageSlug);

        if (isset($pageData[$sectionKey])) {
            return $pageData[$sectionKey];
        }

        return [
            'title' => $this->defaults[$pageSlug][$sectionKey]['title'] ?? '',
            'highlight' => $this->defaults[$pageSlug][$sectionKey]['highlight'] ?? '',
            'description' => $this->defaults[$pageSlug][$sectionKey]['description'] ?? '',
        ];
    }

    /**
     * Helper untuk mengambil field tertentu dari section
     */
    public function get(string $pageSlug, string $sectionKey, string $field): mixed
    {
        $section = $this->getSection($pageSlug, $sectionKey);

        return $section[$field] ?? null;
    }

    /**
     * Dapatkan seluruh content dari semua halaman.
     */
    public function getAllContent(): array
    {
        $pages = Page::with('sections')->get();
        $result = $this->defaults;

        foreach ($pages as $page) {
            $pageSlug = $page->slug;
            if (!isset($result[$pageSlug])) {
                $result[$pageSlug] = [];
            }

            foreach ($page->sections as $sec) {
                $result[$pageSlug][$sec->key] = [
                    'title' => $sec->title ?? ($this->defaults[$pageSlug][$sec->key]['title'] ?? null),
                    'highlight' => $sec->highlight ?? ($this->defaults[$pageSlug][$sec->key]['highlight'] ?? null),
                    'description' => $sec->description ?? ($this->defaults[$pageSlug][$sec->key]['description'] ?? null),
                ];
            }
        }

        return $result;
    }

    /**
     * Memperbarui atau menyimpan banyak section sekaligus secara dinamis untuk sebuah halaman
     */
    public function updatePageSections(string $pageSlug, array $sectionsData): void
    {
        DB::transaction(function () use ($pageSlug, $sectionsData): void {
            $page = Page::firstOrCreate(['slug' => $pageSlug], ['name' => ucfirst($pageSlug)]);
            $sortOrder = 1;

            foreach ($sectionsData as $key => $data) {
                $currentSortOrder = $data['sort_order'] ?? $sortOrder;

                Section::updateOrCreate(
                    ['page_id' => $page->id, 'key' => $key],
                    [
                        'title' => $data['title'] ?? null,
                        'highlight' => $data['highlight'] ?? null,
                        'description' => $data['description'] ?? null,
                        'sort_order' => $currentSortOrder,
                    ]
                );

                $sortOrder = $currentSortOrder + 1;
            }
        });
    }
}
