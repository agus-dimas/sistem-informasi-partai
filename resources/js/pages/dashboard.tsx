import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, MessageSquare, Search, Edit2, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
    total: number;
}

interface NewsItem {
    id: number;
    title: string;
    content: string;
    category?: string;
    image?: string;
    views: number;
    created_at: string;
    user?: {
        name: string;
    };
}

interface ConsultationItem {
    id: number;
    name: string;
    description: string;
    response?: string | null;
    created_at: string;
}

interface DashboardProps {
    news: PaginatedData<NewsItem>;
    consultationCount: number;
    consultations: PaginatedData<ConsultationItem>;
    isAdmin: boolean;
    search: string;
}

export default function Dashboard({
    news,
    consultationCount,
    consultations,
    isAdmin,
    search: initialSearch,
}: DashboardProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(initialSearch || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard', { search }, { preserveState: true });
    };

    const handleResetSearch = () => {
        setSearch('');
        router.get('/dashboard', {}, { preserveState: true });
    };

    const handleDeleteNews = (id: number, title: string) => {
        if (confirm(`Apakah yakin ingin menghapus berita "${title}"?`)) {
            router.delete(`/dashboard/news/${id}`);
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
                {/* Header & Quick Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isAdmin
                                ? 'Ringkasan berita dan konsultasi masyarakat terbaru.'
                                : 'Riwayat konsultasi dan aspirasi yang telah Anda sampaikan.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isAdmin ? (
                            <>
                                <Button asChild className="bg-[#b3181f] text-white hover:bg-[#99141b]">
                                    <Link href="/dashboard/news/create">
                                        <Plus className="mr-1.5 size-4" />
                                        Input Berita
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="relative">
                                    <Link href="/dashboard/konsultasi">
                                        <MessageSquare className="mr-1.5 size-4" />
                                        Konsultasi Masuk
                                        {consultationCount > 0 && (
                                            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                                                {consultationCount}
                                            </span>
                                        )}
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <Button asChild className="bg-[#b3181f] text-white hover:bg-[#99141b]">
                                <Link href="/konsultasi">
                                    <Plus className="mr-1.5 size-4" />
                                    Input Konsultasi
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
                        {flash.error}
                    </div>
                )}

                {/* Admin View: Berita Management */}
                {isAdmin ? (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Daftar Berita</h2>
                                <p className="text-xs text-muted-foreground">
                                    Total {news.total} artikel diterbitkan
                                </p>
                            </div>

                            <form onSubmit={handleSearch} className="flex w-full items-center gap-2 sm:max-w-xs">
                                <div className="relative w-full">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berita..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 text-sm"
                                    />
                                </div>
                                <Button type="submit" size="sm" variant="secondary">
                                    Cari
                                </Button>
                                {search && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleResetSearch}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </form>
                        </div>

                        {news.data.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    Tidak ada berita yang ditemukan.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {news.data.map((item) => (
                                    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                                        <CardContent className="p-5">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg font-bold text-foreground">
                                                            {item.title}
                                                        </h3>
                                                        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
                                                            {item.category || 'Umum'}
                                                        </Badge>
                                                    </div>
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {item.content.replace(/<[^>]*>?/gm, '')}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>Oleh: {item.user?.name || 'Anonim'}</span>
                                                        <span>•</span>
                                                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                                        <span>•</span>
                                                        <span>{item.views} Views</span>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">
                                                    <Button asChild size="sm" variant="ghost">
                                                        <Link href={`/news/${item.id}`} target="_blank">
                                                            <ExternalLink className="size-3.5 mr-1" />
                                                            Lihat
                                                        </Link>
                                                    </Button>
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/dashboard/news/${item.id}/edit`}>
                                                            <Edit2 className="size-3.5 mr-1" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteNews(item.id, item.title)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {news.links && news.links.length > 3 && (
                            <div className="flex flex-wrap justify-center gap-1.5 pt-4">
                                {news.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-3 text-xs text-muted-foreground opacity-50"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[#b3181f] text-white shadow'
                                                    : 'border border-border bg-background text-foreground hover:bg-muted'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* User View: Consultation History */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Riwayat Konsultasi Saya
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Daftar aspirasi dan pesan yang telah dikirimkan.
                                </p>
                            </div>
                        </div>

                        {consultations.data.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    Belum ada konsultasi yang Anda kirimkan.{' '}
                                    <Link href="/konsultasi" className="text-red-600 underline hover:text-red-700">
                                        Kirim konsultasi sekarang
                                    </Link>
                                    .
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {consultations.data.map((item) => (
                                    <Card key={item.id} className="overflow-hidden">
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{new Date(item.created_at).toLocaleString('id-ID')}</span>
                                                <Badge variant={item.response ? 'default' : 'secondary'} className={item.response ? 'bg-emerald-600' : ''}>
                                                    {item.response ? 'Sudah Direspons' : 'Menunggu Tanggapan'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                                                {item.description}
                                            </p>
                                            {item.response && (
                                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
                                                    <p className="font-semibold mb-1 text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                                        Respon Admin:
                                                    </p>
                                                    <p className="whitespace-pre-wrap">{item.response}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {consultations.links && consultations.links.length > 3 && (
                            <div className="flex flex-wrap justify-center gap-1.5 pt-4">
                                {consultations.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-3 text-xs text-muted-foreground opacity-50"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[#b3181f] text-white shadow'
                                                    : 'border border-border bg-background text-foreground hover:bg-muted'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
