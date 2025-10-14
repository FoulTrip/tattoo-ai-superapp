"use client"

import { useState } from 'react';
import {
    Search,
    Eye,
    Filter,
    TrendingUp,
    Calendar,
    Bookmark,
    MoreVertical,
    Plus
} from 'lucide-react';
import UsePortafolio from '@/hooks/UsePortafolio';

export default function TattooPortfolio() {

    const {
        searchQuery,
        filteredDesigns,
        expandedDesc,
        setSearchQuery,
        truncateText,
        toggleDescription
    } = UsePortafolio();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Portafolio de Diseños
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            Explora tu colección de tatuajes
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span className="hidden sm:inline">Estadísticas</span>
                        </button>
                        <button className="px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Crear</span>
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar diseños, estilos, etiquetas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-base text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                        />
                    </div>
                </div>

                {/* Designs Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDesigns.map((design) => {
                        const isExpanded = expandedDesc.includes(design.id);
                        const shouldTruncate = design.description.length > 80;

                        return (
                            <div
                                key={design.id}
                                className="group border border-transparent rounded-lg overflow-hidden transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={design.image}
                                        alt={design.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-white text-xs">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {design.views}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Bookmark className="w-3.5 h-3.5" />
                                                    {design.saved}
                                                </span>
                                            </div>
                                            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                                                <MoreVertical className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col h-full">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {design.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                                            <Calendar className="w-3 h-3 inline mr-1" />
                                            {design.date}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                                        {isExpanded || !shouldTruncate
                                            ? design.description
                                            : truncateText(design.description, 80)}
                                        {shouldTruncate && (
                                            <button
                                                onClick={() => toggleDescription(design.id)}
                                                className="ml-1 text-gray-900 dark:text-white font-medium hover:underline"
                                            >
                                                {isExpanded ? 'ver menos' : 'ver más'}
                                            </button>
                                        )}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {design.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}