import React from "react";
import { Head, Link } from "@inertiajs/react";
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
import { ArrowLeft } from "lucide-react";
import Pagination from "../../Components/Pagination";
import EventSanctionsTable from "../../Components/Sanctions/EventSanctionsTable";

export default function EventSanctionsDetail({ event, sanctions: paginatedSanctions, summary }) {
    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("sanctions.index"), label: "Sanctions" },
        { label: event.agenda },
    ];

    const sanctions = paginatedSanctions?.data || [];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title={`Sanctions - ${event.agenda}`} />

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
                        {/* Back Button */}
                        <Link
                            href={route('sanctions.index')}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sanctions
                        </Link>

                        {/* Event Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{event.agenda}</CardTitle>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </CardHeader>
                        </Card>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Members
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summary.total_sanctions}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₱{parseFloat(summary.total_amount).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Unpaid Amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        ₱{parseFloat(summary.unpaid_amount).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Paid Amount
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₱{parseFloat(summary.paid_amount).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Event Sanctions Table Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Sanctions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EventSanctionsTable 
                                    sanctions={sanctions} 
                                    event={event} 
                                />
                                
                                {/* Pagination */}
                                {paginatedSanctions?.links && paginatedSanctions.links.length > 3 && (
                                    <div className="mt-6">
                                        <Pagination links={paginatedSanctions.links} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
