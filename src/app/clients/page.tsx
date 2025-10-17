"use client"

import { useState } from 'react';
import {
    Users,
    Search,
    ChevronRight,
    ChevronLeft,
    Calendar,
    DollarSign,
    TrendingUp,
    Award,
    Crown,
    X,
} from 'lucide-react';

export default function ClientsDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filterType, setFilterType] = useState('top');
    const itemsPerPage = 20;

    // Datos de ejemplo de clientes
    const allClients = [
        { id: 1, name: 'María García', phone: '+57 300 123 4567', appointments: 24, revenue: 18500000, avatar: 'MG', rank: 1 },
        { id: 2, name: 'Carlos Rodríguez', phone: '+57 301 234 5678', appointments: 21, revenue: 16200000, avatar: 'CR', rank: 2 },
        { id: 3, name: 'Ana Martínez', phone: '+57 302 345 6789', appointments: 19, revenue: 14800000, avatar: 'AM', rank: 3 },
        { id: 4, name: 'Juan Pérez', phone: '+57 303 456 7890', appointments: 17, revenue: 13500000, avatar: 'JP', rank: 4 },
        { id: 5, name: 'Sofia Luna', phone: '+57 304 567 8901', appointments: 16, revenue: 12400000, avatar: 'SL', rank: 5 },
        { id: 6, name: 'Pedro Sánchez', phone: '+57 305 678 9012', appointments: 15, revenue: 11800000, avatar: 'PS', rank: 6 },
        { id: 7, name: 'Laura Gómez', phone: '+57 306 789 0123', appointments: 14, revenue: 10500000, avatar: 'LG', rank: 7 },
        { id: 8, name: 'Diego Torres', phone: '+57 307 890 1234', appointments: 13, revenue: 9800000, avatar: 'DT', rank: 8 },
        { id: 9, name: 'Valentina Cruz', phone: '+57 308 901 2345', appointments: 12, revenue: 9200000, avatar: 'VC', rank: 9 },
        { id: 10, name: 'Andrés Vargas', phone: '+57 309 012 3456', appointments: 11, revenue: 8500000, avatar: 'AV', rank: 10 },
        { id: 11, name: 'Isabella Moreno', phone: '+57 310 123 4567', appointments: 10, revenue: 7800000, avatar: 'IM', rank: 11 },
        { id: 12, name: 'Santiago Díaz', phone: '+57 311 234 5678', appointments: 9, revenue: 7200000, avatar: 'SD', rank: 12 },
        { id: 13, name: 'Camila Ruiz', phone: '+57 312 345 6789', appointments: 9, revenue: 6900000, avatar: 'CR', rank: 13 },
        { id: 14, name: 'Mateo Herrera', phone: '+57 313 456 7890', appointments: 8, revenue: 6400000, avatar: 'MH', rank: 14 },
        { id: 15, name: 'Lucía Ramírez', phone: '+57 314 567 8901', appointments: 8, revenue: 6100000, avatar: 'LR', rank: 15 },
        { id: 16, name: 'Daniel Castro', phone: '+57 315 678 9012', appointments: 7, revenue: 5600000, avatar: 'DC', rank: 16 },
        { id: 17, name: 'Emma Flores', phone: '+57 316 789 0123', appointments: 7, revenue: 5300000, avatar: 'EF', rank: 17 },
        { id: 18, name: 'Sebastián Ortiz', phone: '+57 317 890 1234', appointments: 6, revenue: 4800000, avatar: 'SO', rank: 18 },
        { id: 19, name: 'Mía Jiménez', phone: '+57 318 901 2345', appointments: 6, revenue: 4500000, avatar: 'MJ', rank: 19 },
        { id: 20, name: 'Lucas Mendoza', phone: '+57 319 012 3456', appointments: 5, revenue: 4000000, avatar: 'LM', rank: 20 },
        { id: 21, name: 'Olivia Reyes', phone: '+57 320 123 4567', appointments: 5, revenue: 3800000, avatar: 'OR', rank: 21 },
        { id: 22, name: 'Nicolás Silva', phone: '+57 321 234 5678', appointments: 4, revenue: 3200000, avatar: 'NS', rank: 22 },
        { id: 23, name: 'Martina Suárez', phone: '+57 322 345 6789', appointments: 4, revenue: 3000000, avatar: 'MS', rank: 23 },
        { id: 24, name: 'Gabriel Vega', phone: '+57 323 456 7890', appointments: 3, revenue: 2400000, avatar: 'GV', rank: 24 },
        { id: 25, name: 'Renata Medina', phone: '+57 324 567 8901', appointments: 3, revenue: 2200000, avatar: 'RM', rank: 25 },
    ];

    // Filtrar clientes según búsqueda
    const filteredClients = allClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    // Ordenar según el filtro seleccionado
    const sortedClients = [...filteredClients].sort((a, b) => {
        switch (filterType) {
            case 'top':
                return a.rank - b.rank;
            case 'recent':
                return b.id - a.id;
            case 'revenue':
                return b.revenue - a.revenue;
            case 'appointments':
                return b.appointments - a.appointments;
            case 'alphabetical':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    // Calcular paginación
    const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClients = sortedClients.slice(startIndex, endIndex);

    // Estadísticas generales
    const totalClients = allClients.length;
    const totalRevenue = allClients.reduce((sum, client) => sum + client.revenue, 0);
    const totalAppointments = allClients.reduce((sum, client) => sum + client.appointments, 0);
    const avgRevenuePerClient = totalRevenue / totalClients;

    const getRankBadge = (rank: number) => {
        if (rank === 1) return { icon: Crown, color: 'from-yellow-500 to-amber-500', text: 'text-yellow-600' };
        if (rank === 2) return { icon: Award, color: 'from-gray-400 to-gray-500', text: 'text-gray-600' };
        if (rank === 3) return { icon: Award, color: 'from-orange-600 to-amber-700', text: 'text-orange-600' };
        return null;
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* Header with Stats */}
                <div className="mb-6 sm:mb-8">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                                Clientes
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Gestiona y analiza tu base de clientes
                            </p>
                        </div>

                        {/* Compact Stats Desktop */}
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600/50 rounded-xl backdrop-blur-sm">
                                <div className="p-2.5 bg-blue-500/20 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-slate-400">Total Clientes</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{totalClients}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-gray-200 dark:border-emerald-500/30 rounded-xl backdrop-blur-sm">
                                <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-slate-400">Ingresos Total</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                        <div className="mb-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                                Clientes
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Gestiona y analiza tu base de clientes
                            </p>
                        </div>

                        {/* Stats Mobile - Card Style */}
                        <div className="bg-white dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600/50 rounded-xl backdrop-blur-sm p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500/20 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-slate-400">Clientes</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{totalClients}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 col-span-2 pt-4 border-t border-gray-200 dark:border-slate-600/50">
                                    <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 dark:text-slate-400">Ingresos Totales</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString('es-CO')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clients List */}
                <div className="">
                    <div className="py-4 sm:py-4 px-4 border-b border-gray-200 dark:border-slate-600/50">
                        <div className="flex items-center justify-between gap-4">
                            {/* Filter Selector */}
                            <div className="flex items-center gap-3">
                                <select
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600/50 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500 cursor-pointer appearance-none pr-10 bg-no-repeat bg-right hover:bg-gray-100 dark:hover:bg-slate-700/80 transition-colors"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundSize: '1rem'
                                    }}
                                >
                                    <option value="top">Top Clients</option>
                                    <option value="recent">Clientes Recientes</option>
                                    <option value="revenue">Mayor Ingreso</option>
                                    <option value="appointments">Más Citas</option>
                                    <option value="alphabetical">A-Z</option>
                                </select>
                            </div>

                            {/* Search Toggle Button */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2.5 bg-gray-100 dark:bg-slate-700/60 hover:bg-gray-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-gray-200 dark:border-slate-600/50"
                            >
                                <Search className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Collapsible Search Bar */}
                        {isSearchOpen && (
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700/80 transition-colors"
                                    autoFocus
                                />
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setIsSearchOpen(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-600/50 rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="">
                        {currentClients.map((client) => {
                            const rankBadge = getRankBadge(client.rank);

                            return (
                                <div
                                    key={client.id}
                                    className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group border-l-2 border-transparent hover:border-blue-500"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        {/* Rank & Avatar */}
                                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                            <div className="w-6 sm:w-8 text-center">
                                                {rankBadge ? (
                                                    <div className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${rankBadge.color} shadow-lg`}>
                                                        <rankBadge.icon className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-slate-500">
                                                        #{client.rank}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-lg flex-shrink-0">
                                                {client.avatar}
                                            </div>
                                        </div>

                                        {/* Client Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                                        {client.name}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 truncate">
                                                        {client.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 rounded-lg">
                                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                                        {client.appointments} citas
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                                                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                        ${client.revenue.toLocaleString('es-CO')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button className="flex-shrink-0 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-slate-700/60 hover:bg-gray-200 dark:hover:bg-slate-600/80 border border-gray-200 dark:border-slate-600/50 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 group">
                                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 hidden sm:inline group-hover:text-gray-900 dark:group-hover:text-white">Ver más</span>
                                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-slate-600/50">
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-slate-700/60 hover:bg-gray-200 dark:hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-slate-600/50 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">Anterior</span>
                                </button>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        const isCurrentPage = page === currentPage;

                                        if (totalPages > 5) {
                                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isCurrentPage
                                                                         ? 'bg-gray-900 dark:bg-blue-600 text-white border border-gray-900 dark:border-blue-500'
                                                                         : 'bg-gray-100 dark:bg-slate-700/60 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600/50 hover:bg-gray-200 dark:hover:bg-slate-700/80'
                                                                     }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="text-gray-400 dark:text-slate-600 px-1">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isCurrentPage
                                                             ? 'bg-gray-900 dark:bg-blue-600 text-white border border-gray-900 dark:border-blue-500'
                                                             : 'bg-gray-100 dark:bg-slate-700/60 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600/50 hover:bg-gray-200 dark:hover:bg-slate-700/80'
                                                         }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-slate-700/60 hover:bg-gray-200 dark:hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-slate-600/50 rounded-lg transition-colors"
                                >
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">Siguiente</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}