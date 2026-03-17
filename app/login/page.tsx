"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/button";
import { Icons } from "@/components/common/Icons";
import SafeImage from "@/components/common/SafeImage";

const logo = "/images/logoPrimer 1.png";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error handled in hook/toast
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-primary">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1a8245]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#22ad5c]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-3xl bg-gray-50 mb-6 group hover:scale-105 transition-transform duration-300">
              <SafeImage
                src={logo}
                alt="Logo"
                width={64}
                height={64}
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
              Selamat <span className="text-[#1a8245]">Datang</span>
            </h1>
            <p className="text-gray-500 font-medium text-sm">Masuk untuk mengakses dasbor Mazashi Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] ml-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245]">
                  Kata Sandi
                </label>
                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1a8245] transition-colors">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a8245] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              className="rounded-2xl py-5 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green-100 mt-4 h-auto"
            >
              Masuk Sekarang
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#1a8245] font-black hover:opacity-70 transition-opacity">
                Daftar Sekarang
              </Link>
            </p>
            <div className="pt-6 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                &copy; 2024 PT Mazashi Semuda Farm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
