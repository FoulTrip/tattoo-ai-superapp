import { recentActivity } from "./data";

function RecentCard() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    const colorClasses = {
                        emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
                        blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
                        purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                    };

                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${colorClasses[activity.color]}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.client}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {activity.action || `Pago de $${(activity.amount! / 1000).toFixed(0)}k recibido`}
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-500">hace {activity.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default RecentCard