"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

// Route changes: 200ms fade with 8px translate.
export default function WorkspaceTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.route, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
