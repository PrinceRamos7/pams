import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function AttendanceTable({ members, attendances }) {
    const [formData, setFormData] = useState(
        members.reduce((acc, member) => {
            const attendance = attendances[member.id] || {};
            acc[member.id] = {
                status: attendance.status || "",
                agenda: attendance.agenda || "",
                time_in: attendance.time_in || "",
                time_out: attendance.time_out || "",
            };
            return acc;
        }, {})
    );

    const handleChange = (memberId, field, value) => {
        setFormData({
            ...formData,
            [memberId]: { ...formData[memberId], [field]: value },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Object.entries(formData).forEach(([member_id, data]) => {
            Inertia.post("/attendance", { member_id, ...data });
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Time In</th>
                        <th className="border p-2">Time Out</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Agenda</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td className="border p-2">{member.name}</td>
                            <td className="border p-2">
                                <input
                                    type="time"
                                    value={formData[member.id].time_in}
                                    onChange={(e) =>
                                        handleChange(
                                            member.id,
                                            "time_in",
                                            e.target.value
                                        )
                                    }
                                    className="border p-1"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="time"
                                    value={formData[member.id].time_out}
                                    onChange={(e) =>
                                        handleChange(
                                            member.id,
                                            "time_out",
                                            e.target.value
                                        )
                                    }
                                    className="border p-1"
                                />
                            </td>
                            <td className="border p-2">
                                <select
                                    value={formData[member.id].status}
                                    onChange={(e) =>
                                        handleChange(
                                            member.id,
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="border p-1"
                                >
                                    <option value="">-- Select --</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </td>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    value={formData[member.id].agenda}
                                    onChange={(e) =>
                                        handleChange(
                                            member.id,
                                            "agenda",
                                            e.target.value
                                        )
                                    }
                                    className="border p-1"
                                    placeholder="Agenda"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Save Attendance
            </button>
        </form>
    );
}
