import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Paperclip, Send, Loader2, Shield, Clock } from 'lucide-react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConsultationsCreate() {
    const { auth } = usePage<{
        auth: { user: { id: number; name: string } | null };
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth?.user?.name || '',
        description: '',
        attachment: null as File | null,
    });

    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('attachment', file);
        setFileName(file ? file.name : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/konsultasi', {
            onSuccess: () => {
                reset('description', 'attachment');
                setFileName(null);
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f4]">
            <Head title="Konsultasi Publik - Partai Garuda" />
            <PublicNavbar />

            <main className="flex-grow relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Background Blobs */}
                <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-red-300/30 blur-[90px]" />
                <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-black/5 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-red-200/30 blur-[110px]" />

                <div className="relative mx-auto w-full max-w-5xl">
                    <div className="grid gap-8 lg:grid-cols-2 items-stretch">
                        {/* Info Panel */}
                        <article className="rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl shadow-lg p-7 md:p-10 flex flex-col justify-between">
                            <div>
                                <p className="text-[11px] tracking-[0.28em] uppercase text-red-600 font-bold mb-4">
                                    Konsultasi Publik
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 leading-tight">
                                    Sampaikan Aspirasi Anda Secara Langsung
                                </h1>
                                <p className="mt-4 text-zinc-600 leading-relaxed text-sm md:text-base">
                                    Kami membuka ruang konsultasi untuk menerima masukan dan aspirasi
                                    masyarakat. Isi nama dan pesan Anda dengan jelas agar tim kami
                                    dapat menindaklanjuti dengan cepat dan tepat.
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 flex items-center gap-3">
                                    <Clock className="size-6 text-[#b3181f]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                            Respon
                                        </p>
                                        <p className="text-sm font-bold text-zinc-900">
                                            Terstruktur
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 flex items-center gap-3">
                                    <Shield className="size-6 text-[#b3181f]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                                            Privasi
                                        </p>
                                        <p className="text-sm font-bold text-zinc-900">
                                            Terjaga
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Consultation Form Card */}
                        <article className="rounded-3xl border border-white/80 bg-white/90 backdrop-blur-2xl shadow-xl p-6 md:p-8">
                            {!auth?.user && (
                                <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-800 text-sm">
                                    Anda perlu{' '}
                                    <Link href="/login" className="font-bold underline text-amber-900">
                                        masuk (login)
                                    </Link>{' '}
                                    terlebih dahulu sebelum mengirimkan konsultasi.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-zinc-400">
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama Anda"
                                        required
                                        className="rounded-xl border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="description" className="text-zinc-400">Deskripsi Aspirasi / Pertanyaan</Label>
                                    <textarea
                                        id="description"
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tuliskan aspirasi, keluhan, atau saran Anda secara detail..."
                                        className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#b3181f] focus:ring-1 focus:ring-[#b3181f]"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="attachment" className="text-zinc-400">Lampiran (Opsional)</Label>
                                    <div className="flex items-center gap-3">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-xs">
                                            <Paperclip className="size-4 text-zinc-500" />
                                            <span>
                                                {fileName ? fileName : 'Pilih File (JPG, PNG, PDF)'}
                                            </span>
                                            <input
                                                id="attachment"
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                                onChange={handleFileChange}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-[11px] text-zinc-400">
                                        Maksimum ukuran file: 5 MB
                                    </p>
                                    {errors.attachment && (
                                        <p className="text-xs text-red-600">{errors.attachment}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !auth?.user}
                                    className="w-full rounded-xl bg-[#b3181f] py-6 text-sm font-bold text-white shadow-md hover:bg-[#99141b] transition"
                                >
                                    {processing ? (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 size-4" />
                                    )}
                                    Kirim Konsultasi
                                </Button>
                            </form>
                        </article>
                    </div>

                    <article
                        className="lux-reveal reveal-3 lux-panel mt-6 rounded-3xl border border-white/80 bg-white/75 backdrop-blur-2xl shadow-[0_25px_70px_rgba(30,30,30,0.14)] p-5 md:p-7 overflow-hidden">
                        <p className="text-[11px] tracking-[0.28em] uppercase text-red-600 font-semibold mb-2">Lokasi Kantor</p>
                        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2">DPP Partai Garuda</h2>
                        <p className="text-zinc-600 text-sm md:text-base mb-4">
                            Informasi lokasi kantor pusat disediakan untuk memudahkan masyarakat dan tamu dalam kunjungan,
                            koordinasi, serta keperluan administrasi, dengan akses yang mudah dan terbuka bagi publik.
                        </p>

                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                            <iframe title="Lokasi Kantor Partai Garuda"
                                src="https://maps.google.com/maps?q=DPP%20PARTAI%20GARDA%20REPUBLIK%20INDONESIA%2C%20-6.2011289%2C106.8107504&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                className="w-full h-44 md:h-56" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>

                        <p className="mt-3 text-sm text-zinc-600">
                            Jl. Penjernihan I No.28, RT.2/RW.7, Bend. Hilir, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah
                            Khusus Ibukota Jakarta 10210, Indonesia </p>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
