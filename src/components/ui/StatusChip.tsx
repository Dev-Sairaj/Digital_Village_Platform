import type { ReactNode } from "react";

export type ChipTone = "critical" | "warning" | "info" | "success" | "neutral";
export type DotTone = "online" | "busy" | "offline";

// Always coloured text on a tinted background, never white on a solid fill.
const CHIP: Record<ChipTone, string> = {
  critical: "bg-danger-bg text-danger",
  warning: "bg-warn-bg text-warn",
  info: "bg-info-bg text-info",
  success: "bg-g0 text-g",
  neutral: "bg-s1 text-s5",
};

const DOT: Record<DotTone, string> = {
  online: "bg-g4",
  busy: "bg-warn",
  offline: "bg-s4",
};

export function StatusChip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[12.5px] font-semibold ${CHIP[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone, label }: { tone: DotTone; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-s6">
      <span aria-hidden="true" className={`size-2 rounded-full ${DOT[tone]}`} />
      {label}
    </span>
  );
}
