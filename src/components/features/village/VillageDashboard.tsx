import { Hero } from "@/components/layout/Hero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { DELAY, STAGGER } from "@/lib/motion";
import type { VillageOverview } from "@/types/village";
import { AlertsPanel } from "./AlertsPanel";
import { KpiGrid } from "./KpiGrid";
import { OperatorTable } from "./OperatorTable";
import { ServiceRevenueCard } from "./ServiceRevenueCard";
import { TransactionsPanel } from "./TransactionsPanel";

interface VillageDashboardProps {
  villageName: string;
  overview: VillageOverview;
  denied?: boolean;
}

export function VillageDashboard({
  villageName,
  overview,
  denied = false,
}: VillageDashboardProps) {
  const taluka = overview.trail[overview.trail.length - 1] ?? "your area";

  return (
    <>
      {denied && (
        <p
          role="alert"
          className="mx-auto mt-4 max-w-[1560px] rounded-lg border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning-strong"
        >
          You do not have permission for this action.
        </p>
      )}
      <Hero
        title={villageName}
        trail={overview.trail}
        subtitle={`Services, revenue and field operations for ${taluka}, in one view.`}
      />
      <div className="relative z-10 mx-auto -mt-[62px] w-full max-w-[1560px] space-y-[14px] px-4 pb-10 min-[900px]:px-8">
        <KpiGrid kpis={overview.kpis} />
        <StaggerGroup className="space-y-[14px]" stagger={STAGGER.panel} delay={DELAY.panels}>
          <div className="grid gap-[14px] min-[1180px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <StaggerItem className="h-full min-w-0">
              <AlertsPanel alerts={overview.alerts} />
            </StaggerItem>
            <StaggerItem className="h-full min-w-0">
              <OperatorTable operators={overview.operators} />
            </StaggerItem>
          </div>
          <StaggerItem>
            <ServiceRevenueCard distribution={overview.distribution} activity={overview.activity} />
          </StaggerItem>
          <StaggerItem className="min-w-0">
            <TransactionsPanel transactions={overview.transactions} />
          </StaggerItem>
        </StaggerGroup>
      </div>
    </>
  );
}
