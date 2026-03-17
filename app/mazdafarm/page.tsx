"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";
import { catalogService } from "@/services/catalog.service";

import { Icons } from "@/components/common/Icons";
import { getRandomCowImage } from "@/lib/image-utils";

interface Sapi {
  id: number;
  id_ternak: string;
  nama: string;
  jenis: string;
  berat: string;
  usia: string;
  harga: string;
  status_sapi: string;
  deskripsi: string;
  foto: string | null;
}

export default function MazdafarmPage() {
  const [cattle, setCattle] = useState<Sapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [jenisSapi, setJenisSapi] = useState("all");

  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, minPrice, maxPrice, jenisSapi]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
        status_sapi: "Tersedia",
      };

      if (searchTerm) params.nama = searchTerm;
      if (minPrice) params.min_harga = minPrice;
      if (maxPrice) params.max_harga = maxPrice;
      if (jenisSapi !== "all") params.jenis = jenisSapi;

      const data: any = await catalogService.getTernakPublic(params);

      if (data.results) {
        setCattle(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } else {
        setCattle(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Gagal mengambil data sapi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (productTitle: string) => {
    window.open(`https://wa.me/6285819051216?text=Halo, saya tertarik dengan ${productTitle}`, "_blank");
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
        description="Pusat perdagangan sapi potong dan bibit berkualitas tinggi. Kami menyediakan berbagai jenis sapi dengan jaminan kesehatan dan kualitas terbaik."
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Cari Sapi</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icons.Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Nama sapi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Rentang Harga (Rp)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Jenis Sapi</label>
                <select
                  value={jenisSapi}
                  onChange={(e) => setJenisSapi(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm appearance-none"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="Limousin">Limousin</option>
                  <option value="Simental">Simental</option>
                  <option value="Brahman">Brahman</option>
                  <option value="PO">PO (Peranakan Ongole)</option>
                  <option value="Bali">Bali</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setMinPrice("");
                    setMaxPrice("");
                    setJenisSapi("all");
                    setCurrentPage(1);
                  }}
                  className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all font-bold"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[#008236] font-black text-3xl tracking-tight mb-2">
              Katalog Sapi Berkualitas
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Menampilkan {totalCount} ekor sapi terbaik yang siap untuk dikirim.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {cattle.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Tidak ada sapi yang sesuai dengan kriteria anda.</p>
                  </div>
                ) : (
                  cattle.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.foto ? (item.foto.startsWith('http') ? item.foto : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.foto}`) : getRandomCowImage(item.id_ternak)}
                      title={item.nama}
                      description={item.deskripsi || `${item.jenis} berkualitas tinggi.`}
                      weight={`${Number(item.berat).toLocaleString()} kg`}
                      age={item.usia}
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
        title="Siap Mewujudkan Investasi Ibadah?"
        description="Konsultasikan rencana investasi Anda dengan tim ahli Mazdafarm untuk hasil yang optimal dan penuh berkah."
        buttonText="Hubungi Admin"
        onButtonClick={() => window.open("https://wa.me/6285819051216", "_blank")}
      />

      <Footer />
    </div>
  );
}
