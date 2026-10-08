<?php

namespace App\Http\Controllers;

use App\Models\CustomizeStruktur;
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
        $settings = [
            'sections' => $this->contentService->getPage('home'),
        ];

        return Inertia::render('dashboard/customize/index', compact('settings'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1'],
            'sections.*' => ['required', 'array'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.highlight' => ['nullable', 'string'],
            'sections.*.description' => ['nullable', 'string'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:1'],
        ]);

        $this->contentService->updatePageSections('home', $validated['sections']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konten Home berhasil diperbarui.']);

        return redirect()->route('dashboard.customize.index');
    }

    /**
     * Customize About Us
     */
    public function about()
    {
        $settings = [
            'sections' => $this->contentService->getPage('about'),
        ];

        return Inertia::render('dashboard/customize/about', compact('settings'));
    }


    public function updateAbout(Request $request)
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1'],
            'sections.*' => ['required', 'array'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.highlight' => ['nullable', 'string'],
            'sections.*.description' => ['nullable', 'string'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:1'],
        ]);

        $this->contentService->updatePageSections('about', $validated['sections']);

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
        $settings = [
            'sections' => $this->contentService->getPage('media'),
        ];

        return Inertia::render('dashboard/customize/media', compact('settings'));
    }

    public function updateMedia(Request $request)
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1'],
            'sections.*' => ['required', 'array'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.highlight' => ['nullable', 'string'],
            'sections.*.description' => ['nullable', 'string'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:1'],
        ]);

        $this->contentService->updatePageSections('media', $validated['sections']);

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

        return response()->json([
            'struktur_board_members' => $members,
            'pageContent' => $this->contentService->getAllContent(),
        ]);
    }
}
