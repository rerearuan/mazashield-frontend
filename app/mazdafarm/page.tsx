"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";

const images = {
  limosin1: "http://localhost:3845/assets/f1da604f0ce126df7354f735f18d34f6a960011f.png",
  limosin2: "http://localhost:3845/assets/91d18f320952c2ad9cd5222b5bab33950390dfd0.png",
  simental: "http://localhost:3845/assets/30f5a04bd9cda5b379ddf5ca40c834fa22fcf7e1.png",
  limosin3: "http://localhost:3845/assets/e3ba08c7545d74fe0f87935f2e096c80b26f4df3.png",
  limosin4: "http://localhost:3845/assets/4a8bbd9166951cbd56ff214c13a6bfbd9eea84dd.png",
  po: "http://localhost:3845/assets/2b62c75edef217bc48013426ba4e0c080c1974ed.png",
};

const cattle = [
  {
    image: images.limosin1,
    title: "Sapi Limosin Jantan",
    description: "Sapi limosin jantan premium dengan pertumbuhan optimal. Cocok untuk penggemukan dan dijual kembali.",
    weight: "400-450 kg",
    age: "2-3 tahun",
    stock: "15 ekor",
    price: "Rp 28 Jt",
  },
  {
    image: images.simental,
    title: "Sapi Simental Betina",
    description: "Sapi simental betina berkualitas tinggi. Produktif untuk peternakan dan pengembangbiakan.",
    weight: "350-400 kg",
    age: "2-4 tahun",
    stock: "12 ekor",
    price: "Rp 32 Jt",
  },
  {
    image: images.limosin2,
    title: "Sapi Brahman Jantan",
    description: "Sapi brahman jantan dengan daya tahan tubuh yang kuat. Cocok untuk iklim tropis Indonesia.",
    weight: "380-430 kg",
    age: "2-3 tahun",
    stock: "18 ekor",
    price: "Rp 25 Jt",
  },
  {
    image: images.po,
    title: "Sapi PO (Peranakan Ongole)",
    description: "Sapi PO hasil persilangan berkualitas. Populer untuk peternakan rakyat dengan harga terjangkau.",
    weight: "320-380 kg",
    age: "2-3 tahun",
    stock: "30 ekor",
    price: "Rp 20 Jt",
  },
  {
    image: images.limosin3,
    title: "Sapi Bali Lokal",
    description: "Sapi bali asli Indonesia dengan adaptasi terbaik untuk peternakan lokal. Kualitas daging sangat baik.",
    weight: "300-350 kg",
    age: "2-3 tahun",
    stock: "25 ekor",
    price: "Rp 18 Jt",
  },
  {
    image: images.limosin4,
    title: "Sapi Ongole Jantan",
    description: "Sapi ongole dengan pertumbuhan cepat dan kualitas daging yang sangat baik. Cocok untuk qurban.",
    weight: "420-480 kg",
    age: "3-4 tahun",
    stock: "10 ekor",
    price: "Rp 30 Jt",
  },
];

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

export default function MazdafarmPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(cattle.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCattle = cattle.slice(startIndex, startIndex + itemsPerPage);

  const handleOrder = (cattleTitle: string) => {
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${cattleTitle}`, "_blank");
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentCattle.map((item, idx) => (
              <ProductCard
                key={idx}
                image={item.image}
                title={item.title}
                description={item.description}
                weight={item.weight}
                age={item.age}
                stock={item.stock}
                price={item.price}
                buttonColor="#1a8245"
                onButtonClick={() => handleOrder(item.title)}
              />
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
