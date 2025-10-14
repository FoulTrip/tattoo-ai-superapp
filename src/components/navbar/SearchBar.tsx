"use client"

import { Search, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface SearchBarProps {
    setSearchOpen: (open: boolean) => void;
}

function SearchBar({ setSearchOpen }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleSearch = () => {
        console.log('Buscando:', searchQuery);
        setSearchOpen(false);
        setSearchQuery('');
    };

    return (
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
    )
}

export default SearchBar