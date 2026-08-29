import { useMemo } from "react";
import dagre from "dagre";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Position,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TopologyResponse } from "../types";
import { classifyVendor } from "../vendorIcon";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 84;

// deviceId별로 다른 색을 줘서 여러 브릿지 엣지가 겹쳐 보일 때도 구분되게 함
const BRIDGE_PALETTE = ["#c084fc", "#fb923c", "#22d3ee", "#f472b6", "#a3e635"];
function colorForDevice(deviceId: string | undefined): string {
  if (!deviceId) return BRIDGE_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < deviceId.length; i++) hash = (hash * 31 + deviceId.charCodeAt(i)) >>> 0;
  return BRIDGE_PALETTE[hash % BRIDGE_PALETTE.length];
}

function dagreLayout(topology: TopologyResponse): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 48, ranksep: 130, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));

  topology.nodes.forEach((n) => {
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  const sortedEdges = [...topology.edges].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "bridge" ? -1 : 1
  );
  sortedEdges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  const nodes: Node[] = topology.nodes.map((n) => {
    const pos = g.node(n.id);
    const kind = classifyVendor(n.vendor, n.hostname);
    return {
      id: n.id,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: {
        label: (
          <div className="flow-node">
            <div className="flow-node__ip">{n.ip}</div>
            <div className="flow-node__name">{n.deviceLabel || n.hostname || "\u2014"}</div>
            <div className="flow-node__vendor">{n.vendor || "Unknown"}</div>
            <div className="flow-node__subnet">{n.subnet.replace("_", "/")}</div>
          </div>
        ),
      },
      className: `flow-node--${kind}${n.isGateway ? " flow-node--gateway" : ""}`,
      style: { width: NODE_WIDTH },
    };
  });

  const edges: Edge[] = topology.edges.map((e) => {
    const color = e.kind === "bridge" ? colorForDevice(e.deviceId) : "#4f8cff";
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.kind === "bridge" ? "default" : "smoothstep",
      animated: e.kind === "bridge",
      style: {
        stroke: color,
        strokeWidth: e.kind === "bridge" ? 2.5 : 1.5,
        strokeDasharray: e.kind === "bridge" ? "6 4" : undefined,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      label: e.kind === "bridge" ? (e.deviceId || "동일 장비") : undefined,
      labelStyle: { fill: color, fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#171a21" },
    };
  });

  return { nodes, edges };
}

export function NetworkMapView({ topology }: { topology: TopologyResponse | null }) {
  const { nodes, edges } = useMemo(
    () => (topology ? dagreLayout(topology) : { nodes: [], edges: [] }),
    [topology]
  );

  if (!topology || nodes.length === 0) {
    return <p className="empty">표시할 토폴로지 데이터가 없음</p>;
  }

  return (
    <div style={{ height: 600, border: "1px solid var(--border)", borderRadius: 12 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background gap={24} color="#262b36" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
