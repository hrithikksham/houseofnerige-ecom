"use client";

import Image from "next/image";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function AdminSidebar() {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Failed to sign out:", error);
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <aside className="hidden h-[calc(100vh-40px)] w-[250px] shrink-0 flex-col overflow-hidden rounded-[26px] border border-black/[0.05] bg-[#F8F6F1] shadow-[0_12px_40px_rgba(47,43,36,0.04)] lg:flex">
      {/* Brand */}
      <div className="px-6 pb-5 pt-6">
        <Image
          src="/images/logo/nerige-logos.png"
          alt="House of Nerige Sarees"
          width={220}
          height={80}
          priority
          className="h-auto w-[155px] object-contain object-left"
        />
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-[#243C32]/[0.08]" />

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <AdminNav />
      </div>

      {/* Bottom */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-white/[0.55] p-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="h-11 w-full justify-start gap-3 rounded-xl px-3 text-[13px] font-medium text-[#777B84] transition-all duration-200 hover:bg-[#80503a]/[0.08] hover:text-[#80503a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut
              className="size-[17px]"
              strokeWidth={1.7}
            />

            {isLoggingOut
              ? "Signing out..."
              : "Sign out"}
          </Button>
        </div>
      </div>
    </aside>
  );
}