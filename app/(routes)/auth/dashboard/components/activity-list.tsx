"use client";

import type { RecentActivity } from "../data/dashboard-data";

interface ActivityListProps {
  activities: RecentActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-4 transition-colors duration-150 hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary dark:bg-primary/20">
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium text-foreground">
                  {activity.user}
                </span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium text-foreground">
                  {activity.target}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
