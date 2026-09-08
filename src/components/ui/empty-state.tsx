import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-cream px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-taupe" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-medium text-foreground">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-taupe">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}