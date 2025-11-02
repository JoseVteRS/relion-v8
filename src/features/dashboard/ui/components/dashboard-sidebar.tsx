"use client";

import {
  GiftIcon,
  HeartIcon,
  ListIcon,
  StarIcon,
  TicketCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DashboardTrial } from "./dashboard-trial";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: GiftIcon,
    label: "Mis regalos",
    href: "/dashboard/presents",
  },
  {
    icon: ListIcon,
    label: "Mis Listas",
    href: "/dashboard/lists",
  },
] as const;

const secondSection = [
  {
    icon: HeartIcon,
    label: "Listas favoritas",
    href: "/dashboard/lists/favorites",
  },
  // {
  //   icon: TicketCheckIcon,
  //   label: "Tus reservas",
  //   href: "/presents/picks/",
  // }
] as const;

const thirdSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
] as const;

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isSidebarCollapsed = state === "collapsed";
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <div
            className={cn(
              "border-black dark:border-white",
              isSidebarCollapsed ? "border-4 size-4" : "size-4.5 border-4 mt-1"
            )}
          ></div>
          <p
            className={cn(
              "text-2xl font-bold leading-tight",
              isSidebarCollapsed && "sr-only"
            )}
          >
            Relion
          </p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

       <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        
      </SidebarContent><SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {thirdSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
          </SidebarGroupContent>
        </SidebarGroup> 
      <SidebarFooter className="text-white">
        <DashboardTrial />
        <DashboardUserButton sidebarState={state} />
      </SidebarFooter>
    </Sidebar>
  );
};
