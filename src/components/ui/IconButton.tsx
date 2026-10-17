import type { ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/types/ui";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: IconName;
  tone?: "onDark" | "light";
}

const TONES = {
  onDark: "text-white hover:bg-white/10",
  light: "text-n8 hover:bg-s1",
};

export function IconButton({
  label,
  icon,
  tone = "light",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      {...rest}
      className={`grid size-10 place-items-center rounded-control transition-[background-color,transform] duration-150 active:translate-y-px ${TONES[tone]} ${className}`}
    >
      <Icon name={icon} />
    </button>
  );
}
