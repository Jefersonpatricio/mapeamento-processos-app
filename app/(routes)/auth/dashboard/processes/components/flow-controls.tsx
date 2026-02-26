"use client";

import React from "react";
import { MoveVertical, MoveHorizontal, Cpu, Wrench } from "lucide-react";
import { Panel, useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Direction } from "./flow-contexts";

export function FitViewOnDirectionChange({
  direction,
}: {
  direction: Direction;
}) {
  const { fitView } = useReactFlow();
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const t = setTimeout(() => fitView({ padding: 0.1, duration: 600 }), 50);
    return () => clearTimeout(t);
  }, [direction, fitView]);
  return null;
}

interface DirectionToggleProps {
  direction: Direction;
  onDirectionChange: (d: Direction) => void;
}

export function DirectionToggle({
  direction,
  onDirectionChange,
}: DirectionToggleProps) {
  return (
    <Panel position="top-right">
      <div className="flex gap-1 bg-card border border-border rounded-md p-1 shadow-sm">
        <button
          onClick={() => onDirectionChange("TB")}
          title="Layout Vertical"
          className={`p-1.5 rounded transition-colors ${
            direction === "TB"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <MoveVertical className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDirectionChange("LR")}
          title="Layout Horizontal"
          className={`p-1.5 rounded transition-colors ${
            direction === "LR"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <MoveHorizontal className="h-4 w-4" />
        </button>
      </div>
    </Panel>
  );
}

export function FlowLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 border-t border-border bg-card shrink-0 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground whitespace-nowrap">
        Legenda:
      </span>
      <span className="flex items-center gap-1">
        <Cpu className="h-3 w-3 text-blue-500" /> Sistemático
      </span>
      <span className="flex items-center gap-1">
        <Wrench className="h-3 w-3 text-amber-500" /> Manual
      </span>
      <span className="w-px h-4 bg-border" />
      <span className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm border-2 border-emerald-500 inline-block" />{" "}
        Baixa
      </span>
      <span className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm border-2 border-amber-500 inline-block" />{" "}
        Média
      </span>
      <span className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm border-2 border-red-500 inline-block" />{" "}
        Alta
      </span>
      <span className="w-px h-4 bg-border" />
      <span className="flex items-center gap-1 opacity-60">
        <span className="w-3 h-3 rounded-sm border-2 border-dashed border-muted-foreground inline-block" />{" "}
        Inativo
      </span>
    </div>
  );
}

interface DepartmentFilterProps {
  departments: { id: string; name: string }[];
  selectedDepartment: string;
  onDepartmentChange: (v: string) => void;
}

export function DepartmentFilter({
  departments,
  selectedDepartment,
  onDepartmentChange,
}: DepartmentFilterProps) {
  const { fitView, getNode } = useReactFlow();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleChange = (value: string) => {
    onDepartmentChange(value);
    setTimeout(() => {
      if (value !== "all") {
        const groupNode = getNode(`group-${value}`);
        if (groupNode)
          fitView({ nodes: [groupNode], padding: 0.2, duration: 800 });
      } else {
        fitView({ padding: 0.1, duration: 800 });
      }
    }, 0);
  };

  return (
    <Select value={selectedDepartment} onValueChange={handleChange}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Selecione um departamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os departamentos</SelectItem>
        {departments.map((d) => (
          <SelectItem key={d.id} value={d.id}>
            {d.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
