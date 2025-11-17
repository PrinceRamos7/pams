import React from "react";
import { Head, router } from "@inertiajs/react";
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
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { ArrowLeft } from "lucide-react";
import MemberSanctionDetailsSummary from "../../components/Sanctions/MemberSanctionDetailsSummary";
import MemberSanctionDetailsTable from "../../components/Sanctions/MemberSanctionDetailsTable";

export default function MemberSanctionDetails({ member, sanctions, summary }) {
    const breadcrumbs = [
        { href: route("dashboard"), label: "Dashboard" },
        { href: route("sanctions.members"), label: "Member Sanctions" },
        { label: member.firstname + ' ' + member.lastname },
    ];

    return (
        <SidebarProvider>
            <Toaster position="top-right" />
            <AppSidebar />
            <Head title={`Sanctions - ${member.firstname} ${member.lastname}`} />

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
                        <button
                            onClick={() => router.visit(route('sanctions.members'))}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Member Sanctions
                        </button>

                        {/* Member Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{member.firstname} {member.lastname}</CardTitle>
                                <p className="text-sm text-gray-500">Student ID: {member.student_id}</p>
                            </CardHeader>
                        </Card>

                        {/* Summary Cards */}
                        <MemberSanctionDetailsSummary summary={summary} />

                        {/* Sanctions Table */}
                        <MemberSanctionDetailsTable sanctions={sanctions} />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
