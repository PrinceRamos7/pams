import React, { useState } from "react";
import { Edit, Plus } from "lucide-react";
import EditOfficerModal from "./EditOfficerModal";
import AddOfficerModal from "./AddOfficerModal";

export default function OfficerTable({ officers }) {
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const openEditModal = (officer) => {
        setSelectedOfficer(officer);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedOfficer(null);
        setIsEditModalOpen(false);
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
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
                                    <button
                                        onClick={() => openEditModal(officer)}
                                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                                    >
                                        <Edit size={20} />
                                    </button>
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
                />
            )}
            {isAddModalOpen && (
                <AddOfficerModal
                    closeModal={closeAddModal}
                    existingOfficers={officers}
                />
            )}
        </div>
    );
}
