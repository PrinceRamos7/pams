import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

export default function BulkAddMemberModal({ closeModal, batches = [] }) {
    const [isVisible, setIsVisible] = useState(false);
    const [members, setMembers] = useState([
        {
            student_id: "",
            firstname: "",
            lastname: "",
            sex: "",
            year: "",
            email: "",
            phone_number: "",
            address: "",
            batch_id: "",
        },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeModal, 400);
    };

    const addMemberRow = () => {
        setMembers([
            ...members,
            {
                student_id: "",
                firstname: "",
                lastname: "",
                sex: "",
                year: "",
                email: "",
                phone_number: "",
                address: "",
                batch_id: "",
            },
        ]);

        // Scroll to bottom after adding new member
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, 100);
    };

    const removeMemberRow = (index) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const validateField = (field, value) => {
        switch (field) {
            case "firstname":
            case "lastname":
                // No numbers allowed
                if (/\d/.test(value)) {
                    return "No numbers allowed";
                }
                break;
            case "student_id":
                // Format: XX-XXXXX
                if (value && !/^\d{2}-\d{5}$/.test(value)) {
                    return "Format must be XX-XXXXX (e.g., 20-00001)";
                }
                break;
            case "phone_number":
                // Must start with 09 and be 11 digits
                if (value && !/^09\d{9}$/.test(value)) {
                    return "Must start with 09 and be 11 digits";
                }
                break;
            case "email":
                // Basic email validation
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Invalid email format";
                }
                break;
        }
        return null;
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);

        // Validate field
        const error = validateField(field, value);
        const newErrors = { ...errors };
        const errorKey = `${index}-${field}`;

        if (error) {
            newErrors[errorKey] = error;
        } else {
            delete newErrors[errorKey];
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        // Show loading toast
        const loadingToast = toast.loading("Importing members...", {
            position: "top-right",
        });

        try {
            const response = await fetch("/members/bulk-import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ members }),
            });

            const data = await response.json();

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (data.success) {
                toast.success(
                    `Successfully imported ${members.length} member${
                        members.length > 1 ? "s" : ""
                    }!`,
                    {
                        duration: 4000,
                        position: "top-right",
                    }
                );

                // Close modal and reload after a short delay
                setTimeout(() => {
                    handleClose();
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message || "Failed to import members", {
                    duration: 5000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error importing members:", error);
            toast.dismiss(loadingToast);
            toast.error("Failed to import members. Please try again.", {
                duration: 5000,
                position: "top-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-400 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            <div
                className={`relative bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all duration-400 ease-in-out ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        Add Members
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    <div
                        ref={scrollContainerRef}
                        className="overflow-y-auto p-6 flex-1"
                    >
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 bg-gray-50"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-700">
                                            Member {index + 1}
                                        </h3>
                                        {members.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeMemberRow(index)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        {/* Row 1: Names and Student ID */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {" "}
                                                    (No numbers)
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={member.firstname}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "firstname",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                pattern="[A-Za-z\s]+"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors[`${index}-firstname`]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[`${index}-firstname`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `${index}-firstname`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {" "}
                                                    (No numbers)
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={member.lastname}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "lastname",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                pattern="[A-Za-z\s]+"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors[`${index}-lastname`]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[`${index}-lastname`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `${index}-lastname`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Student ID
                                                <span className="text-xs text-gray-500">
                                                    {" "}
                                                    (XX-XXXXX)
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={member.student_id}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "student_id",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="20-00001"
                                                pattern="\d{2}-\d{5}"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors[
                                                        `${index}-student_id`
                                                    ]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[`${index}-student_id`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `${index}-student_id`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        {/* Row 2: Sex, Year, Batch */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sex{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={member.sex}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "sex",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">
                                                    Male
                                                </option>
                                                <option value="Female">
                                                    Female
                                                </option>
                                                <option value="Others">
                                                    Others (Please Specify)
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Year{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={member.year}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "year",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                <option value="First Year">
                                                    First Year
                                                </option>
                                                <option value="Second Year">
                                                    Second Year
                                                </option>
                                                <option value="Third Year">
                                                    Third Year
                                                </option>
                                                <option value="Fourth Year">
                                                    Fourth Year
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Batch{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={member.batch_id}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "batch_id",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select</option>
                                                {batches.map((batch) => (
                                                    <option
                                                        key={batch.id}
                                                        value={batch.id}
                                                    >
                                                        {batch.year} -{" "}
                                                        {batch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {/* Row 3: Email, Phone, Address */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                                <span className="text-xs text-gray-500">
                                                    {" "}
                                                    (No duplicate)
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                value={member.email}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="email@example.com"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors[`${index}-email`]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[`${index}-email`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors[`${index}-email`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                                <span className="text-xs text-gray-500">
                                                    {" "}
                                                    (09XXXXXXXXX, No duplicate)
                                                </span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={member.phone_number}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "phone_number",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="09123456789"
                                                pattern="09\d{9}"
                                                maxLength="11"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors[
                                                        `${index}-phone_number`
                                                    ]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[
                                                `${index}-phone_number`
                                            ] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {
                                                        errors[
                                                            `${index}-phone_number`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={member.address}
                                                onChange={(e) =>
                                                    handleMemberChange(
                                                        index,
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Complete address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            onClick={addMemberRow}
                            variant="outline"
                            className="mt-4 w-full border-dashed border-2"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Another Member
                        </Button>
                    </div>

                    <div className="flex-shrink-0 bg-white border-t px-6 py-4 flex gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting
                                ? "Importing..."
                                : `Import ${members.length} Member${
                                      members.length > 1 ? "s" : ""
                                  }`}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
