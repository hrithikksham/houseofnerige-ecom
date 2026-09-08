import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

import { AiSearchDialog } from "@/components/storefront/ai-search-dialog";
import { IconButton } from "@/components/ui";
import { Container } from "@/components/ui/container";

import { MobileMenu } from "./mobile-menu";

const navigation = [
  {
    label: "Shop",
    href: "/shop",
    hasDropdown: true,
  },
  {
    label: "Sarees",
    href: "/shop",
    hasDropdown: true,
  },
  {
    label: "Collections",
    href: "/collections",
    hasDropdown: true,
  },
  {
    label: "Contact",
    href: "/contact",
    hasDropdown: false,
  },
];

export function Header() {
  return (
    <header className="relative z-50 border-b border-primary/10 bg-background">
      <Container>
        <div className="relative flex h-24 items-center justify-between sm:h-28 md:h-32 lg:h-36">
          {/* Mobile menu */}
          <div className="flex flex-1 items-center md:hidden">
            <MobileMenu />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden flex-1 items-center gap-7 md:flex lg:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-primary transition-colors duration-300 hover:text-terracotta"
              >
                <span>{item.label}</span>

                {item.hasDropdown && (
                  <ChevronDown
                    className="size-3 transition-transform duration-300 group-hover:translate-y-0.5"
                    strokeWidth={1.5}
                  />
                )}

                <span className="absolute left-0 top-[calc(100%+0.65rem)] h-px w-0 bg-terracotta transition-all duration-300 group-hover:w-8" />
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link
            href="/"
            aria-label="Nerige Sarees home"
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/images/logo/nerige-logos.png"
              alt="House of Nerige"
              width={420}
              height={160}
              priority
              className="
                h-auto
                w-40
                object-contain
                transition-transform
                duration-500
                hover:scale-[1.02]
                sm:w-48
                md:w-56
                lg:w-64
              "
            />
          </Link>

          {/* Header actions */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {/* AI product search */}
            <AiSearchDialog />

            {/* Wishlist */}
            <div className="hidden sm:block">
              <IconButton
                label="Wishlist"
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-primary/5 hover:text-terracotta"
              >
                <Heart
                  className="size-[18px]"
                  strokeWidth={1.5}
                />
              </IconButton>
            </div>

            {/* Account */}
            <Link href="/account">
              <IconButton
                label="Open account"
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-primary/5 hover:text-terracotta"
              >
                <User
                  className="size-[18px]"
                  strokeWidth={1.5}
                />
              </IconButton>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="group relative"
              aria-label="Open shopping bag"
            >
              <IconButton
                label="Open cart"
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-primary/5 hover:text-terracotta"
              >
                <ShoppingBag
                  className="size-[18px]"
                  strokeWidth={1.5}
                />
              </IconButton>

              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  size-[17px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-background
                  bg-terracotta
                  text-[8px]
                  font-medium
                  text-soft-white
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                0
              </span>
            </Link>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[96%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </header>
  );
}