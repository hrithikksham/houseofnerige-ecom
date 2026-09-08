import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
}

export function LoadingState({
  className,
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 w-full flex-col items-center justify-center gap-4 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="size-8 animate-spin rounded-full border-2 border-sand border-t-primary"
        aria-hidden="true"
      />

      <p className="text-sm text-taupe">{message}</p>

      <span className="sr-only">Loading</span>
    </div>
  );
}