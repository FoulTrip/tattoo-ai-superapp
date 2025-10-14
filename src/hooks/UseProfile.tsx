import { UserProfile } from "@/types/portafolio"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"



function UseProfile() {
    const { data: session } = useSession()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [activeTab, setActiveTab] = useState<string>("datos-personales")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!session) return

            try {
                // Aquí iría la llamada a la API para obtener el perfil completo
                // Por ahora, simulamos datos basados en el session
                const mockProfile: UserProfile = {
                    id: session.user?.id || "",
                    email: session.user?.email || "",
                    name: "Usuario Ejemplo",
                    phone: "+57 300 123 4567",
                    userType: "CLIENTE", // Cambiar según el usuario real
                    businessName: "Tattoo Studio XYZ",
                    avatar: ""
                }
                setUserProfile(mockProfile)
            } catch (error) {
                console.error("Error fetching user profile:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [session])

    const tabs = userProfile?.userType === "CLIENTE" ? [
        { id: "datos-personales", label: "Datos Personales" },
        { id: "historial-citas", label: "Historial de Citas" },
        { id: "verificacion", label: "Verificación" },
        { id: "seguridad", label: "Seguridad" }
    ] : [
        { id: "datos-personales", label: "Datos Personales" },
        { id: "espacio-trabajo", label: "Espacio de Trabajo" },
        { id: "historial-citas", label: "Historial de Citas" },
        { id: "verificacion", label: "Verificación" },
        { id: "seguridad", label: "Seguridad" }
    ]

    return {
        userProfile,
        loading,
        activeTab,
        tabs,
        setActiveTab,
    }
}

export default UseProfile