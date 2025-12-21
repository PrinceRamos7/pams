import { usePage } from "@inertiajs/react";
import * as React from "react";
import { SquareTerminal, Calendar, Users, Package, BarChart3 } from "lucide-react";

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
    const user = auth.user;

    // Filter navigation based on user role
    const getFilteredNavigation = () => {
        // Attendance Manager - Dashboard and attendance pages
        if (user.role === 'attendance_manager') {
            return [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: SquareTerminal,
                    isActive: true,
                },
                {
                    title: "Attendance",
                    url: "#",
                    icon: Calendar,
                    isActive: false,
                    items: [
                        {
                            title: "Events",
                            url: route("attendance.index"),
                        },
                        {
                            title: "Events with Sanctions",
                            url: "/sanctions",
                        },
                        {
                            title: "Member Sanctions",
                            url: "/sanctions/members",
                        },
                    ],
                },
            ];
        }

        // Admin - Full access
        return [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: SquareTerminal,
                isActive: true,
            },
            {
                title: "Attendance",
                url: "#",
                icon: Calendar,
                isActive: false,
                items: [
                    {
                        title: "Events",
                        url: route("attendance.index"),
                    },
                    {
                        title: "Events with Sanctions",
                        url: "/sanctions",
                    },
                    {
                        title: "Member Sanctions",
                        url: "/sanctions/members",
                    },
                ],
            },
            {
                title: "Member Management",
                url: "#",
                icon: Users,
                isActive: false,
                items: [
                    {
                        title: "Members",
                        url: "/members",
                    },
                    {
                        title: "Member Archive",
                        url: "/members/history/list",
                    },
                    {
                        title: "Officers",
                        url: "/officers",
                    },
                    {
                        title: "Officers History",
                        url: "/officers/history",
                    },
                    {
                        title: "Media Team",
                        url: "/media-team",
                    },
                ],
            },
            {
                title: "Performance Analytics",
                url: "#",
                icon: BarChart3,
                isActive: false,
                items: [
                    {
                        title: "Category Settings",
                        url: "/performance/categories",
                    },
                ],
            },
            {
                title: "Inventory",
                url: "/inventory",
                icon: Package,
                isActive: false,
            },
        ];
    };

    const data = {
        teams: [
            {
                name: "PIMS",
                logo: "/avatars/piton.png",
                plan: "PITON Integrated",
            },
        ],
        navMain: getFilteredNavigation(),
    };

    const currentUser = {
        name: auth?.user?.name || "Guest",
        email: auth?.user?.email || "guest@example.com",
        avatar: "/avatars/piton.png",
    };

    return (
        <Sidebar
            collapsible="icon"
            className="!bg-[#2563eb] [&_[data-sidebar=sidebar]]:!bg-[#2563eb]"
            {...props}
        >
            <SidebarHeader className="!bg-[#2563eb] text-white">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent className="!bg-[#2563eb] text-white">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="!bg-[#2563eb] text-white border-t border-[#1d4ed8]">
                <NavUser user={currentUser} />
            </SidebarFooter>
            <SidebarRail className="!bg-[#2563eb]" />
        </Sidebar>
    );
}
