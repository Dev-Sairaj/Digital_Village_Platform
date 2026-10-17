"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { listItem } from "@/lib/motion";

export interface Column<T> {
  id: string;
  header: string;
  align?: "left" | "right";
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  caption: string;
  columns: readonly Column<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  minWidthClass?: string;
}

// Wide tables scroll inside their own container, never the page. Rows reflow when filters change.
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  minWidthClass = "min-w-[640px]",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
      <table className={`w-full border-collapse text-left text-[13.5px] ${minWidthClass}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-y border-s2 bg-s0">
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-4 py-2.5 text-[12.5px] font-semibold text-s5 ${
                  column.align === "right" ? "text-right" : ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.tr
                key={getRowId(row)}
                layout
                {...listItem}
                className="border-b border-s1 transition-colors duration-150 last:border-b-0 hover:bg-s0"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-4 py-3 align-middle ${column.align === "right" ? "text-right" : ""}`}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
