import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./api";
import type { ScanHost, DiffResponse, TopologyResponse } from "./types";
import { TopologyView } from "./components/TopologyView";
import { DiffView } from "./components/DiffView";
import { NetworkMapView } from "./components/NetworkMapView";

type ViewMode = "topology" | "map" | "diff";

function formatTime(t: string): string {
  try {
    return new Date(t).toLocaleString("ko-KR");
  } catch {
    return t;
  }
}

export default function App() {
  const [runs, setRuns] = useState<string[]>([]);
  const [selectedRun, setSelectedRun] = useState<string>("");
  const [hosts, setHosts] = useState<ScanHost[]>([]);
  const [diff, setDiff] = useState<DiffResponse | null>(null);
  const [topology, setTopology] = useState<TopologyResponse | null>(null);
  const [view, setView] = useState<ViewMode>("topology");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .runs()
      .then((r) => {
        setRuns(r);
        if (r.length > 0) setSelectedRun(r[0]);
      })
      .catch((e) => setError(String(e.message || e)));
  }, []);

  useEffect(() => {
    if (!selectedRun) return;
    setLoading(true);
    setError(null);
    api
      .at(selectedRun)
      .then(setHosts)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [selectedRun]);

  useEffect(() => {
    if (view !== "diff") return;
    api.diff().then(setDiff).catch((e) => setError(String(e.message || e)));
  }, [view]);

  useEffect(() => {
    if (view !== "map" || !selectedRun) return;
    api
      .topology(selectedRun)
      .then(setTopology)
      .catch((e) => setError(String(e.message || e)));
  }, [view, selectedRun]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>네트워크 토폴로지</h1>
        <div className="app__controls">
          <select
            value={selectedRun}
            onChange={(e) => setSelectedRun(e.target.value)}
            disabled={runs.length === 0}
          >
            {runs.map((r) => (
              <option key={r} value={r}>
                {formatTime(r)}
              </option>
            ))}
          </select>
          <div className="app__tabs">
            <button
              className={view === "topology" ? "active" : ""}
              onClick={() => setView("topology")}
            >
              토폴로지
            </button>
            <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
              네트워크 지도
            </button>
            <button className={view === "diff" ? "active" : ""} onClick={() => setView("diff")}>
              변경 비교
            </button>
          </div>
        </div>
      </header>

      {error && <div className="app__error">{error}</div>}
      {loading && <div className="app__loading">불러오는 중...</div>}

      <main>
        {view === "topology" && <TopologyView hosts={hosts} />}
        {view === "map" && <NetworkMapView topology={topology} />}
        {view === "diff" && <DiffView diff={diff} />}
      </main>
    </div>
  );
}
