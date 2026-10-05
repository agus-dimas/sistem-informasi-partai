import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { UserPlus, KeyRound, Shield, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface UsersIndexProps {
    admins: AdminUser[];
}

export default function UsersIndex({ admins }: UsersIndexProps) {
    // Create Admin Form
    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: '',
        email: '',
        password: '',
    });

    // Reset password states
    const [resetPasswords, setResetPasswords] = useState<Record<number, string>>({});
    const [resettingId, setResettingId] = useState<number | null>(null);

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        postCreate('/dashboard/users', {
            onSuccess: () => resetCreate(),
        });
    };

    const handleResetPassword = (e: React.FormEvent, adminId: number) => {
        e.preventDefault();
        setResettingId(adminId);
        const newPassword = resetPasswords[adminId];

        router.patch(
            `/dashboard/users/${adminId}/password`,
            { password: newPassword },
            {
                onSuccess: () => {
                    setResetPasswords((prev) => ({ ...prev, [adminId]: '' }));
                },
                onFinish: () => setResettingId(null),
            }
        );
    };

    return (
        <>
            <Head title="Manajemen User" />
            <div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Manajemen User
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola akun pengurus partai, buat akun admin baru, dan atur ulang kata sandi.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 items-start">
                    {/* Form Buat Admin */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserPlus className="size-5 text-[#b3181f]" />
                                Buat Admin Baru
                            </CardTitle>
                            <CardDescription>
                                Tambahkan admin baru untuk mengelola berita dan konsultasi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={createData.name}
                                        onChange={(e) => setCreateData('name', e.target.value)}
                                        placeholder="Nama admin"
                                        required
                                    />
                                    {createErrors.name && (
                                        <p className="text-xs text-red-600">{createErrors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createData.email}
                                        onChange={(e) => setCreateData('email', e.target.value)}
                                        placeholder="admin@partaigaruda.org"
                                        required
                                    />
                                    {createErrors.email && (
                                        <p className="text-xs text-red-600">{createErrors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password">Password (min. 8 karakter)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={createData.password}
                                        onChange={(e) => setCreateData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {createErrors.password && (
                                        <p className="text-xs text-red-600">{createErrors.password}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="w-full bg-[#b3181f] text-white hover:bg-[#99141b]"
                                >
                                    {createProcessing && (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    )}
                                    Simpan Admin
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Daftar Admin */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="size-5 text-zinc-700" />
                                Daftar Akun Admin ({admins.length})
                            </CardTitle>
                            <CardDescription>
                                Daftar seluruh akun yang memiliki hak akses administrasi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {admins.map((admin) => (
                                <div
                                    key={admin.id}
                                    className="rounded-xl border border-border p-4 space-y-3 bg-muted/20"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">
                                                {admin.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {admin.email}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                admin.role === 'super_admin' ? 'default' : 'outline'
                                            }
                                            className={
                                                admin.role === 'super_admin'
                                                    ? 'bg-red-600 text-white'
                                                    : 'text-zinc-600'
                                            }
                                        >
                                            {admin.role.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {/* Reset Password Form for role admin */}
                                    {admin.role === 'admin' && (
                                        <form
                                            onSubmit={(e) => handleResetPassword(e, admin.id)}
                                            className="flex items-center gap-2 pt-1"
                                        >
                                            <Input
                                                type="password"
                                                placeholder="Password baru..."
                                                value={resetPasswords[admin.id] || ''}
                                                onChange={(e) =>
                                                    setResetPasswords({
                                                        ...resetPasswords,
                                                        [admin.id]: e.target.value,
                                                    })
                                                }
                                                required
                                                className="h-8 text-xs"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                                disabled={resettingId === admin.id}
                                                className="h-8 text-xs border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                                            >
                                                {resettingId === admin.id ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    <KeyRound className="size-3 mr-1" />
                                                )}
                                                Reset
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
