"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useShell } from "@/components/layout/ShellContext";
import { SyncIndicator } from "@/components/layout/SyncIndicator";
import { ActionButton } from "@/components/ui/ActionButton";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs, type TabOption } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { fadeUp } from "@/lib/motion";

type Period = "month" | "quarter" | "year";

const PERIODS: readonly TabOption<Period>[] = [
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
  { id: "year", label: "Year" },
];

interface HeroProps {
  title: string;
  subtitle: string;
  trail: readonly string[];
}

export function Hero({ title, subtitle, trail }: HeroProps) {
  const { openDrawer } = useShell();
  const { push } = useToast();
  const [period, setPeriod] = useState<Period>("month");

  return (
    <header className="relative isolate overflow-hidden bg-linear-to-br from-n8 to-n9 pb-[104px] pt-5 text-white">
      <div
        aria-hidden="true"
        className="hero-wheel pointer-events-none absolute -right-20 -top-28 -z-10 size-[420px]"
      />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-[1560px] px-4 min-[900px]:px-8"
      >
        <div className="flex items-center gap-3">
          <IconButton
            label="Open menu"
            icon="menu"
            tone="onDark"
            onClick={openDrawer}
            className="-ml-2 min-[900px]:hidden"
          />
          <Breadcrumb trail={trail} current={title} />
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="min-w-0">
            <h1 className="font-serif text-[32px] font-bold leading-[1.1] min-[900px]:text-[40px]">
              {title}
            </h1>
            <p className="mt-2 max-w-[60ch] text-[14px] text-n3">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SyncIndicator />
            <Tabs
              tone="dark"
              label="Reporting period"
              options={PERIODS}
              value={period}
              onChange={setPeriod}
            />
            <ActionButton
              icon="download"
              onClick={() => push("Report export queued.")}
            >
              Export report
            </ActionButton>
          </div>
        </div>
      </motion.div>
      <div aria-hidden="true" className="hero-strip absolute inset-x-0 bottom-0" />
    </header>
  );
}
