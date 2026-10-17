import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...rest}
      className={`rounded-card border border-s2 bg-white shadow-card ${className}`}
    >
      {children}
    </section>
  );
}

interface PanelHeaderProps {
  id: string;
  title: string;
  actions?: ReactNode;
}

export function PanelHeader({ id, title, actions }: PanelHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-[18px] pb-3 pt-4">
      <h2 id={id} className="font-serif text-[18px] font-bold text-n8">
        {title}
      </h2>
      {actions}
    </header>
  );
}
