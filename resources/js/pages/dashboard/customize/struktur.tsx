import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Upload, Loader2, Save, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BoardMember {
    role: string;
    name: string;
    bio: string;
    photo: string;
}

interface MemberFormState {
    role: string;
    name: string;
    bio: string;
    existing_photo: string;
    photo_file?: File | null;
    photo_preview?: string;
}

interface CustomizeStrukturProps {
    boardMembers: BoardMember[];
}

export default function CustomizeStruktur({ boardMembers }: CustomizeStrukturProps) {
    const { errors = {} } = usePage<{
        errors?: Record<string, string>;
    }>().props;

    const [members, setMembers] = useState<MemberFormState[]>(() =>
        boardMembers.map((m) => ({
            role: m.role || '',
            name: m.name || '',
            bio: m.bio || '',
            existing_photo: m.photo || '/images/p1.png',
            photo_preview: m.photo || '/images/p1.png',
        }))
    );

    const [processing, setProcessing] = useState(false);

    const handleAddMember = () => {
        setMembers((prev) => [
            ...prev,
            {
                role: '',
                name: '',
                bio: '',
                existing_photo: '/images/p1.png',
                photo_preview: '/images/p1.png',
            },
        ]);
    };

    const handleRemoveMember = (index: number) => {
        if (members.length <= 1) {
            alert('Minimal harus ada 1 pengurus.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus pengurus ini?')) {
            setMembers((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleChange = (
        index: number,
        field: 'role' | 'name' | 'bio',
        value: string
    ) => {
        setMembers((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        // Store the File immediately so saving does not depend on FileReader finishing.
        setMembers((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], photo_file: file };
            return copy;
        });

        const reader = new FileReader();
        reader.onload = () => {
            setMembers((prev) => {
                const copy = [...prev];
                copy[index] = {
                    ...copy[index],
                    photo_preview: reader.result as string,
                };
                return copy;
            });
        };
        reader.readAsDataURL(file);

        // Let the user select the same file again after changing their mind.
        e.target.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            '/dashboard/customize/struktur',
            {
                members: members.map((member) => ({
                    role: member.role,
                    name: member.name,
                    bio: member.bio,
                    existing_photo: member.existing_photo,
                    photo: member.photo_file ?? null,
                })),
            },
            {
                forceFormData: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Customize Struktur Organisasi" />
            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Customize Struktur Organisasi
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola susunan dewan pengurus, jabatan, foto, dan profil singkat pengurus.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddMember}
                        className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        <Plus className="mr-1.5 size-4" />
                        Tambah Pengurus
                    </Button>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                        {Object.values(errors).map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {members.map((member, index) => (
                            <Card key={index} className="overflow-hidden bg-card/60 transition-all">
                                <CardHeader className="bg-muted/40 py-3 px-6 border-b border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#b3181f]">
                                                Pengurus #{index + 1}
                                            </span>
                                            {member.name && (
                                                <span className="text-xs text-muted-foreground">
                                                    — {member.name} ({member.role})
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveMember(index)}
                                            className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                                        >
                                            <Trash2 className="size-3.5 mr-1" />
                                            Hapus
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid gap-6 md:grid-cols-[140px_1fr] items-start">
                                        {/* Photo Preview & Upload */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative h-36 w-28 overflow-hidden rounded-xl border border-border bg-muted shadow-xs">
                                                <img
                                                    src={member.photo_preview}
                                                    alt={member.name || 'Foto Pengurus'}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <label className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition shadow-xs text-center">
                                                <Upload className="size-3.5 text-muted-foreground" />
                                                Ganti Foto
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoChange(index, e)}
                                                    className="sr-only"
                                                />
                                            </label>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={`role-${index}`}>
                                                        Jabatan / Role
                                                    </Label>
                                                    <Input
                                                        id={`role-${index}`}
                                                        value={member.role}
                                                        onChange={(e) =>
                                                            handleChange(index, 'role', e.target.value)
                                                        }
                                                        placeholder="Contoh: Ketua Umum"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor={`name-${index}`}>
                                                        Nama Lengkap
                                                    </Label>
                                                    <Input
                                                        id={`name-${index}`}
                                                        value={member.name}
                                                        onChange={(e) =>
                                                            handleChange(index, 'name', e.target.value)
                                                        }
                                                        placeholder="Nama Pengurus"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor={`bio-${index}`}>
                                                    Bio / Deskripsi Tugas
                                                </Label>
                                                <textarea
                                                    id={`bio-${index}`}
                                                    rows={2}
                                                    value={member.bio}
                                                    onChange={(e) =>
                                                        handleChange(index, 'bio', e.target.value)
                                                    }
                                                    placeholder="Deskripsi peranan atau visi tugas..."
                                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
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
                            Simpan Struktur Pengurus
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
