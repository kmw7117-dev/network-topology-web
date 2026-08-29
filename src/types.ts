export interface ScanHost {
  time: string;
  subnet: string;
  ip: string;
  mac: string | null;
  vendor: string | null;
  hostname: string | null;
  reachable: number;
}

export interface DiffResponse {
  latestTime?: string;
  previousTime?: string;
  message?: string;
  added: ScanHost[];
  removed: ScanHost[];
}

export interface TopologyNode {
  id: string;
  ip: string;
  mac: string | null;
  hostname: string | null;
  vendor: string | null;
  subnet: string;
  isGateway: boolean;
  deviceId: string | null;
  deviceLabel: string | null;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  kind: "star" | "bridge";
  deviceId?: string;
}

export interface TopologyResponse {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}
