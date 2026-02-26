"use client";

import {
  Plus,
  Edit,
  Cpu,
  Wrench,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Link2,
  GitBranch,
  Building2,
  AlertTriangle,
  AlertCircle,
  Info,
  Tag,
} from "lucide-react";
import type { Node } from "@xyflow/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Process } from "@/hooks/use-processes";

interface ProcessDetailModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  selectedNode: Node | null;
  processes: Process[];
  onAddChild: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CRIT_LABEL = { low: "Baixa", medium: "Média", high: "Alta" } as const;
const CRIT_COLOR = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
} as const;

export function ProcessDetailModal({
  isOpen,
  onClose,
  selectedNode,
  processes,
  onAddChild,
  onEdit,
}: ProcessDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[calc(100vw-2rem)] sm:max-w-lg mx-auto p-0 overflow-hidden gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {selectedNode &&
          (() => {
            const isGroup = selectedNode.id.startsWith("group-");
            const p = isGroup
              ? null
              : processes.find((x) => x.id === selectedNode.id);

            const departmentId = selectedNode.id.replace("group-", "");
            const processesLength = isGroup
              ? processes.filter((x) => x.departmentId === departmentId).length
              : 0;

            return (
              <>
                <div className="px-6 pt-6 pb-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        {isGroup ? "Departamento" : "Processo"}
                      </p>
                      <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                        {String(selectedNode.data.label)}
                      </DialogTitle>
                      {p?.departmentName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          {p.departmentName}
                        </div>
                      )}
                    </div>
                    {p && (
                      <div className="flex flex-col items-end gap-1.5 shrink-0 mt-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            p.active
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {p.active ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {p.active ? "Ativo" : "Inativo"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            p.documented || p.documentLink
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          <FileText className="h-3 w-3" />
                          {p.documented || p.documentLink
                            ? "Documentado"
                            : "Não documentado"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
                  {p ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-border p-3">
                          <p className="text-[11px] text-muted-foreground mb-1.5">
                            Tipo
                          </p>
                          <div className="flex items-center gap-2">
                            {p.type === "systemic" ? (
                              <Cpu className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Wrench className="h-4 w-4 text-amber-500" />
                            )}
                            <span className="text-sm font-semibold">
                              {p.type === "systemic" ? "Sistemático" : "Manual"}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-border p-3">
                          <p className="text-[11px] text-muted-foreground mb-1.5">
                            Criticidade
                          </p>
                          <div className="flex items-center gap-2">
                            {p.criticality === "high" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : p.criticality === "medium" ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Info className="h-4 w-4 text-emerald-500" />
                            )}
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${CRIT_COLOR[p.criticality]}`}
                            >
                              {CRIT_LABEL[p.criticality]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {p.description && (
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Descrição
                          </p>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      )}

                      {(p.parentName || p.childCount > 0) && (
                        <div className="flex flex-col gap-1.5">
                          {p.parentName && (
                            <div className="flex items-center gap-2 text-sm">
                              <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">
                                Macroprocesso:
                              </span>
                              <span className="font-medium">
                                {p.parentName}
                              </span>
                            </div>
                          )}
                          {p.childCount > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <GitBranch className="h-4 w-4 text-muted-foreground shrink-0 scale-x-[-1]" />
                              <span className="text-muted-foreground">
                                Subprocessos:
                              </span>
                              <span className="font-semibold">
                                {p.childCount}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {p.responsibles.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                            <Users className="h-3.5 w-3.5" /> Responsáveis
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.responsibles.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.tools.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                            <Tag className="h-3.5 w-3.5" /> Sistemas e
                            ferramentas
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.tools.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.documentLink && (
                        <a
                          href={p.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                        >
                          <Link2 className="h-4 w-4 shrink-0" /> Ver documento
                        </a>
                      )}
                    </>
                  ) : (
                    isGroup && (
                      <p className="text-sm text-muted-foreground">
                        {processesLength === 0
                          ? "Nenhum processo cadastrado ainda. Clique no botão abaixo para criar o primeiro processo deste departamento."
                          : "Clique num processo dentro deste departamento para ver seus detalhes."}
                      </p>
                    )
                  )}
                </div>

                <div className="px-6 py-4 border-t border-border flex gap-2 justify-end">
                  {!isGroup && (
                    <Button variant="outline" onClick={onAddChild}>
                      <Plus className="h-4 w-4" />
                      Adicionar Subprocesso
                    </Button>
                  )}
                  {isGroup ? (
                    <Button onClick={onAddChild}>
                      <Plus className="h-4 w-4" />
                      Novo Processo
                    </Button>
                  ) : (
                    <Button onClick={onEdit}>
                      <Edit className="h-4 w-4" />
                      Editar Processo
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
      </DialogContent>
    </Dialog>
  );
}
