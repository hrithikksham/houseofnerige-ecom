"use client";

import { User } from "lucide-react";
import Link from "next/link";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  IconButton,
} from "@/components/ui";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Sarees", href: "/sarees" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <IconButton
          label="Open menu"
          variant="ghost"
          className="md:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </span>
        </IconButton>
      </DrawerTrigger>

      <DrawerContent side="left" className="bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b border-border pb-6">
            <span className="font-serif text-2xl text-primary">
              House of Nerige
            </span>
          </div>

          <nav className="flex flex-1 flex-col py-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border py-5 text-lg text-primary transition-colors hover:text-terracotta"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border pt-6">
            <Link
              href="/account"
              className="flex items-center gap-3 text-sm text-primary"
            >
              <User className="size-5" />
              My Account
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}