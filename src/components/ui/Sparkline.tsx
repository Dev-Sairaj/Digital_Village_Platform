"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

const W = 100;
const H = 32;
const PAD = 2;

interface SparklineProps {
  points: readonly number[];
  color: string;
  delay?: number;
}

// Decorative trend line that draws left to right.
export function Sparkline({ points, color, delay = 0 }: SparklineProps) {
  const reduce = useReducedMotion();
  const min = Math.min(...points);
  const span = Math.max(...points) - min || 1;
  const step = W / (points.length - 1);
  const d = points
    .map((value, i) => {
      const y = H - PAD - ((value - min) / span) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-8 w-full"
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      />
    </svg>
  );
}
