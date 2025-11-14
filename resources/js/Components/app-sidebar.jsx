import { usePage } from "@inertiajs/react";
import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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
    const { user } = usePage().props; // get logged-in user from Laravel

    // sample static data
    const data = {
        teams: [
            {
                name: "PAMS",
                logo: "/avatars/piton.png",
                plan: "PITON Attendance",
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

                ],
            },
        ],
        projects: [],
    };

    // Safe user object with fallbacks
    const currentUser = {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
        avatar: user?.avatar || "/default-avatar.svg",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="bg-blue-600 text-white">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent className="bg-blue-600 text-white">
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>

            <SidebarFooter className="bg-blue-600 text-white">
                <NavUser user={currentUser} />
            </SidebarFooter>
            <SidebarRail className="bg-blue-600" />
        </Sidebar>
    );
}
