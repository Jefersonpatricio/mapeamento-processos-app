"use client";

import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  collapsed?: boolean;
  badge?: string;
}

export function SidebarNavItem({
  name,
  href,
  icon: Icon,
  isActive = false,
  collapsed = false,
  badge,
}: SidebarNavItemProps) {
  const baseClasses = cn(
    "group relative flex items-center gap-3 rounded-md text-sm font-medium transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-sidebar-background",
    collapsed ? "justify-center p-3" : "px-4 py-3",
    isActive
      ? "border-l-[3px] border-primary bg-sidebar-active-bg text-primary font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-icon-bg hover:text-foreground",
    isActive && !collapsed && "pl-[calc(1rem-3px)]",
  );

  const content = (
    <Link
      href={href}
      className={baseClasses}
      aria-current={isActive ? "page" : undefined}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center transition-transform duration-200",
          !isActive && "group-hover:scale-105",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            isActive
              ? "text-primary"
              : "text-sidebar-foreground group-hover:text-foreground",
          )}
          strokeWidth={2}
        />
      </div>
      {!collapsed && (
        <>
          <span className="truncate">{name}</span>
          {badge && (
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {name}
          {badge && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
