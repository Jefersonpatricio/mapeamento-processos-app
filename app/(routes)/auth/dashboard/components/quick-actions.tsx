"use client";

import Link from "next/link";
import {
  Plus,
  UserPlus,
  Ticket,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import type { QuickAction } from "../data/dashboard-data";

const iconMap: Record<string, LucideIcon> = {
  Plus,
  UserPlus,
  Ticket,
  Calendar,
};

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid gap-2 p-4">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] || Plus;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-3 rounded-md p-3 transition-all duration-150 hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
