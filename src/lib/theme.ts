// Mirror of the CSS tokens in styles/theme.css, expressed as var() references so
// SVG charts can use them without hard-coding hex values.
export const token = {
  n9: "var(--n9)",
  n8: "var(--n8)",
  n6: "var(--n6)",
  n5: "var(--n5)",
  n4: "var(--n4)",
  n3: "var(--n3)",
  n1: "var(--n1)",
  o: "var(--o)",
  o2: "var(--o2)",
  g: "var(--g)",
  g4: "var(--g4)",
  s2: "var(--s2)",
  s3: "var(--s3)",
  s5: "var(--s5)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  info: "var(--info)",
} as const;

export type ColorToken = keyof typeof token;
