"use client";

import * as React from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { SidebarSection } from "./sidebar-section";
import { ThemeSwitch } from "@/components/theme-switch";
import { navigationData } from "@/app/(routes)/auth/dashboard/navigation-data";
import { useSidebar } from "./sidebar-context";
import { useAuth } from "@/app/contexts/auth-context";
import Image from "next/image";

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = "" }: SidebarProps) {
  const { collapsed, setCollapsed, isMobile } = useSidebar();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 ease-sidebar",
          collapsed ? "w-20" : "w-70",
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border p-4",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={32}
                className="h-auto w-auto"
              />
            </div>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground transition-colors duration-200",
                "hover:bg-sidebar-icon-bg-hover hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-sidebar-background",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </button>
          )}

          {collapsed && isMobile && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white">
              <Image
                src="/mangoLivre.png"
                alt="Logo"
                width={120}
                height={32}
                className="h-auto w-auto"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className={cn("space-y-6", collapsed ? "px-2" : "px-2")}>
            {navigationData.map((section, index) => (
              <React.Fragment key={section.title}>
                {index > 0 && (
                  <div
                    className={cn(
                      "mx-auto h-px bg-sidebar-border",
                      collapsed ? "w-8" : "mx-4",
                    )}
                  />
                )}
                <SidebarSection
                  title={section.title}
                  items={section.items}
                  collapsed={collapsed}
                  currentPath={currentPath}
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={cn("px-4 pb-2", collapsed && "px-2")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className={cn(
                    "flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground transition-colors duration-200",
                    "hover:bg-destructive/10 hover:text-destructive",
                    "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 dark:focus:ring-offset-sidebar-background",
                  )}
                  aria-label="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={logout}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors duration-200",
                "hover:bg-destructive/10 hover:text-destructive",
                "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 dark:focus:ring-offset-sidebar-background",
              )}
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}
        </div>

        <div
          className={cn(
            "border-t border-sidebar-border p-4",
            collapsed && "px-2",
          )}
        >
          <ThemeSwitch collapsed={collapsed} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
