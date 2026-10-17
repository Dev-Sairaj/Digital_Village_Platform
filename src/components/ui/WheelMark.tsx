const SPOKES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  return {
    id: i,
    x: (20 + Math.sin(angle) * 17.5).toFixed(2),
    y: (20 - Math.cos(angle) * 17.5).toFixed(2),
  };
});

// 12-spoke wheel logo mark.
export function WheelMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="17.5" />
      <circle cx="20" cy="20" r="2.4" />
      {SPOKES.map((spoke) => (
        <line key={spoke.id} x1="20" y1="20" x2={spoke.x} y2={spoke.y} />
      ))}
    </svg>
  );
}
