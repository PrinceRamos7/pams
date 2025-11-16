import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, X, Camera, MoreVertical } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";
import { router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

import AddMemberModal from "../members/AddMemberModal";
import EditMemberModal from "../members/EditMemberModal";
import ViewMemberModal from "./ViewMemberModal";
import NotificationModal from "../NotificationModal";

export default function MemberTable({ members }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [formData, setFormData] = useState({
        student_id: "",
        firstname: "",
        lastname: "",
        sex: "",
        age: "",
        birthdate: "",
        phone_number: "",
        email: "",
        address: "",
        year: "",
        status: "",
    });

    // Filter members based on search and year
    const filteredMembers = members.filter((member) => {
        const matchesSearch = 
            member.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesYear = yearFilter === "all" || member.year === yearFilter;
        
        return matchesSearch && matchesYear;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.relative')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (memberId) => {
        setOpenMenuId(openMenuId === memberId ? null : memberId);
    };

    // --- Modal Handlers ---
    const openViewModal = (member) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setSelectedMember(null);
        setIsViewModalOpen(false);
    };
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => {
        resetForm();
        setIsAddModalOpen(false);
    };
    const openEditModal = (member) => {
        setSelectedMember(member);
        setFormData({ ...member });
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setSelectedMember(null);
        resetForm();
        setIsEditModalOpen(false);
    };
    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setSelectedMember(null);
        setIsDeleteModalOpen(false);
    };

    // --- Form Handlers ---
    const resetForm = () =>
        setFormData({
            student_id: "",
            firstname: "",
            lastname: "",
            sex: "",
            age: "",
            birthdate: "",
            phone_number: "",
            email: "",
            address: "",
            year: "",
            status: "",
        });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --- Notification ---
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 4000);
    };

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    // --- Submit Functions ---
    const handleAddSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (
            !formData.student_id ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.sex
        ) {
            showNotificationModal("Validation Error", "Please fill all required fields.", "error");
            return;
        }
        
        const memberName = `${formData.firstname} ${formData.lastname}`;
        
        // Status is automatically set to Active on the backend
        router.post("/members", formData, {
            preserveScroll: true,
            onSuccess: () => {
                closeAddModal();
                setTimeout(() => {
                    showNotificationModal("Success!", `${memberName} has been added successfully!`, "success");
                }, 100);
            },
            onError: (errors) => {
                console.log('Full error object:', errors);
                closeAddModal();
                setTimeout(() => {
                    // Check for specific validation errors
                    let errorMessage = "Failed to add member. Please try again.";
                    
                    // Handle different error structures
                    if (typeof errors === 'object' && errors !== null) {
                        // Check if errors has the field directly
                        if (errors.student_id) {
                            errorMessage = Array.isArray(errors.student_id) ? errors.student_id[0] : errors.student_id;
                        } else if (errors.email) {
                            errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
                        } else if (errors.phone_number) {
                            errorMessage = Array.isArray(errors.phone_number) ? errors.phone_number[0] : errors.phone_number;
                        } else if (errors.firstname) {
                            errorMessage = Array.isArray(errors.firstname) ? errors.firstname[0] : errors.firstname;
                        } else if (errors.lastname) {
                            errorMessage = Array.isArray(errors.lastname) ? errors.lastname[0] : errors.lastname;
                        } else if (errors.sex) {
                            errorMessage = Array.isArray(errors.sex) ? errors.sex[0] : errors.sex;
                        } else if (errors.status) {
                            errorMessage = Array.isArray(errors.status) ? errors.status[0] : errors.status;
                        } else {
                            // Get the first error message from any field
                            const firstError = Object.values(errors)[0];
                            if (firstError) {
                                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                            }
                        }
                    }
                    
                    showNotificationModal("Error!", errorMessage, "error");
                }, 100);
            },
        });
    };

    const handleEditSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (
            !formData.student_id ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.sex ||
            !formData.status
        ) {
            showNotificationModal("Validation Error", "Please fill all required fields.", "error");
            return;
        }
        
        const memberName = `${formData.firstname} ${formData.lastname}`;
        
        router.put(`/members/${selectedMember.member_id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                setTimeout(() => {
                    showNotificationModal("Success!", `${memberName} has been updated successfully!`, "success");
                }, 100);
            },
            onError: (errors) => {
                console.log('Full error object:', errors);
                closeEditModal();
                setTimeout(() => {
                    // Check for specific validation errors
                    let errorMessage = "Failed to update member. Please try again.";
                    
                    // Handle different error structures
                    if (typeof errors === 'object' && errors !== null) {
                        // Check if errors has the field directly
                        if (errors.student_id) {
                            errorMessage = Array.isArray(errors.student_id) ? errors.student_id[0] : errors.student_id;
                        } else if (errors.email) {
                            errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
                        } else if (errors.phone_number) {
                            errorMessage = Array.isArray(errors.phone_number) ? errors.phone_number[0] : errors.phone_number;
                        } else if (errors.firstname) {
                            errorMessage = Array.isArray(errors.firstname) ? errors.firstname[0] : errors.firstname;
                        } else if (errors.lastname) {
                            errorMessage = Array.isArray(errors.lastname) ? errors.lastname[0] : errors.lastname;
                        } else if (errors.sex) {
                            errorMessage = Array.isArray(errors.sex) ? errors.sex[0] : errors.sex;
                        } else if (errors.status) {
                            errorMessage = Array.isArray(errors.status) ? errors.status[0] : errors.status;
                        } else {
                            // Get the first error message from any field
                            const firstError = Object.values(errors)[0];
                            if (firstError) {
                                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                            }
                        }
                    }
                    
                    showNotificationModal("Error!", errorMessage, "error");
                }, 100);
            },
        });
    };

    const handleDelete = () => {
        console.log('Delete function called', selectedMember);
        
        if (!selectedMember) {
            console.log('No selected member');
            return;
        }
        
        const memberName = `${selectedMember.firstname} ${selectedMember.lastname}`;
        console.log('Deleting member:', memberName, 'ID:', selectedMember.member_id);
        
        router.delete(`/members/${selectedMember.member_id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Delete successful');
                closeDeleteModal();
                setTimeout(() => {
                    showNotificationModal("Success!", `${memberName} has been deleted successfully!`, "success");
                }, 100);
            },
            onError: (errors) => {
                console.log('Delete error:', errors);
                closeDeleteModal();
                setTimeout(() => {
                    showNotificationModal("Error!", "Failed to delete member. Please try again.", "error");
                }, 100);
            },
        });
    };

    return (
        <>
            {/* Notification Toast */}
            <div className="fixed top-4 right-4 z-50">
                <Transition
                    show={!!notification.message}
                    enter="transform transition duration-300"
                    enterFrom="translate-x-full opacity-0"
                    enterTo="translate-x-0 opacity-100"
                    leave="transform transition duration-300"
                    leaveFrom="translate-x-0 opacity-100"
                    leaveTo="translate-x-full opacity-0"
                >
                    <div
                        className={`px-4 py-2 rounded-lg font-semibold shadow-lg text-white ${
                            notification.type === "success"
                                ? "bg-green-600"
                                : "bg-red-600"
                        }`}
                    >
                        {notification.message}
                    </div>
                </Transition>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Members</h1>
                <div className="flex gap-2">
                    <a
                        href={route('members.export-pdf')}
                        target="_blank"
                        className="px-4 py-2 font-semibold rounded-lg transition"
                        style={{ backgroundColor: '#F7CC08', color: '#000' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E0B907'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#F7CC08'}
                    >
                        Export PDF
                    </a>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Add Member
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 flex gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by Student ID, Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="w-48">
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Years</option>
                        <option value="First Year">First Year</option>
                        <option value="Second Year">Second Year</option>
                        <option value="Third Year">Third Year</option>
                        <option value="Fourth Year">Fourth Year</option>
                    </select>
                </div>
            </div>

            {/* Members Table */}
            <div className="rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-blue-500 text-white font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Student ID
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Name
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Email
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Year
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Phone
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Status
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                    No members found matching your search criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((m, index) => (
                            <tr
                                key={m.member_id || index}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{m.student_id}</td>
                                <td className="px-4 py-3">
                                    {m.firstname} {m.lastname}
                                </td>
                                <td className="px-4 py-3">{m.email}</td>
                                <td className="px-4 py-3">{m.year}</td>
                                <td className="px-4 py-3">{m.phone_number}</td>
                                <td className="px-4 py-3">{m.status}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => toggleMenu(m.member_id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical size={20} className="text-gray-600" />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openMenuId === m.member_id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            openViewModal(m);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            openEditModal(m);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-3 text-green-700"
                                                    >
                                                        <Edit size={16} />
                                                        Edit Member
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            router.visit(route('members.register-face', m.member_id));
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-3 text-purple-700"
                                                    >
                                                        <Camera size={16} />
                                                        Register Face
                                                    </button>
                                                    
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            openDeleteModal(m);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete Member
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {isAddModalOpen && (
                <AddMemberModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleAddSubmit}
                    closeModal={closeAddModal}
                />
            )}
            {isEditModalOpen && selectedMember && (
                <EditMemberModal
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleEditSubmit}
                    closeModal={closeEditModal}
                />
            )}
            {isViewModalOpen && selectedMember && (
                <ViewMemberModal
                    member={selectedMember}
                    closeModal={closeViewModal}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-red-500 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                Confirm
                            </h2>
                            <button
                                onClick={closeDeleteModal}
                                className="text-white hover:text-gray-200 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Warning Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Message */}
                                <div className="flex-1">
                                    <p className="text-gray-700 text-base mb-2">
                                        Are you sure you want to delete <strong>{selectedMember.firstname} {selectedMember.lastname}</strong>?
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        You can't undo this action.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                                NO
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                                YES
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </>
    );
}
