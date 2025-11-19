import React, { useState } from "react";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function AddMediaTeamModal({ isOpen, onClose, batches }) {
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
        batch_id: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Adding member...', { position: 'top-right' });

        router.post('/media-team', formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Media team member added successfully!', { position: 'top-right' });
                onClose();
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(errorMessage || 'Failed to add member. Please try again.', { position: 'top-right' });
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-purple-600 px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-bold text-white">Add Media Team Member</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name *</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name *</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Student ID</label>
                            <input
                                type="text"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                placeholder="XX-XXXXX"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sex *</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g., Director, Photographer"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g., Photography, Videography"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Year Level</label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="e.g., 3rd Year"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Batch</label>
                            <select
                                name="batch_id"
                                value={formData.batch_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select Batch</option>
                                {batches?.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="09XXXXXXXXX"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
