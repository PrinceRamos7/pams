import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Search, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import MemberHistoryComponent from "../../components/Members/MemberHistory";
import SimplifiedAddMemberModal from "../../components/members/SimplifiedAddMemberModal";
import BulkAddMemberModal from "../../components/members/BulkAddMemberModal";

export default function MemberHistoryPage({ batches }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showBulkAddModal, setShowBulkAddModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        student_id: "",
        firstname: "",
        lastname: "",
        sex: "",
        birthdate: "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditMember = (member) => {
        console.log('Edit member data:', member); // Debug log
        
        // If firstname/lastname are not available, split the name
        let firstname = member.firstname || '';
        let lastname = member.lastname || '';
        
        if (!firstname && !lastname && member.name) {
            const nameParts = member.name.split(' ');
            firstname = nameParts[0] || '';
            lastname = nameParts.slice(1).join(' ') || '';
        }
        
        setSelectedMember({
            ...member,
            id: member.member_id, // Use member_id as id for the API call
            firstname,
            lastname,
        });
        
        setFormData({
            student_id: member.student_id || '',
            firstname: firstname,
            lastname: lastname,
            sex: member.sex || '',
            birthdate: member.birthdate || '',
            batch_id: member.batch_id || '',
            status: member.status || 'Active',
        });
        
        console.log('Form data set:', {
            student_id: member.student_id || '',
            firstname: firstname,
            lastname: lastname,
            sex: member.sex || '',
            birthdate: member.birthdate || '',
            batch_id: member.batch_id || '',
            status: member.status || 'Active',
        }); // Debug log
        
        setShowEditMemberModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        // Check if member can be edited (only members from 'member' source)
        if (selectedMember.source !== 'member') {
            toast.error('Cannot edit this record. This is a historical officer record.', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        const loadingToast = toast.loading('Updating member...', {
            position: 'top-right',
        });

        try {
            // Use member_id instead of id
            const memberId = selectedMember.member_id || selectedMember.id;
            
            console.log('Updating member with ID:', memberId);
            console.log('Selected member:', selectedMember);
            
            if (!memberId) {
                throw new Error('Member ID is missing');
            }
            
            const response = await fetch(`/members/${memberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            toast.dismiss(loadingToast);

            if (data.success) {
                toast.success('Member updated successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
                setShowEditMemberModal(false);
                setSelectedMember(null);
                setFormData({
                    student_id: "",
                    firstname: "",
                    lastname: "",
                    sex: "",
                    birthdate: "",
                    batch_id: "",
                    status: "Active",
                });
                setTimeout(() => {
                    router.visit(route('members.history'), { method: 'get' });
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to update member', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error('Error updating member:', error);
            toast.dismiss(loadingToast);
            toast.error(error.message || 'Failed to update member. Please try again.', {
                duration: 4000,
                position: 'top-right',
            });
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
            birthdate: "",
            batch_id: "",
            status: "Active",
        });
    };

    const handleDeleteMember = (member) => {
        // Show confirmation toast with action buttons
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="text-center">
                    <p className="font-semibold text-gray-900">Delete Member?</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Are you sure you want to delete <strong>{member.firstname || member.name}</strong>?
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(member);
                        }}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            position: 'top-right',
            style: {
                minWidth: '350px',
            },
        });
    };

    const confirmDelete = async (member) => {
        // Check if member can be deleted (only members from 'member' source)
        if (member.source !== 'member') {
            toast.error('Cannot delete this record. This is a historical officer record.', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        const loadingToast = toast.loading('Deleting member...', {
            position: 'top-right',
        });

        try {
            // Use member_id instead of id
            const memberId = member.member_id || member.id;
            
            console.log('Deleting member with ID:', memberId);
            console.log('Member data:', member);
            
            if (!memberId) {
                throw new Error('Member ID is missing');
            }
            
            const response = await fetch(`/members/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            toast.dismiss(loadingToast);

            if (data.success) {
                toast.success('Member deleted successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
                setTimeout(() => {
                    router.visit(route('members.history'), { method: 'get' });
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to delete member', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.dismiss(loadingToast);
            toast.error(error.message || 'Failed to delete member. Please try again.', {
                duration: 4000,
                position: 'top-right',
            });
        }
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
                                        onClick={() => setShowBulkAddModal(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Bulk Add Members
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
            
            {/* Edit Member Modal */}
            {showEditMemberModal && (
                <SimplifiedAddMemberModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleEditSubmit}
                    closeModal={closeEditModal}
                    batches={batches || []}
                    title="Edit Member"
                    isEdit={true}
                />
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
