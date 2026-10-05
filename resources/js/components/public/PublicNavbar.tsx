import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

interface User {
    name: string;
    role: string;
}

interface Auth {
    user: User | null;
}

interface PageProps {
    auth: Auth;
    [key: string]: unknown;
}

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Struktur', href: '/struktur' },
    { label: 'Konsultasi', href: '/konsultasi' },
    { label: 'Media', href: '/media' },
    { label: 'Berita', href: '/news' },
];

export function PublicNavbar() {
    const { auth, url } = usePage<PageProps & { url: string }>().props;
    const user = auth?.user ?? null;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <nav className="bg-[#b3181f]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.28)] fixed w-full z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="inline-flex items-center">
                            <img
                                src="/images/update logo/LogoNavbar.png"
                                alt="Logo Navbar"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex sm:space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link-animated inline-flex items-center px-1 pt-1 text-sm font-medium ${
                                    currentUrl === link.href
                                        ? 'text-white border-b-2 border-white'
                                        : 'text-white/80 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side: user menu + mobile toggle */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    type="button"
                                    className="flex text-sm bg-white/15 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white/70 px-3 py-1"
                                >
                                    {user.name}
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        {user.role === 'super_admin' && (
                                            <Link
                                                href="/dashboard/users"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Manajemen User
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-3 py-1 bg-white text-[#b3181f] rounded hover:bg-white/90 transition font-semibold text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="hidden sm:block px-3 py-1 border border-white/70 text-white rounded hover:bg-white/10 transition text-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-white/85 hover:text-white hover:bg-white/10"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="sm:hidden bg-[#8f1016] shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-white hover:bg-white/10"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
