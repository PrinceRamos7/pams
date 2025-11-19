import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";

export default function EditOfficerModal({ officer, closeModal, showNotificationToast, existingOfficers = [] }) {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        member_id: officer.member_id || "",
    });

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/members", {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                if (!res.ok) throw new Error("Network response not ok");
                const data = await res.json();
                
                if (data.data && Array.isArray(data.data)) {
                    setMembers(data.data);
                } else if (Array.isArray(data)) {
                    setMembers(data);
                } else {
                    setMembers([]);
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
                setMembers([]);
            }
        };
        fetchMembers();
    }, []);

    // Filter members who don't already have an officer position (excluding current officer's member)
    const availableMembers = members.filter((member) => {
        if (!Array.isArray(existingOfficers) || existingOfficers.length === 0) {
            return true;
        }
        // Allow current member or members without officer positions
        return member.member_id === officer.member_id || 
               !existingOfficers.some((off) => off.member_id === member.member_id);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.member_id) {
            showNotificationToast("Please select a member.", "error");
            return;
        }

        router.put(`/officers/${officer.officer_id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setTimeout(() => {
                    showNotificationToast("Officer updated successfully!", "success");
                }, 100);
            },
            onError: (errors) => {
                closeModal();
                setTimeout(() => {
                    const errorMessage = errors.member_id || "Failed to update officer. Please try again.";
                    showNotificationToast(errorMessage, "error");
                }, 100);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-500 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Edit Officer</h2>
                    <button
                        onClick={closeModal}
                        className="text-white hover:text-gray-200 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Member Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="member_id"
                                value={formData.member_id}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
                            >
                                <option value="">Select Member</option>
                                {availableMembers.map((m) => (
                                    <option key={m.member_id} value={m.member_id}>
                                        {m.firstname} {m.lastname} ({m.student_id})
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                        </label>
                        <input
                            type="text"
                            value={officer.position}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="px-6 pb-6 flex justify-end gap-3">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
