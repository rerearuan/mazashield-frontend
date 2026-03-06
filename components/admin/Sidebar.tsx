"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const logo = "/images/logoPrimer 1.png";

interface SidebarItem {
  href: string;
  label: string;
  icon?: string;
}

const sidebarItems: SidebarItem[] = [
  { href: "/admin/manajemen-akun-internal", label: "Manajemen Akun Internal & SuperAdmin" },
  { href: "/admin/manajemen-akun-external", label: "Manajemen Akun External" },
  { href: "/admin/katalog-mazdafarm", label: "Katalog Mazdafarm" },
  { href: "/admin/katalog-mazdaging", label: "Katalog Mazdaging" },
  { href: "/admin/katalog-invest-ternak", label: "Katalog Invest Ternak" },
  { href: "/admin/manajemen-invest-ternak", label: "Manajemen Invest Ternak" },
  { href: "/admin/manajemen-pesanan-qurban", label: "Manajemen Pesanan Qurban" },
  { href: "/admin/manajemen-pesanan-daging-potong", label: "Manajemen Pesanan Daging Potong" },
  { href: "/admin/verifikasi-pembayaran", label: "Verifikasi Pembayaran" },
  { href: "/admin/laporan-investasi", label: "Laporan Investasi" },
  { href: "/admin/dashboard-financial", label: "Dashboard Financial" },
  { href: "/admin/dashboard-kondisi-ternak", label: "Dashboard Kondisi Ternak" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="PT Mazashi Semuda Farm Logo"
            width={40}
            height={40}
            className="object-contain"
            unoptimized
          />
          <span className="font-bold text-lg text-[#1a8245]">Admin Panel</span>
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1a8245] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <Link
          href="/"
          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Kembali ke Website
        </Link>
      </div>
    </aside>
  );
}
