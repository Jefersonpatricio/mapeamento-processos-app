"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./sidebar-nav-item";
import type { NavigationItem } from "@/app/(routes)/auth/dashboard/navigation-data";

interface SidebarSectionProps {
  title: string;
  items: NavigationItem[];
  collapsed?: boolean;
  currentPath?: string;
}

export function SidebarSection({
  title,
  items,
  collapsed = false,
  currentPath = "",
}: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      {/* Section Label - only visible when expanded */}
      {!collapsed && (
        <h3
          className={cn(
            "px-4 py-2 text-xs font-semibold uppercase tracking-wider",
            "text-muted-foreground",
          )}
        >
          {title}
        </h3>
      )}

      {/* Navigation Items */}
      <nav className="space-y-1" role="navigation" aria-label={title}>
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            name={item.name}
            href={item.href}
            icon={item.icon}
            isActive={
              currentPath === item.href ||
              (item.badge === "active" && !currentPath)
            }
            collapsed={collapsed}
            badge={item.badge === "active" ? undefined : item.badge}
          />
        ))}
      </nav>
    </div>
  );
}
