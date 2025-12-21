import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { authenticateFace, startCamera, stopCamera } from "../../utils/faceio";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Clock, Calendar, Users, CheckCircle2, XCircle, Camera, AlertCircle, LogOut } from "lucide-react";

export default function FaceTimeOut({ event }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const videoRef = useRef(null);
    const streamRef = useRef(null);



    useEffect(() => {
        // Start camera on mount
        handleStartCamera();
        
        // Update current time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
            clearInterval(timer);
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

    // Start camera for face recognition
    const handleStartCamera = async () => {
        try {
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

    // Face Recognition
    const handleFaceRecognition = async () => {
        if (!cameraActive || !videoRef.current || !videoRef.current.videoWidth) {
            toast.error("Camera not ready. Please wait a moment.");
            return;
        }

        if (attemptCount >= 3) {
            setErrorMessage("Maximum attempts reached (3/3). Please register your face first or contact administrator.");
            setShowErrorModal(true);
            return;
        }

        setIsProcessing(true);

        try {
            toast.loading("Scanning face...");

            // Get all enrolled faces
            const enrolledResponse = await fetch("/api/faceio/enrolled-faces");
            const enrolledData = await enrolledResponse.json();

            console.log('📥 Enrolled faces received:', enrolledData);

            if (!enrolledData.success || !enrolledData.faces || enrolledData.faces.length === 0) {
                toast.dismiss();
                toast.error("No enrolled faces found");
                setIsProcessing(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const result = await authenticateFace(videoRef.current, enrolledData.faces);
            console.log('🎯 Authentication result:', result);
            toast.dismiss();

            if (!result.success) {
                const newAttemptCount = attemptCount + 1;
                setAttemptCount(newAttemptCount);
                
                if (newAttemptCount >= 3) {
                    setErrorMessage("Face not recognized after 3 attempts. Please register your face first before using face recognition.");
                    setShowErrorModal(true);
                } else {
                    toast.error(`Face not recognized. Attempt ${newAttemptCount}/3. Please try again.`);
                }
                
                setIsProcessing(false);
                return;
            }

            console.log('✅ Matched Member:', result.member);
            toast.success("Face verified successfully!");

            // Record time out
            await recordTimeOut(result.faceId, result.member);

        } catch (error) {
            console.error("Face recognition error:", error);
            toast.dismiss();
            const newAttemptCount = attemptCount + 1;
            setAttemptCount(newAttemptCount);
            
            if (newAttemptCount >= 3) {
                setErrorMessage("Face recognition failed after 3 attempts. Please register your face first.");
                setShowErrorModal(true);
            } else {
                toast.error(`Recognition failed. Attempt ${newAttemptCount}/3`);
            }
            setIsProcessing(false);
        }
    };

    // Record time out
    const recordTimeOut = async (_faceId, recognizedMember) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            // First, find the attendance record for this member and event
            const findResponse = await fetch(`/api/attendance-records/find?event_id=${event.event_id}&member_id=${recognizedMember.member_id}`, {
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const findData = await findResponse.json();

            if (!findData.success || !findData.record) {
                // No time-in record found - create a new record with only time-out (marked as "late")
                console.log('📝 No time-in found, creating time-out only record');
                console.log('🔑 Using faceio_id:', recognizedMember.faceio_id);
                
                const createResponse = await fetch("/attendance-records", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify({
                        event_id: event.event_id,
                        faceio_id: recognizedMember.faceio_id,
                        status: "late",
                        time_out_only: true,
                    }),
                });

                const createData = await createResponse.json();
                
                console.log('📦 Create response:', createData);

                if (createData.success) {
                    // Show success modal with warning about no time-in
                    setSuccessData({
                        name: `${recognizedMember.firstname} ${recognizedMember.lastname}`,
                        studentId: recognizedMember.student_id,
                        year: recognizedMember.year || recognizedMember.year_level || 'Not Set',
                        noTimeIn: true
                    });
                    setShowSuccessModal(true);
                    
                    // Reset for next person after 3 seconds
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        setAttemptCount(0);
                        setIsProcessing(false);
                    }, 3000);
                } else {
                    console.error('❌ Failed to create time-out record:', createData);
                    setErrorMessage(createData.message || "Failed to record time out");
                    setShowErrorModal(true);
                    setIsProcessing(false);
                }
                return;
            }

            // Update the record with time_out
            const response = await fetch(`/attendance-records/${findData.record.record_id}`, {
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

            const data = await response.json();

            if (data.success) {
                // Show success modal with the RECOGNIZED member details (not from backend)
                setSuccessData({
                    name: `${recognizedMember.firstname} ${recognizedMember.lastname}`,
                    studentId: recognizedMember.student_id,
                    year: recognizedMember.year || recognizedMember.year_level || 'Not Set'
                });
                setShowSuccessModal(true);
                
                // Reset for next person after 3 seconds
                setTimeout(() => {
                    setShowSuccessModal(false);
                    setAttemptCount(0);
                    setIsProcessing(false);
                }, 3000);
            } else {
                setErrorMessage(data.message || "Failed to record time out");
                setShowErrorModal(true);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Record time out error:", error);
            setErrorMessage("Failed to record time out. Please try again.");
            setShowErrorModal(true);
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        if (streamRef.current) {
            stopCamera(streamRef.current);
            setCameraActive(false);
        }
        router.visit(route("attendance.index"));
    };

    const handleRegisterFace = () => {
        if (streamRef.current) {
            stopCamera(streamRef.current);
        }
        router.visit(route("members.index"));
    };

    return (
        <>
            <Toaster position="top-right" />
            <Head title="Time Out - Face Recognition" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header Bar */}
                <div className="bg-white border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <LogOut className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Time Out - Face Recognition</h1>
                                    <p className="text-sm text-gray-600">Scan your face to record time out</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="w-full p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Camera */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-lg">
                                    <CardContent className="p-6">
                                        {/* Camera Preview */}
                                        <div className="mb-6">
                                            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className="w-full h-full object-cover"
                                                    style={{ transform: 'scaleX(-1)' }}
                                                />
                                                
                                                {/* Face Guide Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="relative w-64 h-80 border-4 border-blue-400 rounded-full opacity-30">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                                                    </div>
                                                </div>

                                                {/* Camera Status Indicator */}
                                                <div className="absolute top-4 left-4">
                                                    {cameraActive ? (
                                                        <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                            Camera Active
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                            Initializing...
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Loading Overlay */}
                                                {!cameraActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                                                        <div className="text-center text-white">
                                                            <svg className="animate-spin w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <p className="text-lg font-medium">Starting camera...</p>
                                                            <p className="text-sm text-gray-400 mt-1">Please allow camera access</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Processing Overlay */}
                                                {isProcessing && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-80">
                                                        <div className="text-center text-white">
                                                            <div className="relative w-24 h-24 mx-auto mb-4">
                                                                <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                                <Camera className="absolute inset-0 m-auto w-12 h-12 text-blue-400" />
                                                            </div>
                                                            <p className="text-xl font-bold">Scanning Face...</p>
                                                            <p className="text-sm text-blue-200 mt-2">Please stay still</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Attempt Warning */}
                                        {attemptCount > 0 && attemptCount < 3 && (
                                            <div className="mb-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400 flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-amber-900 font-semibold">Attempt {attemptCount}/3</p>
                                                    <p className="text-amber-800 text-sm mt-1">
                                                        Please ensure good lighting and look directly at the camera
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleFaceRecognition}
                                                disabled={isProcessing || !cameraActive || !timeWindow.isActive || attemptCount >= 3}
                                                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-lg"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Scanning...
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogOut className="w-5 h-5" />
                                                        Scan Face to Time Out
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                disabled={isProcessing}
                                                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Info */}
                            <div className="space-y-6">
                                {/* Event Info Card */}
                                <Card className="shadow-lg border-l-4 border-blue-500">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Event Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Event Name</p>
                                            <p className="font-semibold text-gray-900">{event.agenda}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">
                                                {new Date(event.date + 'T' + event.time_out).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {timeWindow.timeOutEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status Card */}
                                <Card className={`shadow-lg ${timeWindow.isActive ? 'border-l-4 border-blue-500 bg-blue-50' : 'border-l-4 border-red-500 bg-red-50'}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            {timeWindow.isActive ? (
                                                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                                            ) : (
                                                <XCircle className="w-8 h-8 text-red-600" />
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-600">Window Status</p>
                                                <p className={`text-xl font-bold ${timeWindow.isActive ? 'text-blue-700' : 'text-red-700'}`}>
                                                    {timeWindow.isActive ? 'ACTIVE' : 'CLOSED'}
                                                </p>
                                            </div>
                                        </div>
                                        {timeWindow.isActive ? (
                                            <div className="mt-4 p-3 bg-white rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                                                <p className="text-3xl font-bold text-blue-600">{timeWindow.remainingMinutes} min</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-700 mt-2">
                                                Time-out window is not active. Please come back during the active window.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Tips Card */}
                                <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-purple-900">📋 Tips for Success</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-purple-900">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span>Ensure good lighting on your face</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span>Look directly at the camera</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span>Remove glasses if possible</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span>Stay still during scanning</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span>Position face within the guide</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Success Modal */}
            {showSuccessModal && successData && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-zoom-in overflow-hidden">
                        <div className={`${successData.noTimeIn ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} p-6 text-center`}>
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white mb-4 shadow-lg">
                                {successData.noTimeIn ? (
                                    <AlertCircle className="h-12 w-12 text-amber-600" />
                                ) : (
                                    <CheckCircle2 className="h-12 w-12 text-blue-600" />
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Time Out Recorded!</h3>
                            <p className={`${successData.noTimeIn ? 'text-amber-100' : 'text-blue-100'}`}>
                                {successData.noTimeIn ? 'Marked as: No Time In' : 'Time out has been recorded'}
                            </p>
                        </div>
                        <div className="p-6">
                            {successData.noTimeIn && (
                                <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-900">No Time-In Record</p>
                                            <p className="text-sm text-amber-800 mt-1">
                                                You did not time in for this event. This will be marked accordingly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Name:</span>
                                    <span className="text-gray-900 font-bold text-lg">{successData.name}</span>
                                </div>
                                <div className="h-px bg-gray-300"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Student ID:</span>
                                    <span className="text-gray-900 font-semibold">{successData.studentId}</span>
                                </div>
                                <div className="h-px bg-gray-300"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Year Level:</span>
                                    <span className="text-gray-900 font-semibold">{successData.year}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <p className="font-semibold">Ready for next person...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-zoom-in overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white mb-4 shadow-lg">
                                <XCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Recognition Failed</h3>
                            <p className="text-red-100">Unable to verify your face</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-800 text-center">{errorMessage}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowErrorModal(false);
                                        setAttemptCount(0);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={handleRegisterFace}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                                >
                                    Register Face
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes zoom-in {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-zoom-in {
                    animation: zoom-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
