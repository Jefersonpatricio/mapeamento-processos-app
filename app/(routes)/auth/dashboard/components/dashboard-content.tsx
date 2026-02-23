"use client";

import { StatCard } from "./stat-card";
import { ActivityList } from "./activity-list";
import { QuickActions } from "./quick-actions";
import { SectorsList } from "./sectors-list";
import {
  statsData,
  recentActivityData,
  quickActionsData,
  sectorsData,
} from "../data/dashboard-data";

const nome = "Jeferson";

export function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Olá, {nome}
              </h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo de volta! Aqui está uma visão geral das suas
                atividades recentes e estatísticas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: Just now
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>

        {/* Sectors Section */}
        <div className="mt-8">
          <SectorsList sectors={sectorsData} />
        </div>

        {/* Two Column Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityList activities={recentActivityData} />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div>
            <QuickActions actions={quickActionsData} />
          </div>
        </div>

        {/* Additional Section */}
        <div className="mt-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Getting Started
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore the sidebar navigation to access all features. Use the
              toggle button to expand or collapse the sidebar on desktop. On
              mobile devices, the sidebar automatically collapses to icons only.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20">
                Responsive Design
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary dark:bg-secondary/20">
                Dark Mode Support
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Accessible
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
