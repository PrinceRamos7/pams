import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CategoryModal from '@/Components/Performance/CategoryModal';
import CategoryTable from '@/Components/Performance/CategoryTable';
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { AppSidebar } from '@/Components/app-sidebar';
import { Separator } from '@/Components/ui/separator';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function CategorySettings({ auth, categories, totalWeight }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleDelete = (categoryId) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('performance.categories.destroy', categoryId));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Head title="Performance Categories" />

                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumbs
                        crumbs={[
                            { label: "Performance Analytics", href: "#" },
                            { label: "Category Settings" },
                        ]}
                    />
                </header>

                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Performance Categories
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Manage performance evaluation categories and weights
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Category
                                    </button>
                                </div>

                                {/* Weight Summary */}
                                <div className={`mb-6 p-4 rounded-lg ${
                                    totalWeight === 100 
                                        ? 'bg-green-50 border border-green-200' 
                                        : 'bg-yellow-50 border border-yellow-200'
                                }`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total Weight:</span>
                                        <span className={`text-lg font-bold ${
                                            totalWeight === 100 ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {totalWeight.toFixed(2)}%
                                        </span>
                                    </div>
                                    {totalWeight !== 100 && (
                                        <p className="text-sm text-yellow-700 mt-2">
                                            ⚠️ Total weight must equal 100% for accurate calculations. 
                                            {totalWeight < 100 && ` Add ${(100 - totalWeight).toFixed(2)}% more.`}
                                            {totalWeight > 100 && ` Reduce by ${(totalWeight - 100).toFixed(2)}%.`}
                                        </p>
                                    )}
                                    {totalWeight === 100 && (
                                        <p className="text-sm text-green-700 mt-2">
                                            ✓ Weights are properly configured
                                        </p>
                                    )}
                                </div>

                                <CategoryTable
                                    categories={categories}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <CategoryModal
                        category={editingCategory}
                        onClose={handleCloseModal}
                        totalWeight={totalWeight}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
