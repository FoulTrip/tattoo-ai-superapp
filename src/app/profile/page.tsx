"use client"

import UseProfile from "@/hooks/UseProfile"
import { UserProfile } from "@/types/portafolio"
import { useState } from "react"

function ProfileUser() {

    const {
        loading,
        userProfile,
        activeTab,
        tabs,
        setActiveTab
    } = UseProfile()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>
    }

    if (!userProfile) {
        return <div className="flex justify-center items-center h-screen">Error al cargar perfil</div>
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === tab.id
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === "datos-personales" && <DatosPersonales profile={userProfile} />}
                {activeTab === "espacio-trabajo" && userProfile.userType === "TATUADOR" && <EspacioTrabajo />}
                {activeTab === "historial-citas" && <HistorialCitas />}
                {activeTab === "verificacion" && <Verificacion />}
                {activeTab === "seguridad" && <Seguridad />}
            </div>
        </div>
    )
}

function DatosPersonales({ profile }: { profile: UserProfile }) {
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        businessName: profile.businessName || ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí iría la lógica para guardar los datos
        console.log("Guardando datos personales:", formData)
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Datos Personales</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {profile.userType === "CLIENTE" ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número de Celular (WhatsApp)</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                            <input
                                type="text"
                                value={formData.businessName}
                                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Números de Contacto</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Guardar Cambios
                </button>
            </form>
        </div>
    )
}

function EspacioTrabajo() {
    const [members, setMembers] = useState<Array<{
        id: string
        name: string
        phone: string
        email: string
        avatar?: string
    }>>([])

    const addMember = () => {
        const newMember = {
            id: Date.now().toString(),
            name: "",
            phone: "",
            email: "",
            avatar: ""
        }
        setMembers([...members, newMember])
    }

    const updateMember = (id: string, field: string, value: string) => {
        setMembers(members.map(member =>
            member.id === id ? { ...member, [field]: value } : member
        ))
    }

    const removeMember = (id: string) => {
        setMembers(members.filter(member => member.id !== id))
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Espacio de Trabajo</h2>
            <button
                onClick={addMember}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
            >
                Agregar Miembro
            </button>
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => updateMember(member.id, "name", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Número WhatsApp</label>
                                <input
                                    type="tel"
                                    value={member.phone}
                                    onChange={(e) => updateMember(member.id, "phone", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={member.email}
                                    onChange={(e) => updateMember(member.id, "email", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Foto de Perfil (Opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => updateMember(member.id, "avatar", e.target.files?.[0]?.name || "")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => removeMember(member.id)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Eliminar Miembro
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function HistorialCitas() {
    // Placeholder para historial de citas
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Historial de Citas</h2>
            <p className="text-gray-600">Aquí se mostrará el historial de citas del usuario.</p>
            {/* Aquí iría la lógica para mostrar las citas */}
        </div>
    )
}

function Verificacion() {
    // Placeholder para verificación
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Verificación</h2>
            <p className="text-gray-600">Sección de verificación en desarrollo.</p>
        </div>
    )
}

function Seguridad() {
    // Placeholder para seguridad
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Seguridad</h2>
            <p className="text-gray-600">Sección de seguridad en desarrollo.</p>
        </div>
    )
}

export default ProfileUser