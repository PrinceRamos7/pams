import React, { useState } from "react";
import { Edit, Trash2, X, MoreVertical } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function MediaTeamTable({ mediaTeam }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [formData, setFormData] = useState({
        student_id: "",
        firstname: "",
        lastname: "",
        sex: "",
        role: "",
        specialization: "",
        year: "",
        email: "",
        phone_number: "",
        address: "",
        status: "Active",
        batch_id: "",
    });

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const openEditModal = (member) => {
        setSelectedMember(member);
        setFormData({
            student_id: member.student_id || "",
            firstname: member.firstname,
            lastname: member.lastname,
            sex: member.sex,
            role: member.role || "",
            specialization: member.specialization || "",
            year: member.year || "",
            email: member.email || "",
            phone_number: member.phone_number || "",
            address: member.address || "",
            status: member.status,
            batch_id: member.batch_id || "",
        });
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    };

    const closeEditModal = () => {
        setSelectedMember(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
        setOpenMenuId(null);
    };

    const closeDeleteModal = () => {
        setSelectedMember(null);
        setIsDeleteModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Updating...', { position: 'top-right' });

        router.put(`/media-team/${selectedMember.media_team_id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                closeEditModal();
                toast.success('Media team member updated successfully!', { position: 'top-right' });
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Failed to update. Please try again.', { position: 'top-right' });
            },
        });
    };

    const handleDelete = () => {
        const loadingToast = toast.loading('Deleting...', { position: 'top-right' });

        router.delete(`/media-team/${selectedMember.media_team_id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                closeDeleteModal();
                toast.success('Media team member deleted successfully!', { position: 'top-right' });
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Failed to delete. Please try again.', { position: 'top-right' });
            },
        });
    };

    return (
        <div className="mt-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr className="text-left font-semibold">
                            <th className="p-3">Name</th>
                            <th className="p-3">Student ID</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Specialization</th>
                            <th className="p-3">Year Level</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mediaTeam && mediaTeam.length > 0 ? (
                            mediaTeam.map((member) => (
                                <tr key={member.media_team_id} className="hover:bg-gray-50 border-b">
                                    <td className="p-3">{member.firstname} {member.lastname}</td>
                                    <td className="p-3">{member.student_id || 'N/A'}</td>
                                    <td className="p-3">{member.role || '-'}</td>
                                    <td className="p-3">{member.specialization || '-'}</td>
                                    <td className="p-3">{member.year || '-'}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => toggleMenu(member.media_team_id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <MoreVertical size={20} className="text-gray-600" />
                                            </button>

                                            {openMenuId === member.media_team_id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                                                    <button
                                                        onClick={() => openEditModal(member)}
                                                        className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 text-blue-700"
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(member)}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-8 text-gray-500">
                                    No media team members found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
                            <h2 className="text-xl font-bold text-white">Edit Media Team Member</h2>
                            <button onClick={closeEditModal} className="text-white hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name *</label>
                                    <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Student ID</label>
                                    <input type="text" name="student_id" value={formData.student_id} onChange={handleChange} placeholder="XX-XXXXX" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sex *</label>
                                    <select name="sex" value={formData.sex} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Year Level</label>
                                    <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 3rd Year" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="09XXXXXXXXX" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Batch</label>
                                    <input type="text" name="batch_id" value={formData.batch_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role *</label>
                                    <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Role</option>
                                        <option value="Media Team Director">Media Team Director</option>
                                        <option value="Media Team Managing Director">Media Team Managing Director</option>
                                        <option value="Media Team Member">Media Team Member</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Specialization</label>
                                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g., Photography, Videography" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status *</label>
                                    <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeEditModal} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <div className="bg-red-500 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
                            <button onClick={closeDeleteModal} className="text-white hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Delete <strong>{selectedMember.firstname} {selectedMember.lastname}</strong>?
                            </p>
                            <p className="text-sm text-gray-500">This action cannot be undone.</p>
                        </div>
                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button onClick={closeDeleteModal} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={handleDelete} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
