import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditMemberModal({
    formData,
    handleChange,
    handleSubmit,
    closeModal,
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeModal, 400); // Match duration with transition
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-400 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden transform transition-transform duration-400 ease-in-out ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Left Column */}
                <div className="w-1/2 p-6 space-y-4">
                    <h2 className="text-xl font-bold text-blue-600">
                        Edit Member
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                label: "Student ID",
                                name: "student_id",
                                type: "text",
                                required: true,
                            },
                            {
                                label: "First Name",
                                name: "firstname",
                                type: "text",
                                required: true,
                            },
                            {
                                label: "Last Name",
                                name: "lastname",
                                type: "text",
                                required: true,
                            },
                            {
                                label: "Sex",
                                name: "sex",
                                type: "select",
                                options: ["Male", "Female", "Others"],
                                required: true,
                            },
                            { label: "Age", name: "age", type: "number" },
                            {
                                label: "Birthdate",
                                name: "birthdate",
                                type: "date",
                            },
                            {
                                label: "Year",
                                name: "year",
                                type: "select",
                                options: [
                                    "First Year",
                                    "Second Year",
                                    "Third Year",
                                    "Fourth Year",
                                ],
                            },
                            {
                                label: "Status",
                                name: "status",
                                type: "select",
                                options: ["Active", "Inactive"],
                                required: true,
                            },
                        ].map((field) => (
                            <div
                                key={field.name}
                                className={
                                    field.name === "student_id"
                                        ? "col-span-2"
                                        : ""
                                }
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label}{" "}
                                    {field.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    >
                                        <option value="">
                                            Select {field.label}
                                        </option>
                                        {field.options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/2 p-6 bg-blue-600 text-white space-y-4">
                    <h2 className="text-xl font-bold">Contact Details</h2>
                    {[
                        { label: "Phone", name: "phone_number", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Address", name: "address", type: "text" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-white sm:text-sm"
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="absolute bottom-6 right-6 flex space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white bg-gray-400 rounded-full p-1 hover:bg-gray-500 transition"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
