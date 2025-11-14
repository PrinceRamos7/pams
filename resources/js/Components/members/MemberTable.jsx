import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, X, Camera, MoreVertical } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";
import { router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import ViewMemberModal from "./ViewMemberModal";
import OfficerTable from "./OfficerTable";

export default function MemberTable({ members }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [openMenuId, setOpenMenuId] = useState(null);
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

    // Officers toggle state
    const [showOfficers, setShowOfficers] = useState(false);
    const [officers, setOfficers] = useState([]);

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

    // --- Toggle officers function ---
    const toggleOfficers = async () => {
        if (showOfficers) {
            setShowOfficers(false);
            return;
        }

        try {
            const response = await fetch("/officers/current", {
                headers: { Accept: "application/json" },
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error(
                    "Expected JSON but received:",
                    await response.text()
                );
                return;
            }

            const data = await response.json();
            setOfficers(data);
            setShowOfficers(true);
        } catch (error) {
            console.error("Failed to fetch officers:", error);
        }
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

    // --- Submit Functions ---
    const handleAddSubmit = () => {
        if (
            !formData.student_id ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.sex ||
            !formData.status
        ) {
            showNotification("Please fill all required fields.", "error");
            return;
        }
        Inertia.post("/members", formData, {
            onSuccess: () => {
                closeAddModal();
                showNotification("Member added successfully!");
            },
            onError: () => showNotification("Failed to add member.", "error"),
        });
    };

    const handleEditSubmit = () => {
        if (
            !formData.student_id ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.sex ||
            !formData.status
        ) {
            showNotification("Please fill all required fields.", "error");
            return;
        }
        Inertia.put(`/members/${selectedMember.member_id}`, formData, {
            onSuccess: () => {
                showNotification("Member updated successfully!");
                closeEditModal();
            },
            onError: () =>
                showNotification("Failed to update member.", "error"),
        });
    };

    const handleDelete = () => {
        if (!selectedMember) return;
        Inertia.delete(`/members/${selectedMember.member_id}`, {
            onSuccess: () => {
                showNotification("Member deleted successfully!");
                closeDeleteModal();
            },
            onError: () =>
                showNotification("Failed to delete member.", "error"),
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
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Add Member
                </button>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
                        {members.map((m, index) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Toggle Officers Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={toggleOfficers}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                    {showOfficers ? "Hide Officers" : "View Officers"}
                </button>
            </div>

            {/* Officers Table */}
            {showOfficers && <OfficerTable officers={officers} />}
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

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-red-600">
                                Confirm Delete
                            </h2>
                            <button
                                onClick={closeDeleteModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete{" "}
                            <strong>
                                {selectedMember.firstname}{" "}
                                {selectedMember.lastname}
                            </strong>
                            ?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
