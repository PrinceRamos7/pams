import React from "react";
import { Eye } from "lucide-react";

export function HideAnalytics({ onShowAnalytics }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 zen-mode overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-float"></div>
            <div className="absolute top-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl animate-float animation-delay-200"></div>
            <div className="absolute bottom-20 left-20 w-36 h-36 bg-cyan-200/30 rounded-full blur-2xl animate-float animation-delay-400"></div>
            <div className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-200/30 rounded-full blur-2xl animate-float animation-delay-600"></div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Decorative ring around logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full border-2 border-blue-300/40 animate-spin-slow"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full border border-blue-400/30 animate-spin-reverse"></div>
                </div>

                <div className="relative flex flex-col items-center gap-6 animate-fade-in">
                    {/* Logo with glow effect */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl"></div>
                        <img
                            src="/avatars/piton.png"
                            alt="PITON Logo"
                            className="relative w-48 h-48 object-contain drop-shadow-2xl animate-float"
                        />
                    </div>

                    {/* Text content */}
                    <div className="text-center space-y-3">
                        <h2 className="text-5xl font-bold text-blue-900 tracking-tight">
                            PITON
                        </h2>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                        <p className="text-xl text-blue-600 font-light">
                            Integrated Management System
                        </p>
                    </div>

                    {/* Decorative dots */}
                    <div className="flex gap-2 mt-4">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
                    </div>

                    {/* Show Analytics Button */}
                    <button
                        onClick={onShowAnalytics}
                        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">Show Analytics</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
