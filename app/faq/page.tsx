"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import CTASection from "@/components/common/CTASection";

const faqIcon = "http://localhost:3845/assets/c7ad65c9bca12f064c993db743c46d60420c007c.svg";
const chevronIcon = "http://localhost:3845/assets/029838f9e53b4a42fca1515ab9136225d94b426c.svg";

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

const popularFaqs = [
  {
    question: "Bagaimana cara memulai investasi?",
    answer: "Pilih paket investasi yang sesuai, lakukan pendaftaran, dan transfer dana investasi. Tim kami akan membantu proses selanjutnya.",
  },
  {
    question: "Apakah daging dijamin halal?",
    answer: "Ya, semua produk kami memiliki sertifikat halal dari MUI dan diproses sesuai standar syariah.",
  },
  {
    question: "Berapa lama proses pengiriman?",
    answer: "Untuk Jabodetabek 1-2 hari kerja, untuk luar kota 3-5 hari kerja tergantung lokasi tujuan.",
  },
  {
    question: "Apakah bisa berkunjung ke peternakan?",
    answer: "Tentu! Kami menerima kunjungan dengan jadwal yang sudah ditentukan. Silakan hubungi kami untuk reservasi.",
  },
];

const categories = ["Semua", "Umum", "Produk", "Sapi", "Investasi", "Pembayaran", "Qurban", "Layanan"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = selectedCategory === "Semua" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const stats = [
    { value: "15", label: "Pertanyaan Terjawab" },
    { value: "7", label: "Kategori Topik" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="faq" />
      
      <PageHeader
        title="FAQ"
        description="Temukan jawaban untuk pertanyaan yang sering diajukan seputar produk, layanan, dan investasi di Mazashi Semuda Farm."
        icon={faqIcon}
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center">
                <p className="text-[#1a8245] font-bold text-5xl mb-2">{stat.value}</p>
                <p className="text-[#4a5565] text-base">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-black font-semibold text-xl mb-4">Filter Berdasarkan Kategori</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-[50px] font-medium text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-[#1a8245] text-white"
                      : "bg-[#f3f4f6] text-[#364153] hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-16">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex-1">
                    <span className="bg-[#e8f5e9] text-[#1a8245] text-xs font-medium px-3 py-1 rounded mb-2 inline-block">
                      {faq.category}
                    </span>
                    <h4 className="text-black font-semibold text-lg">{faq.question}</h4>
                  </div>
                  <div className={`transform transition-transform ${openIndex === idx ? "rotate-180" : ""}`}>
                    <Image src={chevronIcon} alt="" width={24} height={24} />
                  </div>
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-[#4a5565] text-sm leading-5">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h3 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-8">
              Pertanyaan Populer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl p-6">
                  <h4 className="text-black font-semibold text-lg mb-3">{faq.question}</h4>
                  <p className="text-[#4a5565] text-sm leading-5 mb-4">{faq.answer}</p>
                  <button className="text-[#1a8245] font-medium text-sm hover:underline">
                    Baca Selengkapnya →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Tidak Menemukan Jawaban yang Anda Cari?"
        description="Tim customer service kami siap membantu menjawab pertanyaan Anda kapan saja."
        buttonText="Hubungi Customer Service"
        onButtonClick={() => window.open("https://wa.me/6282230549634", "_blank")}
      />

      <Footer />
    </div>
  );
}
