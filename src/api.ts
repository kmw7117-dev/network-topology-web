import type { ScanHost, DiffResponse, TopologyResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4001";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API 요청 실패 (${res.status}): ${path}`);
  }
  return res.json();
}

export const api = {
  runs: () => getJson<string[]>("/api/scan/runs"),
  latest: () => getJson<ScanHost[]>("/api/scan/latest"),
  at: (time: string) => getJson<ScanHost[]>(`/api/scan/at?time=${encodeURIComponent(time)}`),
  diff: () => getJson<DiffResponse>("/api/scan/diff"),
  topology: (time?: string) =>
    getJson<TopologyResponse>(
      time ? `/api/scan/topology?time=${encodeURIComponent(time)}` : "/api/scan/topology"
    ),
};
