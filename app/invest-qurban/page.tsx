"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";

const images = {
  premium: "http://localhost:3845/assets/94d31fd8c85ccbd1cfc6121dd58149157147245f.png",
  standard: "http://localhost:3845/assets/474c6d4b18332750d06291677d49195b2a1e843c.png",
  intensif: "http://localhost:3845/assets/cdf8eb0766d9c09571add8f1edd875830621c074.png",
  indukan: "http://localhost:3845/assets/639033d6b594a94c1f93dde43059b9073586545e.png",
  syariah: "http://localhost:3845/assets/d27bc7bd0d2dc563c9f872298f9716d4b4db5937.png",
  kolektif: "http://localhost:3845/assets/91d18f320952c2ad9cd5222b5bab33950390dfd0.png",
  benefit1: "http://localhost:3845/assets/7d3ec1988d13ec9869deab367053939ea2fddd71.svg",
  benefit2: "http://localhost:3845/assets/ab0f4681b6177decd57b72ee6cd5fe43ac1b27b8.svg",
  benefit3: "http://localhost:3845/assets/6a28298dfc71aa9649829d127181801973e0659e.svg",
};

const benefits = [
  {
    icon: images.benefit1,
    title: "Keuntungan Menarik",
    description: "Return investasi mencapai 15-40% tergantung paket yang dipilih dengan risiko yang terkelola.",
  },
  {
    icon: images.benefit2,
    title: "Jangka Waktu Fleksibel",
    description: "Berbagai pilihan durasi investasi dari 4 hingga 24 bulan sesuai dengan kebutuhan Anda.",
  },
  {
    icon: images.benefit3,
    title: "Transparan & Terpercaya",
    description: "Sistem monitoring real-time dan laporan berkala untuk menjaga kepercayaan investor.",
  },
];

const packages = [
  {
    image: images.premium,
    title: "Paket Qurban Premium",
    description: "Investasi sapi qurban dengan kualitas premium. Sapi dipilih khusus untuk memenuhi syarat qurban dengan berat minimal 250kg.",
    type: "Sapi Limosin / Simental",
    duration: "6-12 bulan",
    return: "15-20%",
    minInvestment: "Rp 15 Juta",
  },
  {
    image: images.standard,
    title: "Paket Qurban Standard",
    description: "Paket qurban dengan harga terjangkau namun tetap berkualitas. Cocok untuk investasi jangka pendek menjelang Idul Adha.",
    type: "Sapi Bali / PO",
    duration: "6-9 bulan",
    return: "12-18%",
    minInvestment: "Rp 10 Juta",
  },
  {
    image: images.intensif,
    title: "Paket Penggemukan Intensif",
    description: "Program penggemukan sapi dengan sistem manajemen modern. Target pertambahan berat 1-1.5 kg per hari.",
    type: "Sapi Brahman / Ongole",
    duration: "4-6 bulan",
    return: "20-25%",
    minInvestment: "Rp 20 Juta",
  },
  {
    image: images.indukan,
    title: "Paket Investasi Indukan",
    description: "Investasi jangka panjang dengan membeli indukan sapi. Keuntungan dari penjualan anak sapi dan peningkatan nilai indukan.",
    type: "Sapi Simental / Limosin Betina",
    duration: "12-24 bulan",
    return: "30-40%",
    minInvestment: "Rp 35 Juta",
  },
  {
    image: images.syariah,
    title: "Paket Qurban Syariah",
    description: "Paket investasi qurban dengan sistem bagi hasil syariah. Transparan dan sesuai dengan prinsip ekonomi Islam.",
    type: "Sapi Ongole / PO",
    duration: "8-12 bulan",
    return: "15-22%",
    minInvestment: "Rp 12 Juta",
  },
  {
    image: images.kolektif,
    title: "Paket Kolektif Qurban",
    description: "Investasi kolektif untuk qurban bersama. Minimal investasi lebih rendah dengan sistem profit sharing yang adil.",
    type: "Berbagai Jenis Sapi",
    duration: "6-10 bulan",
    return: "10-15%",
    minInvestment: "Rp 5 Juta",
  },
];

const steps = [
  {
    number: "1",
    title: "Pilih Paket",
    description: "Pilih paket investasi yang sesuai dengan tujuan Anda",
  },
  {
    number: "2",
    title: "Daftar & Investasi",
    description: "Lakukan pendaftaran dan transfer dana investasi",
  },
  {
    number: "3",
    title: "Monitoring",
    description: "Pantau perkembangan investasi secara real-time",
  },
  {
    number: "4",
    title: "Terima Hasil",
    description: "Dapatkan keuntungan sesuai dengan kesepakatan",
  },
];

export default function InvestQurbanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPackages = packages.slice(startIndex, startIndex + itemsPerPage);

  const handleInvest = (packageTitle: string) => {
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${packageTitle}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="invest-qurban" />
      
      <PageHeader
        title="Invest Qurban"
        description="Investasi yang menguntungkan sekaligus bernilai ibadah. Investasi qurban dengan sistem transparan dan return yang menarik untuk masa depan finansial yang lebih baik."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-4">
              Mengapa Investasi Qurban?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-[#22ad5c] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Image src={benefit.icon} alt="" width={40} height={40} />
                </div>
                <h3 className="text-black font-semibold text-xl mb-2">{benefit.title}</h3>
                <p className="text-[#4a5565] text-sm leading-5">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-2">
              Paket Investasi Tersedia
            </h2>
            <p className="text-black text-base">
              Pilih paket investasi yang sesuai dengan tujuan dan kemampuan finansial Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentPackages.map((pkg, idx) => (
              <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="bg-[#f3f4f6] h-[200px] relative">
                  <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-black font-semibold text-lg mb-2">{pkg.title}</h3>
                    <p className="text-[#4a5565] text-sm leading-5">{pkg.description}</p>
                  </div>
                  
                  <div className="space-y-3 border-t border-[#f3f4f6] pt-4">
                    <div className="flex justify-between">
                      <span className="text-[#6a7282] text-xs">Jenis Sapi</span>
                      <span className="text-black font-semibold text-xs">{pkg.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6a7282] text-xs">Durasi</span>
                      <span className="text-black font-semibold text-xs">{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6a7282] text-xs">Est. Return</span>
                      <span className="text-[#1a8245] font-bold text-sm">{pkg.return}</span>
                    </div>
                  </div>

                  <div className="bg-[#f0fdf4] p-4 rounded-lg">
                    <p className="text-[#4a5565] text-xs mb-1">Minimal Investasi</p>
                    <p className="text-[#008236] font-bold text-xl">{pkg.minInvestment}</p>
                  </div>

                  <button
                    onClick={() => handleInvest(pkg.title)}
                    className="w-full bg-[#1a8245] text-white py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Mulai Investasi
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] text-center mb-12">
            Cara Kerja Investasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-[#1a8245] w-15 h-15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">{step.number}</span>
                </div>
                <h3 className="text-black font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-[#4a5565] text-sm leading-5">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Siap Memulai Investasi Qurban?"
        description="Konsultasikan rencana investasi Anda dengan tim ahli kami untuk hasil yang optimal."
        buttonText="Konsultasi Gratis"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
