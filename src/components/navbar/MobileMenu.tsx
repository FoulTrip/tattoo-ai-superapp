"use client"

import { UseNavBar } from "@/hooks/UseNavBar";
import { Columns3Cog, LogOut, MapPin, Store, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function MobileMenu() {
    const { data: session } = useSession();
    const { setMobileMenuOpen, handleLogout } = UseNavBar();
    const router = useRouter()

    return (
        <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Cali, Colombia</span>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => {
                        console.log('Ir a perfil');
                        setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                            {session?.user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ver perfil</p>
                    </div>
                </button>

                <button
                    onClick={() => {
                        // setDropdownOpen(false);
                        router.push("/overview")
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                    <Columns3Cog size={14} />
                    <span>Panel</span>
                </button>

                <button
                    onClick={() => {
                        // setDropdownOpen(false);
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
                        // setDropdownOpen(false);
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
            </div>
        </div>
    )
}

export default MobileMenu