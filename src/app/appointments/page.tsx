"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppointments } from '@/hooks/useAppointments';
import type { AppointmentStatus } from '@/types/appointment';
import {
    Calendar,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Download,
    Plus,
    Loader2,
    Wifi,
    WifiOff
} from 'lucide-react';

export default function Appointments() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Integrar WebSocket de appointments
    // TODO: Reemplazar con el tenantId real del usuario autenticado
    // Por ahora usamos el id del usuario o un tenant por defecto
    const tenantId = (session?.user as any)?.tenantId || session?.user?.id || 'default-tenant';

    const {
        appointments,
        stats,
        isConnected,
        isLoading,
        error,
        searchAppointments,
    } = useAppointments({
        tenantId,
        // TODO: Agregar calendarIds si se necesita filtrar por calendarios específicos
        // calendarIds: ['calendar-1', 'calendar-2'],
        onReminderNotification: (appointment, minutes) => {
            // Mostrar notificación de recordatorio
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`Recordatorio: ${appointment.title}`, {
                    body: `Cita en ${minutes} minutos con ${appointment.client.name}`,
                    icon: '/favicon.ico',
                });
            }
        },
    });

    // Filtrar appointments usando búsqueda
    const filteredAppointments = searchQuery
        ? searchAppointments(searchQuery)
        : selectedStatus === 'all'
            ? appointments
            : appointments.filter(apt => apt.status.toLowerCase() === selectedStatus);

    const getStatusConfig = (status: AppointmentStatus) => {
        const configs: Record<AppointmentStatus, {
            label: string;
            color: string;
            bg: string;
            icon: typeof CheckCircle2;
        }> = {
            CONFIRMED: {
                label: 'Confirmada',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                icon: CheckCircle2
            },
            PENDING: {
                label: 'Pendiente',
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-950/30',
                icon: AlertCircle
            },
            CANCELLED: {
                label: 'Cancelada',
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-950/30',
                icon: XCircle
            },
            COMPLETED: {
                label: 'Completada',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-950/30',
                icon: CheckCircle2
            }
        };
        return configs[status];
    };

    // Helper function para obtener iniciales del nombre
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Helper function para formatear fecha
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    // Helper function para formatear hora
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Helper function para calcular duración
    const getDuration = (start: Date, end: Date) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const diff = endTime - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Gestión de Citas
                            </h1>
                            {/* Indicador de conexión */}
                            {isConnected ? (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                                    <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Conectado</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <WifiOff className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sin conexión</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            Administra tus citas programadas en tiempo real
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

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Error de conexión</h3>
                                <p className="text-xs text-red-700 dark:text-red-400">{error.message}</p>
                            </div>
                        </div>
                    </div>
                )}

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

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && appointments.length === 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay citas</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {isConnected
                                        ? 'Comienza creando tu primera cita o espera a que se sincronicen los datos.'
                                        : 'Esperando conexión con el servidor...'}
                                </p>
                                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg mx-auto">
                                    <Plus className="w-4 h-4" />
                                    <span>Nueva Cita</span>
                                </button>
                            </div>
                        )}

                        {/* Appointments List */}
                        {!isLoading && filteredAppointments.length > 0 && (
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
                                                    {getInitials(appointment.client.name)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                                    {appointment.client.name}
                                                                </h3>
                                                                <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusConfig.color}`} />
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                                                                {appointment.title}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {formatDate(appointment.startTime)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {formatTime(appointment.startTime)} ({getDuration(appointment.startTime, appointment.endTime)})
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                ${((appointment.totalPrice || 0) / 1000).toFixed(0)}k
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                ${((appointment.deposit || 0) / 1000).toFixed(0)}k abonado
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Images Container */}
                                                    {appointment.designImages && appointment.designImages.length > 0 && (
                                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            {appointment.designImages.map((img: string, idx: number) => (
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
                        )}

                        {/* No Results State */}
                        {!isLoading && appointments.length > 0 && filteredAppointments.length === 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No se encontraron resultados</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Intenta con otros términos de búsqueda o filtros
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg">
                            <h3 className="text-sm font-semibold text-white mb-3">Resumen Rápido</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Total citas</span>
                                    <span className="text-sm font-bold text-white">{stats.total}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Completadas</span>
                                    <span className="text-sm font-bold text-white">{stats.completed}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                    <span className="text-xs text-white/90">Tasa éxito</span>
                                    <span className="text-sm font-bold text-white">
                                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Connection Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Estado del Sistema</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">WebSocket</span>
                                    <span className={`text-xs font-medium ${isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {isConnected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Sincronización</span>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        Tiempo real
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Tenant ID</span>
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-500 truncate max-w-[150px]">
                                        {tenantId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Actualizaciones en tiempo real</h3>
                            <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                                Las citas se actualizan automáticamente cuando hay cambios. No necesitas recargar la página.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
