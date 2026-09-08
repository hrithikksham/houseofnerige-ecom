import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-terracotta text-soft-white hover:bg-terracotta/90",
        outline:
          "border border-border bg-transparent text-primary hover:bg-sand/40",
        ghost:
          "bg-transparent text-primary hover:bg-sand/40",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  children: ReactNode;
  label: string;
}

export function IconButton({
  children,
  className,
  variant,
  size,
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        iconButtonVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}