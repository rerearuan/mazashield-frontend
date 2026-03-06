"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import Pagination from "@/components/common/Pagination";
import CTASection from "@/components/common/CTASection";

const images = {
  premium: "http://localhost:3845/assets/ecfad8b60a3943a5fe8b37ddd6cebddf5c60cc51.png",
  sirloin: "http://localhost:3845/assets/00107f2dfb901db29e94cc807c4bf67a041b15dc.png",
  tenderloin: "http://localhost:3845/assets/504c37e3f70897710d2dc766fa893b5c31b4a346.png",
  ribeye: "http://localhost:3845/assets/af0c1d6c10dea45143626d33694a7b3d8b0ad82a.png",
  wagyu: "http://localhost:3845/assets/6fac0560ecb572f78f4a000c5c5b65d1395a4072.png",
  lokal: "http://localhost:3845/assets/4dfcfa95d7dc2d4648012c65b58bd41310583132.png",
};

const products = [
  {
    image: images.premium,
    title: "Daging Sapi Premium",
    description: "Daging sapi berkualitas tinggi dari peternakan lokal. Segar dan higienis dengan standar ekspor.",
    stock: "150 kg",
    price: "Rp 120.000",
  },
  {
    image: images.sirloin,
    title: "Daging Sapi Sirloin",
    description: "Potongan sirloin premium yang empuk dan lezat. Cocok untuk steak dan masakan mewah.",
    stock: "80 kg",
    price: "Rp 180.000",
  },
  {
    image: images.tenderloin,
    title: "Daging Sapi Tenderloin",
    description: "Bagian terlembut dari daging sapi. Sangat cocok untuk hidangan spesial dan acara penting.",
    stock: "45 kg",
    price: "Rp 250.000",
  },
  {
    image: images.ribeye,
    title: "Daging Sapi Rib Eye",
    description: "Potongan rib eye dengan marbling sempurna. Memberikan rasa yang kaya dan tekstur yang juicy.",
    stock: "60 kg",
    price: "Rp 200.000",
  },
  {
    image: images.wagyu,
    title: "Daging Sapi Wagyu",
    description: "Daging wagyu premium dengan marbling terbaik. Kelezatan yang tak tertandingi untuk pecinta daging.",
    stock: "25 kg",
    price: "Rp 450.000",
  },
  {
    image: images.lokal,
    title: "Daging Sapi Lokal",
    description: "Daging sapi lokal segar untuk masakan sehari-hari. Harga terjangkau dengan kualitas terjamin.",
    stock: "200 kg",
    price: "Rp 95.000",
  },
];

export default function MazdagingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleOrder = (productTitle: string) => {
    // Handle order logic here
    window.open(`https://wa.me/6282230549634?text=Halo, saya tertarik dengan ${productTitle}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="mazdaging" />
      
      <PageHeader
        title="Mazdaging"
        description="Menyediakan daging sapi berkualitas premium langsung dari peternakan kami. Segar, higienis, dan memenuhi standar kualitas internasional."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-2">
              Katalog Produk Daging
            </h2>
            <p className="text-black text-base">
              Pilih dari berbagai jenis daging sapi berkualitas tinggi untuk kebutuhan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                image={product.image}
                title={product.title}
                description={product.description}
                stock={product.stock}
                price={product.price}
                onButtonClick={() => handleOrder(product.title)}
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

      <CTASection
        title="Butuh Pesanan Dalam Jumlah Besar?"
        description="Hubungi kami untuk mendapatkan harga khusus untuk pemesanan dalam jumlah besar."
        buttonText="Hubungi Kami"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
