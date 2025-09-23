import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ViewMemberModal({ member, closeModal }) {
    const formatLabel = (key) =>
        key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const fields = [
        "student_id",
        "firstname",
        "lastname",
        "sex",
        "age",
        "birthdate",
        "phone_number",
        "email",
        "address",
        "year",
        "status",
    ];

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeModal, 400);
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

            {/* Side Modal */}
            <div
                className={`relative w-96 bg-gray-900 text-gray-200 shadow-2xl max-h-full overflow-y-auto transform transition-transform duration-400 ease-in-out rounded-xl ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-blue-500 sticky top-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl shadow-md z-10">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        Member Details
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 transition p-1 rounded-full hover:bg-blue-500/30"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 text-sm">
                    {fields.map((key) => (
                        <div
                            key={key}
                            className="flex items-center hover:bg-blue-500/10 rounded-lg p-2 transition"
                        >
                            <div className="w-1/3 text-blue-400 font-medium">
                                {formatLabel(key)}:
                            </div>
                            <div className="w-2/3">{member[key] || "-"}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
