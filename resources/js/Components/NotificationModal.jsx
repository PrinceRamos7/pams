import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function NotificationModal({ 
    isOpen, 
    onClose, 
    type = "success", // "success" or "error"
    title, 
    message,
    buttonText = "Continue"
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? "opacity-50" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    {isSuccess ? (
                        <div 
                            className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center"
                            style={{
                                animation: 'bounce-in 0.5s ease-out'
                            }}
                        >
                            <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                        </div>
                    ) : (
                        <div 
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center"
                            style={{
                                animation: 'bounce-in 0.5s ease-out'
                            }}
                        >
                            <XCircle size={48} className="text-white" strokeWidth={2.5} />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold text-center mb-3 ${
                    isSuccess ? "text-gray-800" : "text-gray-800"
                }`}>
                    {title || (isSuccess ? "Success!" : "Error!")}
                </h2>

                {/* Message */}
                <p className="text-gray-600 text-center mb-8">
                    {message || (isSuccess ? "Operation completed successfully" : "Something went wrong")}
                </p>

                {/* Button */}
                <button
                    onClick={handleClose}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                        isSuccess 
                            ? "bg-teal-500 hover:bg-teal-600" 
                            : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                    {buttonText}
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes bounce-in {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }
                        50% {
                            transform: scale(1.1);
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `
            }} />
        </div>
    );
}
