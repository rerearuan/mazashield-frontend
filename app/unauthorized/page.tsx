"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const logo = "/images/logoPrimer 1.png";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-primary">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF0118]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#006730]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-[540px] relative z-10 flex flex-col gap-6">
        {/* Back to Home Header Link */}
        <Link
          href="/"
          className="self-start inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md border border-gray-200/60 hover:border-[#006730] hover:text-[#006730] text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm shadow-gray-200/10 hover:shadow-lg active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali Ke Beranda
        </Link>

        {/* Unauthorized Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-green-950/5 border border-gray-200/80 p-8 sm:p-12 md:p-14 text-center relative overflow-hidden">
          {/* Subtle Red Top Bar inside card */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF0118]"></div>

          {/* Logo container */}
          <div className="inline-flex p-4 rounded-3xl bg-gray-50 mb-8 hover:scale-105 transition-transform duration-300">
            <Image
              src={logo}
              alt="PT Mazashi Semuda Farm Logo"
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Warning SVG Icon */}
          <div className="w-20 h-20 bg-[#FF0118]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#FF0118] animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
            Akses <span className="text-[#FF0118]">Dibatasi</span>
          </h1>
          
          <p className="text-gray-600 font-bold text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Maaf, akun Anda tidak memiliki hak akses yang sesuai untuk membuka halaman atau fitur ini. Silakan hubungi Administrator jika Anda memerlukan bantuan akses tambahan.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 w-full bg-[#006730] hover:bg-[#FFDA41] text-white hover:text-gray-900 py-4.5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-green-950/10 hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            Kembali Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
