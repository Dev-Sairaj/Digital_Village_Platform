"use client";

import { useState } from "react";
import { Card, PanelHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Icon } from "@/components/ui/Icon";
import { StatusChip } from "@/components/ui/StatusChip";
import { Tabs, type TabOption } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { formatDateTime, formatRupees } from "@/lib/format";
import type { IconName } from "@/types/ui";
import type { ServiceCategory, Transaction, TransactionStatus } from "@/types/village";

type Filter = "all" | TransactionStatus;

const FILTERS: readonly TabOption<Filter>[] = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
];

const CATEGORY_ICON: Record<ServiceCategory, IconName> = {
  "Utility payments": "receipt",
  "Certificates and records": "reports",
  "Agriculture support": "assets",
  "Health services": "services",
};

const COLUMNS: readonly Column<Transaction>[] = [
  {
    id: "transaction",
    header: "Transaction",
    cell: (tx) => (
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-n1 text-n8">
          <Icon name={CATEGORY_ICON[tx.category]} size={18} />
        </span>
        <div>
          <p className="font-semibold text-s6">{tx.title}</p>
          <p className="text-[12.5px] text-s5">{tx.payer}</p>
        </div>
      </div>
    ),
  },
  { id: "reference", header: "Reference", cell: (tx) => <span className="tabular-nums text-s5">{tx.reference}</span> },
  { id: "category", header: "Category", cell: (tx) => <Tag>{tx.category}</Tag> },
  { id: "when", header: "Date and time", cell: (tx) => <span className="whitespace-nowrap text-s5">{formatDateTime(tx.occurredAt)}</span> },
  { id: "method", header: "Method", cell: (tx) => tx.method },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    cell: (tx) => <span className="font-semibold tabular-nums text-s6">{formatRupees(tx.amount)}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (tx) => (
      <StatusChip tone={tx.status === "completed" ? "success" : "warning"}>
        {tx.status === "completed" ? "Completed" : "Pending"}
      </StatusChip>
    ),
  },
];

export function TransactionsPanel({ transactions }: { transactions: readonly Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = filter === "all" ? transactions : transactions.filter((tx) => tx.status === filter);

  return (
    <Card aria-labelledby="transactions-title">
      <PanelHeader
        id="transactions-title"
        title="Recorded transactions"
        actions={<Tabs label="Filter transactions" options={FILTERS} value={filter} onChange={setFilter} />}
      />
      <DataTable
        caption="Recorded transactions"
        columns={COLUMNS}
        rows={rows}
        getRowId={(tx) => tx.id}
        minWidthClass="min-w-[920px]"
      />
    </Card>
  );
}
