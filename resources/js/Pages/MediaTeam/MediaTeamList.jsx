import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import { Search, UserPlus, Download } from "lucide-react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import MediaTeamTable from "../../components/MediaTeam/MediaTeamTable";
import AddMediaTeamModal from "../../components/MediaTeam/AddMediaTeamModal";

import Pagination from "../../components/Pagination";

export default function MediaTeamList({ mediaTeam, batches, availableMembers, hasDirector, hasManagingDirector, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard" },
        { label: "Media Team" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/media-team", { search: searchQuery }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearchQuery("");
        router.get("/media-team", {}, { preserveState: true });
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Media Team" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Media Team Management</h1>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => router.visit('/media-team/chart')}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Media Team Chart
                                    </button>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <UserPlus size={20} />
                                        Add Members
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, student ID, role, or email..."
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Search
                                    </button>
                                    {filters?.search && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mb-4 text-sm text-gray-600">
                                Total Members: <span className="font-semibold">{mediaTeam?.total || 0}</span>
                            </div>

                            <MediaTeamTable mediaTeam={mediaTeam?.data || []} batches={batches} />

                            {mediaTeam?.data && mediaTeam.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={mediaTeam.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </SidebarInset>

            {isAddModalOpen && (
                <AddMediaTeamModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    batches={batches}
                    availableMembers={availableMembers}
                    hasDirector={hasDirector}
                    hasManagingDirector={hasManagingDirector}
                />
            )}
        </SidebarProvider>
    );
}
