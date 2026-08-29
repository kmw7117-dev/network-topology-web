import type { DiffResponse } from "../types";
import { DeviceIcon } from "../vendorIcon";

export function DiffView({ diff }: { diff: DiffResponse | null }) {
  if (!diff) return null;
  if (diff.message) {
    return <p className="empty">{diff.message}</p>;
  }

  return (
    <div className="diff">
      <div className="diff__col">
        <h3>신규 발견 ({diff.added.length})</h3>
        {diff.added.length === 0 && <p className="empty">없음</p>}
        {diff.added.map((h) => (
          <div key={h.mac || h.ip} className="diff__row diff__row--added">
            <DeviceIcon vendor={h.vendor} hostname={h.hostname} size={18} />
            <span>{h.ip}</span>
            <span className="diff__vendor">{h.vendor || "Unknown"}</span>
          </div>
        ))}
      </div>
      <div className="diff__col">
        <h3>사라짐 ({diff.removed.length})</h3>
        {diff.removed.length === 0 && <p className="empty">없음</p>}
        {diff.removed.map((h) => (
          <div key={h.mac || h.ip} className="diff__row diff__row--removed">
            <DeviceIcon vendor={h.vendor} hostname={h.hostname} size={18} />
            <span>{h.ip}</span>
            <span className="diff__vendor">{h.vendor || "Unknown"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
