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
import MemberTable from "../../Components/Members/MemberTable";
import Pagination from "../../Components/Pagination";

export default function MemberList({ members: paginatedMembers }) {
    const { flash } = usePage().props;
    
    const members = paginatedMembers?.data || [];

    // Flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { label: "Members List" },
    ];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title="Members List" />

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
                                <CardTitle>Members List</CardTitle>
                            </CardHeader>
                            <CardContent className="">
                                <MemberTable members={members} />
                                
                                {/* Pagination */}
                                {paginatedMembers?.links && paginatedMembers.links.length > 3 && (
                                    <div className="mt-6">
                                        <Pagination links={paginatedMembers.links} />
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
