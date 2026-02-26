"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NewProcessForm } from "../../../departments/components/form";
import {
  fetchProcess,
  apiTypeToForm,
  apiCriticalityToForm,
  type Process,
} from "@/hooks/use-processes";

export default function EditProcessPage() {
  const params = useParams();
  const processId = params.id as string;

  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcess(processId)
      .then(setProcess)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Erro ao carregar processo.",
        ),
      )
      .finally(() => setLoading(false));
  }, [processId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm font-medium text-destructive">
          {error ?? "Processo não encontrado."}
        </p>
      </div>
    );
  }

  const initialData = {
    department: process.departmentId,
    processType: apiTypeToForm(process.type),
    criticality: apiCriticalityToForm(process.criticality),
    title: process.name,
    description: process.description ?? "",
    parentId: process.parentId ?? "",
    tools: process.tools,
    responsibles: process.responsibles,
    documentLink: process.documentLink ?? "",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <NewProcessForm
        initialData={initialData}
        mode="edit"
        processId={processId}
        parentLabel={process.parentName ?? undefined}
      />
    </div>
  );
}
