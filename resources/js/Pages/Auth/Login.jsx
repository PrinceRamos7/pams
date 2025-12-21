import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Shield, Users, BarChart3 } from 'lucide-react';
import toastService from '@/utils/toastService';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => {
                toastService.success('Welcome back! Login successful.');
            },
            onError: () => {
                toastService.error('Invalid credentials. Please try again.');
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
                    {/* Left Side - Branding */}
                    <div className="hidden lg:flex flex-col justify-center space-y-8 px-12">
                        <div className="space-y-8">
                            {/* Logo */}
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    <img 
                                        src="/avatars/piton.png" 
                                        alt="PITON Logo" 
                                        className="w-16 h-16 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="text-4xl font-bold text-blue-600">P</span>';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">PITON</h1>
                                    <p className="text-blue-100 font-medium">Integrated Management System</p>
                                </div>
                            </div>
                            
                            {/* Welcome Message */}
                            <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                <h2 className="text-4xl font-bold text-white leading-tight">
                                    Welcome Back!
                                </h2>
                                <p className="text-lg text-blue-50 leading-relaxed">
                                    Access your dashboard to manage attendance, track performance, and oversee member activities with ease.
                                </p>
                            </div>
                            
                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Secure Access</p>
                                        <p className="text-sm text-blue-100">Protected authentication system</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Member Management</p>
                                        <p className="text-sm text-blue-100">Comprehensive member tracking</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <BarChart3 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Analytics Dashboard</p>
                                        <p className="text-sm text-blue-100">Real-time insights and reports</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-blue-100 backdrop-blur-xl">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl mb-4">
                                    <img 
                                        src="/avatars/piton.png" 
                                        alt="PITON Logo" 
                                        className="w-16 h-16 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="text-4xl font-bold text-white">P</span>';
                                        }}
                                    />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">PITON</h1>
                                <p className="text-sm text-gray-600 font-medium">Integrated Management System</p>
                            </div>

                            {/* Form Header */}
                            <div className="mb-8 text-center lg:text-left">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                                    Sign In
                                </h2>
                                <p className="text-gray-600">Enter your credentials to access your account</p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">{status}</p>
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className={`h-5 w-5 transition-colors ${
                                                errors.email ? 'text-red-400' : 'text-blue-400 group-focus-within:text-blue-600'
                                            }`} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="username"
                                            autoFocus
                                            className={`block w-full pl-12 pr-4 py-3.5 border-2 ${
                                                errors.email 
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-blue-200 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300'
                                            } rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 transition-colors ${
                                                errors.password ? 'text-red-400' : 'text-blue-400 group-focus-within:text-blue-600'
                                            }`} />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            className={`block w-full pl-12 pr-12 py-3.5 border-2 ${
                                                errors.password 
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-blue-200 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300'
                                            } rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 transition-all cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-5 w-5" />
                                            <span>Sign In to Dashboard</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span>Secured by <span className="font-semibold text-blue-600">PITON Security</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 lg:hidden">
                            <p className="text-center text-sm text-white">
                                <Shield className="inline h-4 w-4 mr-1" />
                                Your data is protected with enterprise-grade security
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
