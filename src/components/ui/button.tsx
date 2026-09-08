import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap",
    "rounded-sm",
    "px-5 py-3",
    "text-sm font-medium",
    "transition-all duration-300",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-terracotta",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary",
          "text-white",
          "shadow-[0_10px_30px_rgba(23,58,52,0.12)]",
          "hover:-translate-y-px",
          "hover:bg-primary/90",
          "hover:shadow-[0_14px_36px_rgba(23,58,52,0.18)]",
        ].join(" "),

        secondary: [
          "bg-terracotta",
          "text-white",
          "hover:-translate-y-px",
          "hover:bg-terracotta/90",
        ].join(" "),

        outline: [
          "border",
          "border-primary",
          "bg-transparent",
          "text-primary",
          "hover:bg-primary",
          "hover:text-white",
        ].join(" "),

        ghost: [
          "bg-transparent",
          "text-primary",
          "hover:bg-primary/5",
        ].join(" "),

        link: [
          "bg-transparent",
          "px-0 py-0",
          "text-primary",
          "underline-offset-4",
          "hover:underline",
        ].join(" "),
      },

      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({
  children,
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}