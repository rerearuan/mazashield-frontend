"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const logo = "/images/logoPrimer 1.png";

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      router.push("/login");
    }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt="PT Mazashi Semuda Farm Logo"
              width={50}
              height={50}
              className="object-contain"
              unoptimized
            />
          </Link>
          <div className="hidden lg:flex items-center gap-[40px]">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-semibold text-[16px] transition-colors ${activePage === item.key
                  ? "text-[#1a8245]"
                  : "text-gray-700 hover:text-[#1a8245]"
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
                  className="text-gray-700 px-4 py-2 font-bold text-sm hover:text-[#1a8245]"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="text-[#1a8245] px-4 py-2 font-bold text-sm hover:underline"
                >
                  Daftar
                </Link>
                <Link
                  href="/login"
                  className="bg-[#1a8245] text-white px-7 py-2.5 rounded-full font-bold text-sm hover:bg-[#22ad5c] transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
