import { toast } from 'react-hot-toast';

/**
 * Centralized Toast Notification Service
 * Uses react-hot-toast for consistent notifications across the app
 */

const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    },
};

const toastService = {
    /**
     * Show success toast
     * @param {string} message - Success message to display
     * @param {object} options - Additional toast options
     */
    success: (message, options = {}) => {
        return toast.success(message, {
            ...defaultOptions,
            icon: '✅',
            style: {
                ...defaultOptions.style,
                background: '#10b981',
            },
            ...options,
        });
    },

    /**
     * Show error toast
     * @param {string} message - Error message to display
     * @param {object} options - Additional toast options
     */
    error: (message, options = {}) => {
        return toast.error(message, {
            ...defaultOptions,
            icon: '❌',
            duration: 5000, // Errors stay longer
            style: {
                ...defaultOptions.style,
                background: '#ef4444',
            },
            ...options,
        });
    },

    /**
     * Show warning toast
     * @param {string} message - Warning message to display
     * @param {object} options - Additional toast options
     */
    warning: (message, options = {}) => {
        return toast(message, {
            ...defaultOptions,
            icon: '⚠️',
            style: {
                ...defaultOptions.style,
                background: '#f59e0b',
            },
            ...options,
        });
    },

    /**
     * Show info toast
     * @param {string} message - Info message to display
     * @param {object} options - Additional toast options
     */
    info: (message, options = {}) => {
        return toast(message, {
            ...defaultOptions,
            icon: 'ℹ️',
            style: {
                ...defaultOptions.style,
                background: '#3b82f6',
            },
            ...options,
        });
    },

    /**
     * Show loading toast
     * @param {string} message - Loading message to display
     * @param {object} options - Additional toast options
     */
    loading: (message, options = {}) => {
        return toast.loading(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Dismiss a specific toast or all toasts
     * @param {string} toastId - Optional toast ID to dismiss specific toast
     */
    dismiss: (toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    /**
     * Promise-based toast for async operations
     * @param {Promise} promise - Promise to track
     * @param {object} messages - Messages for loading, success, and error states
     */
    promise: (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Loading...',
                success: messages.success || 'Success!',
                error: messages.error || 'Error occurred',
            },
            defaultOptions
        );
    },
};

export default toastService;
