import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function AttendancePieChart({ attendanceAnalytics }) {
    const data = [
        { name: 'Present', value: attendanceAnalytics.presentRecords, color: '#10b981' },
        { name: 'Late', value: attendanceAnalytics.lateRecords, color: '#f59e0b' },
        { name: 'Absent', value: attendanceAnalytics.absentRecords, color: '#ef4444' },
    ];

    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
                    <p className="text-sm text-gray-600">
                        {((payload[0].value / attendanceAnalytics.totalRecords) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function AttendanceBarChart({ attendanceAnalytics }) {
    const data = [
        {
            name: 'Present',
            count: attendanceAnalytics.presentRecords,
            fill: '#10b981'
        },
        {
            name: 'Late',
            count: attendanceAnalytics.lateRecords,
            fill: '#f59e0b'
        },
        {
            name: 'Absent',
            count: attendanceAnalytics.absentRecords,
            fill: '#ef4444'
        },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / attendanceAnalytics.totalRecords) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
                    <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
                    <p className="text-sm text-gray-600">Percentage: {percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
