import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { authenticateFace } from "../../utils/faceio";
import FaceIOConfigCheck from "../../Components/FaceIOConfigCheck";

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

export default function FaceTimeOut({ event, membersWithTimeIn }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [recognizedMember, setRecognizedMember] = useState(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "Face Recognition Time Out" },
    ];

    const handleFaceAuthentication = async () => {
        setIsProcessing(true);
        setRecognizedMember(null);

        try {
            toast.loading("Scanning face...");
            const result = await authenticateFace();
            toast.dismiss();

            if (!result.success) {
                toast.error(result.error || "Face authentication failed");
                setIsProcessing(false);
                return;
            }

            // Find the attendance record for this member
            const memberRecord = membersWithTimeIn.find(
                (record) => record.member?.faceio_id === result.facialId
            );

            if (!memberRecord) {
                toast.error("No time-in record found for this member");
                setIsProcessing(false);
                return;
            }

            setRecognizedMember(memberRecord.member);
            toast.success(`Welcome back, ${memberRecord.member.firstname}!`);

            // Record time out
            await recordTimeOut(memberRecord.record_id);

        } catch (error) {
            console.error("Face authentication error:", error);
            toast.error("Face authentication failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const recordTimeOut = async (recordId) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch(`/attendance-records/${recordId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    time_out: new Date().toISOString(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Time Out recorded successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(data.message || "Failed to record time out");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to record time out");
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Face Recognition Time Out" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Face Recognition Time Out
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FaceIOConfigCheck />
                                
                                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h3 className="font-semibold text-red-800 mb-2">
                                        {event.agenda}
                                    </h3>
                                    <p className="text-red-700">
                                        Date: {event.date}
                                    </p>
                                    <p className="text-red-700">
                                        Time Out Period: {event.time_out}
                                    </p>
                                </div>

                                {recognizedMember && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-800 mb-2">
                                            Recognized Member
                                        </h4>
                                        <p className="text-blue-700">
                                            Name: {recognizedMember.firstname} {recognizedMember.lastname}
                                        </p>
                                        <p className="text-blue-700">
                                            Student ID: {recognizedMember.student_id}
                                        </p>
                                    </div>
                                )}

                                {membersWithTimeIn.length > 0 ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="text-center">
                                            <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                                <svg className="w-24 h-24 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Click the button below to scan your face
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleFaceAuthentication}
                                            disabled={isProcessing}
                                            className="w-full max-w-md px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Scan Face to Time Out
                                                </>
                                            )}
                                        </button>

                                        <div className="flex gap-3 w-full max-w-md">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        route("attendance-records.time-out", event.event_id)
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Use Manual Entry
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        route("attendance.index")
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg mb-4">
                                            No members have timed in yet for this event.
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route("attendance-records.face-time-in", event.event_id)
                                                )
                                            }
                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                                        >
                                            Go to Face Time In
                                        </button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
