"use client";

import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";

import AuthUserButton from "@/components/auth-user-button";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardUserButton } from "@/features/dashboard/ui/components/dashboard-user-button";



export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <>
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background justify-between">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile) 
            ?  <PanelLeftIcon className="size-4" /> 
            : <PanelLeftCloseIcon className="size-4" />
          }
        </Button>

        <AuthUserButton />
      </nav>
    </>
  );
};
