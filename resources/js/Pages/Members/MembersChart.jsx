import React from "react";
import { Head, router } from "@inertiajs/react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, Download, User, X, ZoomIn, ZoomOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import MemberChartComponent from "../../Components/Members/MemberChartComponent";

export default function MembersChartPage({ members }) {
    const [downloading, setDownloading] = React.useState(false);
    const [selectedMember, setSelectedMember] = React.useState(null);
    const [cardSize, setCardSize] = React.useState('medium'); // small, medium, large
    const [uploading, setUploading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const chartRef = React.useRef(null);
    const fileInputRef = React.useRef(null);

    // Filter members based on search
    const filteredMembers = members.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        return (
            member.firstname.toLowerCase().includes(searchLower) ||
            member.lastname.toLowerCase().includes(searchLower) ||
            (member.student_id && member.student_id.toLowerCase().includes(searchLower))
        );
    });

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("members.index"), label: "Members" },
        { label: "Member Chart" },
    ];

    const handleDownloadChart = async () => {
        if (!chartRef.current) return;

        setDownloading(true);
        toast.loading('Generating chart image...', {
            duration: 2000,
            position: 'top-right',
        });

        try {
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: '#f0f9ff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement('a');
            link.download = `PITON-Members-Chart-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('Chart downloaded successfully!', {
                duration: 3000,
                position: 'top-right',
            });
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download chart', {
                duration: 4000,
                position: 'top-right',
            });
        } finally {
            setDownloading(false);
        }
    };

    const compressImage = (file, maxSizeMB = 1) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const maxWidth = 1920;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    let quality = 0.9;
                    const tryCompress = () => {
                        canvas.toBlob(
                            (blob) => {
                                if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.5) {
                                    resolve(new File([blob], file.name, {
                                        type: 'image/jpeg',
                                        lastModified: Date.now(),
                                    }));
                                } else {
                                    quality -= 0.1;
                                    tryCompress();
                                }
                            },
                            'image/jpeg',
                            quality
                        );
                    };
                    tryCompress();
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleUploadPicture = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedMember) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        setUploading(true);

        try {
            let processedFile = file;
            if (file.size > 1024 * 1024) {
                toast.loading('Compressing image...', {
                    duration: 2000,
                    position: 'top-right',
                });
                processedFile = await compressImage(file, 1);
            }

            const formData = new FormData();
            formData.append('profile_picture', processedFile);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/members/${selectedMember.member_id}/upload-picture`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Profile picture updated successfully', {
                    duration: 3000,
                    position: 'top-right',
                });
                setSelectedMember(null);
                setTimeout(() => {
                    router.reload({ only: ['members'] });
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to upload image', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to upload image', {
                duration: 4000,
                position: 'top-right',
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <Head title="Members Chart" />
            <Toaster />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Card Size Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setCardSize('small')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                    cardSize === 'small' 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Small cards"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCardSize('medium')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                    cardSize === 'medium' 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Medium cards"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCardSize('large')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                    cardSize === 'large' 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Large cards"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleDownloadChart}
                            disabled={downloading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            {downloading ? 'Downloading...' : 'Download Chart'}
                        </button>
                        <button
                            onClick={() => router.visit(route("members.index"))}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Members
                        </button>
                    </div>
                </header>

                <main className="w-full h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                    <div className="h-full max-w-7xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl h-full flex flex-col">
                            <CardContent className="p-6 flex-1 overflow-y-auto">
                                <div ref={chartRef} className="space-y-8">
                                    {/* Title */}
                                    <div className="text-center mb-8">
                                        <div className="inline-block">
                                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                                PITON MEMBERS
                                            </h2>
                                            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                                        </div>
                                        <p className="text-base text-gray-600 font-medium mt-3">
                                            Academic Year 2025-2026 • Total: {members.length} Members
                                        </p>
                                    </div>

                                    {/* Member Chart Component */}
                                    <MemberChartComponent
                                        members={members}
                                        searchTerm={searchTerm}
                                        cardSize={cardSize}
                                        onMemberClick={setSelectedMember}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadPicture}
                className="hidden"
            />

            {/* Uploading Overlay */}
            {uploading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-xl font-semibold text-gray-900">Uploading...</p>
                        <p className="text-gray-600 mt-2">Please wait</p>
                    </div>
                </div>
            )}

            {/* Zoom Modal */}
            {selectedMember && !uploading && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedMember(null)}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {selectedMember.firstname} {selectedMember.lastname}
                                </h3>
                                <p className="text-blue-100 mt-1">{selectedMember.student_id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-blue-100">
                                            <img
                                                src={selectedMember.profile_picture || selectedMember.face_image || '/images/default-avatar.jpg'}
                                                alt={`${selectedMember.firstname} ${selectedMember.lastname}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextElementSibling.style.display = "flex";
                                                }}
                                            />
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 hidden items-center justify-center">
                                                <User className="w-32 h-32 text-white" />
                                            </div>
                                        </div>
                                        {/* Upload overlay on hover */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Change Photo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Year Level</p>
                                        <p className="text-lg font-semibold text-gray-900">{selectedMember.year || '-'}</p>
                                    </div>

                                    {selectedMember.batch && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Batch</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedMember.batch.name}</p>
                                        </div>
                                    )}

                                    {selectedMember.email && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email</p>
                                            <p className="text-base text-gray-900">{selectedMember.email}</p>
                                        </div>
                                    )}

                                    {selectedMember.phone_number && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                                            <p className="text-base text-gray-900">{selectedMember.phone_number}</p>
                                        </div>
                                    )}

                                    {selectedMember.address && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Address</p>
                                            <p className="text-base text-gray-900">{selectedMember.address}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                        <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            {selectedMember.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Upload New Picture
                            </button>
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}
