import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import PerformanceChart from '@/Components/Performance/PerformanceChart';
import CategoryScoresChart from '@/Components/Performance/CategoryScoresChart';
import RadarScoresChart from '@/Components/Performance/RadarScoresChart';
import PerformanceTable from '@/Components/Performance/PerformanceTable';
import EditPerformanceModal from '@/Components/Performance/EditPerformanceModal';
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { AppSidebar } from '@/Components/app-sidebar';
import { Separator } from '@/Components/ui/separator';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function StudentPerformance({ 
    auth, 
    member, 
    categories, 
    performances, 
    totalScore, 
    chartData 
}) {
    const [showEditModal, setShowEditModal] = useState(false);

    const getPerformanceGrade = (score) => {
        if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
        if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
        return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const gradeInfo = getPerformanceGrade(totalScore);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Head title={`Performance - ${member.firstname} ${member.lastname}`} />

                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumbs
                        crumbs={[
                            { label: "Members", href: route('members.index') },
                            { label: "Performance Analytics" },
                        ]}
                    />
                </header>

                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            onClick={() => router.visit(route('members.index'))}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Members
                        </Button>

                        {/* Student Info Card */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                            {member.profile_picture ? (
                                                <img
                                                    src={member.profile_picture}
                                                    alt={`${member.firstname} ${member.lastname}`}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {member.firstname} {member.lastname}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {member.student_id} • {member.year} • {member.batch?.year}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Overall Performance</p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {totalScore}
                                            </span>
                                            <div className={`px-4 py-2 rounded-lg ${gradeInfo.bg}`}>
                                                <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                                                    {gradeInfo.grade}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Weight Distribution Pie Chart */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Weight Distribution</h3>
                                    <PerformanceChart data={chartData} />
                                </div>
                            </div>

                            {/* Category Scores Bar Chart */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Category Scores</h3>
                                    <CategoryScoresChart data={chartData} />
                                </div>
                            </div>

                            {/* Performance Radar Chart */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
                                    <RadarScoresChart data={chartData} />
                                </div>
                            </div>
                        </div>

                        {/* Performance Table */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Detailed Breakdown</h3>
                                    <Button onClick={() => setShowEditModal(true)} size="sm">
                                        Edit Scores
                                    </Button>
                                </div>
                                <PerformanceTable 
                                    categories={categories}
                                    performances={performances}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {showEditModal && (
                    <EditPerformanceModal
                        member={member}
                        categories={categories}
                        performances={performances}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
