import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";
import NotificationModal from "../NotificationModal";

export default function AddOfficerModal({ closeModal, existingOfficers = [], onNotify }) {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        member_id: "",
        position: "",
    });
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const positions = [
        "President",
        "Vice President - Internal",
        "Vice President - External",
        "Secretary",
        "Treasurer",
        "Auditor",
        "Business Manager",
        "Public Information Officer (PIO)",
        "Attendance Officer",
        "PITON Representative",
        "Media Team Director",
        "Media Team Managing Director",
    ];

    // Positions that can have 2 members
    const multiMemberPositions = ["Public Information Officer (PIO)", "Business Manager"];

    // Filter positions based on availability
    const availablePositions = positions.filter((pos) => {
        if (!Array.isArray(existingOfficers) || existingOfficers.length === 0) {
            return true;
        }
        
        const positionCount = existingOfficers.filter((off) => off.position === pos).length;
        
        // PIO and Business Manager can have 2 members
        if (multiMemberPositions.includes(pos)) {
            return positionCount < 2;
        }
        
        // All other positions can only have 1 member
        return positionCount === 0;
    });
    
    // Filter members who don't already have an officer position
    const availableMembers = members.filter((member) => {
        if (!Array.isArray(existingOfficers) || existingOfficers.length === 0) {
            return true;
        }
        // Each member can only hold one position
        return !existingOfficers.some((off) => off.member_id === member.member_id);
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
                console.log('Fetched members:', data);
                
                // Check if data is paginated
                if (data.data && Array.isArray(data.data)) {
                    setMembers(data.data);
                } else if (Array.isArray(data)) {
                    setMembers(data);
                } else {
                    console.error('Unexpected data format:', data);
                    setMembers([]);
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
                setMembers([]);
            }
        };
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.member_id || !formData.position) {
            showNotificationModal("Validation Error", "Please select a member and a position.", "error");
            return;
        }

        // Check position availability
        if (Array.isArray(existingOfficers)) {
            const positionCount = existingOfficers.filter((off) => off.position === formData.position).length;
            
            // Check if position is full
            if (multiMemberPositions.includes(formData.position)) {
                if (positionCount >= 2) {
                    showNotificationModal(
                        "Position Full", 
                        `The ${formData.position} position already has 2 members assigned.`, 
                        "error"
                    );
                    return;
                }
            } else {
                if (positionCount >= 1) {
                    showNotificationModal(
                        "Position Taken", 
                        `The ${formData.position} position is already assigned to another officer.`, 
                        "error"
                    );
                    return;
                }
            }
            
            // Check if member already has an officer position
            const memberIsOfficer = existingOfficers.some((off) => off.member_id === parseInt(formData.member_id));
            if (memberIsOfficer) {
                showNotificationModal(
                    "Member Already Officer", 
                    "This member already holds an officer position. Each member can only have one position.", 
                    "error"
                );
                return;
            }
        }

        // Post to backend
        router.post("/officers", formData, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setTimeout(() => {
                    if (onNotify) {
                        onNotify("Success!", "Officer added successfully!", "success");
                    }
                }, 100);
            },
            onError: (errors) => {
                console.error(errors);
                closeModal();
                setTimeout(() => {
                    let errorMessage = "Failed to add officer. Please try again.";
                    
                    if (errors && typeof errors === 'object') {
                        if (errors.position) {
                            errorMessage = Array.isArray(errors.position) ? errors.position[0] : errors.position;
                        } else if (errors.member_id) {
                            errorMessage = Array.isArray(errors.member_id) ? errors.member_id[0] : errors.member_id;
                        }
                    }
                    
                    if (onNotify) {
                        onNotify("Error!", errorMessage, "error");
                    }
                }, 100);
            },
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                            Add Officer
                        </h2>
                        <button
                            onClick={closeModal}
                            className="text-white hover:text-gray-200 transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Member Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Member <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="member_id"
                                    value={formData.member_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white cursor-pointer"
                                    style={{ backgroundImage: 'none' }}
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
                            <p className="text-xs text-gray-500 mt-1">
                                {availableMembers.length} members available (members without officer positions)
                            </p>
                        </div>

                        {/* Position Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white cursor-pointer"
                                    style={{ backgroundImage: 'none' }}
                                >
                                    <option value="">Select Position</option>
                                    {availablePositions.map((pos) => (
                                        <option key={pos} value={pos}>
                                            {pos}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {availablePositions.length} positions available
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                            >
                                Add Officer
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
