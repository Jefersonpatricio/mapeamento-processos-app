"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  FolderOpen,
  Ticket,
  TrendingUp,
  TrendingDown,
  Cpu,
  Wrench,
  Cog,
  type LucideIcon,
} from "lucide-react";
import type { StatCard as StatCardType } from "../data/dashboard-data";

const iconMap: Record<string, LucideIcon> = {
  Users,
  FolderOpen,
  Ticket,
  TrendingUp,
  Cpu,
  Wrench,
  Cog,
};

interface StatCardProps {
  stat: StatCardType;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon] || TrendingUp;
  const isPositive = stat.changeType === "positive";
  const isNegative = stat.changeType === "negative";
  const showChange = !!stat.change && stat.changeType !== "neutral";

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {showChange && (
        <div className="mt-4 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              isPositive && "text-emerald-500",
              isNegative && "text-red-500",
            )}
          >
            {stat.change}
          </span>
          <span className="text-sm text-muted-foreground">
            em relação ao mês passado
          </span>
        </div>
      )}
    </div>
  );
}
