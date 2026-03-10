"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";
import { catalogService } from "@/lib/api-client";

interface Cattle {
  id: number;
  id_ternak: string;
  nama: string;
  jenis: string;
  berat: string;
  tanggal_lahir: string;
  umur: number;
  harga: string;
  deskripsi: string;
  foto: string | null;
  status_ternak: string;
}

export default function MazdafarmPage() {
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCattle();
  }, []);

  const fetchCattle = async () => {
    try {
      setLoading(true);
      const data: any = await catalogService.getTernakInternal({ status_ternak: "Tersedia" });
      setCattle(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Gagal mengambil data ternak:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(cattle.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCattle = cattle.slice(startIndex, startIndex + itemsPerPage);

  const handleOrder = (cattleTitle: string) => {
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${cattleTitle}`, "_blank");
  };

  const features = [
    {
      title: "Kualitas Terjamin",
      description: "Semua sapi melalui proses seleksi ketat dan pemeriksaan kesehatan berkala untuk memastikan kualitas terbaik.",
    },
    {
      title: "Harga Kompetitif",
      description: "Dapatkan harga terbaik dengan kualitas premium. Tersedia juga paket khusus untuk pembelian dalam jumlah besar.",
    },
    {
      title: "Pengiriman Aman",
      description: "Kami menjamin pengiriman sapi dengan aman dan nyaman menggunakan armada khusus ternak yang berpengalaman.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="mazdafarm" />

      <PageHeader
        title="Mazdafarm"
        description="Peternakan sapi modern dengan kualitas terjamin. Kami menyediakan berbagai jenis sapi berkualitas tinggi untuk kebutuhan investasi, penggemukan, dan qurban."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-2">
              Katalog Sapi Berkualitas
            </h2>
            <p className="text-black text-base">
              Pilih dari berbagai jenis sapi premium yang telah melalui proses seleksi ketat untuk menjamin kualitas terbaik.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentCattle.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Belum ada sapi yang tersedia saat ini.</p>
                  </div>
                ) : (
                  currentCattle.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.foto ? (item.foto.startsWith('http') ? item.foto : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.foto}`) : "/images/homepages/Sapi.png"}
                      title={item.nama}
                      description={item.deskripsi || `${item.jenis} berkualitas tinggi.`}
                      weight={`${Number(item.berat).toLocaleString()} kg`}
                      age={`${item.umur} Bulan`}
                      stock="Tersedia"
                      price={`Rp ${Number(item.harga).toLocaleString("id-ID")}`}
                      buttonColor="#1a8245"
                      onButtonClick={() => handleOrder(item.nama)}
                    />
                  ))
                )}
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

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl p-8">
                <h3 className="text-[#008236] font-semibold text-xl mb-4">{feature.title}</h3>
                <p className="text-[#4a5565] text-sm leading-5">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Tertarik Untuk Membeli atau Investasi?"
        description="Konsultasikan kebutuhan Anda dengan tim kami untuk mendapatkan solusi terbaik."
        buttonText="Hubungi Kami"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
