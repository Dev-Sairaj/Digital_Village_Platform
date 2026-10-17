"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

export interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  label: string;
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: "light" | "dark";
}

// The selected pill slides between options through a shared layoutId.
export function Tabs<T extends string>({
  label,
  options,
  value,
  onChange,
  tone = "light",
}: TabsProps<T>) {
  const uid = useId();
  const dark = tone === "dark";

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex rounded-control p-[3px] ${dark ? "bg-white/10" : "bg-s1"}`}
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`relative rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-colors duration-150 ${
              selected ? "text-n8" : dark ? "text-n3 hover:text-white" : "text-s5 hover:text-n8"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`${uid}-pill`}
                className={`absolute inset-0 rounded-[7px] bg-white ${dark ? "" : "shadow-card"}`}
                transition={{ duration: DURATION.interaction + 0.04, ease: EASE_OUT }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
