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

export default function TwoStepTimeOut({ event }) {
    const [step, setStep] = useState(1);
    const [studentId, setStudentId] = useState("");
    const [memberInfo, setMemberInfo] = useState(null);
    const [attendanceRecord, setAttendanceRecord] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "Time Out" },
    ];

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
        };
    }, []);

    // Calculate time window status
    const getTimeWindowStatus = () => {
        const now = new Date();
        const timeOutStart = new Date(event.date + 'T' + event.time_out);
        const timeOutEnd = new Date(timeOutStart.getTime() + (event.time_out_duration || 30) * 60000);
        
        const isActive = now >= timeOutStart && now <= timeOutEnd;
        const remainingMinutes = isActive ? Math.floor((timeOutEnd - now) / 60000) : 0;
        
        return { isActive, remainingMinutes, timeOutStart, timeOutEnd };
    };

    const timeWindow = getTimeWindowStatus();

    // Step 1: Verify Student ID
    const handleVerifyStudentId = async (e) => {
        e.preventDefault();
        
        if (isProcessing) return; // Prevent double submission
        
        if (!studentId.trim()) {
            toast.error("Please enter your student ID");
            return;
        }

        setIsProcessing(true);

        try {
            // Check if time-out window is active
            const now = new Date();
            const timeInStart = new Date(event.date + 'T' + event.time_in);
            const timeInEnd = new Date(timeInStart.getTime() + (event.time_in_duration || 30) * 60000);
            const timeOutStart = new Date(event.date + 'T' + event.time_out);
            const timeOutEnd = new Date(timeOutStart.getTime() + (event.time_out_duration || 30) * 60000);
            
            const timeInActive = now >= timeInStart && now <= timeInEnd;
            const timeOutActive = now >= timeOutStart && now <= timeOutEnd;
            
            if (!timeOutActive && timeInActive) {
                // Time-out window not open but time-in is, redirect to time-in
                toast("Time-out window not open yet. Redirecting to time-in...");
                setTimeout(() => {
                    router.visit(route("attendance-records.two-step-time-in", event.event_id));
                }, 2000);
                return;
            } else if (!timeInActive && !timeOutActive) {
                // Both windows closed
                toast.error("No attendance window is currently active.");
                setIsProcessing(false);
                return;
            }

            const response = await fetch(`/api/members/verify/${studentId}`);
            const data = await response.json();

            if (!data.success) {
                toast.error(data.message || "Student ID not found");
                setIsProcessing(false);
                return;
            }

            if (!data.face_registered) {
                toast.error("Please register your face first before using face recognition");
                setIsProcessing(false);
                return;
            }

            // Check if member has an existing attendance record
            const recordResponse = await fetch(`/api/attendance-records/check-time-in?event_id=${event.event_id}&student_id=${studentId}`);
            const recordData = await recordResponse.json();

            let existingRecord = null;
            
            if (recordData.success && recordData.record) {
                // Member has timed in
                if (recordData.record.time_out) {
                    toast.error(`You have already timed out at ${new Date(recordData.record.time_out).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`);
                    setIsProcessing(false);
                    return;
                }
                existingRecord = recordData.record;
            }
            // If no record exists, we'll create one with only time_out (late arrival)

            setMemberInfo(data.member);
            setAttendanceRecord(existingRecord);
            toast.success(`Welcome back, ${data.member.firstname}!`);
            
            // Move to step 2
            setTimeout(() => {
                setStep(2);
                handleStartCamera();
            }, 1000);

        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to verify student ID");
        } finally {
            setIsProcessing(false);
        }
    };

    // Start camera for face recognition
    const handleStartCamera = async () => {
        try {
            // Wait for video element to be rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (!videoRef.current) {
                throw new Error("Camera element not ready");
            }
            
            const stream = await startCamera(videoRef.current);
            streamRef.current = stream;
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCameraActive(true);
        } catch (error) {
            toast.error(error.message || "Failed to start camera");
        }
    };

    // Step 2: Face Recognition
    const handleFaceRecognition = async () => {
        if (!cameraActive || !videoRef.current || !videoRef.current.videoWidth) {
            toast.error("Camera not ready. Please wait a moment.");
            return;
        }

        if (attemptCount >= 3) {
            toast.error("Maximum attempts reached. Please try again later.");
            return;
        }

        setIsProcessing(true);

        try {
            toast.loading("Scanning face...");

            // Get all enrolled faces
            const enrolledResponse = await fetch("/api/faceio/enrolled-faces");
            const enrolledData = await enrolledResponse.json();

            if (!enrolledData.success || !enrolledData.faces || enrolledData.faces.length === 0) {
                toast.dismiss();
                toast.error("No enrolled faces found");
                setIsProcessing(false);
                return;
            }

            // Wait for better capture
            await new Promise(resolve => setTimeout(resolve, 500));

            const result = await authenticateFace(videoRef.current, enrolledData.faces);
            toast.dismiss();

            if (!result.success) {
                setAttemptCount(prev => prev + 1);
                toast.error(result.error || "Face not recognized");
                
                if (attemptCount + 1 >= 3) {
                    toast.error("Maximum attempts reached. Please contact administrator.");
                } else {
                    toast(`Attempt ${attemptCount + 1}/3. Please try again.`);
                }
                
                setIsProcessing(false);
                return;
            }

            // Verify face matches the student ID
            if (result.member.student_id !== studentId) {
                toast.error("Face does not match the entered student ID");
                setAttemptCount(prev => prev + 1);
                setIsProcessing(false);
                return;
            }

            toast.success("Face verified successfully!");

            // Record time out
            await recordTimeOut();

        } catch (error) {
            console.error("Face recognition error:", error);
            toast.dismiss();
            toast.error("Face recognition failed");
            setIsProcessing(false);
        }
    };

    // Record time out
    const recordTimeOut = async () => {
        if (isProcessing) return; // Prevent double submission
        
        setIsProcessing(true);
        
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try{
            let response;
            
            if (attendanceRecord && attendanceRecord.record_id) {
                // Update existing record (member timed in)
                response = await fetch(`/attendance-records/${attendanceRecord.record_id}`, {
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
            } else {
                // Create new record with only time_out (late arrival - no time_in)
                response = await fetch(`/attendance-records`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify({
                        event_id: event.event_id,
                        student_id: studentId,
                        status: 'late',
                        time_out_only: true,
                    }),
                });
            }

            const data = await response.json();

            if (data.success) {
                if (!attendanceRecord) {
                    toast.success("Time Out recorded (Late arrival)! Ready for next person.");
                } else {
                    toast.success("Time Out recorded successfully! Ready for next person.");
                }
                
                // Stop camera
                if (streamRef.current) {
                    stopCamera(streamRef.current);
                    setCameraActive(false);
                }

                // Reset form for next person instead of redirecting
                setTimeout(() => {
                    setStep(1);
                    setStudentId("");
                    setMemberInfo(null);
                    setAttendanceRecord(null);
                    setIsProcessing(false);
                    setAttemptCount(0);
                }, 2000);
            } else {
                // Show error message (e.g., already timed out)
                toast.error(data.message || "Failed to record time out");
                
                // Stop camera
                if (streamRef.current) {
                    stopCamera(streamRef.current);
                    setCameraActive(false);
                }
                
                // Reset form after showing error
                setTimeout(() => {
                    setStep(1);
                    setStudentId("");
                    setMemberInfo(null);
                    setAttendanceRecord(null);
                    setIsProcessing(false);
                    setAttemptCount(0);
                }, 3000);
            }
        } catch (error) {
            console.error("Record time out error:", error);
            toast.error("Failed to record time out. Please try again.");
            setIsProcessing(false);
            
            // Reset form after error
            setTimeout(() => {
                setStep(1);
                setStudentId("");
                setMemberInfo(null);
                setAttendanceRecord(null);
                setAttemptCount(0);
            }, 3000);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            if (streamRef.current) {
                stopCamera(streamRef.current);
                setCameraActive(false);
            }
            setStep(1);
            setAttemptCount(0);
        } else {
            router.visit(route("attendance.index"));
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Time Out - Two-Step Verification" />

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
                                <CardTitle className="text-red-600">
                                    Time Out - Two-Step Verification
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Event Info */}
                                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h3 className="font-semibold text-red-800 mb-2">
                                        {event.agenda}
                                    </h3>
                                    <p className="text-red-700">Date: {event.date}</p>
                                    <p className="text-red-700">
                                        Time Window: {new Date(event.date + 'T' + event.time_out).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {timeWindow.timeOutEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </p>
                                    {timeWindow.isActive ? (
                                        <p className="text-red-700 font-semibold">
                                            ⚫ ACTIVE ({timeWindow.remainingMinutes} minutes remaining)
                                        </p>
                                    ) : (
                                        <p className="text-gray-700 font-semibold">
                                            ⚫ CLOSED
                                        </p>
                                    )}
                                </div>

                                {!timeWindow.isActive && (
                                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-yellow-800 font-semibold">
                                            Time-out window is not active. Please come back during the active window.
                                        </p>
                                    </div>
                                )}

                                {/* Step Indicator */}
                                <div className="mb-6 flex items-center justify-center gap-4">
                                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300'}`}>
                                            1
                                        </div>
                                        <span className="font-medium">Student ID</span>
                                    </div>
                                    <div className="w-12 h-1 bg-gray-300"></div>
                                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300'}`}>
                                            2
                                        </div>
                                        <span className="font-medium">Face Recognition</span>
                                    </div>
                                </div>

                                {/* Step 1: Student ID */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Step 1: Enter Student ID</h3>
                                            <form onSubmit={handleVerifyStudentId} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Student ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={studentId}
                                                        onChange={(e) => setStudentId(e.target.value)}
                                                        placeholder="Enter your student ID"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                                                        disabled={isProcessing || !timeWindow.isActive}
                                                        autoFocus
                                                    />
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={isProcessing || !timeWindow.isActive}
                                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {isProcessing ? "Verifying..." : "Next: Face Recognition →"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleBack}
                                                        disabled={isProcessing}
                                                        className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Face Recognition */}
                                {step === 2 && memberInfo && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Step 2: Face Recognition</h3>
                                            
                                            {/* Member Info */}
                                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-blue-800">
                                                    <strong>Name:</strong> {memberInfo.firstname} {memberInfo.lastname}
                                                </p>
                                                <p className="text-blue-800">
                                                    <strong>Student ID:</strong> {memberInfo.student_id}
                                                </p>
                                                <p className="text-blue-800">
                                                    <strong>Year:</strong> {memberInfo.year}
                                                </p>
                                                {attendanceRecord && (
                                                    <p className="text-blue-800">
                                                        <strong>Time In:</strong> {new Date(attendanceRecord.time_in).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Camera Preview */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Camera View
                                                </label>
                                                <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className="w-full h-full object-cover"
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

                                            {attemptCount > 0 && (
                                                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                    <p className="text-yellow-800 text-sm">
                                                        Attempt {attemptCount}/3 - Please ensure good lighting and look directly at the camera
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleFaceRecognition}
                                                    disabled={isProcessing || !cameraActive || attemptCount >= 3}
                                                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessing ? "Scanning..." : "Scan Face & Record Time Out"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    disabled={isProcessing}
                                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <h4 className="font-semibold text-yellow-800 mb-2">Tips for Success:</h4>
                                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                                        <li>Ensure good lighting on your face</li>
                                        <li>Look directly at the camera</li>
                                        <li>Remove glasses if possible</li>
                                        <li>Stay still during scanning</li>
                                        <li>Make sure your whole face is visible</li>
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
