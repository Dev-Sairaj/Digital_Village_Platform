import type { Transition, Variants } from "motion/react";

// Single source of truth for animation timing. Animate transform and opacity wherever possible.
export const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export const DURATION = {
  interaction: 0.18,
  entrance: 0.4,
  route: 0.2,
  drawer: 0.28,
  countUp: 1.1,
  sweep: 1.1,
  chart: 1.4,
} as const;

export const STAGGER = { kpi: 0.06, panel: 0.08 } as const;

// Orchestrated page load: hero, then KPI cards, then panels. Total stays under 1.4s.
export const DELAY = { kpi: 0.15, panels: 0.45 } as const;

export const ENTRANCE: Transition = { duration: DURATION.entrance, ease: EASE_OUT };

export const TOOLTIP_SPRING: Transition = { type: "spring", stiffness: 500, damping: 38 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: ENTRANCE },
};

export function staggerContainer(stagger: number, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

// Rows entering, leaving and reflowing when a filter changes.
export const listItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: EASE_OUT },
};

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
