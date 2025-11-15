import { usePage } from "@inertiajs/react";
import * as React from "react";
import { SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {
    const { auth } = usePage().props;

    const data = {
        teams: [
            {
                name: "PIMS",
                logo: "/avatars/piton.png",
                plan: "PITON Integrated",
            },
        ],
        navMain: [
            {
                title: "Main Menu",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    { title: "Dashboard", url: "#" },
                    {
                        title: "Attendance",
                        url: route("attendance.index"),
                    },
                    { title: "Members", url: "/members" },
                    { title: "Sanctions", url: "/sanctions" },
                    { title: "Inventory", url: "/inventory" },
                ],
            },
        ],
    };

    const currentUser = {
        name: auth?.user?.name || "Guest",
        email: auth?.user?.email || "guest@example.com",
        avatar: "/avatars/piton.png",
    };

    return (
        <Sidebar
            collapsible="icon"
            className="!bg-blue-600 [&_[data-sidebar=sidebar]]:!bg-blue-600"
            {...props}
        >
            <SidebarHeader className="!bg-blue-600 text-white">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent className="!bg-blue-600 text-white">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="!bg-blue-600 text-white border-t border-blue-500">
                <NavUser user={currentUser} />
            </SidebarFooter>
            <SidebarRail className="!bg-blue-600" />
        </Sidebar>
    );
}
