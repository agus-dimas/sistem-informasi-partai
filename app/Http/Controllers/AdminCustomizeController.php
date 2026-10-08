<?php

namespace App\Http\Controllers;

use App\Models\CustomizeStruktur;
use App\Models\Page;
use App\Models\Section;
use App\Services\ContentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCustomizeController extends Controller
{
    protected ContentService $contentService;

    public function __construct(ContentService $contentService)
    {
        $this->contentService = $contentService;
    }
    private function defaultBoardMembers()
    {
        return [
            [
                'role' => 'Ketua Umum',
                'name' => 'Ahmad Ridha Sabana',
                'bio' => 'Memimpin arah Partai dan memastikan setiap program berjalan sesuai dengan misi partai.',
                'photo' => '/images/pengurus/ketum1.png',
            ],
            [
                'role' => 'Sekretaris Jenderal',
                'name' => 'Ihsan Jauhari',
                'bio' => 'Sekjen bertanggung jawab atas jalannya administrasi dan koordinasi organisasi, serta memastikan seluruh program kerja terlaksana dengan baik.',
                'photo' => '/images/pengurus/ihsan1.png',
            ],
            [
                'role' => 'Wakil Ketua Umum',
                'name' => 'Teddy Gusnaidi',
                'bio' => 'membantu Ketua Umum dalam menjalankan kepemimpinan serta mengoordinasikan pelaksanaan program di seluruh struktur partai.',
                'photo' => '/images/pengurus/tedy1.png',
            ],
            [
                'role' => 'Ketua 1',
                'name' => 'Faisal',
                'bio' => 'Mengelola struktur organisasi dan pengembangan kader agar partai memiliki sumber daya manusia yang kuat.',
                'photo' => '/images/pengurus/faisal1.png',
            ],
            [
                'role' => 'Ketua 2',
                'name' => 'Jeffry Yulianto Waisapy',
                'bio' => 'Menyusun program kerja dan kajian kebijakan yang sesuai dengan kebutuhan masyarakat dan kondisi lapangan.',
                'photo' => '/images/pengurus/jefry1.png',
            ],
            [
                'role' => 'Ketua 3',
                'name' => 'Ahmad Muhlis Fanani',
                'bio' => 'Mengelola komunikasi publik, media, dan penyampaian informasi agar pesan partai tersampaikan dengan jelas.',
                'photo' => '/images/pengurus/caklis1.png',
            ],
            [
                'role' => 'Wakil Sekretaris Jenderal',
                'name' => 'Saiful Rahman',
                'bio' => 'Membantu koordinasi pelaksanaan program kerja serta memastikan komunikasi antarbidang dan pelaksanaan kegiatan organisasi berjalan efektif.',
                'photo' => '/images/pengurus/saiful1.png',
            ],
            [
                'role' => 'Wakil Sekretaris Jenderal',
                'name' => 'Sulistianing Sasih',
                'bio' => 'Membantu Sekretaris Jenderal dalam pengelolaan administrasi, dokumentasi, serta penataan surat-menyurat organisasi agar berjalan tertib dan terstruktur.',
                'photo' => '/images/pengurus/sulistia1.png',
            ],
            [
                'role' => 'Wakil Bendahara Umum',
                'name' => 'Eka Arum Maqshuuroh',
                'bio' => 'Membantu Bendahara Umum dalam pengelolaan kas, pencatatan transaksi, dan administrasi keuangan operasional partai agar berjalan tertib dan terkontrol.',
                'photo' => '/images/pengurus/harum1.png',
            ],
            [
                'role' => 'Wakil Bendahara Umum',
                'name' => 'Tia Fathiah',
                'bio' => 'Membantu penyusunan laporan keuangan serta pengawasan administrasi keuangan untuk memastikan transparansi dan akuntabilitas pengelolaan dana partai.',
                'photo' => '/images/pengurus/tia1.png',
            ],
            [
                'role' => 'Bendahara Umum',
                'name' => 'Fajar Muhammad Faiz Rozi',
                'bio' => 'Bendahara Umum mengelola keuangan partai secara tertib, transparan, dan bertanggung jawab sesuai kebutuhan program dan kegiatan.',
                'photo' => '/images/pengurus/pfaiz1.png',
            ],
        ];
    }

    /**
     * Customize Home
     */
    public function index()
    {
        $settings = $this->homeSettings();

        return Inertia::render('dashboard/customize/index', compact('settings'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'home_section_tagline' => 'required|string|max:255',
            'home_section_title' => 'required|string|max:255',
            'home_section_description' => 'required|string',
        ]);

        $page = Page::firstOrCreate(['slug' => 'home'], ['name' => 'Home']);

        Section::updateOrCreate(
            ['page_id' => $page->id, 'key' => 'hero'],
            [
                'title' => $request->input('home_section_title'),
                'highlight' => $request->input('home_section_tagline'),
                'description' => $request->input('home_section_description'),
                'sort_order' => 1,
            ]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten Home berhasil diperbarui.']);

        return redirect()->route('dashboard.customize.index');
    }

    /**
     * Customize About Us
     */
    public function about()
    {
        $settings = $this->aboutSettings();

        return Inertia::render('dashboard/customize/about', compact('settings'));
    }


    public function updateAbout(Request $request)
    {
        $request->validate([
            'about_section_tagline' => 'required|string|max:255',
            'about_section_title' => 'required|string|max:255',
            'about_section_description' => 'required|string',
            'visi_section_tagline' => 'required|string|max:255',
            'misi1_section_tagline' => 'required|string|max:255',
            'misi2_section_tagline' => 'required|string|max:255',
            'misi3_section_tagline' => 'required|string|max:255',
            'misi4_section_tagline' => 'required|string|max:255',
        ]);

        $page = Page::firstOrCreate(['slug' => 'about'], ['name' => 'About']);

        $sectionsData = [
            'hero' => [
                'title' => $request->input('about_section_title'),
                'highlight' => $request->input('about_section_tagline'),
                'description' => $request->input('about_section_description'),
                'sort_order' => 1,
            ],
            'visi' => [
                'title' => 'Visi',
                'highlight' => $request->input('visi_section_tagline'),
                'description' => null,
                'sort_order' => 2,
            ],
            'misi1' => [
                'title' => 'Misi 1',
                'highlight' => $request->input('misi1_section_tagline'),
                'description' => null,
                'sort_order' => 3,
            ],
            'misi2' => [
                'title' => 'Misi 2',
                'highlight' => $request->input('misi2_section_tagline'),
                'description' => null,
                'sort_order' => 4,
            ],
            'misi3' => [
                'title' => 'Misi 3',
                'highlight' => $request->input('misi3_section_tagline'),
                'description' => null,
                'sort_order' => 5,
            ],
            'misi4' => [
                'title' => 'Misi 4',
                'highlight' => $request->input('misi4_section_tagline'),
                'description' => null,
                'sort_order' => 6,
            ],
        ];

        foreach ($sectionsData as $key => $data) {
            Section::updateOrCreate(
                ['page_id' => $page->id, 'key' => $key],
                $data
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten About Us berhasil diperbarui.']);

        return redirect()->route('dashboard.customize.about');
    }

    /**
     * Customize Struktur
     */
    public function struktur()
    {
        $boardMembers = CustomizeStruktur::query()->find(1)?->members;
        $boardMembers = is_array($boardMembers) && $boardMembers !== []
            ? $boardMembers
            : $this->defaultBoardMembers();

        return Inertia::render('dashboard/customize/struktur', compact('boardMembers'));
    }

    public function updateStruktur(Request $request)
    {
        $request->validate([
            'members' => 'required|array|min:1',
            'members.*.role' => 'required|string|max:255',
            'members.*.name' => 'required|string|max:255',
            'members.*.bio' => 'nullable|string',
            'members.*.photo' => 'nullable|image|max:5120',
        ]);

        $inputMembers = $request->input('members', []);
        $existingMembers = CustomizeStruktur::query()->find(1)?->members;
        $existingMembers = is_array($existingMembers) && $existingMembers !== []
            ? $existingMembers
            : $this->defaultBoardMembers();
        $updatedMembers = [];
        $newUploads = [];

        foreach ($inputMembers as $index => $memberData) {
            $photoPath = $memberData['existing_photo'] ?? '/images/p1.png';

            if ($request->hasFile("members.{$index}.photo")) {
                $file = $request->file("members.{$index}.photo");
                $storedPath = $file->store('pengurus', 'public');
                if (!is_string($storedPath)) {
                    Storage::disk('public')->delete($newUploads);

                    return back()->withErrors([
                        "members.{$index}.photo" => 'Foto gagal disimpan. Silakan coba unggah kembali.',
                    ]);
                }

                $newUploads[] = $storedPath;
                $photoPath = '/storage/' . $storedPath;
            }

            $updatedMembers[] = [
                'role' => $memberData['role'],
                'name' => $memberData['name'],
                'bio' => $memberData['bio'] ?? '',
                'photo' => $photoPath,
            ];
        }

        try {
            DB::transaction(fn() => CustomizeStruktur::updateOrCreate(
                ['id' => 1],
                ['members' => $updatedMembers],
            ));
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($newUploads);
            throw $exception;
        }

        $retainedUploads = collect($updatedMembers)
            ->pluck('photo')
            ->filter(fn($photo) => is_string($photo) && str_starts_with($photo, '/storage/pengurus/'))
            ->map(fn($photo) => Str::after($photo, '/storage/'))
            ->all();

        $replacedUploads = collect($existingMembers)
            ->pluck('photo')
            ->filter(fn($photo) => is_string($photo) && str_starts_with($photo, '/storage/pengurus/'))
            ->map(fn($photo) => Str::after($photo, '/storage/'))
            ->diff($retainedUploads)
            ->values()
            ->all();

        if ($replacedUploads !== []) {
            Storage::disk('public')->delete($replacedUploads);
        }

        $message = match (count($updatedMembers) <=> count($existingMembers)) {
            1 => 'Pengurus berhasil ditambahkan.',
            -1 => 'Pengurus berhasil dihapus.',
            default => 'Data pengurus berhasil diperbarui.',
        };

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return redirect()->route('dashboard.customize.struktur');
    }

    /**
     * Customize Media
     */
    public function media()
    {
        $settings = $this->mediaSettings();

        return Inertia::render('dashboard/customize/media', compact('settings'));
    }

    public function updateMedia(Request $request)
    {
        $request->validate([
            'media_section_tagline' => 'required|string|max:255',
            'media_section_title' => 'required|string|max:255',
            'media_section_description' => 'required|string',
        ]);

        $page = Page::firstOrCreate(['slug' => 'media'], ['name' => 'Media']);

        Section::updateOrCreate(
            ['page_id' => $page->id, 'key' => 'hero'],
            [
                'title' => $request->input('media_section_title'),
                'highlight' => $request->input('media_section_tagline'),
                'description' => $request->input('media_section_description'),
                'sort_order' => 1,
            ]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten Media berhasil diperbarui.']);

        return redirect()->route('dashboard.customize.media');
    }

    /**
     * Endpoint API publik untuk menyajikan seluruh settings ke React / Frontend.
     */
    public function apiIndex()
    {
        $struktur = CustomizeStruktur::query()->first();
        $members = $struktur?->members;

        if (!is_array($members) || $members === []) {
            $members = $this->defaultBoardMembers();
        }

        return response()->json(array_merge(
            $this->homeSettings(),
            $this->aboutSettings(),
            ['struktur_board_members' => $members],
            $this->mediaSettings(),
            ['pageContent' => $this->contentService->getAllContent()]
        ));
    }

    private function homeSettings(): array
    {
        $hero = $this->contentService->getSection('home', 'hero');

        return [
            'home_section_tagline' => $hero['highlight'] ?? '',
            'home_section_title' => $hero['title'] ?? '',
            'home_section_description' => $hero['description'] ?? '',
        ];
    }

    private function aboutSettings(): array
    {
        $hero = $this->contentService->getSection('about', 'hero');

        return [
            'about_section_tagline' => $hero['highlight'] ?? '',
            'about_section_title' => $hero['title'] ?? '',
            'about_section_description' => $hero['description'] ?? '',
            'visi_section_tagline' => $this->contentService->get('about', 'visi', 'highlight') ?? '',
            'misi1_section_tagline' => $this->contentService->get('about', 'misi1', 'highlight') ?? '',
            'misi2_section_tagline' => $this->contentService->get('about', 'misi2', 'highlight') ?? '',
            'misi3_section_tagline' => $this->contentService->get('about', 'misi3', 'highlight') ?? '',
            'misi4_section_tagline' => $this->contentService->get('about', 'misi4', 'highlight') ?? '',
        ];
    }

    private function mediaSettings(): array
    {
        $hero = $this->contentService->getSection('media', 'hero');

        return [
            'media_section_tagline' => $hero['highlight'] ?? '',
            'media_section_title' => $hero['title'] ?? '',
            'media_section_description' => $hero['description'] ?? '',
        ];
    }
}
