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
import { Card, CardContent } from "../../components/ui/card";

export default function MediaTeamChart({ mediaTeam }) {
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/media-team", label: "Media Team" },
        { label: "Chart" },
    ];

    return (
        <SidebarProvider>
            <AppSidebar />
            <Head title="Media Team Chart" />
            <Toaster />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumbs crumbs={breadcrumbs} />
                    </div>
                </header>

                <main className="w-full p-6 bg-gradient-to-br from-purple-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                            <CardContent className="p-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                        MEDIA TEAM
                                    </h2>
                                    <p className="text-base text-gray-600 font-medium mt-3">
                                        Total: {mediaTeam?.length || 0} Members
                                    </p>
                                </div>
                                <div className="text-center py-12">
                                    <p className="text-gray-600">
                                        Media Team Chart view coming soon...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
