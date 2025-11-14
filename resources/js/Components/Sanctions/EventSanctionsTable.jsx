import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { MoreVertical, Edit, X, Filter } from "lucide-react";

export default function EventSanctionsTable({ sanctions, event }) {
    const [filter, setFilter] = useState({
        search: '',
        type: 'all',
        status: 'all',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingSanction, setEditingSanction] = useState(null);
    const [editForm, setEditForm] = useState({
        amount: '',
        reason: '',
        status: '',
    });

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.relative')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleEditClick = (sanction) => {
        setEditingSanction(sanction);
        setEditForm({
            amount: sanction.amount,
            reason: sanction.reason,
            status: sanction.status,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const response = await fetch(`/api/sanctions/${editingSanction.sanction_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(editForm),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Sanction updated successfully');
                setEditingSanction(null);
                router.reload();
            } else {
                toast.error(data.message || 'Failed to update sanction');
            }
        } catch (error) {
            console.error('Failed to update sanction:', error);
            toast.error('Failed to update sanction');
        }
    };

    const handleMarkAsPaid = async (sanctionId) => {
        if (!confirm('Mark this sanction as paid?')) return;

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const response = await fetch(`/api/sanctions/${sanctionId}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Sanction marked as paid');
                router.reload();
            } else {
                toast.error(data.message || 'Failed to update sanction');
            }
        } catch (error) {
            console.error('Failed to mark as paid:', error);
            toast.error('Failed to update sanction');
        }
    };

    const getSanctionType = (sanction) => {
        if (sanction.reason === 'No time in') {
            return 'No Time In';
        } else if (sanction.reason === 'No time out') {
            return 'No Time Out';
        } else if (sanction.reason === 'Absent') {
            return 'Absent';
        }
        return sanction.reason;
    };

    const getSanctionTypeColor = (sanction) => {
        if (sanction.reason === 'No time in') {
            return 'bg-orange-100 text-orange-800';
        } else if (sanction.reason === 'No time out') {
            return 'bg-yellow-100 text-yellow-800';
        } else if (sanction.reason === 'Absent') {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const filteredSanctions = sanctions.filter(sanction => {
        const matchesSearch = !filter.search || 
            sanction.member?.firstname?.toLowerCase().includes(filter.search.toLowerCase()) ||
            sanction.member?.lastname?.toLowerCase().includes(filter.search.toLowerCase()) ||
            sanction.member?.student_id?.toLowerCase().includes(filter.search);
        
        const matchesType = filter.type === 'all' || sanction.reason?.toLowerCase().includes(filter.type.toLowerCase());
        const matchesStatus = filter.status === 'all' || sanction.status === filter.status;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <>
            {/* Header with Filter Toggle and Export button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Members with Sanctions</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <a
                        href={route('sanctions.event.export-pdf', event.event_id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </a>
                </div>
            </div>

            {/* Search and Filters */}
            {showFilters && (
                <div className="mb-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Search by name or student ID..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Type
                            </label>
                            <select
                                value={filter.type}
                                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="no time out">No Time Out</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Sanctions Table */}
            {filteredSanctions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No sanctions found
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-blue-500 text-white font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Student ID
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Member Name
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Type
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Amount
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Status
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredSanctions.map((sanction) => (
                                <tr key={sanction.sanction_id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        {sanction.member?.student_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        {sanction.member?.firstname} {sanction.member?.lastname}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSanctionTypeColor(sanction)}`}>
                                            {getSanctionType(sanction)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        ₱{parseFloat(sanction.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {sanction.status === 'paid' ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === sanction.sanction_id ? null : sanction.sanction_id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={16} className="text-gray-600" />
                                            </button>
                                            
                                            {openMenuId === sanction.sanction_id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                                    <div className="py-2">
                                                        <button
                                                            onClick={() => {
                                                                handleEditClick(sanction);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                        >
                                                            <Edit size={16} />
                                                            Edit Sanction
                                                        </button>
                                                        {sanction.status === 'unpaid' && (
                                                            <button
                                                                onClick={() => {
                                                                    handleMarkAsPaid(sanction.sanction_id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 text-blue-600"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Mark as Paid
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingSanction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Sanction</h3>
                            <button
                                onClick={() => setEditingSanction(null)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member
                                </label>
                                <input
                                    type="text"
                                    value={`${editingSanction.member?.firstname} ${editingSanction.member?.lastname} (${editingSanction.member?.student_id})`}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount (₱)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason
                                </label>
                                <select
                                    value={editForm.reason}
                                    onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="No time in">No Time In</option>
                                    <option value="No time out">No Time Out</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingSanction(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
