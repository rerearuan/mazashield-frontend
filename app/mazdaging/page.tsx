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
import { getRandomMeatImage } from "@/lib/image-utils";

interface Daging {
  id: number;
  id_daging: string;
  nama: string;
  bagian: string;
  harga_per_kg: string;
  deskripsi: string;
  foto: string | null;
  status_daging: string;
}

export default function MazdagingPage() {
  const [products, setProducts] = useState<Daging[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bagian, setBagian] = useState("all");

  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, minPrice, maxPrice, bagian]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
        status_daging: "Tersedia",
      };

      if (searchTerm) params.nama = searchTerm;
      if (minPrice) params.min_harga = minPrice;
      if (maxPrice) params.max_harga = maxPrice;
      if (bagian !== "all") params.bagian = bagian;

      const data: any = await catalogService.getDagingPublic(params);

      if (data.results) {
        setProducts(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Gagal mengambil data daging:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (productTitle: string) => {
    window.open(`https://wa.me/6285819051216?text=Halo, saya tertarik dengan ${productTitle}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="mazdaging" />
      <PageHeader
        title="Mazdaging"
        description="Menyediakan daging sapi berkualitas premium langsung dari peternakan kami. Segar, higienis, dan memenuhi standar kualitas internasional."
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Cari Produk</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icons.Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Nama daging..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Rentang Harga /kg (Rp)</label>
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
                <label className="text-xs font-black uppercase tracking-widest text-[#1a8245]">Bagian Daging</label>
                <select
                  value={bagian}
                  onChange={(e) => setBagian(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium text-sm appearance-none"
                >
                  <option value="all">Semua Bagian</option>
                  <option value="Has Dalam">Has Dalam</option>
                  <option value="Has Luar">Has Luar</option>
                  <option value="Iga">Iga</option>
                  <option value="Sirloin">Sirloin</option>
                  <option value="Tenderloin">Tenderloin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setMinPrice("");
                    setMaxPrice("");
                    setBagian("all");
                    setCurrentPage(1);
                  }}
                  className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[#008236] font-black text-3xl tracking-tight mb-2">
              Katalog Produk Daging
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Menampilkan {totalCount} produk daging sapi berkualitas tinggi untuk kebutuhan Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Tidak ada produk yang sesuai dengan kriteria anda.</p>
                  </div>
                ) : (
                  products.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.foto ? (item.foto.startsWith('http') ? item.foto : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.foto}`) : getRandomMeatImage(item.id_daging)}
                      title={item.nama}
                      description={item.deskripsi || `Bagian ${item.bagian} berkualitas segar.`}
                      stock="Tersedia"
                      price={`Rp ${Number(item.harga_per_kg).toLocaleString("id-ID")}`}
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

      <CTASection
        title="Butuh Pesanan Dalam Jumlah Besar?"
        description="Kami melayani pemesanan skala industri dan retail dengan harga yang kompetitif. Hubungi tim marketing kami sekarang."
        buttonText="Hubungi Admin"
        onButtonClick={() => window.open("https://wa.me/6285819051216", "_blank")}
      />

      <Footer />
    </div>
  );
}
