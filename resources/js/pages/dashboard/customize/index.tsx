import { Head, useForm } from '@inertiajs/react';
import { Sliders, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomizeHomeProps {
    settings: {
        home_section_tagline: string;
        home_section_title: string;
        home_section_description: string;
    };
}

export default function CustomizeHome({ settings }: CustomizeHomeProps) {
    const { data, setData, post, processing, errors } = useForm({
        home_section_tagline: settings.home_section_tagline || '',
        home_section_title: settings.home_section_title || '',
        home_section_description: settings.home_section_description || '',
    });

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
                                    value={data.home_section_tagline}
                                    onChange={(e) => setData('home_section_tagline', e.target.value)}
                                    placeholder="Contoh: Partai Garuda"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Teks kecil di bagian paling atas hero section.
                                </p>
                                {errors.home_section_tagline && (
                                    <p className="text-xs text-red-600">{errors.home_section_tagline}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Section Utama</Label>
                                <Input
                                    id="title"
                                    value={data.home_section_title}
                                    onChange={(e) => setData('home_section_title', e.target.value)}
                                    placeholder="Contoh: Gerakan Politik Kebangsaan Untuk Indonesia"
                                    required
                                />
                                {errors.home_section_title && (
                                    <p className="text-xs text-red-600">{errors.home_section_title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Konten</Label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    value={data.home_section_description}
                                    onChange={(e) =>
                                        setData('home_section_description', e.target.value)
                                    }
                                    placeholder="Paragraf penjelasan di halaman depan..."
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                                {errors.home_section_description && (
                                    <p className="text-xs text-red-600">
                                        {errors.home_section_description}
                                    </p>
                                )}
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
