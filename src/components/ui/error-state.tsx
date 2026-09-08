import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete your request. Please try again.",
  icon,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 w-full flex-col items-center justify-center rounded-md border border-terracotta/30 bg-cream px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-4 text-terracotta">
        {icon ?? (
          <AlertCircle className="size-8" aria-hidden="true" />
        )}
      </div>

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