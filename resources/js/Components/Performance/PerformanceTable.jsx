import React from 'react';

export default function PerformanceTable({ categories, performances }) {
    const getPerformance = (categoryId) => {
        return performances.find(p => p.category_id === categoryId);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Weight
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Score
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Contribution
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => {
                        const performance = getPerformance(category.id);
                        const contribution = performance 
                            ? (performance.score * category.percentage_weight / 100).toFixed(2)
                            : '0.00';

                        return (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                    {category.percentage_weight}%
                                </td>
                                <td className="px-4 py-3 text-sm text-center">
                                    <span className={`font-semibold ${
                                        performance 
                                            ? performance.score >= 80 
                                                ? 'text-green-600' 
                                                : performance.score >= 60 
                                                    ? 'text-yellow-600' 
                                                    : 'text-red-600'
                                            : 'text-gray-400'
                                    }`}>
                                        {performance ? performance.score : 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                                    {contribution}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
