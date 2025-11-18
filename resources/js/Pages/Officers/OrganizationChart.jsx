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
import { ArrowLeft, X, Download } from "lucide-react";
import OrganizationChart from "../../components/Officers/OrganizationChart";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";

export default function OrganizationChartPage({ officers }) {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [editingAdviser, setEditingAdviser] = React.useState(false);
    const [adviserName, setAdviserName] = React.useState('');
    const [downloading, setDownloading] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const chartRef = React.useRef(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("officers.index"), label: "Officers" },
        { label: "Organization Chart" },
    ];

    const handleImageClick = (imageData) => {
        setSelectedImage(imageData);
        if (imageData.isAdviser) {
            setEditingAdviser(true);
            setAdviserName(imageData.name);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleAdviserNameChange = (e) => {
        setAdviserName(e.target.value);
    };

    const handleSaveAdviserName = () => {
        // Save to localStorage for persistence
        localStorage.setItem(selectedImage.memberId, adviserName);
        toast.success('Adviser name updated successfully', {
            duration: 3000,
            position: 'top-right',
        });
        setSelectedImage(null);
        setEditingAdviser(false);
        // Reload to show updated name
        router.reload({ only: ['officers'] });
    };

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
            link.download = `PITON-Officers-Chart-${new Date().toISOString().split('T')[0]}.png`;
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

                    // Calculate new dimensions (max 1920px width)
                    const maxWidth = 1920;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Start with quality 0.9 and reduce if needed
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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedImage) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        setUploading(true);
        setSelectedImage(null);

        try {
            // Compress image if it's larger than 1MB
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

            const response = await fetch(`/members/${selectedImage.memberId}/upload-picture`, {
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
                setTimeout(() => {
                    router.reload({ only: ['officers'] });
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
            <Head title="Organization Chart" />
            <Toaster />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadChart}
                            disabled={downloading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            {downloading ? 'Downloading...' : 'Download Chart'}
                        </button>
                        <button
                            onClick={() => router.visit(route("officers.index"))}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Officers
                        </button>
                    </div>
                </header>

                <main className="w-full h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                    <div className="h-full max-w-7xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl h-full flex flex-col">
                            <CardContent className="p-4 flex-1 overflow-y-auto">
                                {/* Use the reusable Organization Chart Component */}
                                <div ref={chartRef}>
                                    <OrganizationChart 
                                        officers={officers}
                                        onImageClick={handleImageClick}
                                        showUploadFeature={true}
                                        className="py-4"
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
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Image Preview Modal */}
            {selectedImage && !uploading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
                            <div className="flex-1">
                                {editingAdviser ? (
                                    <input
                                        type="text"
                                        value={adviserName}
                                        onChange={handleAdviserNameChange}
                                        className="text-2xl font-bold text-white bg-white/20 px-3 py-1 rounded border-2 border-white/50 focus:border-white focus:outline-none w-full"
                                        placeholder="Enter adviser name"
                                    />
                                ) : (
                                    <h3 className="text-2xl font-bold text-white">{selectedImage.name}</h3>
                                )}
                                <p className="text-blue-100 mt-1">{selectedImage.position}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    setEditingAdviser(false);
                                }}
                                className="text-white hover:text-gray-200 transition ml-4"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="p-6">
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.name}
                                className="w-full h-96 object-contain rounded-lg mb-6"
                            />
                            {editingAdviser ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleUploadClick}
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Change Picture
                                    </button>
                                    <button
                                        onClick={handleSaveAdviserName}
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleUploadClick}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Upload New Profile Picture
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Uploading Modal */}
            {uploading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-xl font-semibold text-gray-900">Uploading...</p>
                        <p className="text-gray-600 mt-2">Please wait</p>
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}
