"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type PointerEvent } from "react";
import { formatLakh, formatNumber } from "@/lib/format";
import { DURATION, EASE_OUT, TOOLTIP_SPRING } from "@/lib/motion";
import { token } from "@/lib/theme";
import type { SeriesPoint } from "@/types/village";

const W = 560;
const H = 260;
const PL = 44;
const PR = 14;
const PT = 14;
const PB = 30;
const REVENUE_UNIT = 1000;

interface LineChartProps {
  points: readonly SeriesPoint[];
  yMax: number;
  ticks: readonly number[];
  summary: string;
}

function smoothPath(xs: readonly number[], ys: readonly number[]): string {
  return xs
    .map((x, i) => {
      if (i === 0) return `M${x.toFixed(2)} ${ys[i].toFixed(2)}`;
      const mid = ((xs[i - 1] + x) / 2).toFixed(2);
      return `C${mid} ${ys[i - 1].toFixed(2)} ${mid} ${ys[i].toFixed(2)} ${x.toFixed(2)} ${ys[i].toFixed(2)}`;
    })
    .join(" ");
}

export function LineChart({ points, yMax, ticks, summary }: LineChartProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null);

  const xs = points.map((_, i) => PL + (i * (W - PL - PR)) / (points.length - 1));
  const yOf = (value: number) => PT + (1 - value / yMax) * (H - PT - PB);
  const baseY = yOf(0);

  const series = [
    {
      key: "revenue" as const,
      label: "Revenue",
      color: token.n6,
      format: (value: number) => formatLakh(value * REVENUE_UNIT),
    },
    { key: "requests" as const, label: "Requests", color: token.o, format: formatNumber },
  ].map((s) => ({ ...s, ys: points.map((point) => yOf(point[s.key])) }));

  const areaPath = `${smoothPath(xs, series[0].ys)} L${xs[xs.length - 1].toFixed(2)} ${baseY.toFixed(2)} L${xs[0].toFixed(2)} ${baseY.toFixed(2)} Z`;

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    xs.forEach((value, i) => {
      if (Math.abs(value - x) < Math.abs(xs[nearest] - x)) nearest = i;
    });
    const raw = (xs[nearest] / W) * rect.width;
    setHover({ index: nearest, px: Math.min(Math.max(raw, 72), rect.width - 72) });
  }

  const hoverX = hover ? xs[hover.index] : 0;

  return (
    <div className="overflow-x-auto">
      <div
        className="relative min-w-[480px]"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="block h-auto w-full">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PL} x2={W - PR} y1={yOf(tick)} y2={yOf(tick)} className="stroke-s2" strokeWidth={1} />
              <text x={PL - 10} y={yOf(tick) + 4} textAnchor="end" fontSize={12} className="fill-s5">
                {tick}
              </text>
            </g>
          ))}
          {points.map((point, i) => (
            <text key={point.label} x={xs[i]} y={H - 8} textAnchor="middle" fontSize={12} className="fill-s5">
              {point.label}
            </text>
          ))}

          <motion.path
            d={areaPath}
            fill={token.n6}
            fillOpacity={0.08}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: DURATION.chart, duration: DURATION.entrance, ease: EASE_OUT }}
          />

          {series.map((s, i) => (
            <motion.path
              key={s.key}
              d={smoothPath(xs, s.ys)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: DURATION.chart, delay: i * 0.2, ease: EASE_OUT }}
            />
          ))}

          {hover && (
            <g>
              <line x1={hoverX} x2={hoverX} y1={PT} y2={baseY} className="stroke-s3" strokeWidth={1} />
              {series.map((s) => (
                <circle
                  key={s.key}
                  cx={hoverX}
                  cy={s.ys[hover.index]}
                  r={4.5}
                  fill={token.n1}
                  stroke={s.color}
                  strokeWidth={2.5}
                />
              ))}
            </g>
          )}
        </svg>

        {hover && (
          <motion.div
            className="pointer-events-none absolute left-0 top-2 z-10"
            initial={{ opacity: 0, x: hover.px }}
            animate={{ opacity: 1, x: hover.px }}
            transition={TOOLTIP_SPRING}
          >
            <div className="-translate-x-1/2 rounded-control border border-s2 bg-white px-3 py-2 text-[12.5px] shadow-kpi">
              <p className="font-semibold text-n8">{points[hover.index].label}</p>
              <ul className="mt-1 space-y-0.5">
                {series.map((s) => (
                  <li key={s.key} className="flex items-center gap-2 whitespace-nowrap text-s5">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                    <span className="ml-auto pl-3 font-semibold tabular-nums text-s6">
                      {s.format(points[hover.index][s.key])}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
