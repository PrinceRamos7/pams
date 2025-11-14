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

export default function TimeIn({ event }) {
    const [studentId, setStudentId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const webcamRef = useRef(null);

    // Fetch members on mount
    React.useEffect(() => {
        fetch("/members", { headers: { Accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => {
                setMembers(data);
            })
            .catch((err) => {
                console.error("Failed to fetch members:", err);
                toast.error("Failed to load members list");
            });
    }, []);

    // Filter members based on input
    const handleStudentIdChange = (value) => {
        setStudentId(value);
        if (value.trim()) {
            const filtered = members.filter(
                (m) =>
                    m.student_id?.toLowerCase().includes(value.toLowerCase()) ||
                    `${m.firstname} ${m.lastname}`
                        .toLowerCase()
                        .includes(value.toLowerCase())
            );
            setFilteredMembers(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setShowDropdown(false);
        }
    };

    const selectMember = (member) => {
        setStudentId(member.student_id);
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("#studentId")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("attendance.index"), label: "Attendance" },
        { label: "Time In" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId) {
            toast.error("Please enter student ID.");
            return;
        }

        setIsSubmitting(true);

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
                    student_id: studentId,
                    time_in: new Date().toISOString(),
                    status: "Present",
                    photo,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Time In recorded successfully!");
                setStudentId("");
                // Stay on the same page for more entries
            } else {
                // Show validation errors if available
                if (data.errors) {
                    Object.values(data.errors).forEach((errorArray) => {
                        errorArray.forEach((error) => toast.error(error));
                    });
                } else {
                    toast.error(data.message || "Failed to record time in.");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to record time in.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Time In" />

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
                                <CardTitle className="text-green-600">Time In</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        {event.agenda}
                                    </h3>
                                    <p className="text-green-700">
                                        Date: {event.date}
                                    </p>
                                    <p className="text-green-700">
                                        Time In Period: {event.time_in} - {event.time_in && new Date(`2000-01-01T${event.time_in}`).toLocaleTimeString('en-US', { 
                                            hour: 'numeric', 
                                            minute: '2-digit',
                                            hour12: true 
                                        }).replace(/:\d{2}/, (match) => {
                                            const minutes = parseInt(match.slice(1)) + 15;
                                            return `:${minutes.toString().padStart(2, '0')}`;
                                        })}
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="relative">
                                        <label
                                            htmlFor="studentId"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Student ID or Name
                                        </label>
                                        <input
                                            id="studentId"
                                            type="text"
                                            placeholder="Search by Student ID or Name"
                                            value={studentId}
                                            onChange={(e) =>
                                                handleStudentIdChange(
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                if (
                                                    filteredMembers.length > 0
                                                ) {
                                                    setShowDropdown(true);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                            disabled={isSubmitting}
                                            autoComplete="off"
                                        />
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredMembers.map(
                                                    (member) => (
                                                        <button
                                                            key={
                                                                member.member_id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                selectMember(
                                                                    member
                                                                )
                                                            }
                                                            className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="font-medium">
                                                                {
                                                                    member.firstname
                                                                }{" "}
                                                                {
                                                                    member.lastname
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Student ID:{" "}
                                                                {
                                                                    member.student_id
                                                                }
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
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
                                            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting
                                                ? "Recording Time In..."
                                                : "Record Time In"}
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
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}