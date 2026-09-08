import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-sm border border-border bg-soft-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-taupe focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-terracotta",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-terracotta">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";