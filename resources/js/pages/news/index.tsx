import React, { useEffect, useState } from 'react';

import { Head, Link } from '@inertiajs/react';

import { Search } from 'lucide-react';

import { PublicNavbar } from '@/components/public/PublicNavbar';

import { Footer } from '@/components/public/Footer';

const slides = [
    { id: 1, image: '/images/banner-berita.jpg', title: 'Selamat Datang di MyNews' },
    // { id: 2, image: '/images/banner-berita.jpg', title: 'Selamat Datang di MyNews' }
];

function BannerSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full mx-auto aspect-[16/9] max-h-[460px] relative overflow-hidden rounded-2xl mb-10 shadow-lg">
            {slides.map((slide, index) => (
                <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            ))}
        </div>
    );
}

interface NewsCardProps {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    author: string;
    category?: string;
}

const TiltCard = ({ title, description, image, link, author, category }: NewsCardProps) => {
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
                className="group rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-200 ease-out cursor-pointer bg-white flex flex-col h-[420px] border border-zinc-200/80"
                onMouseMove={handleMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                <div className="relative">
                    <img
                        src={image || '/placeholder.jpg'}
                        className="w-full h-52 object-cover"
                        alt={title}
                    />
                    {category && (
                        <span className="absolute top-3 left-3 rounded-full bg-red-600/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                            {category}
                        </span>
                    )}
                </div>
                <h3 className="mt-3 px-4 pt-1 mb-1 text-lg font-bold text-zinc-900 line-clamp-2">
                    {title}
                </h3>
                <p className="text-xs px-4 text-zinc-400">Oleh: {author || 'Anonim'}</p>
                <p className="px-4 text-sm text-zinc-600 leading-relaxed line-clamp-3 min-h-[4.5rem] mt-1">
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

export default function NewsIndex() {
    const [cards, setCards] = useState<NewsCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [categories, setCategories] = useState(['Semua']);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCategories = () => {
        fetch('/api/news/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(['Semua', ...(Array.isArray(data) ? data : [])]);
            })
            .catch((err) => console.error('Fetch categories error:', err));
    };

    const fetchNews = (targetPage = 1, category = selectedCategory, search = searchKeyword) => {
        setLoading(true);
        let url = `/api/news?page=${targetPage}`;
        if (category && category !== 'Semua') {
            url += `&category=${encodeURIComponent(category)}`;
        }
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                const data = result.data || [];
                const formatted = data.map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    description: n.content,
                    image: n.image ? `/storage/${n.image}` : '/placeholder.jpg',
                    link: `/news/${n.id}`,
                    author: n.user_name || 'Anonim',
                    category: n.category || 'Umum',
                }));
                setCards(formatted);
                setPage(result.current_page || 1);
                setLastPage(result.last_page || 1);
            })
            .catch((err) => console.error('Fetch news error:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
        fetchNews(1, 'Semua', '');
    }, []);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        fetchNews(1, cat, searchKeyword);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchNews(1, selectedCategory, searchKeyword);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f5]">
            <Head title="Berita & Artikel - Partai Garuda" />
            <PublicNavbar />

            <main className="flex-grow pt-24 pb-16 max-w-7xl mx-auto px-4 md:px-8 w-full">
                {/* Banner Slider */}
                <BannerSlider />

                {/* Section Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Kanal Informasi & Berita
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-zinc-600 max-w-2xl mx-auto">
                        Ikuti perkembangan kabar, siaran pers, dan liputan kegiatan Partai Garuda di
                        seluruh Indonesia.
                    </p>
                </div>

                {/* Search & Categories Bar */}
                <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat
                                    ? 'bg-[#b3181f] text-white shadow-sm'
                                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Cari topik berita..."
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:border-[#b3181f] focus:ring-1 focus:ring-[#b3181f]"
                        />
                    </form>
                </div>

                {/* News Grid */}
                {loading ? (
                    <div className="py-20 text-center text-zinc-500">Memuat berita...</div>
                ) : cards.length === 0 ? (
                    <div className="py-20 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200">
                        Tidak ada berita yang sesuai dengan kriteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card) => (
                            <TiltCard key={card.id} {...card} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {lastPage > 1 && (
                    <div className="flex justify-center items-center mt-10 space-x-3">
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
            </main>

            <Footer />
        </div>
    );
}
