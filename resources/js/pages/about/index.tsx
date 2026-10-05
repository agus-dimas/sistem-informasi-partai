import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';

export default function AboutIndex() {
    const [settings, setSettings] = useState({
        about_section_tagline: 'About Us',
        about_section_title: 'GARDA REPUBLIK INDONESIA',
        about_section_description:
            'Kami hadir sebagai gerakan politik modern yang menghubungkan ide, aksi, dan dampak nyata untuk masyarakat.',
        visi_section_tagline:
            'Arah perjuangan kami dibangun di atas konstitusi, nilai kebangsaan, dan komitmen untuk menghadirkan dampak yang bisa dirasakan langsung oleh rakyat.',
        misi1_section_tagline:
            'Terwujudnya cita-cita nasional bangsa Indonesia sebagaimana dimaksud dalam Pembukaan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
        misi2_section_tagline:
            'Terwujudnya masyarakat demokratis yang adil dan sejahtera serta berkeyakinan pada Tuhan Yang Maha Esa, mencintai tanah air dan bangsa dalam bingkai Negara Kesatuan Republik Indonesia.',
        misi3_section_tagline:
            'Mewujudkan masyarakat kedaulatan rakyat dalam berdemokrasi, yang menjunjung tinggi nilai-nilai kebenaran dan hukum yang berlaku.',
        misi4_section_tagline: 'Mewujudkan ekonomi kerakyatan yang berkeadilan.',
    });

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setSettings((prev) => ({ ...prev, ...data }));
                }
            })
            .catch((err) => console.error('Fetch settings error:', err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f5]">
            <Head title="About Us - Partai Garuda" />
            <PublicNavbar />

            <main className="flex-grow pt-16 pb-10">
                {/* Header Banner */}
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden bg-[#1b1b1b] text-white">
                    <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col justify-start">
                            <div className="inline-flex flex-col items-start">
                                <p className="pl-[2px] text-[11px] tracking-[0.28em] uppercase text-red-600 font-semibold mb-3 leading-none">
                                    {settings.about_section_tagline || 'About Us'}
                                </p>
                                <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.02] text-white">
                                    PARTAI GARUDA
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <div className="max-w-xl pl-5 md:pl-8 border-l border-white/30">
                                <span className="block mb-2 text-red-600 font-semibold tracking-[0.16em] uppercase text-xs md:text-sm">
                                    {settings.about_section_title || 'GARDA REPUBLIK INDONESIA'}
                                </span>
                                <p className="text-zinc-100/95 leading-relaxed text-sm md:text-base">
                                    {settings.about_section_description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden mb-8 bg-transparent">
                    <img
                        src="/images/banner-about.jpg"
                        alt="Header About"
                        className="about-banner-drop w-full h-[220px] md:h-[360px] lg:h-[420px] object-cover"
                    />
                </section>

                {/* 3 Focus Cards */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-[#1d1c1c] border border-zinc-200 p-5 shadow-[0_10px_30px_rgba(20,20,20,0.08)]">
                            <p className="text-white/80 text-sm">Fokus Kerja</p>
                            <p className="text-2xl font-bold text-white mt-1">Kaderisasi</p>
                        </div>
                        <div className="rounded-2xl bg-[#b3181f] text-white p-5 shadow-[0_12px_32px_rgba(20,20,20,0.08)]">
                            <p className="text-white/80 text-sm">Jangkauan</p>
                            <p className="text-2xl font-bold mt-1">Nasional</p>
                        </div>
                        <div className="rounded-2xl bg-[#1d1c1c] border border-zinc-200 p-5 shadow-[0_10px_30px_rgba(20,20,20,0.08)]">
                            <p className="text-white/80 text-sm">Karakter Gerakan</p>
                            <p className="text-2xl font-bold text-white mt-1">Kolaboratif</p>
                        </div>
                    </div>
                </section>

                {/* Visi & Misi */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-20">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
                        <article className="rounded-3xl bg-gradient-to-br from-white via-white to-red-50/40 border border-zinc-200 p-6 md:p-8 shadow-[0_20px_48px_rgba(20,20,20,0.08)]">
                            <p className="text-[11px] tracking-[0.24em] uppercase text-red-700 font-semibold mb-3">
                                Visi & Misi
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
                                Terwujudnya Cita-cita Perubahan Indonesia.
                            </h2>
                            <p className="mt-3 text-zinc-600 leading-relaxed border-l-2 border-red-400 pl-4">
                                {settings.visi_section_tagline}
                            </p>

                            <div className="mt-6 space-y-3">
                                {[
                                    settings.misi1_section_tagline,
                                    settings.misi2_section_tagline,
                                    settings.misi3_section_tagline,
                                    settings.misi4_section_tagline,
                                ].map((misiText, idx) => (
                                    <div
                                        key={idx}
                                        className="group rounded-2xl border border-zinc-200 bg-white px-4 py-4 transition-all duration-300 hover:border-red-200 hover:shadow-[0_12px_30px_rgba(179,24,31,0.12)]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 inline-flex w-7 h-7 items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-bold shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-zinc-700 leading-relaxed">
                                                {misiText}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-50 to-white border border-zinc-200 shadow-[0_20px_48px_rgba(20,20,20,0.08)] h-full flex items-center justify-center lg:sticky lg:top-24 p-6">
                            <img
                                src="/images/update logo/logo visi.png"
                                alt="Aktivitas Partai Garuda"
                                className="w-full max-w-[460px] h-[360px] md:h-[520px] object-contain object-center"
                            />
                        </article>
                    </div>
                </section>

                {/* Identitas & Atribut */}
                <section className="relative z-20 -mt-10 mb-8">
                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#202020] py-8 shadow-[0_20px_36px_rgba(0,0,0,0.18)]">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-red-600 font-semibold text-center mb-2 md:mb-3">
                                Menyatukan Semangat, Menguatkan Indonesia
                            </p>
                            <h3 className="text-lg md:text-3xl font-bold text-white text-center px-4">
                                Identitas Partai Garuda untuk kedaulatan bangsa
                            </h3>
                            <p className="mt-3 md:mt-4 text-sm md:text-base text-zinc-300 text-center max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
                                Atribut partai Garuda mencerminkan nilai, jati diri, dan semangat
                                perjuangan untuk bangsa dan rakyat. Setiap elemen lambang menegaskan
                                komitmen partai dalam mengawal kedaulatan dan kesejahteraan masyarakat.
                            </p>

                            <div className="mt-4 flex justify-center px-4 md:px-0">
                                <img
                                    src="/images/baju partai/background baju website.png"
                                    alt="Highlight Partai Garuda"
                                    className="w-full max-w-4xl md:max-w-5xl h-auto max-h-[320px] md:max-h-[440px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Banner Dokumentasi */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 shadow-[0_18px_42px_rgba(20,20,20,0.12)]">
                        <img
                            src="/images/banner-about2.jpg"
                            alt="Dokumentasi Partai Garuda"
                            className="w-full h-[220px] md:h-[360px] lg:h-[420px] object-cover"
                        />
                    </div>
                </section>

                {/* Section Galeri Kegiatan */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mt-20 mb-20 overflow-hidden">
                    <div className="text-center mb-12">
                        <p className="text-[11px] tracking-[0.24em] uppercase text-red-600 font-semibold mb-3">
                            Galeri Kegiatan
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                            Momen Perjuangan & Aksi Nyata
                        </h2>
                        <div className="mt-4 w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-xl cursor-pointer bg-zinc-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <img
                                    src={`/images/about/gallery_${i}.jpg`}
                                    alt={`Kegiatan ${i}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <p className="text-white text-sm font-semibold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {i === 1
                                            ? 'Aksi Sosial Masyarakat'
                                            : i === 2
                                              ? 'Diskusi Keanggotaan'
                                              : i === 3
                                                ? 'Konsolidasi Nasional'
                                                : 'Konferensi Pers Utama'}
                                    </p>
                                    <p className="text-white/70 text-[10px] uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        Dokumentasi Kegiatan
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />

            <style>{`
                .about-banner-drop {
                    animation: aboutBannerDrop 2000ms cubic-bezier(.22, 1, .36, 1) both;
                }
                @keyframes aboutBannerDrop {
                    from {
                        transform: translateY(-200px);
                        opacity: 0.3;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
