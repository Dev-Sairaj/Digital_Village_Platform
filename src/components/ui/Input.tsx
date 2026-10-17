import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

export function Input({
  label,
  error,
  trailing,
  className = "",
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-text-strong"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text outline-none transition placeholder:text-text-placeholder focus:ring-2 ${
            error
              ? "border-danger-control focus:ring-danger-border"
              : "border-border-strong focus:border-primary-focus focus:ring-primary-soft"
          } ${trailing ? "pr-16" : ""} ${className}`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
}
