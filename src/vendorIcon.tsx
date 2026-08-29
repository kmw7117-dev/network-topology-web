import {
  Router as RouterIcon,
  Server,
  Laptop,
  Smartphone,
  Cpu,
  HelpCircle,
  Wifi,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * arp-scan vendor 문자열(IEEE OUI 회사명)을 대략적인 장비 유형으로 매핑한다.
 * 정확한 장비 종류를 알 수는 없으니 vendor 이름에 포함된 키워드로 추정만 한다.
 * 실제 회사 로고(상표)는 쓰지 않고 범용 아이콘만 사용.
 */
export type DeviceKind =
  | "router"
  | "server"
  | "pc"
  | "mobile"
  | "iot"
  | "ap"
  | "unknown";

const KEYWORD_RULES: Array<{ pattern: RegExp; kind: DeviceKind }> = [
  { pattern: /espressif|shenzhen|iot/i, kind: "iot" },
  { pattern: /apple|samsung|xiaomi|huawei device|oneplus/i, kind: "mobile" },
  { pattern: /cisco|tp-link|netgear|ubiquiti|efm networks|d-link|asus.*router|mikrotik/i, kind: "router" },
  { pattern: /intel|realtek|broadcom|qualcomm|azurewave|asustek|dell|hp\b|lenovo/i, kind: "pc" },
  { pattern: /vmware|synology|qnap|supermicro/i, kind: "server" },
];

export function classifyVendor(vendor: string | null, hostname: string | null): DeviceKind {
  if (hostname === "_gateway") return "router";
  if (!vendor || /unknown/i.test(vendor)) return "unknown";
  if (vendor === "(this host)") return "server";
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(vendor)) return rule.kind;
  }
  return "unknown";
}

const ICONS: Record<DeviceKind, ComponentType<{ size?: number; className?: string }>> = {
  router: RouterIcon,
  server: Server,
  pc: Laptop,
  mobile: Smartphone,
  iot: Cpu,
  ap: Wifi,
  unknown: HelpCircle,
};

export function DeviceIcon({
  vendor,
  hostname,
  size = 20,
}: {
  vendor: string | null;
  hostname: string | null;
  size?: number;
}) {
  const kind = classifyVendor(vendor, hostname);
  const Icon = ICONS[kind];
  return <Icon size={size} className={`device-icon device-icon--${kind}`} />;
}
