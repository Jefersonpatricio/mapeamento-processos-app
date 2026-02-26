"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Cpu,
  Wrench,
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { useDepartments, type Department } from "@/hooks/use-departments";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortField = "name" | "processCount" | "documentedPercent" | "status";
type SortDir = "asc" | "desc";

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return (
      <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />
    );
  return sortDir === "asc" ? (
    <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
  );
}

export default function DepartmentsPage() {
  const {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    toggleStatus,
    deleteDepartment,
  } = useDepartments();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [formName, setFormName] = useState("");
  const [formManager, setFormManager] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const result = departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.manager ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "processCount":
          cmp = a.processCount - b.processCount;
          break;
        case "documentedPercent":
          cmp = a.documentedPercent - b.documentedPercent;
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [departments, search, statusFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    const active = departments.filter((d) => d.status === "active");
    const totalProcesses = departments.reduce(
      (sum, d) => sum + d.processCount,
      0,
    );
    const avgDocumented =
      active.length > 0
        ? Math.round(
            active.reduce((sum, d) => sum + d.documentedPercent, 0) /
              active.length,
          )
        : 0;
    const topDept =
      departments.length > 0
        ? [...departments].sort((a, b) => b.processCount - a.processCount)[0]
        : null;
    return {
      total: departments.length,
      active: active.length,
      totalProcesses,
      avgDocumented,
      topDept,
    };
  }, [departments]);

  const openCreate = useCallback(() => {
    setModalMode("create");
    setFormName("");
    setFormManager("");
    setFormError(null);
    setEditingDepartment(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((dept: Department) => {
    setModalMode("edit");
    setFormName(dept.name);
    setFormManager(dept.manager ?? "");
    setFormError(null);
    setEditingDepartment(dept);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formName.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      if (modalMode === "create") {
        await createDepartment({
          name: formName.trim(),
          manager: formManager.trim() || undefined,
        });
      } else if (editingDepartment) {
        await updateDepartment(editingDepartment.id, {
          name: formName.trim(),
          manager: formManager.trim() || undefined,
        });
      }
      setModalOpen(false);
      setFormName("");
      setFormManager("");
      setEditingDepartment(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erro ao salvar departamento.",
      );
    } finally {
      setSaving(false);
    }
  }, [
    formName,
    formManager,
    modalMode,
    editingDepartment,
    createDepartment,
    updateDepartment,
  ]);

  const confirmDelete = useCallback((dept: Department) => {
    setDepartmentToDelete(dept);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!departmentToDelete) return;
    setSaving(true);
    try {
      await deleteDepartment(departmentToDelete.id);
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setSaving(false);
    }
  }, [departmentToDelete, deleteDepartment]);

  const handleToggleStatus = useCallback(
    async (dept: Department) => {
      try {
        await toggleStatus(dept.id, dept.status);
      } catch (err) {
        console.error("Erro ao alterar status:", err);
      }
    },
    [toggleStatus],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <p className="text-xs text-muted-foreground">
          Verifique a conexão com o servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatMini
          label="Total de departamentos"
          value={String(stats.total)}
          sub={`${stats.active} ativos`}
        />
        <StatMini
          label="Total de processos"
          value={String(stats.totalProcesses)}
          sub="em todos os departamentos"
        />
        <StatMini
          label="Documentação média"
          value={`${stats.avgDocumented}%`}
          sub="dos departamentos ativos"
        />
        <StatMini
          label="Maior departamento"
          value={stats.topDept?.name ?? "—"}
          sub={
            stats.topDept ? `${stats.topDept.processCount} processos` : "Nenhum"
          }
        />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar departamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {s === "all" ? "Todos" : s === "active" ? "Ativos" : "Inativos"}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Departamento
                    <SortIcon
                      field="name"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Responsável
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort("processCount")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Processos
                    <SortIcon
                      field="processCount"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground hidden md:table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">Sist. / Man.</span>
                      </TooltipTrigger>
                      <TooltipContent>Sistêmicos / Manuais</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground hidden lg:table-cell">
                  <button
                    onClick={() => handleSort("documentedPercent")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Documentação
                    <SortIcon
                      field="documentedPercent"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Status
                    <SortIcon
                      field="status"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium">
                      Nenhum departamento encontrado
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tente ajustar os filtros ou crie um novo departamento.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => {
                  return (
                    <tr
                      key={dept.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {dept.name}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {dept.manager ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {dept.manager ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-center font-medium">
                        {dept.processCount}
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center justify-center gap-3">
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Cpu className="h-3.5 w-3.5 text-blue-500" />
                            {dept.systemicCount}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Wrench className="h-3.5 w-3.5 text-amber-500" />
                            {dept.manualCount}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                dept.documentedPercent >= 80
                                  ? "bg-emerald-500"
                                  : dept.documentedPercent >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                              style={{
                                width: `${dept.documentedPercent}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {dept.documentedPercent}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(dept)}
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                            dept.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground hover:bg-muted/80",
                          )}
                        >
                          {dept.status === "active" ? "Ativo" : "Inativo"}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEdit(dept)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => confirmDelete(dept)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Excluir</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Exibindo {filtered.length} de {departments.length} departamentos
          </div>
        )}
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(false);
            setEditingDepartment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create"
                ? "Novo Departamento"
                : "Editar Departamento"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "create"
                ? "Preencha as informações do novo departamento."
                : "Atualize as informações do departamento."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="dept-name">Nome do Departamento</Label>
              <Input
                id="dept-name"
                placeholder="Ex: Recursos Humanos, Financeiro..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-manager">Responsável</Label>
              <Input
                id="dept-manager"
                placeholder="Nome do gestor responsável"
                value={formManager}
                onChange={(e) => setFormManager(e.target.value)}
              />
            </div>
            {formError && (
              <p className="text-xs text-destructive">{formError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!formName.trim() || saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {modalMode === "create" ? "Criar" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir Departamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o departamento{" "}
              <strong>{departmentToDelete?.name}</strong>? Essa ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              className="text-white"
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatMini({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
