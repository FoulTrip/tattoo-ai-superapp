"use client"

import { useDarkMode } from "@/context/DarkModeContext";
import { LogOut, Menu, Moon, Search, Sun, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import DropDownMenu from "./DropDownMenu";

interface RightActionsProps {
    searchOpen: boolean;
    setSearchOpen: (open: boolean) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

function RightActions({
    searchOpen,
    setSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen
}: RightActionsProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        darkmode,
        changeDarkMode,
    } = useDarkMode();

    const {
        data: session
    } = useSession()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
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
                {dropdownOpen && <DropDownMenu />}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
        </div>
    )
}

export default RightActions