import { DollarSign, Image, MessageSquare, TrendingUp } from "lucide-react"

function FastAccess() {
    return (

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
    )
}

export default FastAccess