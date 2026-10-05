import React, { useEffect, useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';

const defaultBoardMembers = [
    {
        role: 'Ketua Umum',
        name: 'Ahmad Ridha Sabana',
        bio: 'Memimpin arah Partai dan memastikan setiap program berjalan sesuai dengan misi partai.',
        photo: '/images/pengurus/ketum1.png',
    },
    {
        role: 'Sekretaris Jenderal',
        name: 'Ihsan Jauhari',
        bio: 'Sekjen bertanggung jawab atas jalannya administrasi dan koordinasi organisasi, serta memastikan seluruh program kerja terlaksana dengan baik.',
        photo: '/images/pengurus/ihsan1.png',
    },
    {
        role: 'Wakil Ketua Umum',
        name: 'Teddy Gusnaidi',
        bio: 'membantu Ketua Umum dalam menjalankan kepemimpinan serta mengoordinasikan pelaksanaan program di seluruh struktur partai.',
        photo: '/images/pengurus/tedy1.png',
    },
    {
        role: 'Ketua 1',
        name: 'Faisal',
        bio: 'Mengelola struktur organisasi dan pengembangan kader agar partai memiliki sumber daya manusia yang kuat.',
        photo: '/images/pengurus/faisal1.png',
    },
    {
        role: 'Ketua 2',
        name: 'Jeffry Yulianto Waisapy',
        bio: 'Menyusun program kerja dan kajian kebijakan yang sesuai dengan kebutuhan masyarakat dan kondisi lapangan.',
        photo: '/images/pengurus/jefry1.png',
    },
    {
        role: 'Ketua 3',
        name: 'Ahmad Muhlis Fanani',
        bio: 'Mengelola komunikasi publik, media, dan penyampaian informasi agar pesan partai tersampaikan dengan jelas.',
        photo: '/images/pengurus/caklis1.png',
    },
    {
        role: 'Wakil Sekretaris Jenderal',
        name: 'Saiful Rahman',
        bio: 'Membantu koordinasi pelaksanaan program kerja serta memastikan komunikasi antarbidang dan pelaksanaan kegiatan organisasi berjalan efektif.',
        photo: '/images/pengurus/saiful1.png',
    },
    {
        role: 'Wakil Sekretaris Jenderal',
        name: 'Sulistianing Sasih',
        bio: 'Membantu Sekretaris Jenderal dalam pengelolaan administrasi, dokumentasi, serta penataan surat-menyurat organisasi agar berjalan tertib dan terstruktur.',
        photo: '/images/pengurus/sulistia1.png',
    },
    {
        role: 'Wakil Bendahara Umum',
        name: 'Eka Arum Maqshuuroh',
        bio: 'Membantu Bendahara Umum dalam pengelolaan kas, pencatatan transaksi, dan administrasi keuangan operasional partai agar berjalan tertib dan terkontrol.',
        photo: '/images/pengurus/harum1.png',
    },
    {
        role: 'Wakil Bendahara Umum',
        name: 'Tia Fathiah',
        bio: 'Membantu penyusunan laporan keuangan serta pengawasan administrasi keuangan untuk memastikan transparansi dan akuntabilitas pengelolaan dana partai.',
        photo: '/images/pengurus/tia1.png',
    },
    {
        role: 'Bendahara Umum',
        name: 'Fajar Muhammad Faiz Rozi',
        bio: 'Bendahara Umum mengelola keuangan partai secara tertib, transparan, dan bertanggung jawab sesuai kebutuhan program dan kegiatan.',
        photo: '/images/pengurus/pfaiz1.png',
    },
];

const fallbackPhoto = '/images/p1.png';

const STRUKTUR_STYLES = `
    .struktur-copy-reveal {
        will-change: transform, opacity;
        animation: strukturCopyReveal 780ms cubic-bezier(.16, 1, .3, 1) both;
    }
    .struktur-copy-reveal.is-prev {
        animation-name: strukturCopyRevealPrev;
    }
    .struktur-photo-reveal {
        will-change: transform;
        transform-origin: center bottom;
    }
    .struktur-photo-reveal.is-seed-a {
        animation: strukturPhotoRevealA 860ms cubic-bezier(.16, 1, .3, 1) both;
    }
    .struktur-photo-reveal.is-seed-b {
        animation: strukturPhotoRevealB 860ms cubic-bezier(.16, 1, .3, 1) both;
    }
    .struktur-photo-reveal.is-prev.is-seed-a {
        animation-name: strukturPhotoRevealPrevA;
    }
    .struktur-photo-reveal.is-prev.is-seed-b {
        animation-name: strukturPhotoRevealPrevB;
    }
    @keyframes strukturCopyReveal {
        from {
            opacity: 0;
            transform: translate3d(28px, 22px, 0) scale(0.985);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @keyframes strukturCopyRevealPrev {
        from {
            opacity: 0;
            transform: translate3d(-28px, 22px, 0) scale(0.985);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @keyframes strukturPhotoRevealA {
        from {
            transform: translate3d(56px, 18px, 0) scale(0.955);
        }
        to {
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @keyframes strukturPhotoRevealB {
        from {
            transform: translate3d(56px, 18px, 0) scale(0.955);
        }
        to {
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @keyframes strukturPhotoRevealPrevA {
        from {
            transform: translate3d(-56px, 18px, 0) scale(0.955);
        }
        to {
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @keyframes strukturPhotoRevealPrevB {
        from {
            transform: translate3d(-56px, 18px, 0) scale(0.955);
        }
        to {
            transform: translate3d(0, 0, 0) scale(1);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .struktur-copy-reveal,
        .struktur-photo-reveal {
            animation: none !important;
        }
    }
`;

export default function Struktur() {
    const [membersList, setMembersList] = useState(defaultBoardMembers);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [photoMotionSeed, setPhotoMotionSeed] = useState(0);

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.struktur_board_members && data.struktur_board_members.length > 0) {
                    setMembersList(data.struktur_board_members);
                }
            })
            .catch((err) => console.error('Fetch settings error:', err));
    }, []);

    const totalMembers = membersList.length;

    useEffect(() => {
        if (!totalMembers) return;
        const nextIdx = (currentIndex + 1) % totalMembers;
        const prevIdx = (currentIndex - 1 + totalMembers) % totalMembers;

        [membersList[nextIdx]?.photo, membersList[prevIdx]?.photo].forEach((src) => {
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });
    }, [currentIndex, totalMembers, membersList]);

    const goNext = () => {
        if (!totalMembers) return;
        setDirection('next');
        setPhotoMotionSeed((prev) => prev + 1);
        setCurrentIndex((prev) => (prev + 1) % totalMembers);
    };

    const goPrev = () => {
        if (!totalMembers) return;
        setDirection('prev');
        setPhotoMotionSeed((prev) => prev + 1);
        setCurrentIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
    };

    const activeMember =
        membersList[currentIndex] ||
        membersList[0] || {
            role: '',
            name: '',
            bio: '',
            photo: fallbackPhoto,
        };

    return (
        <div className="min-h-screen text-zinc-900 bg-[#f6f6f5] overflow-x-hidden flex flex-col">
            <Head title="Struktur Organisasi - Partai Garuda" />
            <PublicNavbar />

            <main className="flex-grow pt-16">
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-transparent md:bg-white">
                    <div className="relative min-h-[420px] sm:min-h-[520px] md:min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
                        <div
                            className="order-2 md:order-1 relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 md:py-12 lg:py-16 bg-zinc-950 md:mr-[-12vw] md:pr-[18vw] overflow-hidden"
                            style={{
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                            }}
                        >
                            {useMemo(
                                () => (
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src="/images/banner-about.jpg"
                                            alt=""
                                            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-red-900/40"></div>
                                    </div>
                                ),
                                []
                            )}

                            <div className="relative z-10 flex min-h-[320px] md:min-h-[430px] flex-col justify-between pb-8 md:pb-20">
                                <div
                                    key={`content-${currentIndex}-${direction}`}
                                    className={`relative struktur-copy-reveal ${
                                        direction === 'prev' ? 'is-prev' : ''
                                    }`}
                                >
                                    <p className="text-[11px] tracking-[0.3em] uppercase text-red-500 font-bold mb-3">
                                        {activeMember.role?.toUpperCase()}
                                    </p>
                                    <div className="inline-flex max-w-full flex-col items-start">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight uppercase">
                                            {activeMember.name}
                                        </h1>
                                        <div className="mt-3 h-1 w-full bg-red-600 rounded-full max-w-full" />
                                    </div>
                                    <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                                        {activeMember.bio}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition backdrop-blur-sm rounded-lg"
                                        aria-label="Previous pengurus"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_10px_24px_rgba(179,24,31,0.4)] transition rounded-lg"
                                        aria-label="Next pengurus"
                                    >
                                        Next
                                    </button>

                                    <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold ml-4">
                                        <span className="text-red-500">{currentIndex + 1}</span>
                                        <span>/</span>
                                        <span>{totalMembers}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 relative overflow-visible bg-transparent flex items-end justify-center md:justify-start pl-0 md:pl-2 pr-0 md:pr-0 h-[360px] sm:h-[420px] md:h-auto">
                            <div
                                className="absolute inset-y-0 left-0 right-0 bg-gradient-to-br from-[#a40f14] via-[#b3181f] to-[#8e0f14]"
                                style={{
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                }}
                            />
                            <img
                                src="/images/struktur/atribut 2.png"
                                alt=""
                                aria-hidden="true"
                                className="hidden md:block absolute left-[20%] top-0 h-[60%] sm:h-[75%] md:h-[90%] w-auto pointer-events-none z-30"
                            />
                            <img
                                src={activeMember.photo || fallbackPhoto}
                                alt={activeMember.name}
                                className={`relative z-30 mx-auto md:mx-0 md:-ml-28 max-h-[340px] sm:max-h-[380px] md:max-h-[92vh] w-auto object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)] struktur-photo-reveal ${
                                    direction === 'prev' ? 'is-prev' : ''
                                } ${photoMotionSeed % 2 === 0 ? 'is-seed-a' : 'is-seed-b'}`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackPhoto;
                                }}
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style>{STRUKTUR_STYLES}</style>
        </div>
    );
}
