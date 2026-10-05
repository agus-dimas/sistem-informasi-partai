<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function store(Request $request, $newsId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $news = News::findOrFail($newsId);

        Comment::create([
            'user_id' => auth()->id(),
            'news_id' => $news->id,
            'content' => $request->content,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komentar berhasil ditambahkan.']);

        return back();
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        // Authorization: Admin or Super Admin
        $user = auth()->user();
        if ($user && ($user->role === 'admin' || $user->role === 'super_admin')) {
            $comment->delete();
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Komentar berhasil dihapus.']);

            return back();
        }

        return abort(403, 'Unauthorized action.');
    }
}
