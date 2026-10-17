import { initialsOf } from "@/lib/format";

// Decorative: the person's name is always rendered next to it.
export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-n1 text-[12px] font-bold text-n8"
    >
      {initialsOf(name)}
    </span>
  );
}
