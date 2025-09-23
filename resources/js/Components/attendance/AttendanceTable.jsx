import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, X } from "lucide-react";
import { Transition } from "@headlessui/react";
import StartAttendance from "./StartAttendance";

export default function AttendanceTable() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ date: "", agenda: "" });
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetch("/attendance-events", { headers: { Accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(() => showNotification("Failed to fetch events", "error"));
    }, []);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.agenda) {
            showNotification("Please fill all required fields.", "error");
            return;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch("/attendance-events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setEvents((prev) => [data.event, ...prev]);
                setFormData({ date: "", agenda: "" });
                showNotification(data.message, "success");
            } else {
                showNotification("Failed to add event.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to add event.", "error");
        }
    };

    const handleAttendanceRecorded = (record) => {
        showNotification(
            `Attendance recorded for Member ID: ${record.member_id}`,
            "success"
        );
    };

    return (
        <>
            {/* Notification Toast */}
            <div className="fixed top-4 right-4 z-50">
                <Transition
                    show={!!notification.message}
                    enter="transform transition duration-300"
                    enterFrom="translate-x-full opacity-0"
                    enterTo="translate-x-0 opacity-100"
                    leave="transform transition duration-300"
                    leaveFrom="translate-x-0 opacity-100"
                    leaveTo="translate-x-full opacity-0"
                >
                    <div
                        className={`px-4 py-2 rounded-lg font-semibold shadow-lg text-white ${
                            notification.type === "success"
                                ? "bg-green-600"
                                : "bg-red-600"
                        }`}
                    >
                        {notification.message}
                    </div>
                </Transition>
            </div>

            {/* Add Event Form */}
            <form
                onSubmit={handleAddEvent}
                className="mb-4 flex flex-col md:flex-row gap-2 items-end"
            >
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Agenda</label>
                    <input
                        type="text"
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleChange}
                        placeholder="Event description"
                        className="px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Add Event
                </button>
            </form>

            {/* Events Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Date
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                Agenda
                            </th>
                            <th className="px-4 py-3 border-b-2 border-gray-200 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr
                                    key={event.event_id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3">{event.date}</td>
                                    <td className="px-4 py-3">
                                        {event.agenda}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-2">
                                        <button
                                            onClick={() =>
                                                showNotification(
                                                    `Viewing: ${event.agenda}`
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                showNotification(
                                                    `Editing: ${event.agenda}`
                                                )
                                            }
                                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                showNotification(
                                                    `Deleted: ${event.agenda}`
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedEvent(event)
                                            }
                                            className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-100"
                                        >
                                            Start
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-3 text-center text-gray-500"
                                >
                                    No events yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Start Attendance Modal */}
            {selectedEvent && (
                <StartAttendance
                    event={selectedEvent}
                    closeModal={() => setSelectedEvent(null)}
                    onAttendanceRecorded={handleAttendanceRecorded}
                />
            )}
        </>
    );
}
