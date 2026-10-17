import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-md bg-n1 px-2 py-0.5 text-[12.5px] font-semibold text-n8">
      {children}
    </span>
  );
}
