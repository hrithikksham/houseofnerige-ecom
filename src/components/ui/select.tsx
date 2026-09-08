import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      id,
      placeholder,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-11 w-full appearance-none rounded-sm border border-border bg-soft-white px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-terracotta",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {children}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-taupe"
            aria-hidden="true"
          />
        </div>

        {error && (
          <p className="text-xs text-terracotta">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";