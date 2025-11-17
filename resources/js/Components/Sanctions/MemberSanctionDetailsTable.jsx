import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default function MemberSanctionDetailsTable({ sanctions }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sanction Details</CardTitle>
            </CardHeader>
            <CardContent>
                {sanctions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sanctions.map((sanction) => (
                                    <tr key={sanction.sanction_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {sanction.event?.agenda || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sanction.event?.date ? new Date(sanction.event.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                sanction.status === 'excused' 
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : sanction.reason === 'Absent'
                                                    ? 'bg-red-100 text-red-800'
                                                    : sanction.reason === 'No time in'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {sanction.status === 'excused' ? 'Excused' : sanction.reason}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            ₱{parseFloat(sanction.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {sanction.status === 'paid' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Paid
                                                </span>
                                            ) : sanction.status === 'excused' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Excused
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No sanctions found for this member.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
