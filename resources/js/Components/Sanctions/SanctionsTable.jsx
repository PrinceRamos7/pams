import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { MoreVertical, Eye, Edit, Trash2, Filter } from "lucide-react";
import AuthModal from "../AuthModal";
import EditEventModal from "./EditEventModal";
import NotificationModal from "../NotificationModal";
import { Toaster } from "react-hot-toast";

export default function SanctionsTable({ eventSanctions, summary }) {
    const [filter, setFilter] = useState({
        search: '',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: '',
    });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [passwordModal, setPasswordModal] = useState({
        isOpen: false,
        eventId: null,
        eventName: '',
        title: '',
        message: ''
    });
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

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

    const verifyPassword = async (password) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        
        const response = await fetch('/api/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Invalid password');
        }
        
        return true;
    };

    const handleAuthConfirm = async (authData) => {
        // Verify authentication (password or face)
        if (authData.method === 'password') {
            await verifyPassword(authData.password);
        } else if (authData.method === 'face') {
            // Face authentication already verified in AuthModal
            console.log('Authenticated via face recognition:', authData.user);
        }
        
        await executeDeleteEvent(passwordModal.eventId);
    };

    const handleDeleteEvent = (eventId, eventName) => {
        setPasswordModal({
            isOpen: true,
            eventId: eventId,
            eventName: eventName,
            title: 'Delete Event Sanctions',
            message: `Delete all sanctions for "${eventName}"?\n\nThis will permanently delete all sanction records for this event. This action cannot be undone.`
        });
        setOpenMenuId(null);
    };

    const executeDeleteEvent = async (eventId) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

        try {
            const response = await fetch(`/api/sanctions/event/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (data.success) {
                showNotificationModal("Success!", "Sanctions deleted successfully", "success");
                setTimeout(() => router.reload(), 1500);
            } else {
                showNotificationModal("Error!", data.message || "Failed to delete sanctions", "error");
            }
        } catch (error) {
            console.error('Delete error:', error);
            showNotificationModal("Error!", "Failed to delete sanctions", "error");
        }
    };

    const filteredEventSanctions = eventSanctions.filter(eventSanction => {
        const matchesSearch = !filter.search || 
            eventSanction.event?.agenda?.toLowerCase().includes(filter.search.toLowerCase()) ||
            eventSanction.event_id?.toString().includes(filter.search);
        
        const eventDate = new Date(eventSanction.event?.date);
        const matchesDateFrom = !filter.dateFrom || eventDate >= new Date(filter.dateFrom);
        const matchesDateTo = !filter.dateTo || eventDate <= new Date(filter.dateTo);
        
        const matchesMinAmount = !filter.minAmount || eventSanction.total_amount >= parseFloat(filter.minAmount);
        const matchesMaxAmount = !filter.maxAmount || eventSanction.total_amount <= parseFloat(filter.maxAmount);
        
        return matchesSearch && matchesDateFrom && matchesDateTo && matchesMinAmount && matchesMaxAmount;
    });

    return (
        <>
            {/* Header with Export and Filter buttons */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Events with Sanctions</h1>
                <div className="flex gap-2">
                    <a
                        href={route('sanctions.export-pdf')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition"
                        style={{ backgroundColor: '#F7CC08', color: '#000' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0B907'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7CC08'}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </a>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by event ID or event name..."
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date From
                            </label>
                            <input
                                type="date"
                                value={filter.dateFrom}
                                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date To
                            </label>
                            <input
                                type="date"
                                value={filter.dateTo}
                                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Amount (₱)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={filter.minAmount}
                                onChange={(e) => setFilter({ ...filter, minAmount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Amount (₱)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="1000.00"
                                value={filter.maxAmount}
                                onChange={(e) => setFilter({ ...filter, maxAmount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setFilter({ search: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '' })}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Events Table */}
            {filteredEventSanctions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No events with sanctions found
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-blue-500 text-white font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    ID
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Event
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Total Amount
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-left">
                                    Date
                                </th>
                                <th className="px-4 py-3 border-b-2 border-gray-200 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredEventSanctions.map((eventSanction) => (
                                <tr key={eventSanction.event_id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        {eventSanction.event_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        {eventSanction.event?.agenda}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-red-600">
                                        ₱{parseFloat(eventSanction.total_amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(eventSanction.event?.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === eventSanction.event_id ? null : eventSanction.event_id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={20} className="text-gray-600" />
                                            </button>
                                            
                                            {openMenuId === eventSanction.event_id && (
                                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                                    <div className="py-2">
                                                        <Link
                                                            href={route('sanctions.event', eventSanction.event_id)}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                            onClick={() => setOpenMenuId(null)}
                                                        >
                                                            <Eye size={16} />
                                                            View Members ({eventSanction.sanction_count})
                                                        </Link>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setEditingEvent(eventSanction.event);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 text-blue-600"
                                                        >
                                                            <Edit size={16} />
                                                            Edit Event
                                                        </button>
                                                        
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        
                                                        <button
                                                            onClick={() => handleDeleteEvent(eventSanction.event_id, eventSanction.event?.agenda)}
                                                            className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Sanctions
                                                        </button>
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

            {/* Notification Modal - Positioned at top */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />

            {/* Edit Event Modal */}
            <EditEventModal
                event={editingEvent}
                isOpen={!!editingEvent}
                onClose={() => setEditingEvent(null)}
                showNotificationModal={showNotificationModal}
            />

            {/* Authentication Modal (Password or Face Recognition) */}
            <Toaster position="top-right" />
            <AuthModal
                isOpen={passwordModal.isOpen}
                onClose={() => setPasswordModal({ ...passwordModal, isOpen: false })}
                onConfirm={handleAuthConfirm}
                title={passwordModal.title}
                message={passwordModal.message}
                actionText="Delete"
            />
        </>
    );
}
