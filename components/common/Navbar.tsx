"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SafeImage from "./SafeImage";
import ConfirmationModal from "../ui/ConfirmationModal";
import { authService } from "@/services/auth.service";

const logo = "/images/logoPrimer 1.png";

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const onConfirmLogout = async () => {
    setIsLoggingOut(true);
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (e) {
        console.error("Logout error", e);
      }
    }
    localStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    setIsLoggingOut(false);
    router.push("/login");
  };

  const navItems = [
    { href: "/", label: "Home", key: "home" },
    { href: "/mazdaging", label: "Mazdaging", key: "mazdaging" },
    { href: "/mazdafarm", label: "Mazdafarm", key: "mazdafarm" },
    { href: "/invest-qurban", label: "Invest Qurban", key: "invest-qurban" },
    { href: "/faq", label: "FAQ", key: "faq" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <SafeImage
              src={logo}
              alt="PT Mazashi Semuda Farm Logo"
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </Link>
          <div className="hidden lg:flex items-center gap-[40px]">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${activePage === item.key
                  ? "text-[#1a8245]"
                  : "text-gray-400 hover:text-[#1a8245]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href={userRole === "SuperAdmin" || userRole === "Marketing" || userRole === "Finance" || userRole === "CEO" || userRole === "Komisaris" ? "/admin/profile" : "/profile"}
                  className="text-gray-900 px-4 py-2 font-black uppercase tracking-widest text-[11px] hover:text-[#1a8245] transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="text-[#1a8245] px-4 py-2 font-black uppercase tracking-widest text-[11px] hover:opacity-70 transition-opacity"
                >
                  Daftar
                </Link>
                <Link
                  href="/login"
                  className="bg-[#1a8245] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-100 hover:bg-[#22ad5c] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onConfirmLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sistem Mazdafarm? Sesi Anda akan berakhir dan Anda harus masuk kembali."
        confirmText="Keluar Sekarang"
        type="danger"
        isLoading={isLoggingOut}
      />
    </nav>
  );
}
