import React, { useState, useRef, useEffect } from 'react';
import { X, Lock, Camera, Scan } from 'lucide-react';
import { authenticateFace, startCamera, stopCamera } from '../utils/faceio';

export default function AuthModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    message = "Please verify your identity to continue:",
    actionText = "Confirm"
}) {
    const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'face'
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (authMethod === 'face' && isOpen) {
            handleStartCamera();
        }
        
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
                setCameraActive(false);
            }
        };
    }, [authMethod, isOpen]);

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
            setError(error.message || "Failed to start camera");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onConfirm({ method: 'password', password });
            setPassword('');
            handleClose();
        } catch (error) {
            setError(error.message || 'Invalid password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFaceRecognition = async () => {
        if (!cameraActive || !videoRef.current || !videoRef.current.videoWidth) {
            setError("Camera not ready. Please wait a moment.");
            return;
        }

        if (attemptCount >= 3) {
            setError("Maximum attempts reached (3/3). Please use password instead.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Get enrolled admin faces
            const enrolledResponse = await fetch("/api/faceio/enrolled-admins");
            const enrolledData = await enrolledResponse.json();

            if (!enrolledData.success || !enrolledData.faces || enrolledData.faces.length === 0) {
                setError("No admin faces registered. Please use password.");
                setIsSubmitting(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            // Use more lenient threshold for admin authentication (0.6 instead of 0.55)
            console.log('🔐 Admin Authentication - Starting face recognition...');
            console.log('📊 Enrolled admin faces:', enrolledData.faces.length);
            
            const result = await authenticateFace(videoRef.current, enrolledData.faces, 0.6);

            console.log('🎯 Authentication result:', result);

            if (!result.success) {
                const newAttemptCount = attemptCount + 1;
                setAttemptCount(newAttemptCount);
                
                console.log(`❌ Attempt ${newAttemptCount}/3 failed:`, result.error);
                
                if (newAttemptCount >= 3) {
                    setError("Face not recognized after 3 attempts. Please use password.");
                } else {
                    setError(`Face not recognized. Attempt ${newAttemptCount}/3. Please try again.`);
                }
                
                setIsSubmitting(false);
                return;
            }

            console.log('✅ Face recognized! User:', result.user);

            // Verify with backend
            await onConfirm({ method: 'face', faceId: result.faceId, user: result.user });
            handleClose();

        } catch (error) {
            console.error("Face recognition error:", error);
            const newAttemptCount = attemptCount + 1;
            setAttemptCount(newAttemptCount);
            
            if (newAttemptCount >= 3) {
                setError("Face recognition failed after 3 attempts. Please use password.");
            } else {
                setError(`Recognition failed. Attempt ${newAttemptCount}/3`);
            }
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setError('');
        setAttemptCount(0);
        if (streamRef.current) {
            stopCamera(streamRef.current);
            setCameraActive(false);
        }
        onClose();
    };

    const switchAuthMethod = (method) => {
        setAuthMethod(method);
        setError('');
        setAttemptCount(0);
        setPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-auto overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-full">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition"
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">{message}</p>
                    
                    {/* Auth Method Tabs */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => switchAuthMethod('password')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                                authMethod === 'password'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={isSubmitting}
                        >
                            <Lock size={18} />
                            Password
                        </button>
                        <button
                            onClick={() => switchAuthMethod('face')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                                authMethod === 'face'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            disabled={isSubmitting}
                        >
                            <Camera size={18} />
                            Face Recognition
                        </button>
                    </div>

                    {/* Password Method */}
                    {authMethod === 'password' && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-600">{error}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition disabled:opacity-50 shadow-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Verifying...' : actionText}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Face Recognition Method */}
                    {authMethod === 'face' && (
                        <div>
                            {/* Camera Preview */}
                            <div className="mb-4">
                                <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/3' }}>
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
                                        <div className="relative w-48 h-60 border-4 border-red-400 rounded-full opacity-30">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Camera Status */}
                                    <div className="absolute top-3 left-3">
                                        {cameraActive ? (
                                            <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                Camera Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                Initializing...
                                            </div>
                                        )}
                                    </div>

                                    {/* Loading Overlay */}
                                    {!cameraActive && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                                            <div className="text-center text-white">
                                                <svg className="animate-spin w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="text-sm">Starting camera...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Processing Overlay */}
                                    {isSubmitting && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80">
                                            <div className="text-center text-white">
                                                <div className="relative w-20 h-20 mx-auto mb-3">
                                                    <div className="absolute inset-0 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <Scan className="absolute inset-0 m-auto w-10 h-10 text-red-400" />
                                                </div>
                                                <p className="text-lg font-bold">Scanning Face...</p>
                                                <p className="text-sm text-red-200 mt-1">Please stay still</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Attempt Warning */}
                            {attemptCount > 0 && attemptCount < 3 && (
                                <div className="mb-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                                    <p className="text-amber-900 text-sm font-semibold break-words">
                                        Attempt {attemptCount}/3 - Please ensure good lighting and look directly at the camera
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-400 max-h-24 overflow-y-auto">
                                    <p className="text-red-800 text-sm break-words">{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFaceRecognition}
                                    disabled={isSubmitting || !cameraActive || attemptCount >= 3}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <Scan size={18} />
                                            Scan Face
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
