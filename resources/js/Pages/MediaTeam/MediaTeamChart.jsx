import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent } from "../../components/ui/card";
import MediaTeamChartComponent from "../../components/MediaTeam/MediaTeamChartComponent";
import { ArrowLeft, X, Upload } from "lucide-react";

export default function MediaTeamChart({ mediaTeam }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadingMemberId, setUploadingMemberId] = useState(null);

    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/media-team", label: "Media Team" },
        { label: "Chart" },
    ];

    const handleCardClick = (member) => {
        setSelectedMember(member);
    };

    const handleUploadClick = (member) => {
        setUploadingMemberId(member.media_team_id);
        setIsUploadModalOpen(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_picture', file);

        const loadingToast = toast.loading('Uploading...', { position: 'top-right' });

        router.post(`/media-team/${uploadingMemberId}/upload-picture`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Picture uploaded successfully!', { position: 'top-right' });
                setIsUploadModalOpen(false);
                setUploadingMemberId(null);
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Failed to upload picture', { position: 'top-right' });
            },
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <Head title="Media Team Chart" />
            <Toaster />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={() => router.visit('/media-team')}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                        Back to List
                                    </button>
                                    <p className="text-sm text-gray-600 font-medium">
                                        Total: {mediaTeam?.length || 0} Members
                                    </p>
                                </div>

                                <MediaTeamChartComponent 
                                    mediaTeam={mediaTeam}
                                    onCardClick={handleCardClick}
                                    onUploadClick={handleUploadClick}
                                    showUploadFeature={true}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* View Member Modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Member Details</h2>
                            <button onClick={() => setSelectedMember(null)} className="text-white hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 overflow-hidden">
                                    {selectedMember.profile_picture ? (
                                        <img
                                            src={`/${selectedMember.profile_picture}`}
                                            alt={`${selectedMember.firstname} ${selectedMember.lastname}`}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl text-white font-bold">
                                            {selectedMember.firstname[0]}{selectedMember.lastname[0]}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {selectedMember.firstname} {selectedMember.lastname}
                                </h3>
                                <p className="text-purple-600 font-medium">{selectedMember.role}</p>
                            </div>
                            <div className="space-y-3">
                                {selectedMember.student_id && (
                                    <div>
                                        <p className="text-sm text-gray-500">Student ID</p>
                                        <p className="font-medium">{selectedMember.student_id}</p>
                                    </div>
                                )}
                                {selectedMember.specialization && (
                                    <div>
                                        <p className="text-sm text-gray-500">Specialization</p>
                                        <p className="font-medium">{selectedMember.specialization}</p>
                                    </div>
                                )}
                                {selectedMember.email && (
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedMember.email}</p>
                                    </div>
                                )}
                                {selectedMember.phone_number && (
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedMember.phone_number}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Picture Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Upload Picture</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-white hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer inline-block"
                                >
                                    Choose File
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}
