"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Card, PanelHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusDot } from "@/components/ui/StatusChip";
import type { Operator, OperatorAvailability } from "@/types/village";

const AVAILABILITY: Record<OperatorAvailability, string> = {
  online: "Available",
  busy: "On a task",
  offline: "Offline",
};

const COLUMNS: readonly Column<Operator>[] = [
  {
    id: "operator",
    header: "Operator",
    cell: (op) => (
      <div className="flex items-center gap-3">
        <Avatar name={op.name} />
        <div>
          <p className="font-semibold text-s6">{op.name}</p>
          <p className="text-[12.5px] text-s5">{op.code}</p>
        </div>
      </div>
    ),
  },
  { id: "service", header: "Assigned service", cell: (op) => op.service },
  {
    id: "availability",
    header: "Availability",
    cell: (op) => <StatusDot tone={op.availability} label={AVAILABILITY[op.availability]} />,
  },
  { id: "last", header: "Last active", cell: (op) => <span className="text-s5">{op.lastActive}</span> },
];

export function OperatorTable({ operators }: { operators: readonly Operator[] }) {
  return (
    <Card aria-labelledby="operators-title" className="h-full">
      <PanelHeader id="operators-title" title="Service operators" />
      <DataTable
        caption="Service operators"
        columns={COLUMNS}
        rows={operators}
        getRowId={(op) => op.id}
        minWidthClass="min-w-[560px]"
      />
    </Card>
  );
}
