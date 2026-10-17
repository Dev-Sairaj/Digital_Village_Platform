"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";
import { formatLakh, formatNumber } from "@/lib/format";
import { DURATION, easeOutCubic } from "@/lib/motion";
import type { KpiFormat } from "@/types/village";

const FORMATTERS: Record<KpiFormat, (value: number) => string> = {
  integer: (value) => formatNumber(Math.round(value)),
  lakh: formatLakh,
};

// Counts up over 1.1s with ease-out-cubic. Reduced motion shows the final value immediately.
// Screen readers get the final value only, never the intermediate numbers.
export function CountUp({ value, format = "integer" }: { value: number; format?: KpiFormat }) {
  const reduce = useReducedMotion();
  const formatValue = FORMATTERS[format];
  const motionValue = useMotionValue(reduce ? value : 0);
  const text = useTransform(motionValue, formatValue);

  useEffect(() => {
    if (reduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: DURATION.countUp,
      ease: easeOutCubic,
    });
    return () => controls.stop();
  }, [motionValue, reduce, value]);

  return (
    <>
      <span className="sr-only">{formatValue(value)}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </>
  );
}
