import React from "react";
import { usePage, Head, router } from "@inertiajs/react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, User } from "lucide-react";

export default function OrganizationChart({ officers }) {
    const [selectedImage, setSelectedImage] = React.useState(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: "/members", label: "Members" },
        { label: "Organization Chart" },
    ];

    // Group officers by position hierarchy
    const positionHierarchy = [
        "President",
        "Vice President - Internal",
        "Vice President - External",
        "Secretary",
        "Treasurer",
        "Auditor",
        "Business Manager",
        "Public Information Officer (PIO)",
        "Attendance Officer",
        "PITON Representative",
        "Media Team Director",
        "Media Team Managing Director",
    ];

    const getOfficersByPosition = (position) => {
        return officers.filter((officer) => officer.position === position);
    };

    // Helper function to get position-based image
    const getPositionImage = (position, officerIndex = 0) => {
        const positionMap = {
            President: "president",
            "VP - Internal": "vice-president-internal",
            "VP - External": "vice-president-external",
            Secretary: "secretary",
            Treasurer: "treasurer",
            Auditor: "auditor",
            "Business Manager": `business-manager-${officerIndex + 1}`,
            PIO: `pio-${officerIndex + 1}`,
            "Attendance Officer": "attendance-officer",
            "PITON Representative": "piton-representative",
            "Media Team Director": "media-team-director",
            "Media Managing Director": "media-managing-director",
        };

        const imageName = positionMap[position] || "default";
        return `/images/officers/${imageName}.jpg`;
    };

    const OfficerCard = ({
        officer,
        position,
        index = 0,
        positionIndex = 0,
    }) => {
        const positionImage = getPositionImage(position, positionIndex);
        const imageUrl = officer.profile_picture || positionImage;

        return (
            <div
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 w-40 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-transparent rounded-tr-xl opacity-20"></div>

                <div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center mb-2 shadow-lg border-4 border-white relative overflow-hidden group cursor-pointer"
                    onClick={() =>
                        setSelectedImage({
                            url: imageUrl,
                            name: `${officer.firstname} ${officer.lastname}`,
                            position,
                        })
                    }
                >
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>

                    {/* Zoom overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center z-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                        </svg>
                    </div>

                    <img
                        src={imageUrl}
                        alt={`${officer.firstname} ${officer.lastname}`}
                        className="w-full h-full rounded-full object-cover relative z-10"
                        onError={(e) => {
                            // Fallback to user icon if image fails to load
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                        }}
                    />
                    <User className="w-8 h-8 text-white relative z-10 hidden" />
                </div>

                <h3 className="font-bold text-gray-900 text-center text-xs leading-tight uppercase tracking-wide">
                    {officer.firstname} {officer.lastname}
                </h3>

                <div className="mt-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <p className="text-[10px] text-white font-bold">
                        {position}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <Head title="Organization Chart" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                    <button
                        onClick={() => router.visit("/members")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Members
                    </button>
                </header>

                <main className="w-full h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                    <div className="h-full max-w-7xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl h-full flex flex-col">
                            <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
                                <div className="text-center mb-3">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                        OFFICERS CHART
                                    </h1>
                                    <p className="text-sm text-blue-600 font-medium">
                                        PITON Officers Structure
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-start gap-4 overflow-y-auto py-4">
                                    {/* President */}
                                    {getOfficersByPosition("President").length >
                                        0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "President"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="President"
                                                        index={idx}
                                                    />
                                                ))}
                                            </div>
                                            {/* Connector line down */}
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* VP Internal and External */}
                                    {(getOfficersByPosition(
                                        "Vice President - Internal"
                                    ).length > 0 ||
                                        getOfficersByPosition(
                                            "Vice President - External"
                                        ).length > 0) && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-4">
                                                {getOfficersByPosition(
                                                    "Vice President - Internal"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="VP - Internal"
                                                        index={idx + 1}
                                                    />
                                                ))}
                                                {getOfficersByPosition(
                                                    "Vice President - External"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="VP - External"
                                                        index={idx + 2}
                                                    />
                                                ))}
                                            </div>
                                            {/* Connector line down */}
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Secretary */}
                                    {getOfficersByPosition("Secretary").length >
                                        0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "Secretary"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Secretary"
                                                        index={idx + 3}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Treasurer */}
                                    {getOfficersByPosition("Treasurer").length >
                                        0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "Treasurer"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Treasurer"
                                                        index={idx + 4}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Auditor */}
                                    {getOfficersByPosition("Auditor").length >
                                        0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "Auditor"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Auditor"
                                                        index={idx + 5}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Business Manager (can have 2) */}
                                    {getOfficersByPosition("Business Manager")
                                        .length > 0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-4">
                                                {getOfficersByPosition(
                                                    "Business Manager"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Business Manager"
                                                        index={idx + 6}
                                                        positionIndex={idx}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* PIO (can have 2) */}
                                    {getOfficersByPosition(
                                        "Public Information Officer (PIO)"
                                    ).length > 0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-4">
                                                {getOfficersByPosition(
                                                    "Public Information Officer (PIO)"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="PIO"
                                                        index={idx + 7}
                                                        positionIndex={idx}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Attendance Officer */}
                                    {getOfficersByPosition("Attendance Officer")
                                        .length > 0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "Attendance Officer"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Attendance Officer"
                                                        index={idx + 8}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* PITON Representative */}
                                    {getOfficersByPosition(
                                        "PITON Representative"
                                    ).length > 0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "PITON Representative"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="PITON Representative"
                                                        index={idx + 9}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Media Team Director */}
                                    {getOfficersByPosition(
                                        "Media Team Director"
                                    ).length > 0 && (
                                        <div className="relative">
                                            <div className="flex justify-center gap-2">
                                                {getOfficersByPosition(
                                                    "Media Team Director"
                                                ).map((officer, idx) => (
                                                    <OfficerCard
                                                        key={officer.officer_id}
                                                        officer={officer}
                                                        position="Media Team Director"
                                                        index={idx + 10}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-transparent transform -translate-x-1/2"></div>
                                        </div>
                                    )}

                                    {/* Media Team Managing Director */}
                                    {getOfficersByPosition(
                                        "Media Team Managing Director"
                                    ).length > 0 && (
                                        <div className="flex justify-center gap-2">
                                            {getOfficersByPosition(
                                                "Media Team Managing Director"
                                            ).map((officer, idx) => (
                                                <OfficerCard
                                                    key={officer.officer_id}
                                                    officer={officer}
                                                    position="Media Managing Director"
                                                    index={idx + 11}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {officers.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            No officers found in the system.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* Image Modal/Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] animate-zoom-in">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Image */}
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.name}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Info */}
                        <div className="absolute -bottom-16 left-0 right-0 text-center text-white">
                            <h3 className="text-xl font-bold">
                                {selectedImage.name}
                            </h3>
                            <p className="text-sm text-gray-300">
                                {selectedImage.position}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

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

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .animate-zoom-in {
                    animation: zoom-in 0.3s ease-out;
                }
            `}</style>
        </SidebarProvider>
    );
}
