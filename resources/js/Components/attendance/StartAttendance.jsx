import React, { useState, useRef } from "react";
import { Transition } from "@headlessui/react";
import Webcam from "react-webcam";
import { X } from "lucide-react";

export default function StartAttendance({
    event,
    closeModal,
    onAttendanceRecorded,
}) {
    const [memberId, setMemberId] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });
    const webcamRef = useRef(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!memberId) {
            showNotification("Please enter member ID.", "error");
            return;
        }

        const photo = webcamRef.current.getScreenshot();
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch("/attendance-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    event_id: event.event_id,
                    member_id: memberId,
                    time_in: new Date().toISOString(), // ISO format
                    status: "Present", // required field
                    photo,
                }),
            });

            const data = await res.json();

            if (data.success) {
                showNotification(
                    "Attendance recorded successfully!",
                    "success"
                );
                setMemberId("");
                closeModal();
                onAttendanceRecorded?.(data.record);
            } else {
                showNotification("Failed to record attendance.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to record attendance.", "error");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Transition
                show={true}
                enter="transition duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Start Attendance</h2>
                    <p className="mb-4 text-gray-600">
                        Event:{" "}
                        <span className="font-semibold">{event.agenda}</span>
                    </p>

                    {notification.message && (
                        <div
                            className={`mb-4 px-4 py-2 rounded font-semibold text-white ${
                                notification.type === "success"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Member ID"
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                            required
                        />

                        <div className="flex justify-center">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="rounded-lg border"
                                width={250}
                                height={200}
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Time In
                        </button>
                    </form>
                </div>
            </Transition>
        </div>
    );
}
