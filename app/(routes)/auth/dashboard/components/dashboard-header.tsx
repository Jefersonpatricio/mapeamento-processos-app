interface DashboardHeaderProps {
  title: string;
  description?: string;
  showLastUpdated?: boolean;
  lastUpdated?: string;
}

export function DashboardHeader({
  title,
  description,
  showLastUpdated = true,
  lastUpdated = "Just now",
}: DashboardHeaderProps) {
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
