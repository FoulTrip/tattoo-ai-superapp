"use client"

import { useState } from 'react';
import RightActions from './RightActions';
import MobileMenu from './MobileMenu';
import LogoNavbar from './Logo';
import SearchBar from './SearchBar';

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <LogoNavbar />

                    {/* Search Bar Overlay - Center */}
                    {searchOpen && <SearchBar setSearchOpen={setSearchOpen} />}

                    {/* Right Actions */}
                    <RightActions searchOpen={searchOpen} setSearchOpen={setSearchOpen} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && <MobileMenu />}
            </div>
        </nav>
    );
}