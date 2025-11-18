import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Search, Plus, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import MemberHistoryComponent from "../../components/Members/MemberHistory";
import SimplifiedAddMemberModal from "../../components/members/SimplifiedAddMemberModal";
import BulkAddMemberModal from "../../components/members/BulkAddMemberModal";

export default function MemberHistoryPage({ batches }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showBulkAddModal, setShowBulkAddModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        student_id: "",
        firstname: "",
        lastname: "",
        sex: "",
        batch_id: "",
        status: "Active",
    });
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("members.index"), label: "Members" },
        { label: "Member History" },
    ];

    const handleExportPDF = () => {
        window.location.href = route('members.history.export-pdf');
    };

    const handleAddMember = () => {
        setShowAddMemberModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch('/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Member added successfully!');
                setShowAddMemberModal(false);
                setFormData({
                    student_id: "",
                    firstname: "",
                    lastname: "",
                    sex: "",
                    batch_id: "",
                    status: "Active",
                });
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('Failed to add member. Please try again.');
        }
    };

    const closeAddModal = () => {
        setShowAddMemberModal(false);
        setFormData({
            student_id: "",
            firstname: "",
            lastname: "",
            sex: "",
            batch_id: "",
            status: "Active",
        });
    };

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setFormData({
            student_id: member.student_id,
            firstname: member.firstname,
            lastname: member.lastname,
            sex: member.sex,
            batch_id: member.batch_id,
            status: member.status,
        });
        setShowEditMemberModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch(`/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Member updated successfully!');
                setShowEditMemberModal(false);
                setSelectedMember(null);
                setFormData({
                    student_id: "",
                    firstname: "",
                    lastname: "",
                    sex: "",
                    batch_id: "",
                    status: "Active",
                });
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to update member');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            toast.error('Failed to update member. Please try again.');
        }
    };

    const closeEditModal = () => {
        setShowEditMemberModal(false);
        setSelectedMember(null);
        setFormData({
            student_id: "",
            firstname: "",
            lastname: "",
            sex: "",
            batch_id: "",
            status: "Active",
        });
    };

    const handleDeleteMember = (member) => {
        setSelectedMember(member);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch(`/members/${selectedMember.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Member deleted successfully!');
                setShowDeleteConfirm(false);
                setSelectedMember(null);
                setTimeout(() => {
                    router.reload();
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to delete member');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Failed to delete member. Please try again.');
        }
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setSelectedMember(null);
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Member History" />

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
                                <CardTitle>Member History by Batch</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddMember}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Member
                                    </Button>
                                    <Button
                                        onClick={() => setShowBulkAddModal(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Bulk Add
                                    </Button>
                                    <Button
                                        onClick={handleExportPDF}
                                        variant="outline"
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
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
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            type="text"
                                            placeholder="Search by batch name, member name, or student ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-blue-600 font-medium">Total Batches</p>
                                            <p className="text-3xl font-bold text-blue-900">{batches.length}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-green-600 font-medium">Total Members</p>
                                            <p className="text-3xl font-bold text-green-900">
                                                {batches.reduce((sum, batch) => sum + batch.member_count, 0)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-purple-600 font-medium">Total Changes</p>
                                            <p className="text-3xl font-bold text-purple-900">
                                                {batches.reduce((sum, batch) => 
                                                    sum + batch.members.reduce((memberSum, member) => 
                                                        memberSum + member.history.length, 0
                                                    ), 0
                                                )}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Member History Component */}
                                <MemberHistoryComponent 
                                    batches={batches}
                                    searchTerm={searchTerm}
                                    onEdit={handleEditMember}
                                    onDelete={handleDeleteMember}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
            
            {/* Add Member Modal */}
            {showAddMemberModal && (
                <SimplifiedAddMemberModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleAddSubmit}
                    closeModal={closeAddModal}
                    batches={batches || []}
                />
            )}

            {/* Edit Member Modal */}
            {showEditMemberModal && (
                <SimplifiedAddMemberModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleEditSubmit}
                    closeModal={closeEditModal}
                    batches={batches || []}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-40" onClick={closeDeleteConfirm} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Delete</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <strong>{selectedMember?.firstname} {selectedMember?.lastname}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={closeDeleteConfirm}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Add Member Modal */}
            {showBulkAddModal && (
                <BulkAddMemberModal
                    closeModal={() => setShowBulkAddModal(false)}
                    batches={batches || []}
                />
            )}
        </SidebarProvider>
    );
}
