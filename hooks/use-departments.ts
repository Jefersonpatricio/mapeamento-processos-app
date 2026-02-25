import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface DepartmentApiResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  manager: string | null;
  active: boolean;
  processCount?: number;
  systemicCount?: number;
  manualCount?: number;
  documentedPercent?: number;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  manager: string | null;
  processCount: number;
  systemicCount: number;
  manualCount: number;
  documentedPercent: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  slug?: string;
  manager?: string;
  description?: string;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface UpdateDepartmentDto {
  name: string;
  manager?: string;
  description?: string;
}

function normalize(d: DepartmentApiResponse): Department {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    manager: d.manager,
    processCount: d.processCount ?? 0,
    systemicCount: d.systemicCount ?? 0,
    manualCount: d.manualCount ?? 0,
    documentedPercent: d.documentedPercent ?? 0,
    status: d.active ? "active" : "inactive",
    createdAt: d.createdAt,
  };
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<DepartmentApiResponse[]>("/departments");
      setDepartments(data.map(normalize));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar departamentos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const createDepartment = useCallback(
    async (dto: CreateDepartmentDto): Promise<Department> => {
      const created = await api.post<DepartmentApiResponse>("/departments", {
        ...dto,
        slug: dto.slug ?? toSlug(dto.name),
      });
      const normalized = normalize(created);
      setDepartments((prev) => [...prev, normalized]);
      return normalized;
    },
    [],
  );

  const updateDepartment = useCallback(
    async (id: string, dto: UpdateDepartmentDto): Promise<Department> => {
      const updated = await api.put<DepartmentApiResponse>(
        `/departments/${id}`,
        dto,
      );
      const normalized = normalize(updated);
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...normalized,
                processCount: d.processCount,
                systemicCount: d.systemicCount,
                manualCount: d.manualCount,
                documentedPercent: d.documentedPercent,
              }
            : d,
        ),
      );
      return normalized;
    },
    [],
  );

  const toggleStatus = useCallback(
    async (id: string, currentStatus: "active" | "inactive"): Promise<void> => {
      const active = currentStatus !== "active";
      await api.patch(`/departments/${id}/status`, { active });
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: active ? "active" : "inactive" } : d,
        ),
      );
    },
    [],
  );

  const deleteDepartment = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/departments/${id}`);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    createDepartment,
    updateDepartment,
    toggleStatus,
    deleteDepartment,
  };
}
