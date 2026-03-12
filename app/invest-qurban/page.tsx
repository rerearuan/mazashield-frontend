"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";
import { catalogService } from "@/lib/api-client";

interface InvestTernak {
  id: number;
  id_invest: string;
  nama: string;
  berat: string;
  umur: number;
  harga_beli: string;
  harga_jual_per_kg: string;
  deskripsi: string;
  foto: string | null;
  status_investernak: "Tersedia" | "Dipesan" | "Terjual";
  created_at: string;
  updated_at: string;
}

const images = {
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
  const [packages, setPackages] = useState<InvestTernak[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPackages = packages.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchInvestPackages();
  }, []);

  const fetchInvestPackages = async () => {
    try {
      setLoading(true);
      const data: any = await catalogService.getInvestPublic();
      // Filter hanya yang status Tersedia
      const availableData = Array.isArray(data) 
        ? data.filter((item: InvestTernak) => item.status_investernak === "Tersedia")
        : [];
      setPackages(availableData);
    } catch (error: any) {
      console.error("Error fetching invest packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (packageTitle: string) => {
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${packageTitle}`, "_blank");
  };

  const getImageUrl = (foto: string | null) => {
    if (!foto) return "http://localhost:3845/assets/94d31fd8c85ccbd1cfc6121dd58149157147245f.png";
    if (foto.startsWith("http")) return foto;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
    return `${apiUrl}${foto}`;
  };

  const calculateReturn = (hargaBeli: string, hargaJualPerKg: string, berat: string) => {
    const beli = parseFloat(hargaBeli);
    const jual = parseFloat(hargaJualPerKg);
    const beratNum = parseFloat(berat);
    if (beli > 0 && jual > 0 && beratNum > 0) {
      const totalJual = jual * beratNum;
      const profit = totalJual - beli;
      const returnPercent = (profit / beli) * 100;
      return returnPercent > 0 ? returnPercent.toFixed(0) : "0";
    }
    return "15";
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

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Memuat paket investasi...
            </div>
          ) : currentPackages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Belum ada paket investasi tersedia saat ini.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentPackages.map((pkg) => {
                  const returnPercent = calculateReturn(pkg.harga_beli, pkg.harga_jual_per_kg, pkg.berat);
                  return (
                    <div key={pkg.id} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                      <div className="bg-[#f3f4f6] h-[200px] relative">
                        <Image 
                          src={getImageUrl(pkg.foto)} 
                          alt={pkg.nama} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-black font-semibold text-lg mb-2">{pkg.nama}</h3>
                          <p className="text-[#4a5565] text-sm leading-5 line-clamp-3">
                            {pkg.deskripsi}
                          </p>
                        </div>
                        
                        <div className="space-y-3 border-t border-[#f3f4f6] pt-4">
                          <div className="flex justify-between">
                            <span className="text-[#6a7282] text-xs">Berat</span>
                            <span className="text-black font-semibold text-xs">{pkg.berat} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6a7282] text-xs">Umur</span>
                            <span className="text-black font-semibold text-xs">{pkg.umur} bulan</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6a7282] text-xs">Est. Return</span>
                            <span className="text-[#1a8245] font-bold text-sm">{returnPercent}%</span>
                          </div>
                        </div>

                        <div className="bg-[#f0fdf4] p-4 rounded-lg">
                          <p className="text-[#4a5565] text-xs mb-1">Harga Investasi</p>
                          <p className="text-[#008236] font-bold text-xl">
                            Rp {parseFloat(pkg.harga_beli).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          onClick={() => handleInvest(pkg.nama)}
                          className="w-full bg-[#1a8245] text-white py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                        >
                          Mulai Investasi
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
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
