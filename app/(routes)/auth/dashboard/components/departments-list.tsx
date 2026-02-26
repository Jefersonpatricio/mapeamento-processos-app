"use client";

import { Building2, Cpu, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Department } from "../data/dashboard-data";
import { Checkbox } from "@/components/ui/checkbox";

const iconMap: Record<string, LucideIcon> = {
  Building2,
};

const colorClasses: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  primary: {
    bg: "bg-primary/10 dark:bg-primary/20",
    text: "text-primary",
    border: "border-primary/20",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
  },
};

interface DepartmentsListProps {
  departments: Department[];
  isEditing: boolean;
  selectedDepartments: string[];
  onToggleDepartment: (departmentId: string) => void;
}

export function DepartmentsList({
  departments,
  isEditing,
  selectedDepartments,
  onToggleDepartment,
}: DepartmentsListProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">
          Departamentos Cadastrados
        </h3>
        <p className="text-sm text-muted-foreground">
          Para visualizar os processos de um departamento, vá para a aba de
          Processos.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {departments.map((department) => {
          const Icon = iconMap[department.icon] || Building2;
          const colors = colorClasses[department.color] || colorClasses.primary;
          const isSelected = selectedDepartments.includes(department.id);

          return (
            <div
              key={department.id}
              className={cn(
                "group relative flex flex-col gap-3 rounded-lg border p-4 transition-all duration-150",
                "hover:shadow-md",
                isSelected && isEditing
                  ? "border-primary/50 bg-primary/5"
                  : colors.border,
                "bg-card",
              )}
            >
              {isEditing && (
                <div className="absolute right-3 top-3 z-10">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleDepartment(department.id)}
                    className="cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                    colors.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {department.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {department.processCount}{" "}
                    {department.processCount === 1 ? "processo" : "processos"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <div
                  className="flex items-center gap-1.5"
                  title="Processos Sistêmicos"
                >
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {department.systemicCount}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="Processos Manuais"
                >
                  <Wrench className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {department.manualCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
