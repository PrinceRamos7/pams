import React, { useState } from "react";
import { Eye, Edit, Trash2, X } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";
import { Transition } from "@headlessui/react";

// Import modular modals
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import ViewMemberModal from "./ViewMemberModal";

export default function MemberTable({ members }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
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
    const handleAddSubmit = (e) => {
        e.preventDefault();
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

    const handleEditSubmit = (e) => {
        e.preventDefault();
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
                setTimeout(() => Inertia.visit("/members"), 1000);
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
                    <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider">
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
                                <td className="px-4 py-3 text-center space-x-2">
                                    <button
                                        onClick={() => openViewModal(m)}
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(m)}
                                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(m)}
                                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
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
