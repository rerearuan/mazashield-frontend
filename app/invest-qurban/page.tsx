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

import { Icons } from "@/components/common/Icons";

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
    window.open(`https://wa.me/6285819051216?text=Halo, saya tertarik dengan ${packageTitle}`, "_blank");
  };

  const cattlePrices = [
    { class: "Patungan 7 orang*", weight: "±345", price: "3.400.000/orang" },
    { class: "Kelas A", weight: "±300", price: "19.500.000" },
    { class: "Kelas B", weight: "±345", price: "22.400.000" },
    { class: "Kelas C", weight: "±380", price: "25.000.000" },
    { class: "Kelas D", weight: "±435", price: "28.000.000" },
    { class: "Kelas E", weight: "±500", price: "32.500.000" },
  ];

  const goatPrices = [
    { class: "Kelas A", weight: "±25", price: "3.000.000" },
    { class: "Kelas B", weight: "±30", price: "3.500.000" },
    { class: "Kelas C", weight: "±35", price: "4.000.000" },
    { class: "Kelas D", weight: "±45", price: "5.000.000" },
    { class: "Kelas E", weight: "±55", price: "6.000.000" },
  ];

  const timeline = [
    { date: "Okt 2025 - Jan 2026", task: "MoU Tabungan Qurban & Investernak" },
    { date: "Januari 2026", task: "Seleksi & Belanja Sapi dari Bali" },
    { date: "Februari 2026", task: "Sapi Masuk ke Kandang Mazdafarm" },
    { date: "Mei 2026", task: "Penimbangan Bobot Sapi & Persiapan" },
    { date: "27 Mei 2026", task: "Hari Raya Idul Adha 1447 H" },
    { date: "05 Juni 2026", task: "Pengembalian Dana Investernak" },
    { date: "Agustus 2026", task: "Start Penggemukan Sektor Simental & Limousin" },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-[#1a8245] selection:text-white">
      <Navbar activePage="invest-qurban" />

      <PageHeader
        title="Invest Qurban"
        description="Gabungkan nilai ibadah dengan pertumbuhan finansial. Investasi qurban transparan dengan sistem bagi hasil yang kompetitif dan aman."
      />

      {/* Timeline Section */}
      <section className="py-24 px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Roadmap</span>
              <h2 className="text-gray-900 font-extrabold text-4xl lg:text-5xl tracking-tighter mb-8 leading-tight">
                Timeline Operasional <span className="text-[#1a8245]">2026</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-6">
                Kami berkomitmen pada transparansi waktu untuk memastikan setiap tahapan berjalan sesuai rencana, dari MoU hingga hari raya.
              </p>
              <div className="inline-flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-sm font-bold">
                <Icons.Check className="w-5 h-5" />
                Sesuai Jadwal Nasional
              </div>
            </div>
            <div className="lg:w-2/3 w-full">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow-lg shadow-gray-100 text-[#1a8245] absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 group-hover:bg-[#1a8245] group-hover:text-white transition-colors duration-300">
                      <div className="w-4 h-4 rounded-full bg-current"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-[32px] border border-gray-50 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-black text-[#1a8245] text-xs uppercase tracking-widest">{item.date}</div>
                      </div>
                      <div className="text-gray-900 font-black tracking-tight">{item.task}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricelist Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Tabungan Qurban 1447 H</span>
            <h2 className="text-gray-900 font-extrabold text-3xl lg:text-5xl tracking-tighter mb-4">
              Pricelist Hewan <span className="text-[#1a8245]">Qurban</span>
            </h2>
            <p className="text-gray-500 font-medium">Informasi harga terencana, ringan, dan mudah.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sapi Table */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="p-2 bg-[#1a8245]/10 rounded-xl"><Icons.Meat className="w-6 h-6 text-[#1a8245]" /></span>
                Sapi Bali & Jawa
              </h3>
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1a8245]">Pilihan</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1a8245]">Berat (Kg)</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1a8245]">Harga (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cattlePrices.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.class}</td>
                        <td className="px-6 py-4 font-medium text-gray-500 text-sm">{item.weight}</td>
                        <td className="px-6 py-4 font-black text-[#1a8245] text-sm">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kambing Table */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="p-2 bg-[#fbbf24]/10 rounded-xl"><Icons.Leaf className="w-6 h-6 text-[#d97706]" /></span>
                Kambing/Domba
              </h3>
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d97706]">Kelas</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d97706]">Berat (Kg)</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d97706]">Harga (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {goatPrices.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.class}</td>
                        <td className="px-6 py-4 font-medium text-gray-500 text-sm">{item.weight}</td>
                        <td className="px-6 py-4 font-black text-[#d97706] text-sm">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-400 font-medium italic">*Harga Sapi sudah termasuk biaya operasional sembelih Rp 1.500.000/ekor. Harga Kambing belum termasuk biaya jagal.</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-green-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Values & Benefits</span>
            <h2 className="text-gray-900 font-extrabold text-3xl lg:text-5xl tracking-tighter">
              Keunggulan Berqurban di <span className="text-[#1a8245]">Mazdafarm</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, idx) => (
              <div key={idx} className="group p-8 sm:p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="bg-[#1a8245]/10 w-20 h-20 rounded-[28px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-[#1a8245]">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-black text-xl sm:text-2xl mb-4 tracking-tight">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Packages Section */}
      <section className="py-32 px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 text-center sm:text-left">
            <div className="max-w-2xl">
              <span className="text-[#1a8245] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Join Investernak Yuk!!</span>
              <h2 className="text-gray-900 font-extrabold text-3xl lg:text-5xl tracking-tighter mb-4">
                Paket Investasi Penggemukan
              </h2>
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                Pilihan paket investasi transparan dengan bagi hasil 50/50 yang menguntungkan.
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm inline-flex items-center justify-center">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mr-2">Status:</span>
              <span className="text-[#1a8245] font-black uppercase tracking-widest text-[9px]">Open For Investment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bali B */}
            <div className="bg-white rounded-[48px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Paket Bali B</h3>
                  <span className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">120 Hari Maintenance</span>
                </div>
                <div className="bg-[#1a8245]/10 px-4 py-2 rounded-2xl">
                  <span className="text-[#1a8245] font-black text-lg">ROI 6.83%</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Modal Per Ekor</span>
                  <span className="text-gray-900 font-black">Rp 20.350.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Estimasi Jual</span>
                  <span className="text-gray-900 font-black">Rp 22.400.000</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50/50 px-4 rounded-xl">
                  <span className="text-[#1a8245] font-black text-xs uppercase tracking-widest">Hasil Investor (50%)</span>
                  <span className="text-[#1a8245] font-black text-lg">Rp 1.025.000</span>
                </div>
              </div>
              <button onClick={() => handleInvest("Bali B")} className="w-full py-4 bg-[#1a8245] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-100 hover:-translate-y-1 transition-all">Join Invest Sekarang</button>
            </div>

            {/* Bali C */}
            <div className="bg-white rounded-[48px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Paket Bali C</h3>
                  <span className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">120 Hari Maintenance</span>
                </div>
                <div className="bg-[#1a8245]/10 px-4 py-2 rounded-2xl">
                  <span className="text-[#1a8245] font-black text-lg">ROI 7.35%</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Modal Per Ekor</span>
                  <span className="text-gray-900 font-black">Rp 22.500.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Estimasi Jual</span>
                  <span className="text-gray-900 font-black">Rp 25.000.000</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50/50 px-4 rounded-xl">
                  <span className="text-[#1a8245] font-black text-xs uppercase tracking-widest">Hasil Investor (50%)</span>
                  <span className="text-[#1a8245] font-black text-lg">Rp 1.250.000</span>
                </div>
              </div>
              <button onClick={() => handleInvest("Bali C")} className="w-full py-4 bg-[#1a8245] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-100 hover:-translate-y-1 transition-all">Join Invest Sekarang</button>
            </div>

            {/* Super */}
            <div className="bg-gray-900 rounded-[48px] p-8 shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a8245]/20 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Paket Super</h3>
                  <span className="text-[#fbbf24] font-black uppercase tracking-widest text-[10px]">210 Hari Maintenance</span>
                </div>
                <div className="bg-[#fbbf24] px-4 py-2 rounded-2xl shadow-xl shadow-amber-500/20">
                  <span className="text-gray-900 font-black text-lg">ROI 8.38%</span>
                </div>
              </div>
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Modal Per Ekor</span>
                  <span className="text-white font-black">Rp 28.650.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Estimasi Jual</span>
                  <span className="text-white font-black">Rp 32.000.000</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#1a8245] px-4 rounded-xl shadow-lg shadow-green-900/40">
                  <span className="text-white font-black text-xs uppercase tracking-widest">Hasil Investor (50%)</span>
                  <span className="text-white font-black text-lg">Rp 1.675.000</span>
                </div>
              </div>
              <button onClick={() => handleInvest("Super")} className="w-full py-4 bg-[#fbbf24] text-gray-900 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-900/20 hover:bg-white transition-all">Join Invest Sekarang</button>
            </div>
          </div>
          <p className="mt-12 text-center text-sm text-gray-400 font-medium whitespace-pre-line">
            *Investor cukup membayar biaya sapi yang di-highlight (Modal).*{"\n"}
            Pakan diberikan berupa konsentrat, ampas kedelai, dan hijauan. Biaya pemeliharaan sudah termasuk pakan dan operasional.
          </p>

          {/* Detailed Breakdown Table */}
          <div className="mt-24 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Transparansi Struktur Biaya</h3>
              <p className="text-gray-500 text-sm font-medium mt-2">Detail alokasi dana untuk setiap paket investasi per ekor.</p>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Paket</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1a8245]">Harga Sapi</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pemeliharaan</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Vaksin/Vit</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Marketing</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-900">Total Modal</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1a8245]">ROI (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { name: "Bali B", price: "15.000.000", care: "4.200.000", med: "300.000", fee: "850.000", total: "20.350.000", roi: "6.83%" },
                    { name: "Bali C", price: "17.000.000", care: "4.200.000", med: "300.000", fee: "1.000.000", total: "22.500.000", roi: "7.35%" },
                    { name: "Super", price: "20.000.000", care: "7.350.000", med: "300.000", fee: "1.000.000", total: "28.650.000", roi: "8.38%" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-black text-gray-900">{row.name}</td>
                      <td className="px-8 py-6 font-black text-[#1a8245]">Rp {row.price}</td>
                      <td className="px-8 py-6 font-medium text-gray-500 text-sm">Rp {row.care}</td>
                      <td className="px-8 py-6 font-medium text-gray-500 text-sm">Rp {row.med}</td>
                      <td className="px-8 py-6 font-medium text-gray-500 text-sm">Rp {row.fee}</td>
                      <td className="px-8 py-6 font-black text-gray-900">Rp {row.total}</td>
                      <td className="px-8 py-6 font-black text-[#1a8245]">{row.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
        buttonText="Hubungi Admin"
        onButtonClick={() => window.open("https://wa.me/6285819051216", "_blank")}
      />

      <Footer />
    </div>
  );
}
