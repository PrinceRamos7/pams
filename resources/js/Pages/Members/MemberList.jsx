import React, { useEffect, useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { Search, Upload } from "lucide-react";

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import MemberTable from "../../Components/Members/MemberTable";
import Pagination from "../../Components/Pagination";
import BulkAddMemberModal from "../../components/members/BulkAddMemberModal";

export default function MemberList({ members: paginatedMembers, batches, filters }) {
    const { flash } = usePage().props;
    
    const allMembers = paginatedMembers?.data || [];
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showBulkAddModal, setShowBulkAddModal] = useState(false);
    const [yearFilter, setYearFilter] = useState(filters?.year || 'all');

    // Flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Server-side search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('members.index'), 
                { 
                    search: searchTerm,
                    year: yearFilter 
                }, 
                { 
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                }
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, yearFilter]);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Members List" },
    ];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Members List" />

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
                        <Card className="w-full h-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Current Members</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => router.visit(route('members.chart'))}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Members Chart
                                        </button>
                                        <a
                                            href={route('members.export-pdf')}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition"
                                            style={{ backgroundColor: '#F7CC08', color: '#000' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#E0B907'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#F7CC08'}
                                        >
                                            Export PDF
                                        </a>
                                        <button
                                            onClick={() => setShowBulkAddModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <Upload size={18} />
                                            Add Members
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Search and Filter Bar */}
                                <div className="mb-6 flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by Student ID, Name, or Email..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Years</option>
                                        <option value="First Year">First Year</option>
                                        <option value="Second Year">Second Year</option>
                                        <option value="Third Year">Third Year</option>
                                        <option value="Fourth Year">Fourth Year</option>
                                    </select>
                                </div>

                                <MemberTable members={allMembers} batches={batches} />
                                
                                {/* Pagination */}
                                {paginatedMembers?.links && paginatedMembers.links.length > 3 && (
                                    <div className="mt-6">
                                        <Pagination links={paginatedMembers.links} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            {/* Bulk Add Member Modal */}
            {showBulkAddModal && (
                <BulkAddMemberModal
                    closeModal={() => setShowBulkAddModal(false)}
                    batches={batches}
                />
            )}
        </SidebarProvider>
    );
}
