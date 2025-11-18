import React, { useState } from 'react';
import { X, DollarSign, CheckCircle } from 'lucide-react';

export default function MarkAsPaidModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    sanction 
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !sanction) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-full">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Mark as Paid</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition"
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to mark this sanction as paid?
                        </p>
                        
                        {/* Sanction Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Event:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {sanction.event?.agenda || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Date:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {sanction.event?.date ? new Date(sanction.event.date).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Reason:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {sanction.reason}
                                </span>
                            </div>
                            <div className="h-px bg-gray-300 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Amount:</span>
                                <span className="text-lg font-bold text-green-600">
                                    ₱{parseFloat(sanction.amount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                This action will mark the sanction as paid and record the payment date.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="w-5 h-5" />
                                    Mark as Paid
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
