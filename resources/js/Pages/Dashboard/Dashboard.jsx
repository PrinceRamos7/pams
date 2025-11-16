import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Users,
    Calendar,
    TrendingUp,
    Eye,
    EyeOff,
} from "lucide-react";
import { HideAnalytics } from "@/components/Dashboard/HideAnalytics";
import { ShowAnalytics } from "@/components/Dashboard/ShowAnalytics";

export default function Dashboard() {
    const {
        stats = {},
        sanctionAnalytics = {},
        attendanceAnalytics = {},
        recentEvents = [],
        topSanctionedMembers = [],
    } = usePage().props;

    const [hideAnalytics, setHideAnalytics] = useState(false);

    const statCards = [
        {
            title: "Total Members",
            value: stats.totalMembers,
            icon: Users,
            gradient: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Events",
            value: stats.totalEvents,
            icon: Calendar,
            gradient: "from-green-500 to-green-600",
        },
        {
            title: "Upcoming Events",
            value: stats.upcomingEvents,
            icon: TrendingUp,
            color: "bg-orange-500",
            gradient: "from-orange-500 to-orange-600",
        },
        {
            title: "This Month Events",
            value: stats.currentMonthEvents,
            icon: Calendar,
            color: "bg-indigo-500",
            gradient: "from-indigo-500 to-indigo-600",
        },
    ];

    return (
        <SidebarProvider>
            <Head title="Dashboard" />
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-6" />
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <div className="ml-auto">
                        <button
                            onClick={() => setHideAnalytics(!hideAnalytics)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {hideAnalytics ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Show Analytics
                                    </span>
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Hide Analytics
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {hideAnalytics ? (
                        <HideAnalytics
                            onShowAnalytics={() => setHideAnalytics(false)}
                        />
                    ) : (
                        <ShowAnalytics
                            stats={stats}
                            sanctionAnalytics={sanctionAnalytics}
                            attendanceAnalytics={attendanceAnalytics}
                            recentEvents={recentEvents}
                            topSanctionedMembers={topSanctionedMembers}
                            statCards={statCards}
                        />
                    )}
                </main>
            </SidebarInset>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-reverse {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }

                .zen-mode {
                    animation: fade-in 0.5s ease-out;
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out;
                }

                .animate-slide-in-right {
                    animation: slide-in-right 0.6s ease-out;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 15s linear infinite;
                }

                .animation-delay-100 {
                    animation-delay: 100ms;
                }

                .animation-delay-200 {
                    animation-delay: 200ms;
                }

                .animation-delay-400 {
                    animation-delay: 400ms;
                }

                .animation-delay-500 {
                    animation-delay: 500ms;
                }

                .animation-delay-600 {
                    animation-delay: 600ms;
                }

                .animation-delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </SidebarProvider>
    );
}
