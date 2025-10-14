"use client"

import HeaderActions from '@/components/overview/HeaderActions';
import RevenueCard from '@/components/overview/RevenueCard';
import AppointmentsCard from '@/components/overview/AppointmentsCard';
import RecentCard from '@/components/overview/RecentlyCard';
import WhatsappBotCard from '@/components/overview/WhatsappBotCard';
import MonthStatsCard from '@/components/overview/MonthCard';
import FastAccess from '@/components/overview/FastAccess';

export default function OverviewDashboard() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header con Actions */}
                    <HeaderActions />

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-12 gap-6">

                        {/* Left Column - 8 cols */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Revenue Cards */}
                            <RevenueCard />

                            {/* Appointments */}
                            <AppointmentsCard />

                            {/* Recent Activity */}
                            <RecentCard />
                        </div>

                        {/* Right Column - 4 cols */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* WhatsApp Bot Card */}
                            <WhatsappBotCard />

                            {/* Métricas Básicas */}
                            <MonthStatsCard />

                            <FastAccess />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}