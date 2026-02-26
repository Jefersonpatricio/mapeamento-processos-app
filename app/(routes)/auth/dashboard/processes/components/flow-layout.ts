import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@xyflow/react";
import type { ProcessType, ProcessCriticality } from "@/hooks/use-processes";
import type { Direction } from "./flow-contexts";

export const NODE_W = 190;
export const NODE_H = 40;
export const GRP_PAD = 24;
export const GRP_LABEL_H = 36;
export const GRP_H_GAP = 56;
export const GRP_ROW_GAP = 64;

export const CRITICALITY_BORDER: Record<ProcessCriticality, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export const GROUP_COLORS = [
  { bg: "rgba(59,130,246,0.05)", border: "rgba(59,130,246,0.3)" },
  { bg: "rgba(34,197,94,0.05)", border: "rgba(34,197,94,0.3)" },
  { bg: "rgba(168,85,247,0.05)", border: "rgba(168,85,247,0.3)" },
  { bg: "rgba(236,72,153,0.05)", border: "rgba(236,72,153,0.3)" },
  { bg: "rgba(249,115,22,0.05)", border: "rgba(249,115,22,0.3)" },
  { bg: "rgba(14,165,233,0.05)", border: "rgba(14,165,233,0.3)" },
];

export interface ProcessData {
  id: string;
  name: string;
  departmentId: string;
  parentId: string | null;
  type: ProcessType;
  criticality: ProcessCriticality;
  active: boolean;
}

export interface DeptData {
  id: string;
  name: string;
}

export function buildNodesAndEdges(
  processes: ProcessData[],
  departments: DeptData[],
  direction: Direction,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const byDept = new Map<string, ProcessData[]>();
  for (const p of processes) {
    if (!byDept.has(p.departmentId)) byDept.set(p.departmentId, []);
    byDept.get(p.departmentId)!.push(p);
  }

  interface GroupLayout {
    dept: DeptData;
    groupId: string;
    groupW: number;
    groupH: number;
    positions: Map<string, { x: number; y: number }>;
    deptProcesses: ProcessData[];
    color: (typeof GROUP_COLORS)[0];
  }

  const GRP_COLS = direction === "LR" ? 1 : 2;
  const groupLayouts: GroupLayout[] = [];

  for (let idx = 0; idx < departments.length; idx++) {
    const dept = departments[idx];
    const deptProcesses = byDept.get(dept.id) ?? [];
    const color = GROUP_COLORS[idx % GROUP_COLORS.length];
    const groupId = `group-${dept.id}`;
    const positions = new Map<string, { x: number; y: number }>();

    if (deptProcesses.length === 0) {
      groupLayouts.push({
        dept,
        groupId,
        groupW: 220,
        groupH: 80,
        positions,
        deptProcesses,
        color,
      });
      continue;
    }

    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, ranksep: 60, nodesep: 30 });

    for (const p of deptProcesses) {
      g.setNode(p.id, { width: NODE_W, height: NODE_H });
    }

    const deptIds = new Set(deptProcesses.map((p) => p.id));
    for (const p of deptProcesses) {
      if (p.parentId && deptIds.has(p.parentId)) {
        g.setEdge(p.parentId, p.id);
      }
    }

    dagre.layout(g);

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const p of deptProcesses) {
      const n = g.node(p.id);
      const x = n.x - NODE_W / 2;
      const y = n.y - NODE_H / 2;
      positions.set(p.id, { x, y });
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + NODE_W);
      maxY = Math.max(maxY, y + NODE_H);
    }

    for (const [id, pos] of positions) {
      positions.set(id, { x: pos.x - minX, y: pos.y - minY });
    }

    const innerW = maxX - minX;
    const innerH = maxY - minY;
    const groupW = Math.max(innerW + GRP_PAD * 2, 220);
    const groupH = innerH + GRP_LABEL_H + GRP_PAD * 2;

    groupLayouts.push({
      dept,
      groupId,
      groupW,
      groupH,
      positions,
      deptProcesses,
      color,
    });
  }

  const colWidths: number[] = [];
  const rowHeights: number[] = [];

  for (let idx = 0; idx < groupLayouts.length; idx++) {
    const col = idx % GRP_COLS;
    const row = Math.floor(idx / GRP_COLS);
    const { groupW, groupH } = groupLayouts[idx];
    colWidths[col] = Math.max(colWidths[col] ?? 0, groupW);
    rowHeights[row] = Math.max(rowHeights[row] ?? 0, groupH);
  }

  for (let idx = 0; idx < groupLayouts.length; idx++) {
    const { dept, groupId, groupW, groupH, positions, deptProcesses, color } =
      groupLayouts[idx];
    const col = idx % GRP_COLS;
    const row = Math.floor(idx / GRP_COLS);

    const gx = colWidths.slice(0, col).reduce((s, w) => s + w + GRP_H_GAP, 0);
    const gy = rowHeights
      .slice(0, row)
      .reduce((s, h) => s + h + GRP_ROW_GAP, 0);

    nodes.push({
      id: groupId,
      type: "group",
      position: { x: gx, y: gy },
      data: { label: dept.name },
      style: {
        width: groupW,
        height: groupH,
        backgroundColor: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: "10px",
      },
    });

    for (const p of deptProcesses) {
      const pos = positions.get(p.id) ?? { x: 0, y: 0 };
      nodes.push({
        id: p.id,
        type: "custom",
        position: {
          x: GRP_PAD + pos.x,
          y: GRP_LABEL_H + GRP_PAD + pos.y,
        },
        data: {
          label: p.name,
          type: p.type,
          criticality: p.criticality,
          active: p.active,
        },
        parentId: groupId,
        extent: "parent" as const,
      });
    }
  }

  for (const p of processes) {
    if (p.parentId) {
      edges.push({
        id: `e-${p.parentId}-${p.id}`,
        source: p.parentId,
        target: p.id,
        type: "smoothstep",
      });
    }
  }

  return { nodes, edges };
}
