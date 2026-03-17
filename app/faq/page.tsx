"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import CTASection from "@/components/common/CTASection";

const faqs = [
  { category: "Umum", question: "Apa itu Mazashi Semuda Farm?", answer: "PT Mazashi Semuda Farm adalah perusahaan yang bergerak di bidang peternakan, pengelolaan daging, dan layanan qurban. Kami menghubungkan peternak, investor, dan konsumen melalui teknologi modern." },
  { category: "Umum", question: "Dimana lokasi peternakan Mazashi?", answer: "Peternakan utama kami berlokasi di Bogor, Jawa Barat. Kami juga memiliki kantor pusat di Jakarta Selatan. Silakan hubungi kami untuk informasi lebih detail." },
  { category: "Produk", question: "Bagaimana kualitas daging yang dijual?", answer: "Semua produk daging kami memiliki sertifikat halal dari MUI dan diproses sesuai standar kebersihan internasional. Kami menjamin kualitas dan kesegaran produk." },
  { category: "Produk", question: "Apakah tersedia pengiriman untuk pembelian daging?", answer: "Ya, kami menyediakan layanan pengiriman untuk area Jabodetabek dan beberapa kota besar di Indonesia. Pengiriman dilakukan dengan sistem cold chain untuk menjaga kesegaran." },
  { category: "Sapi", question: "Jenis sapi apa saja yang tersedia?", answer: "Kami menyediakan berbagai jenis sapi seperti Limosin, Simental, Brahman, Ongole, PO, dan Bali. Setiap jenis memiliki karakteristik dan harga yang berbeda." },
  { category: "Sapi", question: "Apakah bisa melihat sapi sebelum membeli?", answer: "Tentu saja! Kami menyediakan layanan kunjungan ke peternakan dengan jadwal yang sudah ditentukan. Anda juga bisa melihat dokumentasi lengkap setiap sapi." },
  { category: "Investasi", question: "Bagaimana cara kerja program investasi qurban?", answer: "Anda memilih paket investasi, melakukan transfer dana, dan kami akan mengelola investasi tersebut. Anda dapat memantau perkembangan secara real-time melalui dashboard." },
  { category: "Investasi", question: "Berapa minimal investasi yang diperlukan?", answer: "Minimal investasi bervariasi tergantung paket, mulai dari Rp 5 juta untuk paket kolektif hingga Rp 35 juta untuk paket investasi indukan." },
  { category: "Investasi", question: "Bagaimana cara monitoring investasi saya?", answer: "Anda akan mendapatkan akses ke dashboard online untuk memantau perkembangan investasi secara real-time. Kami juga mengirim laporan berkala via email." },
  { category: "Investasi", question: "Apakah ada risiko dalam investasi qurban?", answer: "Seperti investasi lainnya, ada risiko yang terkelola. Namun kami memiliki sistem manajemen risiko yang baik dan asuransi untuk melindungi investasi Anda." },
  { category: "Pembayaran", question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima pembayaran melalui transfer bank, e-wallet, dan kartu kredit. Untuk investasi besar, tersedia juga sistem cicilan." },
  { category: "Pembayaran", question: "Apakah tersedia sistem cicilan?", answer: "Ya, untuk pembelian sapi dan investasi tertentu, kami menyediakan sistem cicilan dengan syarat dan ketentuan yang berlaku. Silakan hubungi tim sales kami." },
  { category: "Qurban", question: "Kapan waktu terbaik untuk membeli sapi qurban?", answer: "Waktu terbaik adalah 2-3 bulan sebelum Idul Adha untuk mendapatkan harga yang lebih baik dan memastikan sapi memenuhi syarat qurban." },
  { category: "Qurban", question: "Apakah sapi sudah memenuhi syarat qurban?", answer: "Ya, semua sapi qurban kami telah melalui pemeriksaan kesehatan dan memastikan memenuhi syarat qurban sesuai ketentuan syariah." },
  { category: "Layanan", question: "Apakah ada layanan konsultasi gratis?", answer: "Ya, kami menyediakan layanan konsultasi gratis untuk membantu Anda memilih produk atau paket investasi yang sesuai dengan kebutuhan." },
];

const categories = ["Semua", "Umum", "Produk", "Sapi", "Investasi", "Pembayaran", "Qurban", "Layanan"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = selectedCategory === "Semua"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen font-primary">
      <Navbar activePage="faq" />

      <PageHeader
        title="FAQ"
        description="Temukan jawaban untuk pertanyaan yang sering diajukan seputar produk, layanan, dan investasi di Mazashi Semuda Farm."
      />

      <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-16 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedCategory === category
                  ? "bg-[#1a8245] text-white shadow-xl shadow-green-900/20"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <div className="flex-1 pr-6">
                  <span className="text-[#1a8245] font-black text-[9px] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-3 inline-block">
                    {faq.category}
                  </span>
                  <h4 className="text-gray-900 font-black text-xl tracking-tight">{faq.question}</h4>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-all duration-300 ${openIndex === idx ? "bg-[#1a8245] text-white rotate-180" : "text-gray-400 group-hover:bg-gray-100"}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-8 pb-8 pt-0">
                  <div className="w-full h-px bg-gray-50 mb-8" />
                  <p className="text-gray-500 font-medium leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title="Masih Punya Pertanyaan?"
        description="Tim customer service kami siap membantu menjawab pertanyaan Anda melalui WhatsApp kapan saja."
        buttonText="Hubungi Customer Service"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
