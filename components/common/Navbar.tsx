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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { href: "/invest-qurban", label: "Invest Ternak", key: "invest-qurban" },
    { href: "/faq", label: "FAQ", key: "faq" },
    { href: "/contact", label: "Contact", key: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px] md:h-[80px]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <SafeImage
              src={logo}
              alt="PT Mazashi Semuda Farm Logo"
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
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

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Pesanan Saya — hanya untuk Customer */}
                {userRole === "Customer" && (
                  <div className="relative group">
                    <button className="text-gray-900 px-4 py-2 font-black uppercase tracking-widest text-[11px] hover:text-[#1a8245] transition-colors flex items-center gap-1">
                      Pesanan Saya
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <Link
                        href="/pesanan-saya/mazdafarm"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-[#1a8245] rounded-t-xl transition-colors"
                      >
                        🐄 Pesanan Mazdafarm
                      </Link>
                      <Link
                        href="/pesanan-saya/mazdaging"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-b-xl transition-colors"
                      >
                        🥩 Order Mazdaging
                      </Link>
                    </div>
                  </div>
                )}
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all ${activePage === item.key
                ? "bg-[#1a8245]/10 text-[#1a8245]"
                : "text-gray-500 hover:bg-gray-50 hover:text-[#1a8245]"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                {/* Pesanan Saya — hanya untuk Customer (mobile) */}
                {userRole === "Customer" && (
                  <>
                    <Link
                      href="/pesanan-saya/mazdafarm"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl font-semibold text-sm text-[#1a8245] hover:bg-green-50"
                    >
                      🐄 Pesanan Mazdafarm
                    </Link>
                    <Link
                      href="/pesanan-saya/mazdaging"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl font-semibold text-sm text-red-700 hover:bg-red-50"
                    >
                      🥩 Order Mazdaging
                    </Link>
                  </>
                )}
                <Link
                  href={userRole === "SuperAdmin" || userRole === "Marketing" || userRole === "Finance" || userRole === "CEO" || userRole === "Komisaris" ? "/admin/profile" : "/profile"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] text-gray-700 hover:bg-gray-50"
                >
                  Profil
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-[11px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] text-[#1a8245] hover:bg-green-50"
                >
                  Daftar
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-[#1a8245] text-white font-black uppercase tracking-widest text-[11px] text-center"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}

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
