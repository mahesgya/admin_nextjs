"use client"

import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,

  ShoppingCart,
  WashingMachine,
  User,
  Truck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin Akucuciin",
    email: "admin@akucuciin.com",
    avatar: "/images/LogoAkucuciin2.png",
  },
  teams: [
    {
      name: "AkuCuciin",
      logo: GalleryVerticalEnd,
      plan: "Business",
    },
  ],
  navMain: [
    {
      title: "Order",
      url: "/dashboard/order",
      icon: ShoppingCart,
      isActive: true,
      items: [
        {
          title: "Today",
          url: "/dashboard/order/today",
        },
        {
          title: "All History",
          url: "/dashboard/order/history",
        },
      ],
    },
    {
      title: "Laundry",
      url: "/dashboard/laundry",
      icon: WashingMachine,
      items: [
        {
          title: "List Laundry",
          url: "/dashboard/laundry/list",
        },
        {
          title: "Add New Laundry",
          url: "/dashboard/laundry/create",
        },
      ],
    },
    {
      title: "Customer",
      url: "/dashboard/customer",
      icon: User,
      items: [
        {
          title: "List Customer",
          url: "#",
        },
      ],
    },
    {
      title: "Driver",
      url: "/dashboard/driver",
      icon: Truck,
      items: [
        {
          title: "List Driver",
          url: "/dashboard/driver/list",
        },
        {
          title: "Add Driver",
          url: "/dashboard/driver/create",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
