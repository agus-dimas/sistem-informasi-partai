import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Eye, Heart, MessageSquare, Trash2, Calendar, User, ArrowLeft, Send } from 'lucide-react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface NewsItem {
    id: number;
    title: string;
    content: string;
    category?: string;
    image?: string | null;
    views: number;
    created_at: string;
    user?: {
        name: string;
    };
    likes?: unknown[];
    comments?: Comment[];
}

interface NewsShowProps {
    news: NewsItem;
    isLiked: boolean;
    recommendations: NewsItem[];
}

export default function NewsShow({ news, isLiked: initialIsLiked, recommendations }: NewsShowProps) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; role: string } | null } }>().props;
    const [liked, setLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(news.likes?.length || 0);

    const {
        data: commentData,
        setData: setCommentData,
        post: postComment,
        processing: commentProcessing,
        reset: resetComment,
    } = useForm({
        content: '',
    });

    const handleToggleLike = async () => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/news/${news.id}/like`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token || '',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (res.status === 401) {
                router.get('/login');
                return;
            }

            const data = await res.json();
            if (data && data.count !== undefined) {
                setLiked(data.liked);
                setLikesCount(data.count);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/news/${news.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => resetComment(),
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
            router.delete(`/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const isAdmin = auth?.user && ['admin', 'super_admin'].includes(auth.user.role);

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f5]">
            <Head title={`${news.title} - Partai Garuda`} />
            <PublicNavbar />

            <main className="flex-grow pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="mb-6">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/news">
                            <ArrowLeft className="mr-1.5 size-4" />
                            Kembali ke Berita
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Main Article Content */}
                    <article className="w-full lg:w-2/3 bg-white rounded-3xl shadow-sm border border-zinc-200/80 p-6 sm:p-10 space-y-6">
                        {/* Title */}
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                            {news.title}
                        </h1>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100 text-xs text-zinc-500">
                            <div className="flex flex-wrap items-center gap-3">
                                {news.category && (
                                    <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                                        {news.category}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <User className="size-3.5" />
                                    {news.user?.name || 'Anonim'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    {new Date(news.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Eye className="size-3.5" />
                                    {news.views} Views
                                </span>
                                <button
                                    type="button"
                                    onClick={handleToggleLike}
                                    className={`flex items-center gap-1.5 transition ${liked ? 'text-red-600 font-bold' : 'hover:text-red-600'
                                        }`}
                                >
                                    <Heart
                                        className={`size-4 ${liked ? 'fill-current' : ''}`}
                                    />
                                    <span>{likesCount} Suka</span>
                                </button>
                            </div>
                        </div>

                        {/* Article Image */}
                        {news.image && (
                            <div className="overflow-hidden rounded-2xl shadow-sm max-h-[460px]">
                                <img
                                    src={`/storage/${news.image}`}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <div
                            className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed space-y-4 pt-2"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        {/* Komentar Section */}
                        <section className="mt-12 pt-8 border-t border-zinc-100 space-y-6">
                            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                <MessageSquare className="size-5 text-[#b3181f]" />
                                Komentar ({news.comments?.length || 0})
                            </h3>

                            {/* Comment Form / Login reminder */}
                            {auth?.user ? (
                                <form onSubmit={handleCommentSubmit} className="space-y-3">
                                    <textarea
                                        rows={3}
                                        value={commentData.content}
                                        onChange={(e) => setCommentData('content', e.target.value)}
                                        placeholder="Tulis pendapat atau komentar Anda..."
                                        className="w-full rounded-xl border border-zinc-300 p-3 text-sm text-zinc-700 focus:outline-none focus:border-[#b3181f] focus:ring-1 focus:ring-[#b3181f]"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={commentProcessing}
                                            className="bg-[#b3181f] text-white hover:bg-[#99141b]"
                                        >
                                            <Send className="mr-1.5 size-3.5" />
                                            Kirim Komentar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-600">
                                    Silakan{' '}
                                    <Link
                                        href="/login"
                                        className="font-bold text-[#b3181f] hover:underline"
                                    >
                                        masuk (login)
                                    </Link>{' '}
                                    untuk memberikan komentar.
                                </div>
                            )}

                            {/* Comment List */}
                            <div className="space-y-4">
                                {news.comments && news.comments.length > 0 ? (
                                    news.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-zinc-900">
                                                        {comment.user?.name || 'Anonim'}
                                                    </span>
                                                    <span className="text-xs text-zinc-400">
                                                        {new Date(
                                                            comment.created_at
                                                        ).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>

                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteComment(comment.id)
                                                        }
                                                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <Trash2 className="size-3" />
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-zinc-400 italic">
                                        Belum ada komentar untuk artikel ini.
                                    </p>
                                )}
                            </div>
                        </section>
                    </article>

                    {/* Recommendation Sidebar */}
                    <aside className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
                            <h3 className="font-bold text-lg text-zinc-900 pb-2 border-b border-zinc-100">
                                Berita Terkait Lainnya
                            </h3>
                            <div className="space-y-4">
                                {recommendations.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group flex gap-3 items-center"
                                    >
                                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                                            <img
                                                src={
                                                    item.image
                                                        ? `/storage/${item.image}`
                                                        : '/placeholder.jpg'
                                                }
                                                alt={item.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-zinc-800 line-clamp-2 group-hover:text-[#b3181f] transition-colors">
                                                {item.title}
                                            </h4>
                                            <span className="text-[11px] text-zinc-400 mt-1 block">
                                                {new Date(item.created_at).toLocaleDateString(
                                                    'id-ID'
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
