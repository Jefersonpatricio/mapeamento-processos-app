import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export type ProcessType = "systemic" | "manual";
export type ProcessCriticality = "low" | "medium" | "high";

export interface ProcessApiResponse {
  id: string;
  name: string;
  type: ProcessType;
  criticality: ProcessCriticality;
  active: boolean;
  documented: boolean;
  description: string | null;
  departmentId: string;
  parentId: string | null;
  tools: string[];
  responsibles: string[];
  documentLink: string | null;
  department: { id: string; name: string; slug: string } | null;
  parent: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  _count?: { children: number; documents: number };
}

export interface Process {
  id: string;
  name: string;
  type: ProcessType;
  criticality: ProcessCriticality;
  active: boolean;
  documented: boolean;
  description: string | null;
  departmentId: string;
  departmentName: string | null;
  departmentSlug: string | null;
  parentId: string | null;
  parentName: string | null;
  tools: string[];
  responsibles: string[];
  documentLink: string | null;
  childCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcessDto {
  name: string;
  type: ProcessType;
  criticality: ProcessCriticality;
  description?: string;
  departmentId: string;
  parentId?: string;
  tools?: string[];
  responsibles?: string[];
  documentLink?: string;
}

export type UpdateProcessDto = Partial<CreateProcessDto>;

export interface ProcessFiltersDto {
  departmentId?: string;
  type?: ProcessType;
  status?: "active" | "inactive";
  documented?: "true" | "false";
  search?: string;
}

export function formTypeToApi(v: "sistematico" | "manual"): ProcessType {
  return v === "sistematico" ? "systemic" : "manual";
}

export function apiTypeToForm(v: ProcessType): "sistematico" | "manual" {
  return v === "systemic" ? "sistematico" : "manual";
}

export function formCriticalityToApi(
  v: "baixa" | "media" | "alta",
): ProcessCriticality {
  const map = { baixa: "low", media: "medium", alta: "high" } as const;
  return map[v];
}

export function apiCriticalityToForm(
  v: ProcessCriticality,
): "baixa" | "media" | "alta" {
  const map = { low: "baixa", medium: "media", high: "alta" } as const;
  return map[v];
}

function normalize(p: ProcessApiResponse): Process {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    criticality: p.criticality,
    active: p.active,
    documented: p.documented,
    description: p.description,
    departmentId: p.departmentId,
    departmentName: p.department?.name ?? null,
    departmentSlug: p.department?.slug ?? null,
    parentId: p.parentId,
    parentName: p.parent?.name ?? null,
    tools: p.tools ?? [],
    responsibles: p.responsibles ?? [],
    documentLink: p.documentLink,
    childCount: p._count?.children ?? 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function buildQuery(filters?: ProcessFiltersDto): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.departmentId) params.set("departmentId", filters.departmentId);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.documented !== undefined)
    params.set("documented", filters.documented);
  if (filters.search) params.set("search", filters.search);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export function useProcesses(initialFilters?: ProcessFiltersDto) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = useCallback(
    async (filters?: ProcessFiltersDto) => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<ProcessApiResponse[]>(
          `/processes${buildQuery(filters ?? initialFilters)}`,
        );
        setProcesses(data.map(normalize));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar processos.",
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchProcesses(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProcesses]);

  const createProcess = useCallback(
    async (dto: CreateProcessDto): Promise<Process> => {
      const created = await api.post<ProcessApiResponse>("/processes", dto);
      const normalized = normalize(created);
      setProcesses((prev) => [normalized, ...prev]);
      return normalized;
    },
    [],
  );

  const updateProcess = useCallback(
    async (id: string, dto: UpdateProcessDto): Promise<Process> => {
      const updated = await api.put<ProcessApiResponse>(
        `/processes/${id}`,
        dto,
      );
      const normalized = normalize(updated);
      setProcesses((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...normalized,
                childCount: p.childCount,
              }
            : p,
        ),
      );
      return normalized;
    },
    [],
  );

  const toggleStatus = useCallback(
    async (id: string, currentActive: boolean): Promise<void> => {
      await api.patch(`/processes/${id}/status`);
      setProcesses((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !currentActive } : p)),
      );
    },
    [],
  );

  const toggleDocumented = useCallback(
    async (id: string, currentDocumented: boolean): Promise<void> => {
      await api.patch(`/processes/${id}/documented`);
      setProcesses((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, documented: !currentDocumented } : p,
        ),
      );
    },
    [],
  );

  const deleteProcess = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/processes/${id}`);
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    processes,
    loading,
    error,
    refetch: fetchProcesses,
    createProcess,
    updateProcess,
    toggleStatus,
    toggleDocumented,
    deleteProcess,
  };
}

export async function fetchProcess(id: string): Promise<Process> {
  const data = await api.get<ProcessApiResponse>(`/processes/${id}`);
  return normalize(data);
}
