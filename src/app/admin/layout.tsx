"use client";

import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  // Login page — completely standalone
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated admin pages
  return (
    <div className="min-h-screen bg-[#F4F4F2] p-0 lg:p-5">
      <div className="flex min-h-screen lg:min-h-[calc(100vh-40px)] lg:gap-5">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content surface */}
        <main className="min-w-0 flex-1 overflow-x-hidden bg-white p-5 sm:p-7 lg:rounded-[28px] lg:border lg:border-black/[0.05] lg:p-8 xl:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}