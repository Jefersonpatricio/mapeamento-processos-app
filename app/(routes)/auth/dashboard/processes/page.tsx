"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, SquarePen, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeMouseHandler,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { useProcesses } from "@/hooks/use-processes";
import { useDepartments } from "@/hooks/use-departments";

import {
  SelectedNodeContext,
  DirectionContext,
  type Direction,
} from "./components/flow-contexts";
import { buildNodesAndEdges } from "./components/flow-layout";
import { nodeTypes } from "./components/flow-nodes";
import {
  DepartmentFilter,
  DirectionToggle,
  FitViewOnDirectionChange,
  FlowLegend,
} from "./components/flow-controls";
import { ProcessDetailModal } from "./components/process-detail-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProcessesPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const {
    processes,
    loading,
    error,
    deleteProcess,
    refetch: refetchProcesses,
  } = useProcesses();
  const { departments, refetch: refetchDepartments } = useDepartments();

  const [nodesState, setNodes] = useState<Node[]>([]);
  const [edgesState, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [direction, setDirection] = useState<Direction>("TB");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProcess = async () => {
    if (!selectedNode || selectedNode.id.startsWith("group-")) return;
    setDeleting(true);
    try {
      await deleteProcess(selectedNode.id);
      await refetchDepartments();
      await refetchProcesses();
      toast.success("Processo excluído com sucesso!");
      setIsModalOpen(false);
      setSelectedNode(null);
    } catch (err) {
      toast.error("Erro ao excluir processo.");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  const { nodes: builtNodes, edges: builtEdges } = useMemo(
    () => buildNodesAndEdges(processes, departments, direction),
    [processes, departments, direction],
  );

  React.useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
  }, [builtNodes, builtEdges]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((n) => applyNodeChanges(changes, n)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((e) => applyEdgeChanges(changes, e)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((e) => addEdge(params, e)),
    [],
  );

  const onNodeClick: NodeMouseHandler<Node> = (_, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleAddChildProcess = () => {
    if (!selectedNode) return;
    const isGroup = selectedNode.id.startsWith("group-");
    let departmentId: string;

    if (isGroup) {
      departmentId = selectedNode.id.replace("group-", "");
    } else {
      const process = processes.find((p) => p.id === selectedNode.id);
      departmentId = process?.departmentId ?? "";
    }

    const params = new URLSearchParams({
      parentId: isGroup ? "" : selectedNode.id,
      parentLabel: String(selectedNode.data.label),
      parentDepartment: departmentId,
    });
    if (isGroup) params.delete("parentId");

    router.push(`/auth/dashboard/processes/new?${params.toString()}`);
  };

  const handleEditProcess = () => {
    if (!selectedNode || selectedNode.id.startsWith("group-")) return;
    router.push(`/auth/dashboard/processes/${selectedNode.id}/edit`);
  };

  const visibleNodes = useMemo(() => {
    if (selectedDepartment === "all") return nodesState;
    return nodesState.filter(
      (n) =>
        n.id === `group-${selectedDepartment}` ||
        n.parentId === `group-${selectedDepartment}`,
    );
  }, [nodesState, selectedDepartment]);

  const visibleEdges = useMemo(() => {
    if (selectedDepartment === "all") return edgesState;
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return edgesState.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
    );
  }, [edgesState, visibleNodes, selectedDepartment]);

  if (loading || !processes) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2">
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-8">
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push("/auth/dashboard/processes/new")}
        >
          Criar novo processo
          <Plus data-icon="inline-end" />
        </Button>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <SquarePen size={24} color="gray" />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-card border border-border text-foreground"
            >
              <p>
                Para editar o processo você precisa clicar no nó correspondente
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Visualização de Processos
        </h2>
        <p className="text-sm text-muted-foreground">
          Mapeamento visual dos processos e subprocessos
        </p>
      </div>

      <ReactFlowProvider>
        <div className="w-full h-[calc(100vh-21rem)] rounded-lg border border-border bg-card overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card shrink-0">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Filtrar por departamento:
            </span>
            <DepartmentFilter
              departments={departments}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
            />
          </div>

          <div className="flex-1 relative">
            <DirectionContext.Provider value={direction}>
              <SelectedNodeContext.Provider value={selectedNode?.id ?? null}>
                <ReactFlow
                  nodes={visibleNodes}
                  edges={visibleEdges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodesConnectable={false}
                  nodesDraggable
                  colorMode={resolvedTheme === "dark" ? "dark" : "light"}
                  fitView
                >
                  <Background
                    variant={BackgroundVariant.Dots}
                    gap={12}
                    size={1}
                  />
                  <Controls />
                  <MiniMap
                    pannable
                    zoomable
                    nodeColor={(node) => {
                      if (node.type === "group") return "transparent";
                      const crit = (node.data as { criticality?: string })
                        .criticality;
                      if (crit === "high") return "#ef4444";
                      if (crit === "medium") return "#f59e0b";
                      return "#10b981";
                    }}
                    nodeStrokeColor={(node) => {
                      if (node.type === "group") return "#6b7280";
                      const crit = (node.data as { criticality?: string })
                        .criticality;
                      if (crit === "high") return "#ef4444";
                      if (crit === "medium") return "#f59e0b";
                      return "#10b981";
                    }}
                    nodeStrokeWidth={2}
                    maskColor="rgba(0,0,0,0.06)"
                    className="bg-card! border! border-border! rounded-lg"
                  />
                  <FitViewOnDirectionChange direction={direction} />
                  <DirectionToggle
                    direction={direction}
                    onDirectionChange={setDirection}
                  />
                </ReactFlow>
              </SelectedNodeContext.Provider>
            </DirectionContext.Provider>
          </div>

          <FlowLegend />
        </div>
      </ReactFlowProvider>

      <ProcessDetailModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        selectedNode={selectedNode}
        processes={processes}
        onAddChild={handleAddChildProcess}
        onEdit={handleEditProcess}
        onDelete={() => setConfirmDeleteOpen(true)}
      />

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <p>
            Tem certeza que deseja excluir este processo? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProcess}
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
