"use client"

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Moon, Sun, User, LogOut, Menu, X } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { darkmode, changeDarkMode } = useDarkMode();
    const { data: session } = useSession();

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        console.log('Buscando:', searchQuery);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const handleLogout = async () => {
        console.log('Cerrando sesión...');
        setDropdownOpen(false);
        setMobileMenuOpen(false);

        await signOut({
            callbackUrl: '/login',
            redirect: true
        });
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <a href="/" className="text-lg font-semibold text-gray-900 dark:text-white">
                            Tattoo
                        </a>

                        {/* Location - Desktop */}
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Cali</span>
                        </div>
                    </div>

                    {/* Search Bar Overlay - Center */}
                    {searchOpen && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-4 z-10">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Buscar tatuajes, artistas..."
                                    className="w-full pl-12 pr-12 py-3 text-sm bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 rounded-full focus:outline-none shadow-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                <button
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-1">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={changeDarkMode}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkmode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* User Menu - Desktop */}
                        <div className="hidden md:block relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {session?.user?.name || 'Usuario'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {session?.user?.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            console.log('Ir a perfil');
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Mi Perfil</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>Cali, Colombia</span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => {
                                    console.log('Ir a perfil');
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {session?.user?.name || 'Usuario'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Ver perfil</p>
                                </div>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}