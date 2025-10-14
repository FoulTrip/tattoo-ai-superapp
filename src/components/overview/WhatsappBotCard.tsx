import { MessageSquare } from "lucide-react"

function WhatsappBotCard() {
    return (
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">WhatsApp Bot</h3>
                </div>

                <p className="text-sm text-white/90 mb-6">
                    Tu asistente automático está respondiendo consultas 24/7.
                </p>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                        <span className="text-sm">Consultas respondidas</span>
                        <span className="text-lg font-bold">47</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                        <span className="text-sm">Tiempo respuesta</span>
                        <span className="text-lg font-bold">&lt;2min</span>
                    </div>
                </div>

                <button className="w-full mt-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Ver conversaciones
                </button>
            </div>
        </div>
    )
}

export default WhatsappBotCard