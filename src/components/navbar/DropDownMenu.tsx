import { UseNavBar } from "@/hooks/UseNavBar";
import { Columns3Cog, LogOut, Store, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function DropDownMenu() {
    const { data: session } = useSession();
    const {
        setDropdownOpen,
        handleLogout,
    } = UseNavBar();

    const router = useRouter()

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 px-1">
            {session ? (
                <>
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session.user?.email}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setDropdownOpen(false);
                            router.push("/profile")
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                    </button>

                    <button
                        onClick={() => {
                            setDropdownOpen(false);
                            router.push("/overview")
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <Columns3Cog size={14} />
                        <span>Panel</span>
                    </button>

                    <button
                        onClick={() => {
                            setDropdownOpen(false);
                            router.push("/portafolio")
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Portafolio</span>
                    </button>

                    <button
                        onClick={() => {
                            setDropdownOpen(false);
                            router.push("/marketplace")
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <Store size={14} />
                        <span>Marketplace</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <LogOut size={14} />
                        <span>Cerrar Sesión</span>
                    </button>
                </>
            ) : (
                <button
                    onClick={() => {
                        window.location.href = '/login';
                        setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <User className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                </button>
            )}
        </div>
    )
}

export default DropDownMenu;