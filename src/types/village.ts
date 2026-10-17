export type KpiFormat = "integer" | "lakh";
export type KpiNoteTone = "neutral" | "positive" | "critical" | "warning";
export type KpiAccent = "navy" | "green" | "red" | "amber" | "blue";

export interface Kpi {
  id: string;
  label: string;
  value: number;
  format: KpiFormat;
  /** Denominator for "12 of 14" style figures. */
  of?: number;
  note: string;
  noteTone: KpiNoteTone;
  accent: KpiAccent;
  spark: readonly number[];
}

export type AlertSeverity = "critical" | "warning" | "pending";

export interface VillageAlert {
  id: string;
  title: string;
  category: string;
  owner: string;
  timeLabel: string;
  severity: AlertSeverity;
}

export type OperatorAvailability = "online" | "busy" | "offline";

export interface Operator {
  id: string;
  name: string;
  code: string;
  service: string;
  availability: OperatorAvailability;
  lastActive: string;
}

export type ServiceCategory =
  | "Utility payments"
  | "Certificates and records"
  | "Agriculture support"
  | "Health services";

export type TransactionStatus = "completed" | "pending";

export interface Transaction {
  id: string;
  title: string;
  payer: string;
  reference: string;
  category: ServiceCategory;
  /** ISO 8601 timestamp. */
  occurredAt: string;
  method: string;
  /** Recorded amount in rupees. Recorded only, never collected or settled by the platform. */
  amount: number;
  status: TransactionStatus;
}

export type DistributionTone = "n8" | "n5" | "g" | "n3";

export interface ServiceCategoryShare {
  id: string;
  label: ServiceCategory;
  percent: number;
  count: number;
  tone: DistributionTone;
}

export interface ServiceDistribution {
  total: number;
  segments: readonly ServiceCategoryShare[];
}

export interface SeriesPoint {
  label: string;
  /** Revenue in thousands of rupees (shares the 0 to 300 axis with requests). */
  revenue: number;
  requests: number;
}

export interface RevenueActivity {
  points: readonly SeriesPoint[];
  yMax: number;
  /** Current period revenue in rupees. */
  revenueTotal: number;
  changePercent: number;
  comparedTo: string;
}

export interface VillageOverviewData {
  /** Ancestor names from state down to the parent of the village, in display order. */
  trail: readonly string[];
  kpis: readonly Kpi[];
  alerts: readonly VillageAlert[];
  operators: readonly Operator[];
  distribution: ServiceDistribution;
  activity: RevenueActivity;
  transactions: readonly Transaction[];
}

export interface VillageOverview extends VillageOverviewData {
  villageId: string;
}
