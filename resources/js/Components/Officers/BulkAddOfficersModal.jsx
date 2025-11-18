import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import NotificationModal from "../NotificationModal";

export default function BulkAddOfficersModal({
    closeModal,
    existingOfficers = [],
    onNotify,
}) {
    const [members, setMembers] = useState([]);
    const [batches, setBatches] = useState([]);
    const [batchName, setBatchName] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [createNewBatch, setCreateNewBatch] = useState(false);
    const [officers, setOfficers] = useState([
        { id: 1, member_id: "", position: "" },
    ]);
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
    });

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message,
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

    const multiMemberPositions = [
        "Public Information Officer (PIO)",
        "Business Manager",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch members
                const membersRes = await fetch("/members", {
                    headers: { Accept: "application/json" },
                });
                if (membersRes.ok) {
                    const membersData = await membersRes.json();
                    if (membersData.data && Array.isArray(membersData.data)) {
                        setMembers(membersData.data);
                    } else if (Array.isArray(membersData)) {
                        setMembers(membersData);
                    }
                }

                // Fetch batches
                const batchesRes = await fetch("/batches", {
                    headers: { Accept: "application/json" },
                });
                if (batchesRes.ok) {
                    const batchesData = await batchesRes.json();
                    setBatches(Array.isArray(batchesData) ? batchesData : []);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    const addOfficerRow = () => {
        setOfficers([
            ...officers,
            { id: Date.now(), member_id: "", position: "" },
        ]);
    };

    const removeOfficerRow = (id) => {
        if (officers.length > 1) {
            setOfficers(officers.filter((officer) => officer.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        setOfficers(
            officers.map((officer) =>
                officer.id === id ? { ...officer, [field]: value } : officer
            )
        );
    };

    const getAvailableMembers = (currentOfficerId) => {
        // Get members already selected in the form
        const selectedMemberIds = officers
            .filter((o) => o.id !== currentOfficerId && o.member_id)
            .map((o) => parseInt(o.member_id));

        // Get members who already have officer positions
        const existingOfficerMemberIds = Array.isArray(existingOfficers)
            ? existingOfficers.map((o) => o.member_id)
            : [];

        return members.filter(
            (member) =>
                !selectedMemberIds.includes(member.member_id) &&
                !existingOfficerMemberIds.includes(member.member_id)
        );
    };

    const getAvailablePositions = (currentOfficerId) => {
        // Get positions already selected in the form
        const selectedPositions = officers
            .filter((o) => o.id !== currentOfficerId && o.position)
            .map((o) => o.position);

        // Count existing positions
        const existingPositionCounts = {};
        if (Array.isArray(existingOfficers)) {
            existingOfficers.forEach((officer) => {
                existingPositionCounts[officer.position] =
                    (existingPositionCounts[officer.position] || 0) + 1;
            });
        }

        // Count selected positions in form
        selectedPositions.forEach((pos) => {
            existingPositionCounts[pos] =
                (existingPositionCounts[pos] || 0) + 1;
        });

        return positions.filter((pos) => {
            const count = existingPositionCounts[pos] || 0;
            if (multiMemberPositions.includes(pos)) {
                return count < 2;
            }
            return count === 0;
        });
    };

    const validateForm = () => {
        // Check batch selection
        if (!createNewBatch && !selectedBatchId) {
            showNotificationModal(
                "Batch Required",
                "Please select an existing batch or create a new one.",
                "error"
            );
            return false;
        }

        if (createNewBatch && !batchName.trim()) {
            showNotificationModal(
                "Batch Name Required",
                "Please enter a batch name.",
                "error"
            );
            return false;
        }

        // Check if all fields are filled
        for (const officer of officers) {
            if (!officer.member_id || !officer.position) {
                showNotificationModal(
                    "Incomplete Form",
                    "Please fill in all member and position fields.",
                    "error"
                );
                return false;
            }
        }

        // Check for duplicate members
        const memberIds = officers.map((o) => o.member_id);
        const uniqueMemberIds = new Set(memberIds);
        if (memberIds.length !== uniqueMemberIds.size) {
            showNotificationModal(
                "Duplicate Members",
                "Each member can only be assigned once.",
                "error"
            );
            return false;
        }

        // Check for duplicate positions (except multi-member positions)
        const positionCounts = {};
        officers.forEach((o) => {
            positionCounts[o.position] = (positionCounts[o.position] || 0) + 1;
        });

        for (const [position, count] of Object.entries(positionCounts)) {
            if (multiMemberPositions.includes(position)) {
                if (count > 2) {
                    showNotificationModal(
                        "Too Many Assignments",
                        `${position} can only have up to 2 members.`,
                        "error"
                    );
                    return false;
                }
            } else {
                if (count > 1) {
                    showNotificationModal(
                        "Duplicate Position",
                        `${position} can only be assigned to one member.`,
                        "error"
                    );
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Prepare data for bulk insert
        const officersData = officers.map((o) => ({
            member_id: parseInt(o.member_id),
            position: o.position,
        }));

        const requestData = {
            officers: officersData,
            batch_id: createNewBatch ? null : parseInt(selectedBatchId),
            batch_name: createNewBatch ? batchName.trim() : null,
        };

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/officers/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                closeModal();
                setTimeout(() => {
                    if (onNotify) {
                        onNotify(
                            "Success!",
                            `${result.count} officer(s) added successfully!`,
                            "success"
                        );
                    }
                    // Reload the page to show new officers
                    window.location.reload();
                }, 100);
            } else {
                showNotificationModal(
                    "Error",
                    result.message || "Failed to add officers.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error adding officers:", error);
            showNotificationModal(
                "Error",
                "An error occurred while adding officers.",
                "error"
            );
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto pt-10">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                            Add Officers
                        </h2>
                        <button
                            onClick={closeModal}
                            className="text-white hover:text-gray-200 transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Add multiple officers at once. Each member can
                                only hold one position.
                            </p>
                        </div>

                        {/* Batch Selection */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Batch Information
                            </h3>

                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!createNewBatch}
                                        onChange={() =>
                                            setCreateNewBatch(false)
                                        }
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm font-medium">
                                        Select Existing Batch
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={createNewBatch}
                                        onChange={() => setCreateNewBatch(true)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm font-medium">
                                        Create New Batch
                                    </span>
                                </label>
                            </div>

                            {!createNewBatch ? (
                                <select
                                    value={selectedBatchId}
                                    onChange={(e) =>
                                        setSelectedBatchId(e.target.value)
                                    }
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name}{" "}
                                            {batch.year
                                                ? `(${batch.year})`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={batchName}
                                    onChange={(e) =>
                                        setBatchName(e.target.value)
                                    }
                                    placeholder="Enter batch name (e.g., Batch 2024-2025)"
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            )}
                        </div>

                        {/* Officers List */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {officers.map((officer, index) => (
                                <div
                                    key={officer.id}
                                    className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>

                                    {/* Member Select */}
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Member
                                        </label>
                                        <select
                                            value={officer.member_id}
                                            onChange={(e) =>
                                                handleChange(
                                                    officer.id,
                                                    "member_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                Select Member
                                            </option>
                                            {getAvailableMembers(
                                                officer.id
                                            ).map((m) => (
                                                <option
                                                    key={m.member_id}
                                                    value={m.member_id}
                                                >
                                                    {m.firstname} {m.lastname} (
                                                    {m.student_id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Position Select */}
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Position
                                        </label>
                                        <select
                                            value={officer.position}
                                            onChange={(e) =>
                                                handleChange(
                                                    officer.id,
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                Select Position
                                            </option>
                                            {getAvailablePositions(
                                                officer.id
                                            ).map((pos) => (
                                                <option key={pos} value={pos}>
                                                    {pos}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeOfficerRow(officer.id)
                                        }
                                        disabled={officers.length === 1}
                                        className={`flex-shrink-0 mt-6 p-2 rounded-lg transition ${
                                            officers.length === 1
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-red-100 text-red-600 hover:bg-red-200"
                                        }`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add More Button */}
                        <button
                            type="button"
                            onClick={addOfficerRow}
                            className="mt-4 w-full py-3 border-2 border-dashed border-blue-400 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Add Another Officer
                        </button>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
                            >
                                Add {officers.length} Officer
                                {officers.length > 1 ? "s" : ""}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() =>
                    setNotificationModal({
                        ...notificationModal,
                        isOpen: false,
                    })
                }
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </>
    );
}
