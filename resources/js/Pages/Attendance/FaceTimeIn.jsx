import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { authenticateFace, startCamera, stopCamera } from "../../utils/faceio";

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

export default function FaceTimeIn({ event }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [recognizedMember, setRecognizedMember] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "Face Recognition Time In" },
    ];

    useEffect(() => {
        // Auto-start camera
        handleStartCamera();
        
        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
        };
    }, []);

    const handleStartCamera = async () => {
        try {
            const stream = await startCamera(videoRef.current);
            streamRef.current = stream;
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCameraActive(true);
        } catch (error) {
            toast.error(error.message || "Failed to start camera");
        }
    };

    const handleFaceAuthentication = async () => {
        if (!cameraActive || !videoRef.current || !videoRef.current.videoWidth) {
            toast.error("Camera not ready. Please wait a moment.");
            return;
        }

        setIsProcessing(true);
        setRecognizedMember(null);

        try {
            toast.loading("Scanning face...");
            
            // Get all enrolled faces
            const enrolledResponse = await fetch("/api/faceio/enrolled-faces");
            const enrolledData = await enrolledResponse.json();
            
            if (!enrolledData.success || !enrolledData.faces || enrolledData.faces.length === 0) {
                toast.dismiss();
                toast.error("No enrolled faces found. Please register faces first.");
                setIsProcessing(false);
                return;
            }

            // Wait a moment for better capture
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await authenticateFace(videoRef.current, enrolledData.faces);
            toast.dismiss();

            if (!result.success) {
                toast.error(result.error || "Face not recognized");
                setIsProcessing(false);
                return;
            }

            setRecognizedMember(result.member);
            toast.success(`Welcome, ${result.member.firstname}!`);

            // Record attendance
            await recordAttendance(result.member, result.faceId);

        } catch (error) {
            console.error("Face authentication error:", error);
            toast.dismiss();
            toast.error("Face authentication failed");
            setIsProcessing(false);
        }
    };

    const recordAttendance = async (member, faceId) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch("/attendance-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    event_id: event.event_id,
                    faceio_id: faceId,
                    status: "Present",
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Time In recorded successfully!");
                setTimeout(() => {
                    setRecognizedMember(null);
                    setIsProcessing(false);
                }, 2000);
            } else {
                toast.error(data.message || "Failed to record time in");
                setIsProcessing(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to record time in");
            setIsProcessing(false);
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Face Recognition Time In" />

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
                                <CardTitle className="text-green-600 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Face Recognition Time In (FREE!)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        {event.agenda}
                                    </h3>
                                    <p className="text-green-700">
                                        Date: {event.date}
                                    </p>
                                    <p className="text-green-700">
                                        Time In Period: {event.time_in}
                                    </p>
                                </div>

                                {recognizedMember && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
                                        <h4 className="font-semibold text-blue-800 mb-2">
                                            ✓ Recognized!
                                        </h4>
                                        <p className="text-blue-700">
                                            Name: {recognizedMember.firstname} {recognizedMember.lastname}
                                        </p>
                                        <p className="text-blue-700">
                                            Student ID: {recognizedMember.student_id}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-6">
                                    {/* Video Preview */}
                                    <div className="w-full max-w-md">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Camera View
                                        </label>
                                        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover mirror"
                                                style={{ transform: 'scaleX(-1)' }}
                                            />
                                            {!cameraActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                                    <div className="text-center text-white">
                                                        <svg className="animate-spin w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <p>Starting camera...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleFaceAuthentication}
                                        disabled={isProcessing || !cameraActive}
                                        className="w-full max-w-md px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                                Scan Face to Time In
                                            </>
                                        )}
                                    </button>

                                    <div className="flex gap-3 w-full max-w-md">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.visit(
                                                    route("attendance-records.time-in", event.event_id)
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

                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Tips:</strong> Ensure good lighting, look directly at the camera, and stay still during scanning.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
