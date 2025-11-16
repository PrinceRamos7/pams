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
import OfficerTable from "../../Components/Officers/OfficerTable";

export default function OfficersList({ officers }) {
    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Officers" },
    ];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Officers List" />

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
                                <CardTitle>Officers Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OfficerTable officers={officers} />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
