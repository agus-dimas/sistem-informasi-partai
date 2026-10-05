<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function create()
    {
        return Inertia::render('consultations/create', [
            'sent' => request()->boolean('sent'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,webp,pdf'],
        ]);

        try {
            if ($request->hasFile('attachment')) {
                $validated['attachment_path'] = $request->file('attachment')->store('consultations', 'public');
            }

            $validated['user_id'] = $request->user()->id;

            Consultation::create($validated);
        } catch (\Throwable $e) {
            report($e);

            return back()
                ->withErrors(['attachment' => 'Upload gagal. Coba gunakan file lain atau ulangi kembali.'])
                ->withInput();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Konsultasi berhasil dikirim.']);

        return redirect()->route('consultations.create');
    }

    public function index()
    {
        Consultation::where('is_read', false)->update(['is_read' => true]);

        $consultations = Consultation::latest()->paginate(2);

        return Inertia::render('dashboard/consultations/index', [
            'consultations' => $consultations,
        ]);
    }

    public function respond(Request $request, Consultation $consultation)
    {
        $validated = $request->validate([
            'response' => ['nullable', 'string', 'max:2000'],
        ]);

        $consultation->update([
            'response' => $validated['response'] ?? null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Respon konsultasi berhasil disimpan.']);

        return back();
    }
}
