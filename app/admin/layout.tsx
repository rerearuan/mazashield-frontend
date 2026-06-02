"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("accessToken");
    const aksMzf = localStorage.getItem("aksesMazdafarm");
    const aksMdg = localStorage.getItem("aksesMazdaging");
    const aksInv = localStorage.getItem("aksesInvesternak");

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    // Role-based route checking
    const isMzfRoute = pathname.includes("/katalog-mazdafarm") || pathname.includes("/manajemen-pesanan-mazdafarm");
    const isMdgRoute = pathname.includes("/katalog-mazdaging") || pathname.includes("/manajemen-pesanan-mazdaging");
    const isInvRoute = pathname.includes("/katalog-invest-ternak") || pathname.includes("/manajemen-invest-ternak") || pathname.includes("/laporan-investasi");
    
    // Finance vs Marketing section checking
    const isFinanceRoute = pathname.includes("/verifikasi-pembayaran") || pathname.includes("/laporan-penjualan") || pathname.includes("/dashboard-financial");
    const isCatalogOrOrderRoute = pathname.includes("/katalog-") || pathname.includes("/manajemen-pesanan-") || pathname.includes("/manajemen-invest-");

    let isOk = true;

    // Check specific module access
    if (isMzfRoute && aksMzf === "false") isOk = false;
    if (isMdgRoute && aksMdg === "false") isOk = false;
    if (isInvRoute && aksInv === "false") isOk = false;

    // Check global role sections
    if (role === "Finance" && isCatalogOrOrderRoute) isOk = false;
    if ((role === "Marketing" || role === "Komisaris") && isFinanceRoute) isOk = false;

    // Direct role sanity check
    const allowedRoles = ["SuperAdmin", "CEO", "Finance", "Marketing", "Komisaris"];
    if (!allowedRoles.includes(role)) isOk = false;

    if (!isOk) {
      router.replace("/unauthorized");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006730]" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f8fafc] relative">
        {/* Premium Background Elements */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#006730]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <Sidebar />
        <main className="flex-1 min-w-0 md:ml-64 relative z-10 pt-14 md:pt-0">
          <div className="max-w-[1600px] mx-auto min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
