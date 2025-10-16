import { Activity, Calendar, Image, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function HeaderActions() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                    Bienvenido de vuelta
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>Viernes, 10 de Octubre 2025</span>
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={() => router.push("/appointments")} className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    Agenda
                </button>

                {session?.userType == "TATUADOR" && (
                    <>
                        <button onClick={() => router.push("/clients")} className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-gray-900/20 dark:shadow-white/20 cursor-pointer">
                            <Users className="w-4 h-4" />
                            Clientes
                        </button>

                        <button onClick={() => router.push("/portafolio")} className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-gray-900/20 dark:shadow-white/20 cursor-pointer">
                            <Image className="w-4 h-4" />
                            Portafolio
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default HeaderActions;