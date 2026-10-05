import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CustomizeAboutProps {
    settings: {
        about_section_tagline: string;
        about_section_title: string;
        about_section_description: string;
        visi_section_tagline: string;
        misi1_section_tagline: string;
        misi2_section_tagline: string;
        misi3_section_tagline: string;
        misi4_section_tagline: string;
    };
}

export default function CustomizeAbout({ settings }: CustomizeAboutProps) {
    const { data, setData, post, processing, errors } = useForm({
        about_section_tagline: settings.about_section_tagline || '',
        about_section_title: settings.about_section_title || '',
        about_section_description: settings.about_section_description || '',
        visi_section_tagline: settings.visi_section_tagline || '',
        misi1_section_tagline: settings.misi1_section_tagline || '',
        misi2_section_tagline: settings.misi2_section_tagline || '',
        misi3_section_tagline: settings.misi3_section_tagline || '',
        misi4_section_tagline: settings.misi4_section_tagline || '',
    });

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
                                    value={data.about_section_tagline}
                                    onChange={(e) =>
                                        setData('about_section_tagline', e.target.value)
                                    }
                                    required
                                />
                                {errors.about_section_tagline && (
                                    <p className="text-xs text-red-600">
                                        {errors.about_section_tagline}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="about_title">Judul Section</Label>
                                <Input
                                    id="about_title"
                                    value={data.about_section_title}
                                    onChange={(e) =>
                                        setData('about_section_title', e.target.value)
                                    }
                                    required
                                />
                                {errors.about_section_title && (
                                    <p className="text-xs text-red-600">
                                        {errors.about_section_title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="about_description">Isi Deskripsi Profil</Label>
                                <textarea
                                    id="about_description"
                                    rows={4}
                                    value={data.about_section_description}
                                    onChange={(e) =>
                                        setData('about_section_description', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                                {errors.about_section_description && (
                                    <p className="text-xs text-red-600">
                                        {errors.about_section_description}
                                    </p>
                                )}
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
                                    value={data.visi_section_tagline}
                                    onChange={(e) =>
                                        setData('visi_section_tagline', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi1">Deskripsi Misi #1</Label>
                                <Input
                                    id="misi1"
                                    value={data.misi1_section_tagline}
                                    onChange={(e) =>
                                        setData('misi1_section_tagline', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi2">Deskripsi Misi #2</Label>
                                <Input
                                    id="misi2"
                                    value={data.misi2_section_tagline}
                                    onChange={(e) =>
                                        setData('misi2_section_tagline', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi3">Deskripsi Misi #3</Label>
                                <Input
                                    id="misi3"
                                    value={data.misi3_section_tagline}
                                    onChange={(e) =>
                                        setData('misi3_section_tagline', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="misi4">Deskripsi Misi #4</Label>
                                <Input
                                    id="misi4"
                                    value={data.misi4_section_tagline}
                                    onChange={(e) =>
                                        setData('misi4_section_tagline', e.target.value)
                                    }
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
