import { Card, PanelHeader } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatLakh, formatNumber } from "@/lib/format";
import { token } from "@/lib/theme";
import type { RevenueActivity, ServiceDistribution } from "@/types/village";
import { DonutChart } from "./DonutChart";
import { LineChart } from "./LineChart";

const TICKS = [0, 100, 200, 300] as const;

export function ServiceRevenueCard({
  distribution,
  activity,
}: {
  distribution: ServiceDistribution;
  activity: RevenueActivity;
}) {
  const first = activity.points[0];
  const last = activity.points[activity.points.length - 1];
  const summary = `Revenue moved from ${formatLakh(first.revenue * 1000)} in ${first.label} to ${formatLakh(
    last.revenue * 1000,
  )} in ${last.label}. Service requests moved from ${formatNumber(first.requests)} to ${formatNumber(
    last.requests,
  )}.`;

  return (
    <Card
      aria-label="Service distribution and revenue activity"
      className="grid min-[1180px]:grid-cols-[minmax(0,400px)_1px_minmax(0,1fr)]"
    >
      <div className="min-w-0">
        <PanelHeader id="distribution-title" title="Service distribution" />
        <div className="px-[18px] pb-5">
          <DonutChart distribution={distribution} />
        </div>
      </div>

      <div aria-hidden="true" className="h-px bg-s2 min-[1180px]:h-auto min-[1180px]:w-px" />

      <div className="min-w-0">
        <PanelHeader id="activity-title" title="Revenue and service activity" />
        <div className="px-[18px] pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-serif text-[32px] font-bold leading-none tabular-nums text-n9">
              {formatLakh(activity.revenueTotal)}
            </p>
            <StatusChip tone="success">
              {"\u2191"} {activity.changePercent}% on {activity.comparedTo}
            </StatusChip>
            <ul className="ml-auto flex items-center gap-4 text-[13px] font-medium text-s5">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: token.n6 }} />
                Revenue
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: token.o }} />
                Requests
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <LineChart points={activity.points} yMax={activity.yMax} ticks={TICKS} summary={summary} />
          </div>
        </div>
      </div>
    </Card>
  );
}
