import type { ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/types/ui";

type Variant = "primary" | "quiet";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: IconName;
}

// Saffron is reserved for the one primary button per page.
const VARIANTS: Record<Variant, string> = {
  primary: "bg-o text-n9 hover:bg-o2 hover:text-white",
  quiet: "border border-s2 bg-white text-n8 hover:bg-s1",
};

export function ActionButton({
  variant = "primary",
  icon,
  className = "",
  type = "button",
  children,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 text-[14px] font-semibold transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
