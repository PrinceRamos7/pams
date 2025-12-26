import React, { useState } from "react";
import { MoreVertical, DollarSign } from "lucide-react";
import { router } from "@inertiajs/react";
import toastService from "../../utils/toastService";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import MarkAsPaidModal from "./MarkAsPaidModal";

export default function MemberSanctionDetailsTable({ sanctions }) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedSanction, setSelectedSanction] = useState(null);
    const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleOpenMarkAsPaidModal = (sanction) => {
        setSelectedSanction(sanction);
        setShowMarkAsPaidModal(true);
        setOpenMenuId(null);
    };

    const handleMarkAsPaid = async () => {
        if (!selectedSanction) return;

        setIsProcessing(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/sanctions/${selectedSanction.sanction_id}/mark-paid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                setShowMarkAsPaidModal(false);
                toastService.success("Sanction marked as paid successfully!");
                // Reload the page after showing success toast
                setTimeout(() => {
                    router.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error marking sanction as paid:', error);
            toastService.error("Failed to mark sanction as paid");
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sanction Details</CardTitle>
            </CardHeader>
            <CardContent>
                {sanctions.length > 0 ? (
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
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {sanction.status === 'unpaid' && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === sanction.sanction_id ? null : sanction.sanction_id)}
                                                        className="p-1 hover:bg-gray-100 rounded transition"
                                                        disabled={isProcessing}
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    
                                                    {openMenuId === sanction.sanction_id && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-10" 
                                                                onClick={() => setOpenMenuId(null)}
                                                            ></div>
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                                <button
                                                                    onClick={() => handleOpenMarkAsPaidModal(sanction)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2 transition"
                                                                >
                                                                    <DollarSign className="w-4 h-4" />
                                                                    Mark as Paid
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No sanctions found for this member.
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Mark as Paid Modal */}
            <MarkAsPaidModal
                isOpen={showMarkAsPaidModal}
                onClose={() => {
                    setShowMarkAsPaidModal(false);
                    setSelectedSanction(null);
                }}
                onConfirm={handleMarkAsPaid}
                sanction={selectedSanction}
            />
        </Card>
    );
}
