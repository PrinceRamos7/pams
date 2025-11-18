import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ChevronDown, ChevronUp, FileText, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import AddBatchOfficersModal from "../../components/Officers/AddBatchOfficersModal";
import NotificationModal from "../../components/NotificationModal";

export default function OfficersHistory({ batches }) {
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });
    
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            setNotificationModal({
                isOpen: true,
                type: "success",
                title: "Success!",
                message: flash.success
            });
        } else if (flash?.error) {
            setNotificationModal({
                isOpen: true,
                type: "error",
                title: "Error!",
                message: flash.error
            });
        }
    }, [flash]);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: "/officers", label: "Officers" },
        { label: "Officers History" },
    ];

    const toggleBatch = (batchId) => {
        setExpandedBatch(expandedBatch === batchId ? null : batchId);
    };

    const handleAddSuccess = () => {
        router.reload({ only: ['batches'] });
    };

    // Filter batches and officers based on search term
    const filteredBatches = batches.filter((batch) => {
        const batchNameMatch = batch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const officersMatch = batch.officers.some(
            (officer) =>
                officer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                officer.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                officer.student_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return batchNameMatch || officersMatch;
    });

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Officers History" />

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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Officers History by Batch</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Batch Officers
                                    </Button>
                                    <Button
                                        onClick={() => window.location.href = '/officers/history/export-pdf'}
                                        className="bg-[#F7CC08] hover:bg-[#d9b307] text-black"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Export PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Search Bar */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by batch name, position, member name, or student ID..."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {filteredBatches.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchTerm ? "No matching batches or officers found" : "No officer batches found"}
                                        </div>
                                    ) : (
                                        filteredBatches.map((batch) => (
                                            <div key={batch.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Batch Header */}
                                                <button
                                                    onClick={() => toggleBatch(batch.id)}
                                                    className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-800">
                                                                {batch.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {batch.officers_count} Officer{batch.officers_count !== 1 ? 's' : ''}
                                                                {batch.year && ` • Year ${batch.year}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {expandedBatch === batch.id ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>

                                                {/* Officers List */}
                                                {expandedBatch === batch.id && (
                                                    <div className="p-6 bg-white">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">Position</th>
                                                                    <th className="px-4 py-2 text-left">Member Name</th>
                                                                    <th className="px-4 py-2 text-left">Student ID</th>
                                                                    <th className="px-4 py-2 text-left">Sex</th>
                                                                    <th className="px-4 py-2 text-left">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                                {batch.officers.map((officer) => (
                                                                    <tr key={officer.officer_id} className="hover:bg-gray-50">
                                                                        <td className="px-4 py-3 font-medium">{officer.position}</td>
                                                                        <td className="px-4 py-3">{officer.member_name}</td>
                                                                        <td className="px-4 py-3">{officer.student_id}</td>
                                                                        <td className="px-4 py-3">{officer.sex || '-'}</td>
                                                                        <td className="px-4 py-3">
                                                                            {officer.status === 'Alumni' ? (
                                                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                                                    Alumni
                                                                                </span>
                                                                            ) : officer.status === 'Inactive' ? (
                                                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                                                    Inactive
                                                                                </span>
                                                                            ) : (
                                                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                                                    Active
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>

            <AddBatchOfficersModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
            />

            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </SidebarProvider>
    );
}
