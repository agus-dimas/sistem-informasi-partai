import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';
import { useContent } from '@/services/contentService';

const shoeBrands = [
    { name: 'persepsi', image: '/images/p1.png' },
    { name: 'the respon', image: '/images/p2.png' },
    { name: 'wehjangan', image: '/images/p3.png' },
    { name: 'the guardian', image: '/images/p4.png' },
    { name: 'garuda', image: '/images/p5.png' },
    { name: 'the respon', image: '/images/p2.png' },
    { name: 'the guardian', image: '/images/p4.png' },
    { name: 'the respon', image: '/images/p2.png' },
    { name: 'wehjangan', image: '/images/p3.png' },
];

interface CardItem {
    id?: number;
    title: string;
    description: string;
    image: string;
    link: string;
    author: string;
}

const HOME_NEWS_LIMIT = 4;

const TiltCard = ({ title, description, image, link, author }: CardItem) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const threshold = 12;

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setTilt({ x: y * -threshold, y: x * threshold });
    };

    return (
        <Link href={link} className="w-full">
            <div
                className="group rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer bg-white flex flex-col h-[420px]"
                onMouseMove={handleMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                <img
                    src={image || '/placeholder.jpg'}
                    className="w-full h-52 object-cover"
                    alt={title}
                />
                <h3 className="mt-3 px-4 pt-3 mb-1 text-lg font-semibold text-gray-800 line-clamp-2">
                    {title}
                </h3>
                <p className="text-xs px-4 text-gray-400">Oleh: {author || 'Anonim'}</p>
                <p className="px-4 text-sm text-gray-600 leading-relaxed line-clamp-3 min-h-[4.5rem] mt-1">
                    {description ? description.replace(/<[^>]*>?/gm, '') : ''}
                </p>
                <div className="mt-auto px-4 pb-4">
                    <span className="relative inline-flex items-center justify-center overflow-hidden rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white">
                        <span className="absolute inset-0 bg-gradient-to-r from-[#d11b24] via-[#b3181f] to-[#7f0f15] transition-all duration-500 group-hover:scale-105"></span>
                        <span className="absolute -inset-y-1 -left-8 w-8 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[105%]"></span>
                        <span className="relative">Baca selengkapnya →</span>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default function Home() {
    const content = useContent();
    const hero = content.section('home', 'hero');

    const [cards, setCards] = useState<CardItem[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchNews = (targetPage = 1) => {
        fetch(`/api/news?page=${targetPage}`)
            .then((res) => res.json())
            .then((result) => {
                const data = result.data || [];
                const formatted = data
                    .filter((news: any, index: number, items: any[]) =>
                        items.findIndex((item) => item.id === news.id) === index,
                    )
                    .slice(0, HOME_NEWS_LIMIT)
                    .map((n: any) => ({
                        id: n.id,
                        title: n.title,
                        description: n.content,
                        image: n.image ? `/storage/${n.image}` : '/placeholder.jpg',
                        link: `/news/${n.id}`,
                        author: n.user_name || 'Anonim',
                    }));
                setCards(formatted);
                setPage(result.current_page || 1);
                setLastPage(result.last_page || 1);
            })
            .catch((err) => console.error('Fetch news error:', err));
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f5]">
            <Head title="Partai Garda Republik Indonesia - Official Website" />
            <PublicNavbar />

            <main className="flex-grow pt-16 w-full">
                {/* Hero Banner Section */}
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden">
                    <img
                        src="/images/banner home.jpg"
                        alt="Header Home"
                        className="w-full h-[220px] md:h-[360px] lg:h-[460px] object-cover"
                    />
                    <span className="hero-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />
                    <span className="hero-sheen-two pointer-events-none absolute inset-y-0 -left-1/3 w-1/4" />
                </section>

                {/* Section Introduction */}
                <section className="py-10 md:py-16">
                    <div className="w-full md:max-w-5xl mx-auto px-4 md:px-6">
                        <div className="rounded-2xl px-6 py-6 md:px-8 md:py-7 bg-white/70 backdrop-blur-md shadow-sm border border-zinc-200/60">
                            <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-red-600 font-semibold mb-2">
                                {hero.highlight || 'Partai Garuda'}
                            </p>
                            <h2 className="text-xl md:text-3xl font-bold text-zinc-900 mb-3">
                                {hero.title ||
                                    'Gerakan Politik Kebangsaan Untuk Indonesia'}
                            </h2>
                            <p className="text-sm md:text-base text-zinc-700 leading-relaxed">
                                {hero.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3 Pillars */}
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#202020] py-8 md:py-10 mb-8">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 place-items-center">
                        <div className="overflow-hidden rounded-2xl w-full max-w-[360px] bg-white/5 border border-white/10 shadow-lg">
                            <img
                                src="/images/home/NASIONALIS.jpg"
                                alt="Nasionalis"
                                className="block w-full object-contain object-center mx-auto"
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl w-full max-w-[360px] bg-white/5 border border-white/10 shadow-lg">
                            <img
                                src="/images/home/RELIGIUS.jpg"
                                alt="Religius"
                                className="block w-full object-contain object-center mx-auto"
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl w-full max-w-[360px] bg-white/5 border border-white/10 shadow-lg">
                            <img
                                src="/images/home/KERAKYATAN.jpg"
                                alt="Kerakyatan"
                                className="block w-full object-contain object-center mx-auto"
                            />
                        </div>
                    </div>
                </section>

                {/* Section Bersama Kita Bisa */}
                <section className="mt-0 mb-16 relative z-10 overflow-hidden text-zinc-900 bg-transparent w-screen left-1/2 right-1/2 -mx-[50vw]">
                    <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 py-8 md:px-10 md:py-12 bg-white/60 rounded-3xl border border-zinc-200/80 backdrop-blur-md">
                            <div className="order-1">
                                <div className="rounded-2xl overflow-hidden">
                                    <img
                                        src="/images/home/moment.png"
                                        alt="Moment Partai Garuda"
                                        className="w-full mx-auto h-[260px] md:h-[420px] object-contain"
                                    />
                                </div>
                            </div>

                            <div className="order-2 space-y-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-red-600 font-bold">
                                    Partai Garda Republik Indonesia
                                </p>
                                <h2 className="text-2xl md:text-4xl font-bold leading-tight text-zinc-900">
                                    &ldquo;Bersama, Kita Bisa!&rdquo;
                                </h2>
                                <p className="text-sm md:text-base text-zinc-700 leading-relaxed">
                                    Komitmen Kami: Kami siap menjadi pelopor perubahan dan garda terdepan
                                    dalam memperjuangkan hak-hak rakyat. Dengan tekad yang bulat,
                                    kami berkomitmen untuk selalu hadir dalam setiap langkah perjuangan
                                    masyarakat, memberikan solusi nyata untuk tantangan bangsa,
                                    dan membawa aspirasi Anda ke tingkat yang lebih tinggi.
                                </p>
                                <div className="pt-4">
                                    <a
                                        href="https://app.partaigaruda.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-xs font-bold text-white uppercase tracking-wider shadow-lg"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-[#d11b24] via-[#b3181f] to-[#7f0f15] transition-all duration-500 group-hover:scale-105"></span>
                                        <span className="absolute -inset-y-1 -left-8 w-8 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[105%]"></span>
                                        <span className="relative">Bergabung Menjadi Anggota</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Indonesia Map Graphic */}
                <section className="relative z-20">
                    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#202020] py-10 md:py-14 shadow-[0_20px_36px_rgba(0,0,0,0.18)]">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-red-600 font-semibold mb-2">
                                Gerakan
                            </p>
                            <h3 className="text-xl md:text-3xl font-bold text-white px-4">
                                Partai Garuda Untuk Indonesia Berdaulat
                            </h3>
                            <p className="mt-3 md:mt-4 text-sm md:text-base text-zinc-300 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
                                Kami hadir membawa semangat perubahan melalui kerja politik yang berpihak pada rakyat,
                                mendorong keadilan sosial, serta memperkuat persatuan nasional untuk masa depan Indonesia
                                yang lebih maju dan bermartabat.
                            </p>

                            <div className="mt-6 flex justify-center px-4 md:px-0">
                                <img
                                    src="/images/home/indonesia.png"
                                    alt="Peta Indonesia Garuda"
                                    className="w-full max-w-4xl md:max-w-5xl h-auto max-h-[260px] md:max-h-[360px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Video Highlight Section */}
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#2a2a2a] py-8 mb-14 text-white">
                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center p-4">
                            <div className="space-y-3 text-center md:text-left">
                                <p className="text-xs tracking-[0.25em] uppercase text-red-500 font-bold">
                                    Kaderisasi Pemimpin
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                    Membangun Indonesia yang Sejahtera.
                                </h2>
                                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                                    Melalui semangat kebersamaan dan partisipasi masyarakat, kepemimpinan
                                    dapat menghadirkan kebijakan yang berpihak pada kesejahteraan rakyat
                                    serta membawa Indonesia menuju masa depan yang lebih adil, kuat, dan sejahtera.
                                </p>
                            </div>

                            <div className="flex items-center justify-center">
                                <video
                                    className="w-full max-w-full aspect-[16/9] object-cover rounded-xl shadow-[8px_10px_0_rgba(179,24,31,0.9)]"
                                    src="/videos/home video.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    controls
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Berita Terbaru Section */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-zinc-900">Berita Terbaru</h2>
                        <p className="mt-2 text-sm md:text-base text-zinc-600">
                            Informasi terkini yang menghadirkan berbagai kegiatan dan perkembangan terbaru.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.slice(0, HOME_NEWS_LIMIT).map((card, i) => (
                            <TiltCard key={card.id ?? i} {...card} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-3">
                            <button
                                onClick={() => fetchNews(page - 1)}
                                disabled={page <= 1}
                                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-200 text-zinc-800 disabled:opacity-40 hover:bg-zinc-300 transition"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-xs font-medium text-zinc-600">
                                Halaman {page} dari {lastPage}
                            </span>
                            <button
                                onClick={() => fetchNews(page + 1)}
                                disabled={page >= lastPage}
                                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-200 text-zinc-800 disabled:opacity-40 hover:bg-zinc-300 transition"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </section>

                {/* Media Center Ticker Section */}
                <section className="mt-8 mb-16">
                    <h2 className="text-xl font-semibold text-center mb-6 text-zinc-700">
                        Media Center Garuda
                    </h2>
                    <div className="relative overflow-hidden rounded-2xl py-2 space-y-4">
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#f6f6f5] to-transparent z-10" />
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#f6f6f5] to-transparent z-10" />

                        <div className="carousel-track flex items-center gap-8 w-max px-8">
                            {[...shoeBrands, ...shoeBrands].map((brand, i) => (
                                <div
                                    key={`${brand.name}-${i}`}
                                    className="h-16 w-36 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                >
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="max-h-10 max-w-[120px] object-contain grayscale hover:grayscale-0 transition"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="carousel-track-reverse flex items-center gap-8 w-max px-8">
                            {[...shoeBrands, ...shoeBrands].map((brand, i) => (
                                <div
                                    key={`reverse-${brand.name}-${i}`}
                                    className="h-16 w-36 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                >
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="max-h-10 max-w-[120px] object-contain grayscale hover:grayscale-0 transition"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style>{`
                .hero-sheen {
                    background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 58%, transparent 100%);
                    filter: blur(0.4px);
                    animation: heroSheen 2.8s cubic-bezier(.52, 1, .36, 1) .35s both;
                }
                .hero-sheen-two {
                    background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.04) 60%, transparent 100%);
                    filter: blur(0.5px);
                    animation: heroSheenTwo 4.2s cubic-bezier(.22, 1, .36, 1) 1s both;
                }
                .carousel-track {
                    animation: carousel-scroll 28s linear infinite;
                }
                .carousel-track-reverse {
                    animation: carousel-scroll-reverse 28s linear infinite;
                }
                @keyframes heroSheen {
                    from {
                        transform: translateX(0);
                        opacity: 0;
                    }
                    12% {
                        opacity: 1;
                    }
                    to {
                        transform: translateX(440%);
                        opacity: 0;
                    }
                }
                @keyframes heroSheenTwo {
                    from {
                        transform: translateX(0);
                        opacity: 0;
                    }
                    15% {
                        opacity: 1;
                    }
                    to {
                        transform: translateX(520%);
                        opacity: 0;
                    }
                }
                @keyframes carousel-scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                @keyframes carousel-scroll-reverse {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
