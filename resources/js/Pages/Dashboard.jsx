import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Calendar,
    AlertCircle,
    DollarSign,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
    PieChart,
    Eye,
    EyeOff,
} from "lucide-react";

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
                                    <span className="text-sm font-medium">Show Analytics</span>
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    <span className="text-sm font-medium">Hide Analytics</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {hideAnalytics ? (
                        /* Simple Zen Mode - Clean PITON Logo Display */
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 zen-mode overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-float"></div>
                            <div className="absolute top-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl animate-float animation-delay-200"></div>
                            <div className="absolute bottom-20 left-20 w-36 h-36 bg-cyan-200/30 rounded-full blur-2xl animate-float animation-delay-400"></div>
                            <div className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-200/30 rounded-full blur-2xl animate-float animation-delay-600"></div>
                            
                            {/* Main content */}
                            <div className="relative z-10">
                                {/* Decorative ring around logo */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-80 h-80 rounded-full border-2 border-blue-300/40 animate-spin-slow"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-72 h-72 rounded-full border border-blue-400/30 animate-spin-reverse"></div>
                                </div>
                                
                                <div className="relative flex flex-col items-center gap-6 animate-fade-in">
                                    {/* Logo with glow effect */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl"></div>
                                        <img
                                            src="/avatars/piton.png"
                                            alt="PITON Logo"
                                            className="relative w-48 h-48 object-contain drop-shadow-2xl animate-float"
                                        />
                                    </div>
                                    
                                    {/* Text content */}
                                    <div className="text-center space-y-3">
                                        <h2 className="text-5xl font-bold text-blue-900 tracking-tight">
                                            PITON
                                        </h2>
                                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                                        <p className="text-xl text-blue-600 font-light">
                                            Attendance Monitoring System
                                        </p>
                                    </div>
                                    
                                    {/* Decorative dots */}
                                    <div className="flex gap-2 mt-4">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
                                    </div>
                                    
                                    {/* Show Analytics Button */}
                                    <button
                                        onClick={() => setHideAnalytics(false)}
                                        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="font-medium">Show Analytics</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Welcome Section with Logo */}
                            <div className="mb-8 animate-fade-in">
                        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold animate-slide-in-left">
                                            Welcome to PAMS
                                        </h2>
                                        <p className="text-blue-100 text-lg animate-slide-in-left animation-delay-100">
                                            PITON Attendance Monitoring System
                                        </p>
                                        <p className="text-blue-200 text-sm animate-slide-in-left animation-delay-200">
                                            {new Date().toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>
                                    <div className="animate-float">
                                        <img
                                            src="/avatars/piton.png"
                                            alt="PITON Logo"
                                            className="w-24 h-24 object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        {statCards.map((stat, index) => (
                            <Card
                                key={stat.title}
                                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-600">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`p-4 rounded-full bg-gradient-to-br ${stat.gradient} shadow-lg`}
                                        >
                                            <stat.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Analytics Section */}
                    <div className="grid gap-6 lg:grid-cols-2 mb-8">
                        {/* Sanctions Analytics */}
                        <Card className="animate-fade-in-up animation-delay-400">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    Sanctions Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Sanctions
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {
                                                    sanctionAnalytics.totalSanctions
                                                }
                                            </p>
                                        </div>
                                        <BarChart3 className="w-8 h-8 text-red-600" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <p className="text-xs text-gray-600">
                                                    Paid
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold text-green-700">
                                                {
                                                    sanctionAnalytics.paidSanctions
                                                }
                                            </p>
                                            <p className="text-xs text-green-600">
                                                ₱
                                                {sanctionAnalytics.totalPaidAmount?.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <XCircle className="w-4 h-4 text-red-600" />
                                                <p className="text-xs text-gray-600">
                                                    Unpaid
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold text-red-700">
                                                {
                                                    sanctionAnalytics.unpaidSanctions
                                                }
                                            </p>
                                            <p className="text-xs text-red-600">
                                                ₱
                                                {sanctionAnalytics.totalUnpaidAmount?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-600">
                                                Payment Rate
                                            </p>
                                            <p className="text-lg font-bold text-blue-700">
                                                {sanctionAnalytics.paymentRate}%
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${sanctionAnalytics.paymentRate}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Total Amount
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ₱
                                                    {sanctionAnalytics.totalSanctionAmount?.toLocaleString()}
                                                </p>
                                            </div>
                                            <DollarSign className="w-8 h-8 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance Analytics */}
                        <Card className="animate-fade-in-up animation-delay-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-blue-600" />
                                    Attendance Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Records
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {
                                                    attendanceAnalytics.totalRecords
                                                }
                                            </p>
                                        </div>
                                        <BarChart3 className="w-8 h-8 text-blue-600" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-green-50 rounded-lg text-center">
                                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                            <p className="text-xs text-gray-600 mb-1">
                                                Present
                                            </p>
                                            <p className="text-lg font-bold text-green-700">
                                                {
                                                    attendanceAnalytics.presentRecords
                                                }
                                            </p>
                                        </div>

                                        <div className="p-3 bg-yellow-50 rounded-lg text-center">
                                            <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                                            <p className="text-xs text-gray-600 mb-1">
                                                Late
                                            </p>
                                            <p className="text-lg font-bold text-yellow-700">
                                                {
                                                    attendanceAnalytics.lateRecords
                                                }
                                            </p>
                                        </div>

                                        <div className="p-3 bg-red-50 rounded-lg text-center">
                                            <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                            <p className="text-xs text-gray-600 mb-1">
                                                Absent
                                            </p>
                                            <p className="text-lg font-bold text-red-700">
                                                {
                                                    attendanceAnalytics.absentRecords
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-600">
                                                Attendance Rate
                                            </p>
                                            <p className="text-lg font-bold text-green-700">
                                                {
                                                    attendanceAnalytics.attendanceRate
                                                }
                                                %
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${attendanceAnalytics.attendanceRate}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">
                                            This Month
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Events
                                                </p>
                                                <p className="text-xl font-bold text-indigo-700">
                                                    {stats.currentMonthEvents}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Attendance
                                                </p>
                                                <p className="text-xl font-bold text-indigo-700">
                                                    {stats.currentMonthAttendance}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Sanctions
                                                </p>
                                                <p className="text-xl font-bold text-indigo-700">
                                                    {stats.currentMonthSanctions}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Events */}
                        <Card className="animate-fade-in-up animation-delay-600">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Recent Events
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentEvents.length > 0 ? (
                                        recentEvents.map((event, index) => (
                                            <div
                                                key={event.event_id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-slide-in-right"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                }}
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {event.agenda}
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(
                                                            event.date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-600">
                                                            Attendance
                                                        </p>
                                                        <p className="font-semibold text-blue-600">
                                                            {
                                                                event.attendance_count
                                                            }
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            event.status ===
                                                            "open"
                                                                ? "bg-green-100 text-green-700"
                                                                : event.status ===
                                                                    "closed"
                                                                  ? "bg-gray-100 text-gray-700"
                                                                  : "bg-blue-100 text-blue-700"
                                                        }`}
                                                    >
                                                        {event.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No recent events found
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Sanctioned Members */}
                        <Card className="animate-fade-in-up animation-delay-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    Top Sanctioned Members
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topSanctionedMembers.length > 0 ? (
                                        topSanctionedMembers.map(
                                            (member, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200 animate-slide-in-right"
                                                    style={{
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {member.member_name}
                                                        </h4>
                                                        <p className="text-xs text-gray-600">
                                                            {member.student_id}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600">
                                                                Sanctions
                                                            </p>
                                                            <p className="font-semibold text-red-600">
                                                                {
                                                                    member.sanction_count
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600">
                                                                Amount
                                                            </p>
                                                            <p className="font-semibold text-red-700">
                                                                ₱
                                                                {member.total_amount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No sanctions found
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                        </>
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
