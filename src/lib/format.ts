const NUMBER = new Intl.NumberFormat("en-IN");

export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

export function formatRupees(value: number): string {
  return `\u20B9${NUMBER.format(value)}`;
}

// 248000 -> "₹2.48L". Below one lakh the full figure is shown with lakh-style grouping.
export function formatLakh(value: number): string {
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(2)}L`;
  return formatRupees(Math.round(value));
}

const DATE_TIME = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

// "16 Oct 2026, 11:24 AM". Fixed time zone keeps server and client output identical.
export function formatDateTime(iso: string): string {
  const parts = Object.fromEntries(
    DATE_TIME.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} ${String(
    parts.dayPeriod,
  ).toUpperCase()}`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
