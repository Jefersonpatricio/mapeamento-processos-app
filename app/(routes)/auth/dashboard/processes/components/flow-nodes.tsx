"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Cpu, Wrench } from "lucide-react";
import type { ProcessType, ProcessCriticality } from "@/hooks/use-processes";
import { SelectedNodeContext, DirectionContext } from "./flow-contexts";
import { CRITICALITY_BORDER } from "./flow-layout";

interface CustomNodeData {
  label: string;
  type?: ProcessType;
  criticality?: ProcessCriticality;
  active?: boolean;
}

export function CustomNode({
  data,
  id,
}: {
  data: CustomNodeData;
  id?: string;
}) {
  const selectedNodeId = React.useContext(SelectedNodeContext);
  const direction = React.useContext(DirectionContext);
  const isHorizontal = direction === "LR";
  const isSelected = selectedNodeId === id;
  const critColor = data.criticality
    ? CRITICALITY_BORDER[data.criticality]
    : undefined;
  const isInactive = data.active === false;

  const borderColor = isSelected
    ? "var(--primary)"
    : (critColor ?? "var(--border)");

  return (
    <div
      style={{
        borderColor,
        borderStyle: isInactive ? "dashed" : "solid",
        opacity: isInactive ? 0.55 : 1,
      }}
      className="px-3 py-2 shadow-sm rounded-lg bg-card border-2 transition-all min-w-40 max-w-55 hover:brightness-95"
    >
      <div className="flex items-center justify-center gap-1.5">
        {data.type === "systemic" ? (
          <Cpu className="h-3 w-3 text-blue-500 shrink-0" />
        ) : data.type === "manual" ? (
          <Wrench className="h-3 w-3 text-amber-500 shrink-0" />
        ) : null}
        <span className="text-xs font-semibold text-foreground leading-tight text-center">
          {data.label}
        </span>
      </div>
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

export function GroupNode({ data }: { data: { label: string } }) {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-2 left-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {data.label}
      </div>
    </div>
  );
}

export const nodeTypes = { custom: CustomNode, group: GroupNode };
