"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

interface DrawerContentProps
  extends React.ComponentProps<typeof Dialog.Content> {
  side?: "left" | "right";
}

export function DrawerContent({
  className,
  children,
  side = "right",
  ...props
}: DrawerContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />

      <Dialog.Content
        className={cn(
          "fixed top-0 z-50 flex h-full w-full max-w-sm flex-col bg-cream p-6 shadow-card focus:outline-none",
          side === "left" ? "left-0" : "right-0",
          className
        )}
        {...props}
      >
        {children}

        <Dialog.Close
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-taupe transition-colors hover:bg-sand/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          aria-label="Close drawer"
        >
          <X className="size-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}