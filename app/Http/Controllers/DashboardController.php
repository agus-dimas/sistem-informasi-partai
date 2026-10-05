<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function __invoke(Request $request)
    {
        $user = auth()->user();
        $isAdmin = in_array($user->role, ['admin', 'super_admin'], true);

        if ($isAdmin) {

            $search = $request->input('search');

            $news = News::with('user')
                ->latest()
                ->when($search, function ($query, $search) {
                    return $query->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                })
                ->paginate(3);

            $consultationCount = Consultation::where('is_read', false)->count();
            $consultations = collect();
        } else {
            $news = News::with('user')->where('user_id', $user->id)->latest()->paginate(3);
            $consultationCount = Consultation::where('user_id', $user->id)->count();
            $consultations = Consultation::where('user_id', $user->id)->latest()->paginate(5);
        }

        return Inertia::render('dashboard', [
            'news' => $news,
            'consultationCount' => $consultationCount,
            'consultations' => $consultations,
            'isAdmin' => $isAdmin,
            'search' => $request->input('search', ''),
        ]);
    }
}
