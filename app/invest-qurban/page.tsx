"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";
import Image from "next/image";
import { useInvestPublic } from "@/features/invest-public/useInvestPublic";

// Code splitting
const PublicInvestCard = dynamic(() => import("@/features/invest-public/components/PublicInvestCard"), {
  loading: () => <div className="h-[500px] w-full bg-gray-50 animate-pulse rounded-2xl" />,
});

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    ),
    title: "Keuntungan Menarik",
    description: "Return investasi mencapai 15-40% tergantung paket yang dipilih dengan risiko yang terkelola.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    ),
    title: "Jangka Waktu Fleksibel",
    description: "Berbagai pilihan durasi investasi dari 4 hingga 24 bulan sesuai dengan kebutuhan Anda.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    ),
    title: "Transparan & Terpercaya",
    description: "Sistem monitoring real-time dan laporan berkala untuk menjaga kepercayaan investor.",
  },
];

const steps = [
  { n: "01", t: "Pilih Paket", d: "Temukan paket investasi yang paling sesuai dengan tujuan finansial Anda." },
  { n: "02", t: "Daftar & Aktivasi", d: "Selesaikan pendaftaran dan lakukan verifikasi pembayaran investasi." },
  { n: "03", t: "Monitoring Portofolio", d: "Pantau pertumbuhan ternak Anda melalui dashboard investor kami." },
  { n: "04", t: "Nikmati Hasil", d: "Terima bagi hasil investasi setelah periode penggemukan selesai." },
];

export default function InvestQurbanPage() {
  const { packages, loading, currentPage, setCurrentPage, totalPages } = useInvestPublic(6);

  const handleInvest = (packageTitle: string) => {
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${packageTitle}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen selection:bg-[#1a8245] selection:text-white">
      <Navbar activePage="invest-qurban" />

      <PageHeader
        title="Invest Qurban"
        description="Gabungkan nilai ibadah dengan pertumbuhan finansial. Investasi qurban transparan dengan sistem bagi hasil yang kompetitif dan aman."
      />

      {/* Benefits Section */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-green-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Values & Benefits</span>
            <h2 className="text-gray-900 font-extrabold text-4xl lg:text-5xl tracking-tighter">
              Mengapa Berinvestasi di <span className="text-[#1a8245]">Mazdafarm?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, idx) => (
              <div key={idx} className="group p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="bg-[#1a8245]/10 w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-[#1a8245]">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-black text-2xl mb-4 tracking-tight">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50 relative rounded-[60px] lg:rounded-[100px] mx-4 lg:mx-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Available Packages</span>
              <h2 className="text-gray-900 font-extrabold text-4xl lg:text-5xl tracking-tighter mb-4">
                Pilih Paket Investasi Anda
              </h2>
              <p className="text-gray-500 text-lg font-medium">
                Pilihan paket investasi yang fleksibel dan transparan untuk masa depan Anda.
              </p>
            </div>
            <div className="bg-white px-8 py-4 rounded-full border border-gray-200 shadow-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mr-2">Status:</span>
              <span className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">Active & Verified</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[600px] bg-white rounded-[40px] animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-gray-200 shadow-sm">
              <span className="text-6xl mb-6 block">🍃</span>
              <h3 className="text-gray-400 font-bold text-2xl">Belum ada paket tersedia paket saat ini.</h3>
              <p className="text-gray-400 mt-2">Nantikan paket investasi gelombang berikutnya segera!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <PublicInvestCard key={pkg.id} pkg={pkg} onInvest={handleInvest} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-20">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-40 px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Simple Process</span>
            <h2 className="text-gray-900 font-extrabold text-4xl lg:text-5xl tracking-tighter">
              Langkah Menuju <span className="text-[#1a8245]">Kebebasan Finansial</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {steps.map((s, idx) => (
              <div key={idx} className="relative group">
                <div className="mb-8">
                  <span className="text-8xl font-black text-gray-100 group-hover:text-green-50 transition-colors duration-500">{s.n}</span>
                </div>
                <div className="relative z-10 -mt-16 pl-6">
                  <h3 className="text-gray-900 font-black text-xl mb-4 tracking-tight uppercase tracking-widest">{s.t}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Siap Mewujudkan Investasi Ibadah?"
        description="Konsultasikan rencana investasi Anda dengan tim ahli Mazdafarm untuk hasil yang optimal dan penuh berkah."
        buttonText="Hubungi Konsultan Kami"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
