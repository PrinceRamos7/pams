import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    AlertCircle,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
    PieChart,
} from "lucide-react";

export function ShowAnalytics({
    stats,
    sanctionAnalytics,
    attendanceAnalytics,
    recentEvents,
    topSanctionedMembers,
    statCards,
}) {
    return (
        <>
            {/* Welcome Section with Logo */}
            <div className="mb-8 animate-fade-in">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none shadow-xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold animate-slide-in-left">
                                    Welcome to PIMS
                                </h2>
                                <p className="text-blue-100 text-lg animate-slide-in-left animation-delay-100">
                                    PITON Integrated Management System
                                </p>
                                <p className="text-blue-200 text-sm animate-slide-in-left animation-delay-200">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
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
                                        {sanctionAnalytics.totalSanctions}
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
                                        {sanctionAnalytics.paidSanctions}
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
                                        {sanctionAnalytics.unpaidSanctions}
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
                                        {attendanceAnalytics.totalRecords}
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
                                        {attendanceAnalytics.presentRecords}
                                    </p>
                                </div>

                                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                                    <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-600 mb-1">
                                        Late
                                    </p>
                                    <p className="text-lg font-bold text-yellow-700">
                                        {attendanceAnalytics.lateRecords}
                                    </p>
                                </div>

                                <div className="p-3 bg-red-50 rounded-lg text-center">
                                    <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-600 mb-1">
                                        Absent
                                    </p>
                                    <p className="text-lg font-bold text-red-700">
                                        {attendanceAnalytics.absentRecords}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-600">
                                        Attendance Rate
                                    </p>
                                    <p className="text-lg font-bold text-green-700">
                                        {attendanceAnalytics.attendanceRate}%
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
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-600">
                                                    Attendance
                                                </p>
                                                <p className="font-semibold text-blue-600">
                                                    {event.attendance_count}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    event.status === "open"
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
                                topSanctionedMembers.map((member, index) => (
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
                                            {member.type && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Type: {member.type}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-600">
                                                    Sanctions
                                                </p>
                                                <p className="font-semibold text-red-600">
                                                    {member.sanction_count}
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
                                            {member.status && (
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        member.status === "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : member.status === "excused"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {member.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
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
    );
}
