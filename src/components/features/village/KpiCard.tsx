"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";
import { Sparkline } from "@/components/ui/Sparkline";
import { DURATION, EASE_OUT, STAGGER, fadeUp } from "@/lib/motion";
import { token, type ColorToken } from "@/lib/theme";
import type { Kpi, KpiAccent, KpiNoteTone } from "@/types/village";

const ACCENT: Record<KpiAccent, { edge: string; spark: ColorToken }> = {
  navy: { edge: "border-t-n6", spark: "n6" },
  green: { edge: "border-t-g", spark: "g" },
  red: { edge: "border-t-danger", spark: "danger" },
  amber: { edge: "border-t-warn", spark: "warn" },
  blue: { edge: "border-t-n5", spark: "n5" },
};

const NOTE: Record<KpiNoteTone, string> = {
  neutral: "text-s5",
  positive: "text-g",
  critical: "text-danger",
  warning: "text-warn",
};

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const accent = ACCENT[kpi.accent];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: DURATION.interaction, ease: EASE_OUT } }}
      className={`flex flex-col gap-3 rounded-card border-t-[3px] bg-white p-4 shadow-kpi transition-shadow duration-200 hover:shadow-kpi-hover ${accent.edge}`}
    >
      <h3 className="text-[13px] font-semibold text-s5">{kpi.label}</h3>
      <p className="font-serif text-[32px] font-bold leading-none tabular-nums text-n9">
        <CountUp value={kpi.value} format={kpi.format} />
        {kpi.of !== undefined && (
          <span className="ml-1.5 font-sans text-[14px] font-semibold text-s5">of {kpi.of}</span>
        )}
      </p>
      <p className={`text-[13px] font-semibold ${NOTE[kpi.noteTone]}`}>{kpi.note}</p>
      <Sparkline
        points={kpi.spark}
        color={token[accent.spark]}
        delay={DURATION.entrance + index * STAGGER.kpi}
      />
    </motion.article>
  );
}
