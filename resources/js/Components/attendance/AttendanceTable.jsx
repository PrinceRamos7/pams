import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, MoreVertical, Clock, Plus, Calendar, Users } from "lucide-react";
import { Transition } from "@headlessui/react";
import { router } from "@inertiajs/react";
import PasswordModal from "../PasswordModal";
import NotificationModal from "../NotificationModal";

export default function AttendanceTable() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        date: "",
        agenda: "",
        time_in: "",
        time_out: "",
    });
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [testMode, setTestMode] = useState(false); // Set to false for production, true for testing
    const [passwordModal, setPasswordModal] = useState({
        isOpen: false,
        action: null,
        event: null,
        title: '',
        message: ''
    });
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });

    useEffect(() => {
        fetch("/attendance-events", { headers: { Accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(() => showNotification("Failed to fetch events", "error"));
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.relative')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Update current time every minute to refresh active status
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        
        return () => clearInterval(timer);
    }, []);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 4000);
    };

    const showNotificationModal = (title, message, type = "success") => {
        setNotificationModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const verifyPassword = async (password) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

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

    const handlePasswordConfirm = async (password) => {
        await verifyPassword(password);
        
        // Execute the original action
        switch (passwordModal.action) {
            case 'forceBeginTimeOut':
                await executeForceBeginTimeOut(passwordModal.event);
                break;
            case 'forceReopenTimeOut':
                await executeForceReopenTimeOut(passwordModal.event);
                break;
            case 'forceClose':
                await executeForceClose(passwordModal.event);
                break;
            case 'edit':
                executeEditEvent(passwordModal.event);
                break;
            case 'delete':
                await executeDelete(passwordModal.event);
                break;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.agenda || !formData.time_in || !formData.time_out) {
            showNotification("Please fill all required fields.", "error");
            return;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const url = isEditing ? `/attendance-events/${editingEventId}` : "/attendance-events";
            const requestBody = isEditing ? { ...formData, _method: 'PUT' } : formData;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();

            if (data.success) {
                if (isEditing) {
                    setEvents((prev) => prev.map(e => e.event_id === editingEventId ? data.event : e));
                } else {
                    setEvents((prev) => [data.event, ...prev]);
                }
                setFormData({ date: "", agenda: "", time_in: "", time_out: "" });
                setShowForm(false);
                setIsEditing(false);
                setEditingEventId(null);
                showNotificationModal("Success!", data.message, "success");
            } else {
                showNotificationModal("Error!", isEditing ? "Failed to update event." : "Failed to add event.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification(isEditing ? "Failed to update event." : "Failed to add event.", "error");
        }
    };

    const handleEditEvent = (event) => {
        setPasswordModal({
            isOpen: true,
            action: 'edit',
            event: event,
            title: 'Edit Event',
            message: `Edit "${event.agenda}"?\n\nPlease enter your password to continue.`
        });
    };

    const executeEditEvent = (event) => {
        setFormData({
            date: event.date,
            agenda: event.agenda,
            time_in: event.time_in,
            time_out: event.time_out,
        });
        setIsEditing(true);
        setEditingEventId(event.event_id);
        setShowForm(true);
        setOpenMenuId(null);
    };

    const handleDeleteEvent = (event) => {
        setPasswordModal({
            isOpen: true,
            action: 'delete',
            event: event,
            title: 'Delete Event',
            message: `Delete "${event.agenda}"?\n\nThis will permanently delete the event and all related attendance records. This action cannot be undone.`
        });
    };

    const executeDelete = async (event) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch(`/attendance-events/${event.event_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ _method: 'DELETE' }),
            });

            const data = await res.json();

            if (data.success) {
                setEvents((prev) => prev.filter(e => e.event_id !== event.event_id));
                showNotificationModal("Success!", data.message, "success");
            } else {
                showNotificationModal("Error!", "Failed to delete event.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to delete event.", "error");
        }
        
        setOpenMenuId(null);
    };

    const handleCancelEdit = () => {
        setFormData({ date: "", agenda: "", time_in: "", time_out: "" });
        setIsEditing(false);
        setEditingEventId(null);
        setShowForm(false);
    };

    const handleForceBeginTimeOut = (event) => {
        setPasswordModal({
            isOpen: true,
            action: 'forceBeginTimeOut',
            event: event,
            title: 'Force Begin Time Out',
            message: `Force begin time-out for "${event.agenda}"?\n\nThis will:\n- Open time-out window immediately\n- Allow members to time out now\n- Update the time-out time to current time`
        });
    };

    const executeForceBeginTimeOut = async (event) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch(`/attendance-events/${event.event_id}/force-begin-timeout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await res.json();

            if (data.success) {
                // Update the event in the list
                setEvents((prev) => prev.map(e => e.event_id === event.event_id ? data.event : e));
                showNotificationModal("Success!", data.message, "success");
            } else {
                showNotificationModal("Error!", data.message || "Failed to open time-out window.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to open time-out window.", "error");
        }
        
        setOpenMenuId(null);
    };

    const handleForceReopenTimeOut = (event) => {
        setPasswordModal({
            isOpen: true,
            action: 'forceReopenTimeOut',
            event: event,
            title: 'Force Reopen Time Out',
            message: `Reopen time-out window for "${event.agenda}"?\n\nThis will:\n- Reopen time-out window for 30 more minutes\n- Allow members who missed time-out to complete it\n- Update the time-out time to current time`
        });
    };

    const executeForceReopenTimeOut = async (event) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch(`/attendance-events/${event.event_id}/force-reopen-timeout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await res.json();

            if (data.success) {
                // Update the event in the list
                setEvents((prev) => prev.map(e => e.event_id === event.event_id ? data.event : e));
                showNotificationModal("Success!", data.message, "success");
            } else {
                showNotificationModal("Error!", data.message || "Failed to reopen time-out window.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to reopen time-out window.", "error");
        }
        
        setOpenMenuId(null);
    };

    const handleForceClose = (event) => {
        setPasswordModal({
            isOpen: true,
            action: 'forceClose',
            event: event,
            title: 'Force Close Event',
            message: `Force close "${event.agenda}" and calculate sanctions?\n\nThis will:\n- End time windows immediately\n- Calculate sanctions for absent members\n- Cannot be undone`
        });
    };

    const executeForceClose = async (event) => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            const res = await fetch(`/attendance-events/${event.event_id}/force-close`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            const data = await res.json();

            if (data.success) {
                // Update the event in the list with the closed status
                setEvents((prev) => prev.map(e => e.event_id === event.event_id ? data.event : e));
                showNotificationModal("Success!", data.message, "success");
            } else {
                showNotificationModal("Error!", data.message || "Failed to close event.", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to close event.", "error");
        }
        
        setOpenMenuId(null);
    };

    const isTimeInActive = (event) => {
        // If event is closed, time in is not active
        if (event.status === 'closed') return false;
        
        if (!event.time_in || !event.date) return false;
        
        const now = new Date();
        
        // Parse the event date and time
        const eventDateTime = new Date(event.date + 'T' + event.time_in);
        
        // Calculate end time (15 minutes after start)
        const endTime = new Date(eventDateTime.getTime() + 15 * 60000);
        
        // For debugging - log the times
        console.log('Time In Check:', {
            now: now.toLocaleString(),
            eventStart: eventDateTime.toLocaleString(),
            eventEnd: endTime.toLocaleString(),
            isActive: now >= eventDateTime && now <= endTime,
            status: event.status
        });
        
        // Check if current time is within the window
        const isActive = now >= eventDateTime && now <= endTime;
        
        // In test mode, always return true if we have valid time data
        return testMode ? true : isActive;
    };

    const isTimeOutActive = (event) => {
        // If event is closed, time out is not active
        if (event.status === 'closed') return false;
        
        if (!event.time_out || !event.date) return false;
        
        const now = new Date();
        
        // Parse the event date and time
        const eventDateTime = new Date(event.date + 'T' + event.time_out);
        
        // Calculate end time (15 minutes after start)
        const endTime = new Date(eventDateTime.getTime() + 15 * 60000);
        
        // For debugging - log the times
        console.log('Time Out Check:', {
            now: now.toLocaleString(),
            eventStart: eventDateTime.toLocaleString(),
            eventEnd: endTime.toLocaleString(),
            isActive: now >= eventDateTime && now <= endTime,
            status: event.status
        });
        
        // Check if current time is within the window
        const isActive = now >= eventDateTime && now <= endTime;
        
        // In test mode, always return true if we have valid time data
        return testMode ? true : isActive;
    };

    const hasTimeInStarted = (event) => {
        // Check if the time-in period has started (not necessarily active, just started)
        if (!event.time_in || !event.date) return false;
        
        const now = new Date();
        const timeInDateTime = new Date(event.date + 'T' + event.time_in);
        
        // Return true if current time is past the time-in start time
        return now >= timeInDateTime || testMode;
    };

    const handleTimeIn = (event) => {
        if (!testMode && !isTimeInActive(event)) {
            showNotification("Time In period is not active or has expired", "error");
            return;
        }
        router.visit(route("attendance-records.time-in", event.event_id));
    };

    const handleTimeOut = (event) => {
        if (!testMode && !isTimeOutActive(event)) {
            showNotification("Time Out period is not active or has expired", "error");
            return;
        }
        router.visit(route("attendance-records.time-out", event.event_id));
    };

    const toggleMenu = (eventId) => {
        setOpenMenuId(openMenuId === eventId ? null : eventId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
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
                        className={`px-6 py-3 rounded-lg font-medium shadow-lg text-white ${
                            notification.type === "success"
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    >
                        {notification.message}
                    </div>
                </Transition>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Daily Attendance</h2>
                    <p className="text-gray-600 mt-1">Manage attendance events and schedules</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New Event
                </button>
            </div>

            {/* Add Event Form */}
            <Transition
                show={showForm}
                enter="transition-all duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition-all duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isEditing ? 'Edit Event' : 'Create New Event'}
                    </h3>
                    <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Event Name
                            </label>
                            <input
                                type="text"
                                name="agenda"
                                value={formData.agenda}
                                onChange={handleChange}
                                placeholder="e.g., Morning Meeting"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Time In
                            </label>
                            <input
                                type="time"
                                name="time_in"
                                value={formData.time_in}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Time Out
                            </label>
                            <input
                                type="time"
                                name="time_out"
                                value={formData.time_out}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-4 flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isEditing ? 'Update Event' : 'Create Event'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Transition>

            {/* Events Grid/Cards */}
            {events.length > 0 ? (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <div
                            key={event.event_id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Calendar className="text-blue-600" size={20} />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {event.agenda}
                                            </h3>
                                            {event.status === 'closed' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                                    Closed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            {formatDate(event.date)}
                                        </p>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">Time In:</span>
                                                <span className={`text-sm font-medium ${
                                                    isTimeInActive(event) ? 'text-green-600' : 'text-gray-900'
                                                }`}>
                                                    {formatTime(event.time_in)}
                                                </span>
                                                {isTimeInActive(event) && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">Time Out:</span>
                                                <span className={`text-sm font-medium ${
                                                    isTimeOutActive(event) ? 'text-green-600' : 'text-gray-900'
                                                }`}>
                                                    {formatTime(event.time_out)}
                                                </span>
                                                {isTimeOutActive(event) && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleMenu(event.event_id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical size={20} className="text-gray-600" />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {openMenuId === event.event_id && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-visible">
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            router.visit(
                                                                route(
                                                                    "attendance-records.view",
                                                                    event.event_id
                                                                )
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                    >
                                                        <Eye size={16} />
                                                        View Attendance
                                                    </button>
                                                    
                                                    <button
                                                        onClick={(e) => {
                                                            if (event.status === 'closed') {
                                                                e.preventDefault();
                                                                showNotification("Event is closed. Cannot time in.", "error");
                                                                setOpenMenuId(null);
                                                                return;
                                                            }
                                                            if (!isTimeInActive(event) && !testMode) {
                                                                e.preventDefault();
                                                                showNotification("Time In period is not active", "error");
                                                                setOpenMenuId(null);
                                                                return;
                                                            }
                                                            router.visit(
                                                                route(
                                                                    "attendance-records.two-step-time-in",
                                                                    event.event_id
                                                                )
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                                                            event.status === 'closed' || (!isTimeInActive(event) && !testMode)
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' 
                                                                : 'hover:bg-green-50 text-green-700 cursor-pointer'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>Time In</span>
                                                        {event.status === 'closed' ? (
                                                            <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                                Closed
                                                            </span>
                                                        ) : isTimeInActive(event) && (
                                                            <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                Active
                                                            </span>
                                                        )}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={(e) => {
                                                            if (event.status === 'closed') {
                                                                e.preventDefault();
                                                                showNotification("Event is closed. Cannot time out.", "error");
                                                                setOpenMenuId(null);
                                                                return;
                                                            }
                                                            if (!isTimeOutActive(event) && !testMode) {
                                                                e.preventDefault();
                                                                showNotification("Time Out period is not active", "error");
                                                                setOpenMenuId(null);
                                                                return;
                                                            }
                                                            router.visit(
                                                                route(
                                                                    "attendance-records.two-step-time-out",
                                                                    event.event_id
                                                                )
                                                            );
                                                            setOpenMenuId(null);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                                                            event.status === 'closed' || (!isTimeOutActive(event) && !testMode)
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' 
                                                                : 'hover:bg-red-50 text-red-700 cursor-pointer'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>Time Out</span>
                                                        {event.status === 'closed' ? (
                                                            <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                                Closed
                                                            </span>
                                                        ) : isTimeOutActive(event) && (
                                                            <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                Active
                                                            </span>
                                                        )}
                                                    </button>
                                                    
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    
                                                    <button
                                                        onClick={() => handleForceBeginTimeOut(event)}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                                                            event.status === 'closed' || isTimeOutActive(event) || !hasTimeInStarted(event)
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400' 
                                                                : 'hover:bg-blue-50 text-blue-600'
                                                        }`}
                                                        disabled={event.status === 'closed' || isTimeOutActive(event) || !hasTimeInStarted(event)}
                                                    >
                                                        <Clock size={16} />
                                                        Force Begin Time Out
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleForceReopenTimeOut(event)}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                                                            event.status === 'closed' || isTimeOutActive(event) || !hasTimeInStarted(event)
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400' 
                                                                : 'hover:bg-purple-50 text-purple-600'
                                                        }`}
                                                        disabled={event.status === 'closed' || isTimeOutActive(event) || !hasTimeInStarted(event)}
                                                    >
                                                        <Clock size={16} />
                                                        Force Reopen Time Out
                                                    </button>
                                                    
                                                                    <button
                                                        onClick={() => handleForceClose(event)}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
                                                            event.status === 'closed' || !hasTimeInStarted(event)
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                                : 'hover:bg-orange-50 text-orange-600'
                                                        }`}
                                                        disabled={event.status === 'closed' || !hasTimeInStarted(event)}
                                                    >
                                                        <Clock size={16} />
                                                        Force Close & Calculate
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                    >
                                                        <Edit size={16} />
                                                        Edit Event
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleDeleteEvent(event)}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete Event
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-600 mb-4">Create your first attendance event to get started</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Create Event
                    </button>
                </div>
            )}

            {/* Password Confirmation Modal */}
            <PasswordModal
                isOpen={passwordModal.isOpen}
                onClose={() => setPasswordModal({ ...passwordModal, isOpen: false })}
                onConfirm={handlePasswordConfirm}
                title={passwordModal.title}
                message={passwordModal.message}
                actionText="Confirm"
            />

            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
            />
        </div>
    );
}