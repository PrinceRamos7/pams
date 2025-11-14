import React from "react";
import { Head } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Separator } from "../../components/ui/separator";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import SanctionsTable from "../../Components/Sanctions/SanctionsTable";

export default function SanctionsIndex({ eventSanctions, summary }) {
    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Sanctions" },
    ];

    const sanctionsData = eventSanctions || [];
    const summaryData = summary || {
        total_sanctions: 0,
        unpaid_sanctions: 0,
        total_unpaid_amount: 0,
        total_paid_amount: 0
    };

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Sanctions Management" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Sanctions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summaryData.total_sanctions}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Unpaid Sanctions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{summaryData.unpaid_sanctions}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Unpaid Amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        ₱{parseFloat(summaryData.total_unpaid_amount).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Paid Amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₱{parseFloat(summaryData.total_paid_amount).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sanctions Table Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sanctions Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SanctionsTable 
                                    eventSanctions={sanctionsData} 
                                    summary={summaryData} 
                                />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
