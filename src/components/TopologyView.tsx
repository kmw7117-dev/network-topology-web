import type { ScanHost } from "../types";
import { DeviceIcon } from "../vendorIcon";

function groupBySubnet(hosts: ScanHost[]): Record<string, ScanHost[]> {
  return hosts.reduce<Record<string, ScanHost[]>>((acc, h) => {
    (acc[h.subnet] ||= []).push(h);
    return acc;
  }, {});
}

export function TopologyView({ hosts }: { hosts: ScanHost[] }) {
  const groups = groupBySubnet(hosts);
  const subnets = Object.keys(groups).sort();

  if (subnets.length === 0) {
    return <p className="empty">표시할 스캔 데이터가 없음</p>;
  }

  return (
    <div className="topology">
      {subnets.map((subnet) => (
        <div key={subnet} className="topology__subnet">
          <div className="topology__subnet-label">{subnet.replace("_", "/")}</div>
          <div className="topology__nodes">
            {groups[subnet]
              .slice()
              .sort((a, b) => a.ip.localeCompare(b.ip, undefined, { numeric: true }))
              .map((h) => (
                <div key={h.mac || h.ip} className="node-card" title={h.mac || ""}>
                  <DeviceIcon vendor={h.vendor} hostname={h.hostname} size={28} />
                  <div className="node-card__ip">{h.ip}</div>
                  <div className="node-card__name">{h.hostname || "\u2014"}</div>
                  <div className="node-card__vendor">{h.vendor || "Unknown"}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
