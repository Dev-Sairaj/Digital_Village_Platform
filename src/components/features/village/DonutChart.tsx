"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { formatNumber } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { token } from "@/lib/theme";
import type { ServiceDistribution } from "@/types/village";

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 72;
const GAP_DEG = 1.5;
const STROKE = 20;
const STROKE_ACTIVE = 24;

function polar(deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(rad), y: CENTER + RADIUS * Math.sin(rad) };
}

function arcPath(start: number, end: number): string {
  const a = polar(start);
  const b = polar(end);
  const large = end - start > 180 ? 1 : 0;
  return `M${a.x.toFixed(3)} ${a.y.toFixed(3)} A${RADIUS} ${RADIUS} 0 ${large} 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}

// Segments sweep in one after another. Hovering a segment or legend row dims the others to 25 percent
// and widens the hovered stroke from 20 to 24.
export function DonutChart({ distribution }: { distribution: ServiceDistribution }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const arcs = distribution.segments.map((segment, i) => {
    const before = distribution.segments.slice(0, i).reduce((sum, s) => sum + s.percent, 0);
    return {
      ...segment,
      d: arcPath(before * 3.6 + GAP_DEG / 2, (before + segment.percent) * 3.6 - GAP_DEG / 2),
      delay: (before / 100) * DURATION.sweep,
      duration: (segment.percent / 100) * DURATION.sweep,
    };
  });

  const summary = `Service requests by category: ${distribution.segments
    .map((s) => `${s.label} ${s.percent} percent`)
    .join(", ")}.`;

  return (
    <div>
      <div className="relative mx-auto size-[200px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={summary} className="size-full">
          {arcs.map((arc) => (
            <motion.path
              key={arc.id}
              d={arc.d}
              fill="none"
              style={{ stroke: token[arc.tone] }}
              initial={reduce ? false : { pathLength: 0, strokeWidth: STROKE, opacity: 1 }}
              animate={{
                pathLength: 1,
                strokeWidth: active === arc.id ? STROKE_ACTIVE : STROKE,
                opacity: active && active !== arc.id ? 0.25 : 1,
              }}
              transition={{
                pathLength: { duration: arc.duration, delay: arc.delay, ease: "linear" },
                strokeWidth: { duration: DURATION.interaction, ease: EASE_OUT },
                opacity: { duration: DURATION.interaction, ease: EASE_OUT },
              }}
              onMouseEnter={() => setActive(arc.id)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-serif text-[28px] font-bold leading-none tabular-nums text-n9">
            <CountUp value={distribution.total} />
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-s5">Requests</p>
        </div>
      </div>

      <ul className="mt-5 space-y-1">
        {arcs.map((arc) => (
          <li key={arc.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(arc.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(arc.id)}
              onBlur={() => setActive(null)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[13.5px] transition-[opacity,background-color] duration-150 hover:bg-s0 ${
                active && active !== arc.id ? "opacity-40" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: token[arc.tone] }}
              />
              <span className="flex-1 font-medium text-s6">{arc.label}</span>
              <span className="tabular-nums text-s5">{formatNumber(arc.count)}</span>
              <span className="w-10 text-right font-semibold tabular-nums text-s6">
                {arc.percent}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
