"use client"

import { useState } from 'react';
import {
    Calendar,
    Search,
    Clock,
    DollarSign,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Phone,
    Mail,
    Download,
    Plus,
    Bot,
    Monitor,
    CreditCard,
    Wallet
} from 'lucide-react';

export default function Appointments() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const appointments = [
        {
            id: 1,
            client: 'María García',
            phone: '+57 300 123 4567',
            email: 'maria.garcia@email.com',
            date: '2025-10-14',
            time: '10:00',
            duration: '3h',
            service: 'Manga completa - Dragón japonés',
            status: 'confirmed',
            value: 850000,
            deposit: 250000,
            avatar: 'MG',
            notes: 'Cliente prefiere colores vibrantes',
            images: [
                'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&h=200&fit=crop'
            ]
        },
        {
            id: 2,
            client: 'Juan Pérez',
            phone: '+57 301 234 5678',
            email: 'juan.perez@email.com',
            date: '2025-10-14',
            time: '14:00',
            duration: '1.5h',
            service: 'Retoque de color en pierna',
            status: 'pending',
            value: 320000,
            deposit: 100000,
            avatar: 'JP',
            notes: 'Retoque de tatuaje anterior',
            images: [
                'https://images.unsplash.com/photo-1598043503346-80104f6b2cb0?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1590246814883-57c511a9a865?w=200&h=200&fit=crop'
            ]
        },
        {
            id: 3,
            client: 'Sofia Luna',
            phone: '+57 302 345 6789',
            email: 'sofia.luna@email.com',
            date: '2025-10-14',
            time: '16:30',
            duration: '2h',
            service: 'Diseño personalizado - Flores',
            status: 'confirmed',
            value: 450000,
            deposit: 150000,
            avatar: 'SL',
            notes: 'Diseño aprobado',
            images: [
                'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1597937066611-dc2c9e0d5d5b?w=200&h=200&fit=crop'
            ]
        },
        {
            id: 4,
            client: 'Pedro Sánchez',
            phone: '+57 303 456 7890',
            email: 'pedro.sanchez@email.com',
            date: '2025-10-15',
            time: '09:00',
            duration: '4h',
            service: 'Pecho completo - Águila',
            status: 'confirmed',
            value: 1200000,
            deposit: 400000,
            avatar: 'PS',
            notes: 'Primera sesión de dos',
            images: [
                'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&h=200&fit=crop'
            ]
        },
        {
            id: 5,
            client: 'Laura Martínez',
            phone: '+57 304 567 8901',
            email: 'laura.martinez@email.com',
            date: '2025-10-15',
            time: '15:00',
            duration: '2h',
            service: 'Geométrico en brazo',
            status: 'cancelled',
            value: 580000,
            deposit: 0,
            avatar: 'LM',
            notes: 'Cancelado por el cliente',
            images: [
                'https://images.unsplash.com/photo-1590246814883-57c511a9a865?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1597937066611-dc2c9e0d5d5b?w=200&h=200&fit=crop'
            ]
        },
        {
            id: 6,
            client: 'Roberto Díaz',
            phone: '+57 305 678 9012',
            email: 'roberto.diaz@email.com',
            date: '2025-10-16',
            time: '11:00',
            duration: '3h',
            service: 'Tradicional - Barco pirata',
            status: 'pending',
            value: 750000,
            deposit: 250000,
            avatar: 'RD',
            notes: 'Pendiente confirmación de depósito',
            images: [
                'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=200&h=200&fit=crop'
            ]
        }
    ];

    const activityLogs = [
        { id: 1, user: 'María García', action: 'Cita creada', source: 'Bot WhatsApp', time: '2h', icon: Bot },
        { id: 2, user: 'Juan Pérez', action: 'Cita creada', source: 'Sistema', time: '3h', icon: Monitor },
        { id: 3, user: 'Sofia Luna', action: 'Cita creada', source: 'Bot WhatsApp', time: '5h', icon: Bot },
        { id: 4, user: 'Pedro Sánchez', action: 'Cita creada', source: 'Sistema', time: '6h', icon: Monitor },
        { id: 5, user: 'Laura Martínez', action: 'Cita creada', source: 'Bot WhatsApp', time: '8h', icon: Bot },
    ];

    const paymentLogs = [
        { id: 1, user: 'María García', type: 'abono', amount: 250000, time: '1h', icon: Wallet },
        { id: 2, user: 'Pedro Sánchez', type: 'completo', amount: 1200000, time: '3h', icon: CreditCard },
        { id: 3, user: 'Juan Pérez', type: 'abono', amount: 100000, time: '4h', icon: Wallet },
        { id: 4, user: 'Sofia Luna', type: 'completo', amount: 450000, time: '5h', icon: CreditCard },
    ];

    const stats = {
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        totalRevenue: appointments.filter(a => a.status === 'confirmed').reduce((sum, a) => sum + a.value, 0)
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusConfig = (status: string) => {
        const configs = {
            confirmed: {
                label: 'Confirmada',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                icon: CheckCircle2
            },
            pending: {
                label: 'Pendiente',
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-950/30',
                icon: AlertCircle
            },
            cancelled: {
                label: 'Cancelada',
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-950/30',
                icon: XCircle
            }
        };
        return configs[status];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Gestión de Citas
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            Administra tus citas programadas
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">Calendario</span>
                        </button>
                        <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                        <button className="px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nueva</span>
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confirmadas</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.confirmed}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pendientes</p>
                                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 shadow-lg">
                                <p className="text-xs text-white/70 mb-1">Ingresos</p>
                                <p className="text-xl font-bold text-white">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente o servicio..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                                />
                            </div>
                        </div>

                        {/* Appointments */}
                        <div className="space-y-3">
                            {filteredAppointments.map((appointment) => {
                                const statusConfig = getStatusConfig(appointment.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div
                                        key={appointment.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-md flex-shrink-0">
                                                {appointment.avatar}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                                {appointment.client}
                                                            </h3>
                                                            <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusConfig.color}`} />
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                                                            {appointment.service}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {appointment.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {appointment.time} ({appointment.duration})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                            ${(appointment.value / 1000).toFixed(0)}k
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                            ${(appointment.deposit / 1000).toFixed(0)}k abonado
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Images Container */}
                                                {appointment.images && (
                                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                        {appointment.images.map((img, idx) => (
                                                            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Activity Logs */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Registro de Actividad</h3>
                            <div className="space-y-2">
                                {activityLogs.map((log) => {
                                    const Icon = log.icon;
                                    const isBot = log.source === 'Bot WhatsApp';
                                    
                                    return (
                                        <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${isBot ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-blue-100 dark:bg-blue-950/30'}`}>
                                                <Icon className={`w-3.5 h-3.5 ${isBot ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                                    {log.action} por {log.user}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    desde {log.source} · hace {log.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Logs */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Registro de Pagos</h3>
                            <div className="space-y-2">
                                {paymentLogs.map((log) => {
                                    const Icon = log.icon;
                                    const isComplete = log.type === 'completo';
                                    
                                    return (
                                        <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${isComplete ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-blue-100 dark:bg-blue-950/30'}`}>
                                                <Icon className={`w-3.5 h-3.5 ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                                    {log.user} {log.type === 'completo' ? 'pago completo' : 'abonó'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        hace {log.time}
                                                    </p>
                                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                                        ${(log.amount / 1000).toFixed(0)}k COP
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-semibold text-white mb-3">Resumen Rápido</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Citas hoy</span>
                                    <span className="text-sm font-bold text-white">3</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Esta semana</span>
                                    <span className="text-sm font-bold text-white">12</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Tasa confirmación</span>
                                    <span className="text-sm font-bold text-white">85%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}