import { useDarkMode } from "@/context/DarkModeContext";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export const UseNavBar = () => {
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

    return {
        searchOpen,
        dropdownRef,
        dropdownOpen,
        mobileMenuOpen,
        searchInputRef,
        searchQuery,
        setSearchQuery,
        setSearchOpen,
        setDropdownOpen,
        handleLogout,
        setMobileMenuOpen,
        handleSearch,
    }
}