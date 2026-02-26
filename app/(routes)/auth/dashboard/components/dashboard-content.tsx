"use client";

import { useState, useMemo } from "react";
import { StatCard } from "./stat-card";
import { ActivityList } from "./activity-list";
import { QuickActions } from "./quick-actions";
import { DepartmentsList } from "./departments-list";
import { Button } from "@/components/ui/button";
import { DepartmentModal } from "./department-modal";
import { recentActivityData, quickActionsData } from "../data/dashboard-data";
import { useProcesses } from "@/hooks/use-processes";
import { useDepartments } from "@/hooks/use-departments";
import { toast } from "sonner";

const DEPT_COLORS = [
  "primary",
  "emerald",
  "blue",
  "purple",
  "amber",
  "rose",
  "teal",
  "indigo",
];

export function DashboardContent() {
  const { processes, loading: loadingProcesses } = useProcesses();
  const {
    departments: apiDepartments,
    loading: loadingDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDepartmentName, setEditingDepartmentName] = useState("");

  const statsData = useMemo(() => {
    const total = processes.length;
    const documented = processes.filter((p) => p.documented).length;
    const systemic = processes.filter((p) => p.type === "systemic").length;
    const manual = processes.filter((p) => p.type === "manual").length;
    return [
      { title: "Total de processos", value: String(total), icon: "Cog" },
      {
        title: "Com documentação",
        value: String(documented),
        icon: "FolderOpen",
      },
      { title: "Processos Sistêmicos", value: String(systemic), icon: "Cpu" },
      { title: "Processos Manuais", value: String(manual), icon: "Wrench" },
    ];
  }, [processes]);

  const departmentsData = useMemo(
    () =>
      apiDepartments.map((dept, idx) => ({
        id: dept.id,
        name: dept.name,
        processCount: dept.processCount,
        systemicCount: dept.systemicCount,
        manualCount: dept.manualCount,
        icon: "Building2",
        color: DEPT_COLORS[idx % DEPT_COLORS.length],
      })),
    [apiDepartments],
  );

  const handleStartEdit = () => {
    setIsEditing(true);
    setSelectedDepartments([]);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingDepartmentName("");
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedDepartments([]);
  };

  const handleToggleDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(departmentId)) {
        return prev.filter((id) => id !== departmentId);
      }
      return [...prev, departmentId];
    });
  };

  const handleEditSelected = () => {
    if (selectedDepartments.length === 1) {
      const department = departmentsData.find(
        (s) => s.id === selectedDepartments[0],
      );
      if (department) {
        setEditingDepartmentName(department.name);
        setModalMode("edit");
        setModalOpen(true);
      }
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedDepartments.map((id) => deleteDepartment(id)));
    } catch (err) {
      console.error("Erro ao deletar departamentos:", err);
    }
    setSelectedDepartments([]);
    setIsEditing(false);
  };

  const handleModalSubmit = async (name: string) => {
    try {
      if (modalMode === "edit" && selectedDepartments.length === 1) {
        await updateDepartment(selectedDepartments[0], { name });
        toast.success("Departamento atualizado com sucesso!");
      } else {
        await createDepartment({ name });
        toast.success("Departamento criado com sucesso!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar departamento.",
      );
    }
    setModalOpen(false);
    setEditingDepartmentName("");
    setSelectedDepartments([]);
    setIsEditing(false);
  };
  return (
    <>
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        {loadingProcesses ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </div>
        )}

        {/* Departments Section */}
        <div className="mt-8">
          {loadingDepartments ? (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DepartmentsList
              departments={departmentsData}
              isEditing={isEditing}
              selectedDepartments={selectedDepartments}
              onToggleDepartment={handleToggleDepartment}
            />
          )}

          {/* Botões de ação quando está editando */}
          {isEditing && (
            <div className="mt-4 flex items-center justify-start gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              {selectedDepartments.length === 1 && (
                <Button onClick={handleEditSelected}>
                  Editar Departamento
                </Button>
              )}
              {selectedDepartments.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="text-white"
                >
                  Excluir{" "}
                  {selectedDepartments.length > 1
                    ? `(${selectedDepartments.length})`
                    : ""}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Quick Actions - Takes 1 column */}
          <div>
            <QuickActions
              actions={quickActionsData}
              onStartEdit={handleStartEdit}
              onOpenCreate={handleOpenCreate}
            />
          </div>

          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityList activities={recentActivityData} />
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <DepartmentModal
        isOpen={modalOpen}
        mode={modalMode}
        onClose={() => {
          setModalOpen(false);
          setEditingDepartmentName("");
        }}
        onSubmit={handleModalSubmit}
        initialValue={editingDepartmentName}
      />
    </>
  );
}
