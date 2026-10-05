<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboard/news/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => 'nullable|image',
            'category' => 'required|string|max:255',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        News::create([
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
            'image' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil ditambahkan.']);

        return redirect()->route('dashboard');
    }

    public function edit($id)
    {
        $news = News::findOrFail($id);
        return Inertia::render('dashboard/news/edit', [
            'news' => $news,
        ]);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => 'nullable|image',
            'category' => 'required|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image) {
                \Storage::disk('public')->delete($news->image);
            }
            $news->image = $request->file('image')->store('news', 'public');
        }

        $news->title = $request->title;
        $news->content = $request->content;
        $news->category = $request->category;
        $news->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil diperbarui.']);

        return redirect()->route('dashboard');
    }

    public function index()
    {
        $news = News::latest()->get();
        return Inertia::render('news/index', compact('news'));
    }

    public function show($id)
    {
        $news = News::with(['user', 'comments.user', 'likes'])->findOrFail($id);

        // Increment views
        $news->increment('views');

        $isLiked = auth()->check() ? $news->isLikedBy(auth()->user()) : false;
        $recommendations = News::where('id', '!=', $id)->latest()->take(5)->get();

        return Inertia::render('news/show', [
            'news' => $news,
            'isLiked' => $isLiked,
            'recommendations' => $recommendations,
        ]);
    }

    public function toggleLike($id)
    {
        $news = News::findOrFail($id);
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $like = \App\Models\NewsLike::where('news_id', $news->id)
            ->where('user_id', $user->id)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            \App\Models\NewsLike::create([
                'news_id' => $news->id,
                'user_id' => $user->id,
            ]);
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'count' => $news->likes()->count()
        ]);
    }

    public function apiIndex(Request $request)
    {
        $query = News::with('user')->latest();

        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $news = $query->paginate(4);

        $news->getCollection()->transform(function ($n) {
            return [
                'id' => $n->id,
                'title' => $n->title,
                'content' => $n->content,
                'image' => $n->image,
                'category' => $n->category ?? 'Umum',
                'user_name' => $n->user->name ?? 'Anonim',
            ];
        });

        return response()->json($news);
    }


    public function apiCategories()
    {
        $categories = News::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json($categories);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

        if ($news->image) {
            \Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita berhasil dihapus.']);

        return redirect()->route('dashboard');
    }
}
