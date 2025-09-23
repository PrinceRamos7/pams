import React, { useState } from "react";
import { X } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";

export default function EditOfficerModal({ officer, closeModal }) {
    const [formData, setFormData] = useState({
        position: officer.position || "",
        batch_name: officer.batch_name || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        Inertia.put(`/officers/${officer.officer_id}`, formData, {
            onSuccess: () => closeModal(),
            onError: () => alert("Failed to update officer."),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-600">
                        Edit Officer
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Position
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Batch Name
                        </label>
                        <input
                            type="text"
                            name="batch_name"
                            value={formData.batch_name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
