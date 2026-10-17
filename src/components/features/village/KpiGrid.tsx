"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { DELAY, STAGGER, staggerContainer } from "@/lib/motion";
import type { Kpi } from "@/types/village";
import { KpiCard } from "./KpiCard";

// 5 columns, 3 below 1180px, 2 below 620px.
export function KpiGrid({ kpis }: { kpis: readonly Kpi[] }) {
  const variants = useMemo(() => staggerContainer(STAGGER.kpi, DELAY.kpi), []);

  return (
    <motion.section
      aria-labelledby="kpi-heading"
      variants={variants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-[14px] min-[620px]:grid-cols-3 min-[1180px]:grid-cols-5"
    >
      <h2 id="kpi-heading" className="sr-only">
        Key figures
      </h2>
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.id} kpi={kpi} index={index} />
      ))}
    </motion.section>
  );
}
