import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

export default function ViewAttendance({ event, attendanceRecords: paginatedRecords }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    // Extract data from paginated response
    const attendanceRecords = paginatedRecords?.data || [];

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "View Attendance" },
    ];

    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timeString) => {
        if (!timeString) return "N/A";
        const date = new Date(timeString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return null;
        // If it's already a full URL or starts with http, return as is
        if (photoPath.startsWith('http') || photoPath.startsWith('/storage/')) {
            return photoPath;
        }
        // Otherwise, prepend /storage/
        return `/storage/${photoPath}`;
    };

    const isTimeInActive = (event) => {
        if (!event.time_in || !event.date) return false;
        const now = new Date();
        const eventDateTime = new Date(event.date + 'T' + event.time_in);
        const endTime = new Date(eventDateTime.getTime() + (event.time_in_duration || 30) * 60000);
        return now >= eventDateTime && now <= endTime;
    };

    const isTimeOutActive = (event) => {
        if (!event.time_out || !event.date) return false;
        const now = new Date();
        const eventDateTime = new Date(event.date + 'T' + event.time_out);
        const endTime = new Date(eventDateTime.getTime() + (event.time_out_duration || 30) * 60000);
        return now >= eventDateTime && now <= endTime;
    };

    const getSmartAttendanceRoute = (event) => {
        if (event.status === 'closed') return null;
        const timeInActive = isTimeInActive(event);
        const timeOutActive = isTimeOutActive(event);
        
        if (timeInActive) {
            return route("attendance-records.two-step-time-in", event.event_id);
        } else if (timeOutActive) {
            return route("attendance-records.two-step-time-out", event.event_id);
        }
        return null;
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="View Attendance" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-7xl mx-auto">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Attendance Records</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Event: {event.agenda}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Date: {event.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={route('attendance-records.export-pdf', event.event_id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition"
                                            style={{ backgroundColor: '#F7CC08', color: '#000' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0B907'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7CC08'}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Export PDF
                                        </a>
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route("attendance.index")
                                                )
                                            }
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {attendanceRecords.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-blue-500 text-white">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        #
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        Student ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        Time In
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        Time Out
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {attendanceRecords.map(
                                                    (record, index) => (
                                                        <tr
                                                            key={
                                                                record.record_id
                                                            }
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {record.member
                                                                    ?.student_id ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {record.member
                                                                    ? `${record.member.firstname} ${record.member.lastname}`
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {record.time_in ? (
                                                                    <>
                                                                        <div>
                                                                            {formatDate(
                                                                                record.time_in
                                                                            )}
                                                                        </div>
                                                                        <div className="text-gray-500">
                                                                            {formatTime(
                                                                                record.time_in
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-amber-600 font-medium">No Time In</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {record.time_out
                                                                    ? formatTime(
                                                                          record.time_out
                                                                      )
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        record.status === "Present"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : record.status === "no_time_in" || record.status === "late"
                                                                            ? "bg-amber-100 text-amber-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {record.status === "no_time_in" ? "No Time In" : (record.status || "N/A")}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            No attendance records found for this event.
                                        </p>
                                    </div>
                                )}

                                {attendanceRecords.length > 0 && (
                                    <div className="mt-4 flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Total: {attendanceRecords.length}{" "}
                                            {attendanceRecords.length === 1
                                                ? "record"
                                                : "records"}
                                        </p>
                                        {(() => {
                                            const smartRoute = getSmartAttendanceRoute(event);
                                            const timeInActive = isTimeInActive(event);
                                            const timeOutActive = isTimeOutActive(event);
                                            
                                            if (event.status === 'closed') {
                                                return (
                                                    <button
                                                        disabled
                                                        className="px-4 py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                                                    >
                                                        Event Closed
                                                    </button>
                                                );
                                            } else if (smartRoute) {
                                                return (
                                                    <button
                                                        onClick={() => router.visit(smartRoute)}
                                                        className={`px-4 py-2 font-semibold rounded-lg transition ${
                                                            timeInActive 
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                    >
                                                        {timeInActive ? 'Add More Attendance (Time In)' : 'Add More Attendance (Time Out)'}
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <button
                                                        disabled
                                                        className="px-4 py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                                                    >
                                                        No Active Window
                                                    </button>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Attendance Photo"
                            className="max-w-full max-h-screen rounded-lg"
                        />
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}
