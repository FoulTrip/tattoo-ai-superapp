import { ChevronRight, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { upcomingAppointments } from "./data";

function AppointmentsCard() {
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Agenda de Hoy</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">3 citas programadas</p>
                    </div>
                    <button onClick={() => router.push("/appointments")} className="cursor-pointer text-xs sm:text-sm font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
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
    )
}

export default AppointmentsCard