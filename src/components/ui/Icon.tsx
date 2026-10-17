import type { SVGProps } from "react";
import type { IconName } from "@/types/ui";

// 24px grid, 1.7px stroke, round caps and joins.
const PATHS: Record<IconName, string> = {
  home: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6",
  revenue: "M6 4h12M6 9h12M8 4c4.5 0 7 1.8 7 5s-2.5 5-7 5H7l8 6",
  services: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  assets: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  grievances: "M4 5h16v11H9l-5 4z",
  alerts: "M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0",
  reports: "M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6",
  ai: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
  appointments: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  signOut: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  clock: "M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
