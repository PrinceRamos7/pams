import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";

export default function AddOfficerModal({ closeModal, existingOfficers = [] }) {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        member_id: "",
        position: "",
    });

    const positions = [
        "President",
        "Vice President",
        "Treasurer",
        "Auditor",
        "Secretary",
    ];

    // Safely filter positions already taken
    const availablePositions = positions.filter(
        (pos) =>
            Array.isArray(existingOfficers) &&
            !existingOfficers.some((off) => off.position === pos)
    );

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/members");
                if (!res.ok) throw new Error("Network response not ok");
                const data = await res.json();
                setMembers(data);
            } catch (err) {
                console.error("Failed to fetch members:", err);
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
            alert("Please select a member and a position.");
            return;
        }

        // Post to backend
        Inertia.post("/officers", formData, {
            onSuccess: () => closeModal(),
            onError: (err) => {
                console.error(err);
                alert("Failed to add officer.");
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-600">
                        Add Officer
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Member Dropdown */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Member
                        </label>
                        <select
                            name="member_id"
                            value={formData.member_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select Member</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.firstname} {m.lastname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Position Dropdown */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Position
                        </label>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select Position</option>
                            {availablePositions.map((pos) => (
                                <option key={pos} value={pos}>
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Add Officer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
