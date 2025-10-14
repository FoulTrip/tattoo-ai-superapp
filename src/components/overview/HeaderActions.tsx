import { Activity, Calendar, Plus } from "lucide-react";

function HeaderActions() {
    return (
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
    )
}

export default HeaderActions;