import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { X } from 'lucide-react';

export default function EditPerformanceModal({ member, categories, performances, onClose }) {
    const [formData, setFormData] = useState(
        categories.map(category => {
            const existing = performances.find(p => p.category_id === category.id);
            return {
                category_id: category.id,
                category_name: category.name,
                score: existing?.score || '',
                remarks: existing?.remarks || '',
            };
        })
    );

    const handleScoreChange = (index, value) => {
        const newData = [...formData];
        newData[index].score = value;
        setFormData(newData);
    };

    const handleRemarksChange = (index, value) => {
        const newData = [...formData];
        newData[index].remarks = value;
        setFormData(newData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validPerformances = formData.filter(item => item.score !== '');
        
        router.post(
            route('performance.student.bulk-update', member.member_id),
            { performances: validPerformances },
            {
                onSuccess: () => onClose(),
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold">
                        Edit Performance Scores
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="space-y-4">
                            {formData.map((item, index) => (
                                <div key={item.category_id} className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        {item.category_name}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Score (0-100)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={item.score}
                                                onChange={(e) => handleScoreChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Enter score"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Remarks (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.remarks}
                                                onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Add remarks"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 flex-shrink-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save All Scores
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
