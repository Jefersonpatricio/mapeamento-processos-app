"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  showLastUpdated?: boolean;
}

function useLastUpdated() {
  const [loadedAt] = useState(() => new Date());
  const [label, setLabel] = useState(() => {
    const diff = Math.floor((Date.now() - loadedAt.getTime()) / 1000);
    if (diff < 60) {
      return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (agora mesmo)`;
    }
    const mins = Math.floor(diff / 60);
    if (mins < 60) {
      return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (há ${mins} min)`;
    }
    const hrs = Math.floor(mins / 60);
    return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (há ${hrs}h)`;
  });

  useEffect(() => {
    function format() {
      const diff = Math.floor((Date.now() - loadedAt.getTime()) / 1000);
      if (diff < 60) {
        return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (agora mesmo)`;
      }
      const mins = Math.floor(diff / 60);
      if (mins < 60) {
        return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (há ${mins} min)`;
      }
      const hrs = Math.floor(mins / 60);
      return `${loadedAt.getHours().toString().padStart(2, "0")}:${loadedAt.getMinutes().toString().padStart(2, "0")} (há ${hrs}h)`;
    }

    const id = setInterval(() => setLabel(format()), 60_000);
    return () => clearInterval(id);
  }, [loadedAt]);

  return label;
}

export function DashboardHeader({
  title,
  description,
  showLastUpdated = true,
}: DashboardHeaderProps) {
  const lastUpdated = useLastUpdated();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {showLastUpdated && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Última atualização: {lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
