import { cn } from "@/lib/utils";

interface WovenDividerProps {
  className?: string;
}

export function WovenDivider({
  className,
}: WovenDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden",
        className
      )}
    >
      <div
        className="
          h-32
          w-full
          bg-[url('/images/woven-divider.webp')]
          bg-[length:100%_auto]
          bg-center
          bg-no-repeat
        "
      />
    </div>
  );
}