import React, { useState, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import Webcam from "react-webcam";
import { Toaster, toast } from "react-hot-toast";

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

export default function TimeOut({ event, membersWithTimeIn }) {
    const [selectedMember, setSelectedMember] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const webcamRef = useRef(null);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "Time Out" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMember) {
            toast.error("Please select a member to time out.");
            return;
        }

        setIsSubmitting(true);

        const photo = webcamRef.current.getScreenshot();
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            // Update the existing attendance record with time_out
            const res = await fetch(`/attendance-records/${selectedMember}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    time_out: new Date().toISOString(),
                    photo_out: photo, // Optional: separate photo for time out
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Time Out recorded successfully!");
                setSelectedMember("");
                // Refresh the page to update the list
                window.location.reload();
            } else {
                toast.error(data.message || "Failed to record time out.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to record time out.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Time Out" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">Time Out</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h3 className="font-semibold text-red-800 mb-2">
                                        {event.agenda}
                                    </h3>
                                    <p className="text-red-700">
                                        Date: {event.date}
                                    </p>
                                    <p className="text-red-700">
                                        Time Out Period: {event.time_out} - {event.time_out && new Date(`2000-01-01T${event.time_out}`).toLocaleTimeString('en-US', { 
                                            hour: 'numeric', 
                                            minute: '2-digit',
                                            hour12: true 
                                        }).replace(/:\d{2}/, (match) => {
                                            const minutes = parseInt(match.slice(1)) + 15;
                                            return `:${minutes.toString().padStart(2, '0')}`;
                                        })}
                                    </p>
                                </div>

                                {membersWithTimeIn.length > 0 ? (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex flex-col gap-6"
                                    >
                                        <div>
                                            <label
                                                htmlFor="memberSelect"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Select Member to Time Out
                                            </label>
                                            <select
                                                id="memberSelect"
                                                value={selectedMember}
                                                onChange={(e) =>
                                                    setSelectedMember(e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <option value="">
                                                    Choose a member...
                                                </option>
                                                {membersWithTimeIn.map((record) => (
                                                    <option
                                                        key={record.record_id}
                                                        value={record.record_id}
                                                    >
                                                        {record.member?.firstname}{" "}
                                                        {record.member?.lastname} ({record.member?.student_id}) - 
                                                        Timed in at {new Date(record.time_in).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Camera
                                            </label>
                                            <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    className="rounded-lg border border-gray-300"
                                                    width={400}
                                                    height={300}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting
                                                    ? "Recording Time Out..."
                                                    : "Record Time Out"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        route("attendance.index")
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg mb-4">
                                            No members have timed in yet for this event.
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route("attendance-records.time-in", event.event_id)
                                                )
                                            }
                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                                        >
                                            Go to Time In
                                        </button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}