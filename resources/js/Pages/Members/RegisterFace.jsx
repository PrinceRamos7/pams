import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { enrollFace, startCamera, stopCamera } from "../../utils/faceio";
import NotificationModal from "../../Components/NotificationModal";

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

export default function RegisterFace({ member }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("members.index"), label: "Members" },
        { label: "Register Face" },
    ];

    useEffect(() => {
        // Cleanup camera on unmount
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
        };
    }, []);

    const handleStartCamera = async () => {
        try {
            toast.loading("Starting camera...");
            const stream = await startCamera(videoRef.current);
            streamRef.current = stream;
            
            // Wait a bit for video to stabilize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.dismiss();
            setCameraActive(true);
            toast.success("Camera ready! Position your face in the frame.");
        } catch (error) {
            toast.dismiss();
            toast.error(error.message || "Failed to start camera");
        }
    };

    const handleEnrollFace = async () => {
        if (!cameraActive) {
            toast.error("Please start the camera first");
            return;
        }

        // Check if video is ready
        if (!videoRef.current || !videoRef.current.videoWidth) {
            toast.error("Video not ready. Please wait a moment and try again.");
            return;
        }

        setIsProcessing(true);
        setEnrollmentSuccess(false);

        try {
            toast.loading("Analyzing face... Please stay still");
            
            // Wait a moment for better capture
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await enrollFace(videoRef.current);
            toast.dismiss();

            if (!result.success) {
                toast.error(result.error || "Face enrollment failed");
                setIsProcessing(false);
                return;
            }

            // Save face data to database
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/api/faceio/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    member_id: member.member_id,
                    face_id: result.faceId,
                    face_descriptor: result.descriptor,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEnrollmentSuccess(true);
                
                // Stop camera
                if (streamRef.current) {
                    stopCamera(streamRef.current);
                    setCameraActive(false);
                }
                
                showNotificationModal(
                    "Success!",
                    `Face registered successfully for ${member.firstname} ${member.lastname}!`,
                    "success"
                );
                
                setTimeout(() => {
                    router.visit(route("members.index"));
                }, 2500);
            } else {
                showNotificationModal("Error!", data.message || "Failed to save face data", "error");
            }

        } catch (error) {
            console.error("Face enrollment error:", error);
            toast.error("Face enrollment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveFace = async () => {
        if (!confirm("Are you sure you want to remove face registration?")) {
            return;
        }

        setIsProcessing(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch(`/api/faceio/unenroll/${member.member_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                showNotificationModal(
                    "Success!",
                    `Face registration removed successfully for ${member.firstname} ${member.lastname}!`,
                    "success"
                );
                setTimeout(() => {
                    router.visit(route("members.index"));
                }, 2500);
            } else {
                showNotificationModal("Error!", data.message || "Failed to remove face registration", "error");
            }

        } catch (error) {
            console.error("Face removal error:", error);
            toast.error("Failed to remove face registration");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Register Face" />

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
                                <CardTitle className="flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Face Registration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-800 mb-2">
                                        Member Information
                                    </h3>
                                    <p className="text-blue-700">
                                        Name: {member.firstname} {member.lastname}
                                    </p>
                                    <p className="text-blue-700">
                                        Student ID: {member.student_id}
                                    </p>
                                    <p className="text-blue-700">
                                        Status: {member.faceio_id ? (
                                            <span className="text-green-600 font-semibold">✓ Face Registered</span>
                                        ) : (
                                            <span className="text-orange-600 font-semibold">Not Registered</span>
                                        )}
                                    </p>
                                </div>

                                {enrollmentSuccess && (
                                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-green-800 font-semibold">
                                            ✓ Face registered successfully!
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-6">
                                    {/* Video Preview */}
                                    <div className="w-full max-w-md">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Camera Preview
                                        </label>
                                        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                            {!cameraActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                                    <div className="text-center text-white">
                                                        <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <p>Camera not started</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full max-w-md space-y-3">
                                        {!cameraActive ? (
                                            <button
                                                onClick={handleStartCamera}
                                                disabled={isProcessing}
                                                className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Start Camera
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleEnrollFace}
                                                disabled={isProcessing}
                                                className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        {member.faceio_id ? "Re-register Face" : "Register Face"}
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {member.faceio_id && (
                                            <button
                                                onClick={handleRemoveFace}
                                                disabled={isProcessing}
                                                className="w-full px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove Face Registration
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.visit(route("members.index"))
                                            }
                                            disabled={isProcessing}
                                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            Back to Members
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <h4 className="font-semibold text-yellow-800 mb-2">
                                        Tips for best results:
                                    </h4>
                                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                                        <li>Ensure good lighting on your face</li>
                                        <li>Look directly at the camera</li>
                                        <li>Remove glasses if possible</li>
                                        <li>Keep a neutral expression</li>
                                        <li>Stay still during the scan</li>
                                        <li>Make sure your whole face is visible</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </SidebarProvider>
    );
}
