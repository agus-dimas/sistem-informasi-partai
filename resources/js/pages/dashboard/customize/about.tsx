import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomizeAboutProps {
    settings: {
        sections: Record<string, {
            title?: string | null;
            highlight?: string | null;
            description?: string | null;
            sort_order?: number;
        }>;
    };
}

export default function CustomizeAbout({ settings }: CustomizeAboutProps) {
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
        key: string,
        field: 'title' | 'highlight' | 'description',
        value: string,
    ) => {
        setData('sections', {
            ...data.sections,
            [key]: {
                title: '',
                highlight: '',
                description: '',
                ...data.sections[key],
                [field]: value,
            },
        });
    };

    const fieldError = (key: string, field: 'title' | 'highlight' | 'description') =>
        errors[`sections.${key}.${field}`];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/customize/about');
    };

    return (
        <>
            <Head title="Customize About Us" />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Customize About Us
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola konten profil, narasi gerakan, serta visi dan misi partai.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section About Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Section Header Profil</CardTitle>
                            <CardDescription>
                                Judul dan deskripsi pembuka di halaman Tentang Kami.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="about_tagline">Tagline / Sub-Judul</Label>
                                <Input
                                    id="about_tagline"
                                    value={data.sections.hero?.highlight || ''}
                                    onChange={(e) => updateSection('hero', 'highlight', e.target.value)}
                                    required
                                />
                                {fieldError('hero', 'highlight') && <p className="text-xs text-red-600">{fieldError('hero', 'highlight')}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="about_title">Judul Section</Label>
                                <Input
                                    id="about_title"
                                    value={data.sections.hero?.title || ''}
                                    onChange={(e) => updateSection('hero', 'title', e.target.value)}
                                    required
                                />
                                {fieldError('hero', 'title') && <p className="text-xs text-red-600">{fieldError('hero', 'title')}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="about_description">Isi Deskripsi Profil</Label>
                                <textarea
                                    id="about_description"
                                    rows={4}
                                    value={data.sections.hero?.description || ''}
                                    onChange={(e) => updateSection('hero', 'description', e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                                {fieldError('hero', 'description') && <p className="text-xs text-red-600">{fieldError('hero', 'description')}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Section Identitas & Atribut</CardTitle>
                            <CardDescription>
                                Konten identitas partai yang tampil pada halaman Tentang Kami.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="identity_highlight">Tagline</Label>
                                <Input
                                    id="identity_highlight"
                                    value={data.sections.identity?.highlight || ''}
                                    onChange={(e) => updateSection('identity', 'highlight', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="identity_title">Judul Section</Label>
                                <Input
                                    id="identity_title"
                                    value={data.sections.identity?.title || ''}
                                    onChange={(e) => updateSection('identity', 'title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="identity_description">Deskripsi</Label>
                                <textarea
                                    id="identity_description"
                                    rows={4}
                                    value={data.sections.identity?.description || ''}
                                    onChange={(e) => updateSection('identity', 'description', e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section Visi & Misi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Section Visi & Misi</CardTitle>
                            <CardDescription>
                                Arah perjuangan dan butir-butir misi partai.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="visi">Deskripsi Visi</Label>
                                <Input
                                    id="visi"
                                    value={data.sections.visi?.highlight || ''}
                                    onChange={(e) => updateSection('visi', 'highlight', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi1">Deskripsi Misi #1</Label>
                                <Input
                                    id="misi1"
                                    value={data.sections.misi1?.highlight || ''}
                                    onChange={(e) => updateSection('misi1', 'highlight', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi2">Deskripsi Misi #2</Label>
                                <Input
                                    id="misi2"
                                    value={data.sections.misi2?.highlight || ''}
                                    onChange={(e) => updateSection('misi2', 'highlight', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi3">Deskripsi Misi #3</Label>
                                <Input
                                    id="misi3"
                                    value={data.sections.misi3?.highlight || ''}
                                    onChange={(e) => updateSection('misi3', 'highlight', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi4">Deskripsi Misi #4</Label>
                                <Input
                                    id="misi4"
                                    value={data.sections.misi4?.highlight || ''}
                                    onChange={(e) => updateSection('misi4', 'highlight', e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

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
            </div>
        </>
    );
}
