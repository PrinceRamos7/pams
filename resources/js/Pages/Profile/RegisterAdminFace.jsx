import React, { useState, useRef, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import toastService from "../../utils/toastService";
import { enrollFace, startCamera, stopCamera } from "../../utils/faceio";
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
import { Camera, Shield, CheckCircle2 } from "lucide-react";

export default function RegisterAdminFace() {
    const { auth } = usePage().props;
    const user = auth.user;
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Register Admin Face" },
    ];

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
        };
    }, []);

    const handleStartCamera = async () => {
        try {
            const loadingToast = toastService.loading("Starting camera...");
            const stream = await startCamera(videoRef.current);
            streamRef.current = stream;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toastService.dismiss(loadingToast);
            setCameraActive(true);
            toastService.success("Camera ready! Position your face in the frame.");
        } catch (error) {
            toastService.error(error.message || "Failed to start camera");
        }
    };

    const handleEnrollFace = async () => {
        if (!cameraActive) {
            toastService.error("Please start the camera first");
            return;
        }

        if (!videoRef.current || !videoRef.current.videoWidth) {
            toastService.error("Video not ready. Please wait a moment and try again.");
            return;
        }

        setIsProcessing(true);
        setEnrollmentSuccess(false);

        try {
            const loadingToast = toastService.loading("Analyzing face... Please stay still");
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await enrollFace(videoRef.current);
            toastService.dismiss(loadingToast);

            if (!result.success) {
                toastService.error(result.error || "Face enrollment failed");
                setIsProcessing(false);
                return;
            }

            // Capture face image
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            const faceImage = canvas.toDataURL('image/jpeg', 0.8);

            // Save face data to database
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/api/faceio/enroll-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    face_id: result.faceId,
                    face_descriptor: result.descriptor,
                    face_image: faceImage,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEnrollmentSuccess(true);
                
                if (streamRef.current) {
                    stopCamera(streamRef.current);
                    setCameraActive(false);
                }
                
                toastService.success("Face registered successfully! You can now use face recognition for authentication.");
                
                setTimeout(() => {
                    router.visit(route("dashboard"));
                }, 2500);
            } else {
                toastService.error(data.message || "Failed to save face data");
            }

        } catch (error) {
            console.error("Face enrollment error:", error);
            toastService.error("Face enrollment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveFace = async () => {
        if (!confirm("Are you sure you want to remove your face registration?")) {
            return;
        }

        setIsProcessing(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch(`/api/faceio/unenroll-admin/${user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                toastService.success("Face registration removed successfully!");
                setTimeout(() => {
                    router.visit(route("dashboard"));
                }, 2500);
            } else {
                toastService.error(data.message || "Failed to remove face registration");
            }

        } catch (error) {
            console.error("Face removal error:", error);
            toastService.error("Failed to remove face registration");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <Head title="Register Admin Face" />

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
                        <Card className="border-l-4 border-red-500">
                            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Shield className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl">Admin Face Registration</div>
                                        <div className="text-sm font-normal text-gray-600 mt-1">
                                            Register your face for secure authentication
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Admin Information
                                    </h3>
                                    <p className="text-blue-700">
                                        Name: {user.name}
                                    </p>
                                    <p className="text-blue-700">
                                        Email: {user.email}
                                    </p>
                                    <p className="text-blue-700 flex items-center gap-2">
                                        Status: {user.faceio_id ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Face Registered
                                            </span>
                                        ) : (
                                            <span className="text-orange-600 font-semibold">Not Registered</span>
                                        )}
                                    </p>
                                </div>

                                {enrollmentSuccess && (
                                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        <p className="text-green-800 font-semibold">
                                            Face registered successfully!
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-6">
                                    {/* Video Preview */}
                                    <div className="w-full max-w-md">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Camera Preview
                                        </label>
                                        <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/3' }}>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                                style={{ transform: 'scaleX(-1)' }}
                                            />
                                            
                                            {/* Face Guide */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="relative w-48 h-60 border-4 border-red-400 rounded-full opacity-30">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                                </div>
                                            </div>
                                            
                                            {!cameraActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                                                    <div className="text-center text-white">
                                                        <Camera className="w-16 h-16 mx-auto mb-3 opacity-50" />
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
                                                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Camera className="w-5 h-5" />
                                                Start Camera
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleEnrollFace}
                                                disabled={isProcessing}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
                                                        <Shield className="w-5 h-5" />
                                                        {user.faceio_id ? "Re-register Face" : "Register Face"}
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {user.faceio_id && (
                                            <button
                                                onClick={handleRemoveFace}
                                                disabled={isProcessing}
                                                className="w-full px-6 py-4 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove Face Registration
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => router.visit(route("dashboard"))}
                                            disabled={isProcessing}
                                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100"
                                        >
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Security Tips:
                                    </h4>
                                    <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                                        <li>Ensure good lighting on your face</li>
                                        <li>Look directly at the camera</li>
                                        <li>Remove glasses if possible</li>
                                        <li>Keep a neutral expression</li>
                                        <li>Stay still during the scan</li>
                                        <li>Your face data is encrypted and secure</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
