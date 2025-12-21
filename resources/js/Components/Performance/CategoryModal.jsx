import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { X } from 'lucide-react';

export default function CategoryModal({ category, onClose, totalWeight }) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        percentage_weight: category?.percentage_weight || '',
        display_order: category?.display_order || 0,
        is_active: category?.is_active ?? true,
    });
    const [errors, setErrors] = useState({});

    const remainingWeight = category 
        ? 100 - (totalWeight - category.percentage_weight)
        : 100 - totalWeight;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (category) {
            router.put(route('performance.categories.update', category.id), formData, {
                onError: (errors) => setErrors(errors),
                onSuccess: () => onClose(),
            });
        } else {
            router.post(route('performance.categories.store'), formData, {
                onError: (errors) => setErrors(errors),
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold">
                        {category ? 'Edit Category' : 'Add Category'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Percentage Weight * (Available: {remainingWeight.toFixed(2)}%)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={remainingWeight}
                            value={formData.percentage_weight}
                            onChange={(e) => setFormData({ ...formData, percentage_weight: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.percentage_weight && (
                            <p className="text-red-500 text-sm mt-1">{errors.percentage_weight}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Total must equal 100%. Current total: {totalWeight.toFixed(2)}%
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {category ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
