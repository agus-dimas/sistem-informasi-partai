import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface News {
    id: number;
    title: string;
    category: string;
    image: string | null;
    content: string;
}

interface NewsEditProps {
    news: News;
    errors?: Record<string, string>;
}

export default function NewsEdit({ news, errors: initialErrors }: NewsEditProps) {
    const [title, setTitle] = useState(news.title);
    const [category, setCategory] = useState(news.category || '');
    const [content, setContent] = useState(news.content);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        news.image ? `/storage/${news.image}` : null
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState(initialErrors || {});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);

        if (imageFile) {
            formData.append('image', imageFile);
        }

        router.post(`/dashboard/news/${news.id}`, formData, {
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title={`Edit Berita - ${news.title}`} />
            <div className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-1.5 size-4" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>
                </div>

                <Card className="w-full">
                    <CardHeader className="px-5 py-4 sm:px-6 sm:py-5">
                        <CardTitle className="text-2xl font-bold">Edit Berita</CardTitle>
                        <CardDescription>
                            Perbarui informasi berita atau artikel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul berita..."
                                    required
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Input
                                    id="category"
                                    list="categories-list"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Pilih atau ketik kategori baru"
                                    required
                                />
                                <datalist id="categories-list">
                                    <option value="Politik" />
                                    <option value="Nasional" />
                                    <option value="Teknologi" />
                                    <option value="Kegiatan" />
                                    <option value="Pernyataan Resmi" />
                                </datalist>
                                {errors.category && (
                                    <p className="text-xs text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar Berita</Label>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {imagePreview && (
                                        <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-border shadow-sm">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-[#b3181f] hover:text-[#b3181f] transition-colors">
                                        <Upload className="size-4" />
                                        <span>{imageFile ? imageFile.name : 'Ganti Gambar (Opsional)'}</span>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="text-xs text-red-600">{errors.image}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Isi Berita</Label>
                                <textarea
                                    id="content"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tuliskan isi berita..."
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                                {errors.content && (
                                    <p className="text-xs text-red-600">{errors.content}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button asChild variant="outline">
                                    <Link href="/dashboard">Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#b3181f] text-white hover:bg-[#99141b]"
                                >
                                    {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Update Berita
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
