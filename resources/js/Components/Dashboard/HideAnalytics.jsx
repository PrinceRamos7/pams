import React, { useState, useEffect } from "react";
import { Eye, BarChart3, TrendingUp, Activity, Sparkles } from "lucide-react";

export function HideAnalytics({ onShowAnalytics }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Set greeting based on time
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 zen-mode overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float animation-delay-200"></div>
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float animation-delay-400"></div>
                <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-float animation-delay-600"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    {/* Logo section with enhanced effects */}
                    <div className="relative">
                        {/* Rotating rings - smaller */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-full border-2 border-blue-300/30 animate-spin-slow"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-56 h-56 rounded-full border border-indigo-300/20 animate-spin-reverse"></div>
                        </div>

                        {/* Logo with enhanced glow */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-2xl">
                                <img
                                    src="/avatars/piton.png"
                                    alt="PITON Logo"
                                    className="w-28 h-28 object-contain drop-shadow-2xl animate-float"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Text content with enhanced styling */}
                    <div className="text-center space-y-3">
                        {/* Greeting */}
                        <div className="space-y-1">
                            <p className="text-base text-blue-600 font-medium animate-slide-in-up">
                                {greeting}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight animate-slide-in-up animation-delay-100">
                                PITON
                            </h1>
                        </div>

                        {/* Divider with sparkle */}
                        <div className="flex items-center justify-center gap-2 animate-slide-in-up animation-delay-200">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-1 animate-slide-in-up animation-delay-300">
                            <p className="text-lg md:text-xl text-gray-700 font-light">
                                Integrated Management System
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                Attendance • Sanctions • Analytics
                            </p>
                        </div>

                        {/* Date and Time Display */}
                        <div className="mt-3 space-y-1 animate-slide-in-up animation-delay-400">
                            <div className="text-2xl md:text-3xl font-bold text-gray-800 tabular-nums">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-xs text-gray-600">
                                {formatDate(currentTime)}
                            </div>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="flex items-center gap-4 mt-2 animate-slide-in-up animation-delay-500">
                        <div className="flex flex-col items-center gap-1 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span className="text-xs text-gray-600 font-medium">Analytics</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-xs text-gray-600 font-medium">Insights</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <Activity className="w-5 h-5 text-purple-600" />
                            <span className="text-xs text-gray-600 font-medium">Reports</span>
                        </div>
                    </div>

                    {/* Show Analytics Button - Enhanced */}
                    <button
                        onClick={onShowAnalytics}
                        className="group mt-4 relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 animate-slide-in-up animation-delay-600"
                    >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                        
                        <Eye className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10 text-base font-semibold">View Dashboard Analytics</span>
                        
                        {/* Arrow indicator */}
                        <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>

                    {/* Hint text */}
                    <p className="text-xs text-gray-500 animate-slide-in-up animation-delay-700">
                        Click to view detailed analytics and insights
                    </p>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float-particle"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-particle animation-delay-200"></div>
                <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-float-particle animation-delay-400"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-particle animation-delay-600"></div>
            </div>
        </div>
    );
}
