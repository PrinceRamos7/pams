import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Eye, Download } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default function MemberSanctionsTable({ memberSanctions }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = memberSanctions.filter(member =>
        member.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (memberId) => {
        router.visit(route('sanctions.member.details', memberId));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Member Sanctions</CardTitle>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or student ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <a
                            href={route('sanctions.members.export-pdf')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition"
                            style={{ backgroundColor: '#F7CC08', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0B907'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7CC08'}
                        >
                            <Download className="w-4 h-4" />
                            Export PDF
                        </a>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredMembers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Student ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Member Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Total Sanctions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Unpaid Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Paid Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMembers.map((member) => (
                                    <tr key={member.member_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.student_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.member_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.sanction_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            ₱{parseFloat(member.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                                            ₱{parseFloat(member.unpaid_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            ₱{parseFloat(member.paid_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleViewDetails(member.member_id)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? 'No members found matching your search.' : 'No members with sanctions found.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
