import { CheckCircle2, DollarSign, Users } from "lucide-react"
import { stats } from "./data"

function MonthStatsCard() {
    return (
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
    )
}

export default MonthStatsCard