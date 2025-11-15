import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function EditEventModal({ event, isOpen, onClose, showNotificationModal }) {
    const [formData, setFormData] = useState({
        date: "",
        agenda: "",
        time_in: "",
        time_out: "",
    });

    // Update form data when event changes
    useEffect(() => {
        if (event) {
            setFormData({
                date: event.date || "",
                agenda: event.agenda || "",
                time_in: event.time_in || "",
                time_out: event.time_out || "",
            });
        }
    }, [event]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const response = await fetch(`/attendance-events/${event.event_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ ...formData, _method: 'PUT' }),
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                showNotificationModal("Success!", "Event updated successfully", "success");
                setTimeout(() => router.reload(), 1500);
            } else {
                showNotificationModal("Error!", data.message || "Failed to update event", "error");
            }
        } catch (error) {
            console.error("Failed to update event:", error);
            showNotificationModal("Error!", "Failed to update event", "error");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Event</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Name
                        </label>
                        <input
                            type="text"
                            name="agenda"
                            value={formData.agenda}
                            onChange={handleChange}
                            placeholder="e.g., Morning Meeting"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Time In */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time In
                        </label>
                        <input
                            type="time"
                            name="time_in"
                            value={formData.time_in}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Time Out */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Out
                        </label>
                        <input
                            type="time"
                            name="time_out"
                            value={formData.time_out}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                    >
                        Update Event
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
