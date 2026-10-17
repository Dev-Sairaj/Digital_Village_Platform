import type { VillageOverviewData } from "@/types/village";

// MOCK DATA. Figures in the brief are verbatim; alert, operator and transaction rows are placeholders
// until the reference design file is checked. Replaced by the API via api/repositories/villageRepository.ts.
export const VILLAGE_OVERVIEW_MOCK: VillageOverviewData = {
  trail: ["Maharashtra", "Pune Division", "Pune District", "Haveli Taluka"],
  kpis: [
    { id: "services", label: "Active services", value: 12, format: "integer", of: 14, note: "2 offline", noteTone: "warning", accent: "navy", spark: [10, 11, 11, 12, 12, 13, 12, 12] },
    { id: "revenue", label: "Revenue collected", value: 248000, format: "lakh", note: "\u2191 8.3% vs May", noteTone: "positive", accent: "green", spark: [142, 168, 191, 207, 215, 229, 240, 248] },
    { id: "grievances", label: "Open grievances", value: 14, format: "integer", note: "3 critical", noteTone: "critical", accent: "red", spark: [9, 11, 10, 13, 12, 15, 13, 14] },
    { id: "assets", label: "Assets needing attention", value: 7, format: "integer", note: "2 overdue", noteTone: "warning", accent: "amber", spark: [4, 5, 5, 6, 8, 6, 7, 7] },
    { id: "appointments", label: "Appointments today", value: 28, format: "integer", note: "19 done", noteTone: "positive", accent: "blue", spark: [14, 18, 22, 20, 26, 24, 27, 28] },
  ],
  alerts: [
    { id: "al-1", title: "Water pump pressure below threshold", category: "Assets", owner: "Santosh Gaikwad", timeLabel: "12 min ago", severity: "critical" },
    { id: "al-2", title: "Health sub-centre service is offline", category: "Services", owner: "Priya Salunke", timeLabel: "38 min ago", severity: "critical" },
    { id: "al-3", title: "Grievance unacknowledged for 24 hours", category: "Grievances", owner: "Mahesh Kale", timeLabel: "1 h ago", severity: "warning" },
    { id: "al-4", title: "Street light maintenance is overdue", category: "Assets", owner: "Ganesh Bhosale", timeLabel: "3 h ago", severity: "warning" },
    { id: "al-5", title: "Certificate applications awaiting approval", category: "Services", owner: "Kavita Pawar", timeLabel: "5 h ago", severity: "pending" },
  ],
  operators: [
    { id: "op-1", name: "Santosh Gaikwad", code: "OP-1042", service: "Water supply", availability: "online", lastActive: "2 min ago" },
    { id: "op-2", name: "Priya Salunke", code: "OP-1043", service: "Health sub-centre", availability: "busy", lastActive: "9 min ago" },
    { id: "op-3", name: "Ganesh Bhosale", code: "OP-1044", service: "Digital seva kendra", availability: "online", lastActive: "14 min ago" },
    { id: "op-4", name: "Kavita Pawar", code: "OP-1045", service: "Agriculture help desk", availability: "offline", lastActive: "2 h ago" },
    { id: "op-5", name: "Mahesh Kale", code: "OP-1046", service: "Certificates desk", availability: "online", lastActive: "21 min ago" },
  ],
  distribution: {
    total: 1284,
    segments: [
      { id: "utility", label: "Utility payments", percent: 35, count: 449, tone: "n8" },
      { id: "certificates", label: "Certificates and records", percent: 25, count: 321, tone: "n5" },
      { id: "agriculture", label: "Agriculture support", percent: 20, count: 257, tone: "g" },
      { id: "health", label: "Health services", percent: 20, count: 257, tone: "n3" },
    ],
  },
  activity: {
    yMax: 300,
    revenueTotal: 248000,
    changePercent: 8.3,
    comparedTo: "May",
    points: [
      { label: "Jan", revenue: 142, requests: 180 },
      { label: "Feb", revenue: 168, requests: 205 },
      { label: "Mar", revenue: 191, requests: 226 },
      { label: "Apr", revenue: 207, requests: 240 },
      { label: "May", revenue: 229, requests: 262 },
      { label: "Jun", revenue: 248, requests: 284 },
    ],
  },
  transactions: [
    { id: "tx-1", title: "Water tax payment", payer: "Ramesh Shinde", reference: "TXN-2610-0412", category: "Utility payments", occurredAt: "2026-10-16T11:24:00+05:30", method: "UPI", amount: 1250, status: "completed" },
    { id: "tx-2", title: "Birth certificate fee", payer: "Sunita Pawar", reference: "TXN-2610-0411", category: "Certificates and records", occurredAt: "2026-10-16T10:48:00+05:30", method: "Cash", amount: 50, status: "completed" },
    { id: "tx-3", title: "Soil testing service", payer: "Dattatray More", reference: "TXN-2610-0409", category: "Agriculture support", occurredAt: "2026-10-16T10:05:00+05:30", method: "UPI", amount: 300, status: "pending" },
    { id: "tx-4", title: "Health camp registration", payer: "Meera Gaikwad", reference: "TXN-2610-0398", category: "Health services", occurredAt: "2026-10-15T17:32:00+05:30", method: "Cash", amount: 100, status: "completed" },
    { id: "tx-5", title: "Property tax payment", payer: "Anil Jadhav", reference: "TXN-2610-0391", category: "Utility payments", occurredAt: "2026-10-15T15:10:00+05:30", method: "Net banking", amount: 4800, status: "pending" },
  ],
};
