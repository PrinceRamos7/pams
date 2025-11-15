import React, { useState, useEffect } from "react";
import { Edit, Plus, Trash2, X, MoreVertical } from "lucide-react";
import { router } from "@inertiajs/react";
import EditOfficerModal from "./EditOfficerModal";
import AddOfficerModal from "./AddOfficerModal";
import NotificationModal from "../NotificationModal";

export default function OfficerTable({ officers }) {
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
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

    const toggleMenu = (officerId) => {
        setOpenMenuId(openMenuId === officerId ? null : officerId);
    };

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const openEditModal = (officer) => {
        setSelectedOfficer(officer);
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    };

    const closeEditModal = () => {
        setSelectedOfficer(null);
        setIsEditModalOpen(false);
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    
    const openDeleteModal = (officer) => {
        setSelectedOfficer(officer);
        setIsDeleteModalOpen(true);
        setOpenMenuId(null);
    };
    
    const closeDeleteModal = () => {
        setSelectedOfficer(null);
        setIsDeleteModalOpen(false);
    };
    
    const handleDelete = () => {
        if (!selectedOfficer) return;
        
        router.delete(`/officers/${selectedOfficer.officer_id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
                setTimeout(() => {
                    showNotificationModal("Success!", `Officer removed successfully!`, "success");
                }, 100);
            },
            onError: () => {
                closeDeleteModal();
                setTimeout(() => {
                    showNotificationModal("Error!", "Failed to remove officer. Please try again.", "error");
                }, 100);
            },
        });
    };
    return (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-600">
                    👥 Current Officers
                </h3>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold"
                >
                    <Plus size={18} /> Add Officer
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-blue-500 text-white sticky top-0 z-10">
                    <tr className="text-left font-semibold">
                        <th className="p-3">Officer ID</th>
                        <th className="p-3">Position</th>
                        <th className="p-3">Member Name</th>
                        <th className="p-3">Batch Name</th>
                        <th className="p-3">Created At</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {officers.length > 0 ? (
                        officers.map((officer) => (
                            <tr
                                key={officer.officer_id}
                                className="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
                            >
                                <td className="p-3">{officer.officer_id}</td>
                                <td className="p-3">{officer.position}</td>
                                <td className="p-3">{officer.member_name}</td>
                                <td className="p-3">{officer.batch_name}</td>
                                <td className="p-3">
                                    {new Date(
                                        officer.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => toggleMenu(officer.officer_id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical size={20} className="text-gray-600" />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openMenuId === officer.officer_id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => openEditModal(officer)}
                                                        className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 text-blue-700"
                                                    >
                                                        <Edit size={16} />
                                                        Edit Officer
                                                    </button>
                                                    
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    
                                                    <button
                                                        onClick={() => openDeleteModal(officer)}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove Officer
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center p-3 text-gray-500"
                            >
                                No current officers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modals */}
            {isEditModalOpen && selectedOfficer && (
                <EditOfficerModal
                    officer={selectedOfficer}
                    closeModal={closeEditModal}
                    existingOfficers={officers}
                    showNotificationModal={showNotificationModal}
                />
            )}
            {isAddModalOpen && (
                <AddOfficerModal
                    closeModal={closeAddModal}
                    existingOfficers={officers}
                    onNotify={showNotificationModal}
                />
            )}
            
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedOfficer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-red-500 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Confirm</h2>
                            <button onClick={closeDeleteModal} className="text-white hover:text-gray-200 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 text-base mb-2">
                                        Remove <strong>{selectedOfficer.member_name}</strong> from <strong>{selectedOfficer.position}</strong>?
                                    </p>
                                    <p className="text-gray-500 text-sm">You can't undo this action.</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button onClick={closeDeleteModal} className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                                NO
                            </button>
                            <button onClick={handleDelete} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
                                YES
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </div>
    );
}
