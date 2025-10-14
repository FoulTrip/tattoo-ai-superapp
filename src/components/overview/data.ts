import { Calendar, CheckCircle2, DollarSign } from "lucide-react";

export const stats = {
    todayRevenue: 2450000,
    monthRevenue: 18500000,
    weeklyGrowth: 12.5,
    portfolioViews: 1248,
    completedAppointments: 24,
    newLeads: 18
};

// Datos mensuales para la gráfica (en millones)
export const monthlyRevenue = [
    { month: 'Ene', value: 12.5 },
    { month: 'Feb', value: 14.2 },
    { month: 'Mar', value: 15.8 },
    { month: 'Abr', value: 13.5 },
    { month: 'May', value: 16.3 },
    { month: 'Jun', value: 17.1 },
    { month: 'Jul', value: 15.9 },
    { month: 'Ago', value: 18.5 },
    { month: 'Sep', value: 19.2 },
    { month: 'Oct', value: 18.5 },
    { month: 'Nov', value: 0 },
    { month: 'Dic', value: 0 }
];

export const upcomingAppointments = [
    { id: 1, client: 'María García', time: '10:00', duration: '3h', service: 'Manga completa', artist: 'Carlos Ruiz', status: 'confirmed', avatar: 'MG', value: 850000 },
    { id: 2, client: 'Juan Pérez', time: '14:00', duration: '1.5h', service: 'Retoque color', artist: 'Ana Torres', status: 'pending', avatar: 'JP', value: 320000 },
    { id: 3, client: 'Sofia Luna', time: '16:30', duration: '2h', service: 'Diseño personalizado', artist: 'Carlos Ruiz', status: 'confirmed', avatar: 'SL', value: 450000 }
];

export const recentActivity = [
    { type: 'payment', client: 'Pedro Sánchez', amount: 650000, time: '2h', icon: DollarSign, color: 'emerald' },
    { type: 'design', client: 'Laura Martínez', action: 'aprobó diseño', time: '3h', icon: CheckCircle2, color: 'blue' },
    { type: 'booking', client: 'Roberto Díaz', action: 'agendó cita', time: '5h', icon: Calendar, color: 'purple' }
];