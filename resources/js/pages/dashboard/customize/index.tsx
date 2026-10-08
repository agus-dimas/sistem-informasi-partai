import { Head, useForm } from '@inertiajs/react';
import { Sliders, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomizeHomeProps {
    settings: {
        sections: Record<string, {
            title?: string | null;
            highlight?: string | null;
            description?: string | null;
            sort_order?: number;
        }>;
    };
}

export default function CustomizeHome({ settings }: CustomizeHomeProps) {
    const { data, setData, post, processing, errors } = useForm<{
        sections: Record<string, {
            title: string;
            highlight: string;
            description: string;
            sort_order?: number;
        }>;
    }>({
        sections: Object.fromEntries(
            Object.entries(settings.sections || {}).map(([key, section]) => [key, {
                title: section.title || '',
                highlight: section.highlight || '',
                description: section.description || '',
                ...(section.sort_order ? { sort_order: section.sort_order } : {}),
            }]),
        ),
    });

    const updateSection = (
        field: 'title' | 'highlight' | 'description',
        value: string,
    ) => {
        setData('sections', {
            ...data.sections,
            hero: { ...data.sections.hero, [field]: value },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/customize');
    };

    return (
        <>
            <Head title="Customize Home" />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Customize Tampilan Home
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola teks tagline, judul, dan deskripsi utama pada halaman beranda depan.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Section Header Home</CardTitle>
                        <CardDescription>
                            Teks yang akan muncul di hero section halaman utama partai.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="tagline">Tagline / Sub-Judul</Label>
                                <Input
                                    id="tagline"
                                    value={data.sections.hero?.highlight || ''}
                                    onChange={(e) => updateSection('highlight', e.target.value)}
                                    placeholder="Contoh: Partai Garuda"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Teks kecil di bagian paling atas hero section.
                                </p>
                                {errors['sections.hero.highlight'] && <p className="text-xs text-red-600">{errors['sections.hero.highlight']}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Section Utama</Label>
                                <Input
                                    id="title"
                                    value={data.sections.hero?.title || ''}
                                    onChange={(e) => updateSection('title', e.target.value)}
                                    placeholder="Contoh: Gerakan Politik Kebangsaan Untuk Indonesia"
                                    required
                                />
                                {errors['sections.hero.title'] && <p className="text-xs text-red-600">{errors['sections.hero.title']}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Konten</Label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    value={data.sections.hero?.description || ''}
                                    onChange={(e) => updateSection('description', e.target.value)}
                                    placeholder="Paragraf penjelasan di halaman depan..."
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                                {errors['sections.hero.description'] && <p className="text-xs text-red-600">{errors['sections.hero.description']}</p>}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#b3181f] text-white hover:bg-[#99141b]"
                                >
                                    {processing ? (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 size-4" />
                                    )}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
