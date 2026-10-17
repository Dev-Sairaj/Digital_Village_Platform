"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Card, PanelHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip, type ChipTone } from "@/components/ui/StatusChip";
import { Tabs, type TabOption } from "@/components/ui/Tabs";
import { listItem } from "@/lib/motion";
import type { AlertSeverity, VillageAlert } from "@/types/village";

type Filter = "all" | AlertSeverity;

const FILTERS: readonly TabOption<Filter>[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "pending", label: "Pending" },
];

const SEVERITY: Record<AlertSeverity, { bar: string; chip: ChipTone; label: string }> = {
  critical: { bar: "bg-danger", chip: "critical", label: "Critical" },
  warning: { bar: "bg-warn", chip: "warning", label: "Warning" },
  pending: { bar: "bg-n6", chip: "info", label: "Pending" },
};

export function AlertsPanel({ alerts }: { alerts: readonly VillageAlert[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? alerts : alerts.filter((alert) => alert.severity === filter);

  return (
    <Card aria-labelledby="alerts-title" className="h-full">
      <PanelHeader
        id="alerts-title"
        title="Alerts and escalations"
        actions={<Tabs label="Filter alerts" options={FILTERS} value={filter} onChange={setFilter} />}
      />
      {visible.length === 0 ? (
        <EmptyState title="No alerts in this view" hint="Switch the filter to see other alerts." />
      ) : (
        <ul className="px-2 pb-2">
          <AnimatePresence initial={false}>
            {visible.map((alert) => {
              const severity = SEVERITY[alert.severity];
              return (
                <motion.li
                  key={alert.id}
                  layout
                  {...listItem}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-s0"
                >
                  <span
                    aria-hidden="true"
                    className={`h-10 w-[3px] shrink-0 rounded-full ${severity.bar}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-s6">{alert.title}</p>
                    <p className="truncate text-[13px] text-s5">
                      {alert.category} · {alert.owner} · {alert.timeLabel}
                    </p>
                  </div>
                  <StatusChip tone={severity.chip}>{severity.label}</StatusChip>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
