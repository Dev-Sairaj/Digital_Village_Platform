"use client";

import { motion } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { STAGGER, fadeUp, staggerContainer } from "@/lib/motion";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerGroup({
  children,
  className,
  stagger = STAGGER.panel,
  delay = 0,
}: StaggerGroupProps) {
  const variants = useMemo(() => staggerContainer(stagger, delay), [stagger, delay]);
  return (
    <motion.div className={className} variants={variants} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
