"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  Package,
  Settings,
  Shapes,
  ShoppingBag,
  Users,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Shapes,
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: FolderOpen,
  },
  {
    label: "Campaigns",
    href: "/admin/campaigns",
    icon: ImageIcon,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

const secondaryNavigation = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type NavItemType =
  | (typeof navigation)[number]
  | (typeof secondaryNavigation)[number];

export function AdminNav() {
  const pathname = usePathname();

  function NavItem({
    label,
    href,
    icon: Icon,
  }: NavItemType) {
    const isActive =
      href === "/admin"
        ? pathname === "/admin"
        : pathname === href ||
          pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-[#F4F4F2] text-[#1C1D20]"
            : "text-[#777B84] hover:bg-black/[0.035] hover:text-[#1C1D20]"
        }`}
      >
        <Icon
          className={`size-[17px] shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-[#9A694F]"
              : "text-[#9A9DA5] group-hover:text-[#1C1D20]"
          }`}
          strokeWidth={1.7}
        />

        <span>{label}</span>

        {isActive && (
          <span className="ml-auto size-1.5 rounded-full bg-[#9A694F]" />
        )}
      </Link>
    );
  }

  return (
    <nav className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-1">
        <p className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#A0A3AA]">
          Overview
        </p>

        {navigation.map((item) => (
          <NavItem
            key={item.href}
            {...item}
          />
        ))}
      </div>

      <div className="mt-auto border-t border-black/[0.06] pt-5">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#A0A3AA]">
          Preferences
        </p>

        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavItem
              key={item.href}
              {...item}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}