import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { Footer } from '@/components/public/Footer';

interface YouTubeVideo {
    title: string;
    channel: string;
    embedUrl: string;
}

const youtubeVideos: YouTubeVideo[] = [
    {
        title: 'Wapres Gibran Semakin Dihantam Semakin Matang⁉️',
        channel: 'Partai Garuda',
        embedUrl: 'https://www.youtube.com/embed/mtvvkspRFZs',
    },
    {
        title: 'Rakyat Belum Puas Dengan Prabowo Gegara Kasus Jokowi yang Belum Tuntas⁉️',
        channel: 'Partai Garuda',
        embedUrl: 'https://www.youtube.com/embed/QJwmDZoXh1c',
    },
    {
        title: 'Fenomena Joki Strava, Males Olahraga Pengen Cari Validasi Semata⁉️',
        channel: 'Partai Garuda',
        embedUrl: 'https://www.youtube.com/embed/Ly1SHX2vkpk',
    },
];

const useRollingNumber = (target: number, duration: number, start: boolean) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;

        let frameId: number;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.round(target * eased));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [target, duration, start]);

    return value;
};

const VideoCard = ({ title, channel, embedUrl }: YouTubeVideo) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const threshold = 10;

    const handleMove = (e: React.MouseEvent<HTMLElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setTilt({ x: y * -threshold, y: x * threshold });
    };

    return (
        <article
            className="group rounded-2xl overflow-hidden bg-white shadow-xl border border-zinc-200/70 transition-transform duration-200 ease-out"
            onMouseMove={handleMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
            <div className="aspect-video w-full bg-black">
                <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
            <div className="p-4">
                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-red-600 font-semibold mb-2">
                    YouTube
                </span>
                <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm text-zinc-600 mt-1">{channel}</p>
            </div>
        </article>
    );
};

export default function MediaIndex() {
    const statsRef = useRef<HTMLDivElement>(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const viewCount = useRollingNumber(1287500, 3200, statsVisible);
    const [settings, setSettings] = useState({
        media_section_tagline: 'Highlight Media',
        media_section_title: 'Sumber Informasi Resmi dan Terverifikasi',
        media_section_description:
            'Ruang media ini menampilkan dokumentasi gerakan, pernyataan resmi, dan aktivitas lapangan sebagai bentuk transparansi kerja organisasi kepada publik.',
    });

    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 500], [0, 150]);
    const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

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

    useEffect(() => {
        if (!statsRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );

        observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f4]">
            <Head title="Media - Partai Garuda" />
            <PublicNavbar />

            <main className="flex-grow pt-16 px-4 md:px-8 pb-10">
                {/* Header Parallax Banner */}
                <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] h-[220px] md:h-[360px] lg:h-[420px] overflow-hidden mb-8">
                    <motion.div
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src="/images/banner-media.jpg"
                            alt="Header Media"
                            className="w-full h-full object-coverw-full h-[220px] md:h-[360px] lg:h-[420px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/15" />
                    </motion.div>
                </section>

                <section className="max-w-6xl mx-auto">
                    {/* Video and Channel Highlights */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 rounded-3xl p-3 md:p-6">
                            <div className="rounded-2xl overflow-hidden bg-transparent flex items-center justify-center p-1 md:p-4">
                                <div className="flex items-center gap-2 md:gap-4">
                                    <div className="flex flex-col gap-2 md:gap-4">
                                        <video
                                            className="w-[58px] sm:w-[80px] md:w-[106px] aspect-[9/16] object-cover rounded-lg"
                                            src="/videos/video 1.mp4"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            controls
                                        />
                                        <video
                                            className="w-[58px] sm:w-[80px] md:w-[106px] aspect-[9/16] object-cover rounded-lg"
                                            src="/videos/video 2.mp4"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            controls
                                        />
                                    </div>

                                    <video
                                        className="w-[120px] sm:w-[145px] md:w-[250px] aspect-[9/16] object-cover rounded-xl shadow-[0_18px_42px_rgba(20,20,20,0.30)]"
                                        src="/videos/background website.mp4"
                                        poster="/images/-"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col justify-center min-w-0">
                                <p className="text-[9px] md:text-[11px] tracking-[0.16em] md:tracking-[0.28em] uppercase text-red-600 font-semibold mb-2 md:mb-3">
                                    {settings.media_section_tagline || 'Highlight Media'}
                                </p>
                                <h2 className="text-sm sm:text-lg md:text-3xl font-bold text-zinc-900 leading-tight">
                                    {settings.media_section_title ||
                                        'Sumber Informasi Resmi dan Terverifikasi'}
                                    <img
                                        src="https://img.icons8.com/color/48/verified-badge.png"
                                        alt="Verifikasi"
                                        className="inline-block ml-1 md:ml-2 w-4 h-4 md:w-7 md:h-7 align-[-0.1em]"
                                        loading="lazy"
                                    />
                                </h2>
                                <p className="mt-2 md:mt-3 text-[11px] sm:text-sm md:text-base text-zinc-600 leading-relaxed">
                                    {settings.media_section_description ||
                                        'Ruang media ini menampilkan dokumentasi gerakan, pernyataan resmi, dan aktivitas lapangan sebagai bentuk transparansi kerja organisasi kepada publik.'}
                                </p>
                                <div className="mt-4 px-auto">
                                    <a
                                        href="https://www.youtube.com/@PartaiGarudaOfficial"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative inline-flex items-center justify-center overflow-hidden rounded-lg px-16 py-1.5 text-[8px] font-semibold text-white"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-[#d11b24] via-[#b3181f] to-[#7f0f15] transition-all duration-500 group-hover:scale-105"></span>
                                        <span className="absolute -inset-y-1 -left-8 w-8 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[105%]"></span>
                                        <span className="relative">SUBSCRIBE</span>
                                    </a>
                                </div>
                                <div>
                                    <ul className="mt-5 flex gap-6">
                                        <li>
                                            <a
                                                href="https://www.instagram.com/partaigaruda/"
                                                rel="noreferrer"
                                                target="_blank"
                                                className="text-zinc-600 transition hover:text-red-500"
                                            >
                                                <span className="sr-only">Instagram</span>
                                                <svg
                                                    className="size-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.facebook.com/PartaiGarudaOfficiall"
                                                rel="noreferrer"
                                                target="_blank"
                                                className="text-zinc-600 transition hover:text-red-500"
                                            >
                                                <span className="sr-only">Facebook</span>
                                                <svg
                                                    className="size-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                rel="noreferrer"
                                                target="_blank"
                                                className="text-zinc-600 transition hover:text-red-500"
                                            >
                                                <span className="sr-only">Twitter</span>
                                                <svg
                                                    className="size-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                rel="noreferrer"
                                                target="_blank"
                                                className="text-zinc-600 transition hover:text-red-500"
                                            >
                                                <span className="sr-only">Dribbble</span>
                                                <svg
                                                    className="size-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Media Center Dark Banner with Rolling Counter */}
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#101013] via-[#151518] to-[#191013] shadow-[0_24px_70px_rgba(20,20,20,0.35)] p-6 md:p-9 mb-8 text-center">
                        <span className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-red-700/20 blur-3xl" />
                        <span className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-3xl" />

                        <p className="relative text-[11px] tracking-[0.28em] uppercase text-red-600 font-semibold mb-3">
                            Media Center
                        </p>
                        <h1 className="relative text-3xl md:text-4xl font-bold text-zinc-100 leading-tight">
                            Partai Garuda
                        </h1>
                        <p className="relative mt-3 text-zinc-300 leading-relaxed max-w-3xl mx-auto">
                            dokumentasi kegiatan, dan materi komunikasi partai dalam satu halaman.
                        </p>
                        <div
                            ref={statsRef}
                            className="relative mt-6 grid grid-cols-1 md:grid-cols-[250px_280px] justify-center gap-3 md:gap-4 max-w-2xl mx-auto"
                        >
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm w-full min-w-0 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M23.5 6.2a3.03 3.03 0 0 0-2.14-2.14C19.48 3.5 12 3.5 12 3.5s-7.48 0-9.36.56A3.03 3.03 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3.03 3.03 0 0 0 2.14 2.14c1.88.56 9.36.56 9.36.56s7.48 0 9.36-.56a3.03 3.03 0 0 0 2.14-2.14A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.68V8.32L15.84 12 9.6 15.68Z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] tracking-[0.16em] uppercase text-zinc-400">
                                        Platform
                                    </p>
                                    <p className="text-zinc-100 font-semibold">YouTube Official</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-red-500/30 bg-gradient-to-r from-[#2a1114] to-[#3a161a] px-5 py-3 shadow-sm text-left w-full min-w-0">
                                <p className="text-[10px] tracking-[0.16em] uppercase text-red-200">
                                    Total Penayangan
                                </p>
                                <p className="text-2xl md:text-3xl font-extrabold text-white leading-none mt-1 tabular-nums font-mono whitespace-nowrap">
                                    {new Intl.NumberFormat('id-ID').format(viewCount)}+
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* YouTube Video Cards Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {youtubeVideos.map((video, i) => (
                            <motion.div
                                key={`${video.title}-${i}`}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                            >
                                <VideoCard {...video} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
