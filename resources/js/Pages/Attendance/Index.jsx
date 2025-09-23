import React, { useEffect } from "react";
import { usePage, Head } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";

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
import AttendanceTable from "../../Components/Attendance/AttendanceTable";

export default function Attendance({ members, attendances }) {
    const { flash } = usePage().props;

    // Flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Attendance" },
    ];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Attendance" />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6">
                    <div className="max-w-7xl mx-auto">
                        <Card className="w-full h-auto">
                            <CardHeader>
                                <CardTitle>Daily Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AttendanceTable
                                    members={members}
                                    attendances={attendances}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
