"use client"

import { useState } from 'react';
import {
    Calendar,
    Plus,
    TrendingUp,
    Users,
    Clock,
    MessageSquare,
    Image,
    ChevronRight,
    DollarSign,
    CheckCircle2,
    Activity
} from 'lucide-react';
import Navbar from '@/components/navbar/NavBar';

export default function OverviewDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    const stats = {
        todayRevenue: 2450000,
        monthRevenue: 18500000,
        weeklyGrowth: 12.5,
        portfolioViews: 1248,
        completedAppointments: 24,
        newLeads: 18
    };

    // Datos mensuales para la gráfica (en millones)
    const monthlyRevenue = [
        { month: 'Ene', value: 12.5 },
        { month: 'Feb', value: 14.2 },
        { month: 'Mar', value: 15.8 },
        { month: 'Abr', value: 13.5 },
        { month: 'May', value: 16.3 },
        { month: 'Jun', value: 17.1 },
        { month: 'Jul', value: 15.9 },
        { month: 'Ago', value: 18.5 },
        { month: 'Sep', value: 19.2 },
        { month: 'Oct', value: 18.5 },
        { month: 'Nov', value: 0 },
        { month: 'Dic', value: 0 }
    ];

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

    const upcomingAppointments = [
        { id: 1, client: 'María García', time: '10:00', duration: '3h', service: 'Manga completa', artist: 'Carlos Ruiz', status: 'confirmed', avatar: 'MG', value: 850000 },
        { id: 2, client: 'Juan Pérez', time: '14:00', duration: '1.5h', service: 'Retoque color', artist: 'Ana Torres', status: 'pending', avatar: 'JP', value: 320000 },
        { id: 3, client: 'Sofia Luna', time: '16:30', duration: '2h', service: 'Diseño personalizado', artist: 'Carlos Ruiz', status: 'confirmed', avatar: 'SL', value: 450000 }
    ];

    const recentActivity = [
        { type: 'payment', client: 'Pedro Sánchez', amount: 650000, time: '2h', icon: DollarSign, color: 'emerald' },
        { type: 'design', client: 'Laura Martínez', action: 'aprobó diseño', time: '3h', icon: CheckCircle2, color: 'blue' },
        { type: 'booking', client: 'Roberto Díaz', action: 'agendó cita', time: '5h', icon: Calendar, color: 'purple' }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header con Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                                Bienvenido de vuelta
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <span>Viernes, 10 de Octubre 2025</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                <span className="flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5" />
                                    8 citas hoy
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                                <Calendar className="w-4 h-4" />
                                Ver Calendario
                            </button>
                            <button className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-gray-900/20 dark:shadow-white/20">
                                <Plus className="w-4 h-4" />
                                Nueva Cita
                            </button>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-12 gap-6">

                        {/* Left Column - 8 cols */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Revenue Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Main Revenue Card */}
                                <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-medium text-white/80">Ingresos</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {['today', 'week', 'month'].map((period) => (
                                                    <button
                                                        key={period}
                                                        onClick={() => setSelectedPeriod(period)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedPeriod === period
                                                            ? 'bg-white/20 text-white'
                                                            : 'text-white/60 hover:text-white/80'
                                                            }`}
                                                    >
                                                        {period === 'today' ? 'Hoy' : period === 'week' ? 'Semana' : 'Mes'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <h2 className="text-4xl font-bold mb-1">
                                                ${(stats.todayRevenue / 1000).toFixed(0)}k
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span className="font-medium">+{stats.weeklyGrowth}%</span>
                                                </div>
                                                <span className="text-white/60">vs. semana anterior</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <div className="mb-3">
                                                <p className="text-xs text-white/60">Ingresos mensuales 2025</p>
                                            </div>

                                            {/* Gráfica de barras minimalista */}
                                            <div className="flex items-end justify-between gap-1 h-16">
                                                {monthlyRevenue.map((data, index) => {
                                                    const height = data.value > 0 ? (data.value / maxRevenue) * 100 : 5;
                                                    const isCurrentMonth = index === 9; // Octubre

                                                    return (
                                                        <div key={data.month} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative">
                                                            <div className="w-full flex items-end" style={{ height: '48px' }}>
                                                                <div
                                                                    className={`w-full rounded-sm transition-all ${data.value === 0
                                                                            ? 'bg-white/10 dark:bg-white/5'
                                                                            : isCurrentMonth
                                                                                ? 'bg-emerald-400 dark:bg-emerald-500 group-hover:bg-emerald-300 dark:group-hover:bg-emerald-400'
                                                                                : 'bg-white/30 dark:bg-white/20 group-hover:bg-white/40 dark:group-hover:bg-white/30'
                                                                        }`}
                                                                    style={{ height: `${height}%` }}
                                                                >
                                                                    {/* Tooltip */}
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                                        {data.value > 0 ? `$${data.value}M` : 'Sin datos'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[9px] transition-colors ${isCurrentMonth ? 'text-white font-medium' : 'text-white/50 dark:text-white/40'
                                                                }`}>
                                                                {data.month}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Citas completadas</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedAppointments}</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Este mes</p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Nuevos leads</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newLeads}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Esta semana</p>
                                    </div>
                                </div>
                            </div>

                            {/* Appointments */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Agenda de Hoy</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">3 citas programadas</p>
                                        </div>
                                        <button className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                                            <span className="hidden sm:inline">Ver todas</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {upcomingAppointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="px-4 py-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-lg">
                                                        {appointment.avatar}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                                                    {appointment.client}
                                                                </h4>
                                                                {appointment.status === 'confirmed' ? (
                                                                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full whitespace-nowrap">
                                                                        Confirmada
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full whitespace-nowrap">
                                                                        Pendiente
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5 line-clamp-1">
                                                                {appointment.service}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                    {appointment.time} ({appointment.duration})
                                                                </span>
                                                                <span className="flex items-center gap-1 line-clamp-1">
                                                                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                    <span className="truncate">{appointment.artist}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0 flex items-center gap-1 sm:gap-2">
                                                            <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                                ${(appointment.value / 1000).toFixed(0)}k
                                                            </p>
                                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => {
                                        const IconComponent = activity.icon;
                                        const colorClasses = {
                                            emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
                                            blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
                                            purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                                        };

                                        return (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${colorClasses[activity.color]}`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.client}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {activity.action || `Pago de $${(activity.amount / 1000).toFixed(0)}k recibido`}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-500">hace {activity.time}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - 4 cols */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* WhatsApp Bot Card */}
                            <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold">WhatsApp Bot</h3>
                                    </div>

                                    <p className="text-sm text-white/90 mb-6">
                                        Tu asistente automático está respondiendo consultas 24/7.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                                            <span className="text-sm">Consultas respondidas</span>
                                            <span className="text-lg font-bold">47</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                                            <span className="text-sm">Tiempo respuesta</span>
                                            <span className="text-lg font-bold">&lt;2min</span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium">
                                        <MessageSquare className="w-4 h-4" />
                                        Ver conversaciones
                                    </button>
                                </div>
                            </div>

                            {/* Métricas Básicas */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Resumen del Mes</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Ganancias totales</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">${(stats.monthRevenue / 1000000).toFixed(1)}M</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+{stats.weeklyGrowth}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Citas completadas</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.completedAppointments}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">este mes</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Nuevos leads</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.newLeads}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">esta semana</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Acceso Rápido</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl hover:scale-105 transition-transform text-left border border-purple-200 dark:border-purple-800">
                                        <Image className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Portafolio</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Gestionar</p>
                                    </button>

                                    <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl hover:scale-105 transition-transform text-left border border-blue-200 dark:border-blue-800">
                                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Mensajes</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Consultas</p>
                                    </button>

                                    <button className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 rounded-xl hover:scale-105 transition-transform text-left border border-emerald-200 dark:border-emerald-800">
                                        <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Pagos</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Transacciones</p>
                                    </button>

                                    <button className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 rounded-xl hover:scale-105 transition-transform text-left border border-amber-200 dark:border-amber-800">
                                        <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Reportes</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Analíticas</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}