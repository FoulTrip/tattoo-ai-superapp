import { CheckCircle2, DollarSign, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { monthlyRevenue, stats } from "./data";

function RevenueCard() {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

    return (
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
    )
}

export default RevenueCard