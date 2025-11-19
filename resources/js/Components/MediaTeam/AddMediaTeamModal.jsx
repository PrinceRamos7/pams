import React, { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function AddMediaTeamModal({ isOpen, onClose, batches, availableMembers, hasDirector, hasManagingDirector }) {
    const [members, setMembers] = useState([{
        id: Date.now(),
        member_id: "",
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
    }]);

    const addMemberRow = () => {
        setMembers([...members, {
            id: Date.now(),
            member_id: "",
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
        }]);
    };

    const removeMemberRow = (id) => {
        if (members.length > 1) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const handleMemberSelect = (index, memberId) => {
        if (memberId) {
            const member = availableMembers.find(m => m.member_id == memberId);
            if (member) {
                const updatedMembers = [...members];
                updatedMembers[index] = {
                    ...updatedMembers[index],
                    member_id: memberId,
                    student_id: member.student_id || "",
                    firstname: member.firstname,
                    lastname: member.lastname,
                    sex: member.sex,
                    year: member.year || "",
                    email: member.email || "",
                    phone_number: member.phone_number || "",
                    address: member.address || "",
                    batch_id: member.batch_id || "",
                };
                setMembers(updatedMembers);
            }
        } else {
            const updatedMembers = [...members];
            updatedMembers[index] = {
                ...updatedMembers[index],
                member_id: "",
                student_id: "",
                firstname: "",
                lastname: "",
                sex: "",
                year: "",
                email: "",
                phone_number: "",
                address: "",
                batch_id: "",
            };
            setMembers(updatedMembers);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that all members have required fields
        const invalidMembers = members.filter(m => !m.member_id || !m.role);
        if (invalidMembers.length > 0) {
            toast.error('Please select a member and role for all entries', { position: 'top-right' });
            return;
        }

        const loadingToast = toast.loading(`Adding ${members.length} member(s)...`, { position: 'top-right' });

        // Prepare data for bulk import
        const membersData = members.map(m => ({
            student_id: m.student_id,
            firstname: m.firstname,
            lastname: m.lastname,
            sex: m.sex,
            role: m.role,
            specialization: m.specialization,
            year: m.year,
            email: m.email,
            phone_number: m.phone_number,
            address: m.address,
            batch_id: m.batch_id,
        }));

        router.post('/media-team/bulk-add', { members: membersData }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success(`Successfully added ${members.length} member(s)!`, { position: 'top-right' });
                onClose();
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(errorMessage || 'Failed to add members. Please try again.', { position: 'top-right' });
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-bold text-white">Add Media Team Members</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {members.map((member, index) => (
                            <div key={member.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-700">Member {index + 1}</h3>
                                    {members.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMemberRow(member.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1">Select Member *</label>
                                    <select
                                        value={member.member_id}
                                        onChange={(e) => handleMemberSelect(index, e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select a member --</option>
                                        {availableMembers?.map((availMember) => (
                                            <option key={availMember.member_id} value={availMember.member_id}>
                                                {availMember.firstname} {availMember.lastname} {availMember.student_id ? `(${availMember.student_id})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">First Name</label>
                                        <input
                                            type="text"
                                            value={member.firstname}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Last Name</label>
                                        <input
                                            type="text"
                                            value={member.lastname}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Student ID</label>
                                        <input
                                            type="text"
                                            value={member.student_id}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Sex</label>
                                        <input
                                            type="text"
                                            value={member.sex}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Year</label>
                                        <input
                                            type="text"
                                            value={member.year}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Batch</label>
                                        <input
                                            type="text"
                                            value={batches?.find(b => b.id == member.batch_id)?.year || ''}
                                            readOnly
                                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Role *</label>
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Role</option>
                                            {!hasDirector && <option value="Media Team Director">Media Team Director</option>}
                                            {!hasManagingDirector && <option value="Media Team Managing Director">Media Team Managing Director</option>}
                                            <option value="Media Team Member">Media Team Member</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Specialization</label>
                                        <input
                                            type="text"
                                            value={member.specialization}
                                            onChange={(e) => handleFieldChange(index, 'specialization', e.target.value)}
                                            placeholder="e.g., Photography"
                                            className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addMemberRow}
                        className="w-full mt-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Another Member
                    </button>

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
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add {members.length} Member{members.length > 1 ? 's' : ''}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
