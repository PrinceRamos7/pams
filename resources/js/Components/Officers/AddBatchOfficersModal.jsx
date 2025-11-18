import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AddBatchOfficersModal({ isOpen, onClose, onSuccess }) {
    const [isVisible, setIsVisible] = useState(false);
    const [batchName, setBatchName] = useState("");
    const [officers, setOfficers] = useState([
        { position: "", member_name: "", student_id: "", sex: "", status: "Alumni" }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = ["Alumni", "Active", "Inactive"];
    const sexOptions = ["Male", "Female", "Others"];

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
    const multiMemberPositions = ["Business Manager", "Public Information Officer (PIO)"];

    // Get available positions for a specific officer row
    const getAvailablePositions = (currentIndex) => {
        // Count how many times each position is used (excluding current row)
        const positionCounts = {};
        officers.forEach((officer, index) => {
            if (index !== currentIndex && officer.position) {
                positionCounts[officer.position] = (positionCounts[officer.position] || 0) + 1;
            }
        });

        // Filter positions based on availability
        return positions.filter(position => {
            const count = positionCounts[position] || 0;
            if (multiMemberPositions.includes(position)) {
                return count < 2; // Can have up to 2
            }
            return count === 0; // Can only have 1
        });
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const addOfficerRow = () => {
        setOfficers([
            ...officers,
            { position: "", member_name: "", student_id: "", sex: "", status: "Alumni" }
        ]);
    };

    const removeOfficerRow = (index) => {
        if (officers.length > 1) {
            setOfficers(officers.filter((_, i) => i !== index));
        }
    };

    const updateOfficer = (index, field, value) => {
        const updated = [...officers];
        
        // If updating position, check for duplicates
        if (field === "position" && value) {
            const positionCount = officers.filter((o, i) => i !== index && o.position === value).length;
            
            if (multiMemberPositions.includes(value)) {
                if (positionCount >= 2) {
                    toast.error(`${value} can only have 2 members maximum`);
                    return;
                }
            } else {
                if (positionCount >= 1) {
                    toast.error(`${value} is already assigned to another officer`);
                    return;
                }
            }
        }
        
        // If updating member name, check if member already has a position
        if (field === "member_name" && value.trim()) {
            const memberExists = officers.some((o, i) => 
                i !== index && 
                o.member_name.trim().toLowerCase() === value.trim().toLowerCase()
            );
            
            if (memberExists) {
                toast.error(`${value} already has a position assigned`);
                return;
            }
        }
        
        updated[index][field] = value;
        setOfficers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!batchName.trim()) {
            toast.error("Please enter a batch name");
            return;
        }

        const invalidOfficers = officers.filter(
            (o) => !o.position || !o.member_name.trim()
        );
        if (invalidOfficers.length > 0) {
            toast.error("Please fill in all officer positions and member names");
            return;
        }

        // Check for duplicate member names
        const memberNames = officers.map(o => o.member_name.trim().toLowerCase());
        const duplicateMembers = memberNames.filter((name, index) => 
            memberNames.indexOf(name) !== index
        );
        if (duplicateMembers.length > 0) {
            toast.error("A member cannot have multiple positions. Please check for duplicate names.");
            return;
        }

        // Check for duplicate positions (except multi-member positions)
        const positionCounts = {};
        officers.forEach(o => {
            positionCounts[o.position] = (positionCounts[o.position] || 0) + 1;
        });
        
        for (const [position, count] of Object.entries(positionCounts)) {
            if (multiMemberPositions.includes(position)) {
                if (count > 2) {
                    toast.error(`${position} can only have 2 members maximum`);
                    return;
                }
            } else {
                if (count > 1) {
                    toast.error(`${position} can only be assigned to one officer`);
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/officers/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    batch_name: batchName,
                    officers: officers.map((o) => ({
                        position: o.position,
                        member_name: o.member_name,
                        student_id: o.student_id || null,
                        sex: o.sex || null,
                        status: o.status,
                    })),
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                resetForm();
                onClose();
                // Reload the page to show new data
                window.location.reload();
            } else {
                toast.error(data.message || "Failed to add batch officers");
                if (data.errors && data.errors.length > 0) {
                    data.errors.forEach((error) => toast.error(error));
                }
            }
        } catch (error) {
            console.error("Error adding batch officers:", error);
            toast.error("An error occurred while adding batch officers");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setBatchName("");
        setOfficers([
            { position: "", member_name: "", student_id: "", sex: "", status: "Alumni" }
        ]);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            resetForm();
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? "bg-opacity-50" : "bg-opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-2xl font-bold text-white">
                        Add Batch Officers
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[75vh]">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="space-y-6">
                            {/* Batch Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                    placeholder="e.g., Batch 2023-2024"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Officers List */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Officers
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addOfficerRow}
                                        className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Officer
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                                    <div className="grid grid-cols-12 gap-2 px-3 pb-2 text-xs font-semibold text-gray-600 border-b">
                                        <div className="col-span-3">Position</div>
                                        <div className="col-span-3">Member Name</div>
                                        <div className="col-span-2">Student ID</div>
                                        <div className="col-span-1">Sex</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    {officers.map((officer, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-2 items-center p-3 bg-white rounded-lg border"
                                        >
                                            {/* Position */}
                                            <div className="col-span-3">
                                                <select
                                                    value={officer.position}
                                                    onChange={(e) =>
                                                        updateOfficer(index, "position", e.target.value)
                                                    }
                                                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select Position</option>
                                                    {/* Show current position even if taken */}
                                                    {officer.position && !getAvailablePositions(index).includes(officer.position) && (
                                                        <option value={officer.position}>{officer.position}</option>
                                                    )}
                                                    {/* Show available positions */}
                                                    {getAvailablePositions(index).map((pos) => (
                                                        <option key={pos} value={pos}>
                                                            {pos}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Member Name (Typable) */}
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    value={officer.member_name}
                                                    onChange={(e) =>
                                                        updateOfficer(index, "member_name", e.target.value)
                                                    }
                                                    placeholder="Enter full name"
                                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            {/* Student ID (Optional) */}
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    value={officer.student_id}
                                                    onChange={(e) =>
                                                        updateOfficer(index, "student_id", e.target.value)
                                                    }
                                                    placeholder="XX-XXXXX"
                                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Sex Dropdown */}
                                            <div className="col-span-1">
                                                <select
                                                    value={officer.sex}
                                                    onChange={(e) =>
                                                        updateOfficer(index, "sex", e.target.value)
                                                    }
                                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">-</option>
                                                    {sexOptions.map((sex) => (
                                                        <option key={sex} value={sex}>
                                                            {sex.charAt(0)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Status Dropdown */}
                                            <div className="col-span-2">
                                                <select
                                                    value={officer.status}
                                                    onChange={(e) =>
                                                        updateOfficer(index, "status", e.target.value)
                                                    }
                                                    className={`w-full px-2 py-1.5 text-xs border rounded-md text-center font-medium focus:ring-2 focus:ring-blue-500 ${
                                                        officer.status === "Alumni"
                                                            ? "bg-purple-100 text-purple-700 border-purple-200"
                                                            : officer.status === "Active"
                                                            ? "bg-green-100 text-green-700 border-green-200"
                                                            : "bg-gray-100 text-gray-700 border-gray-200"
                                                    }`}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Remove Button */}
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeOfficerRow(index)}
                                                    disabled={officers.length === 1}
                                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Sticky at bottom */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Adding..." : "Add Batch Officers"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
