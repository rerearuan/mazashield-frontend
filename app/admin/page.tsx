"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/common/Icons";

const adminHomeCards = [
  {
    title: "Financial Dashboard",
    description: "Monitoring profit, revenue, dan pengeluaran operasional.",
    href: "/admin/dashboard-financial",
    icon: <Icons.Dashboard className="w-8 h-8" />,
    color: "bg-blue-500",
  },
  {
    title: "Katalog Mazdafarm",
    description: "Kelola data ternak sapi dan kambing untuk qurban.",
    href: "/admin/katalog-mazdafarm",
    icon: <Icons.Meat className="w-8 h-8" />,
    color: "bg-[#1a8245]",
  },
  {
    title: "Invest Ternak",
    description: "Manajemen paket investasi penggemukan sapi.",
    href: "/admin/katalog-invest-ternak",
    icon: <Icons.Leaf className="w-8 h-8" />,
    color: "bg-amber-500",
  },
  {
    title: "Manajemen Akun",
    description: "Kontrol akses user internal, marketing, dan external.",
    href: "/admin/manajemen-akun-internal",
    icon: <Icons.Users className="w-8 h-8" />,
    color: "bg-purple-500",
  },
];

export default function AdminHomePage() {
  const [userInfo, setUserInfo] = useState({ name: "User", role: "Staff" });

  useEffect(() => {
    const name = localStorage.getItem("userName") || "User";
    const role = localStorage.getItem("userRole") || "Staff";
    setUserInfo({ name, role });
  }, []);

  return (
    <div className="p-10 font-primary">
      <div className="mb-12">
        <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
          Control Center
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-4">
          Selamat Datang, <span className="text-[#1a8245]">{userInfo.name}</span>
          <span className="block text-xl sm:text-2xl text-gray-400 mt-2 font-black uppercase tracking-widest">{userInfo.role} Mode</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl">
          Gunakan panel ini untuk mengelola seluruh ekosistem peternakan Mazdafarm secara efisien dan terintegrasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {adminHomeCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className={`${card.color} w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
              {card.icon}
            </div>
            <h3 className="text-gray-900 font-black text-xl mb-3 tracking-tight">{card.title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              {card.description}
            </p>
            <div className="inline-flex items-center gap-2 text-[#1a8245] font-black uppercase tracking-widest text-[10px]">
              Buka Modul <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20">
        <div className="bg-gray-900 rounded-[48px] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1a8245]/20 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-white font-black text-3xl lg:text-4xl tracking-tighter mb-4">
                Butuh bantuan teknis?
              </h2>
              <p className="text-gray-400 font-medium text-lg italic">
                "Sistem yang baik adalah sistem yang terjaga. Pastikan setiap data diinput dengan akurat untuk laporan finansial yang presisi."
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/profile"
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
              >
                Pengaturan Profil
              </Link>
              <button
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
              >
                Buka Dokumentasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
