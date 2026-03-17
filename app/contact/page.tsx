"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";

const Icons = {
  Phone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
  ),
  Email: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  ),
  Location: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
  ),
  WhatsApp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.105 2.156-.566c.946.515 1.944.787 3.143.788h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.77-5.767zm3.387 8.213c-.147.416-.745.764-1.029.811-.283.047-.536.074-1.516-.312-.98-.387-2.551-1.397-3.41-2.256-.859-.859-1.328-1.503-1.408-2.245-.08-.742.313-1.127.467-1.282.154-.154.333-.194.444-.194h.333c.111 0 .259-.04.407.319.148.359.518 1.261.555 1.341.037.08.062.174.012.273-.05.1-.074.162-.148.25-.074.088-.155.197-.222.266-.074.077-.151.16-.065.307.086.147.387.64.833 1.038.578.514 1.07.674 1.22.75.15.074.235.062.321-.038.086-.1.371-.434.47-.583.099-.15.197-.124.333-.074.136.05.865.407 1.013.482.148.074.247.112.284.174.037.062.037.359-.111.775z" />
    </svg>
  )
};

const contactInfo = [
  {
    icon: <Icons.Phone />,
    title: "Hubungi Admin",
    value: "+62 858-1905-1216",
    desc: "Hubungi kami via telepon atau WhatsApp.",
    color: "bg-green-50 text-[#1a8245]"
  },
  {
    icon: <Icons.Email />,
    title: "Email Resmi",
    value: "mazdafarmco@gmail.com",
    desc: "Kami akan membalas dalam 24 jam.",
    color: "bg-amber-50 text-amber-600"
  },
  {
    icon: <Icons.Location />,
    title: "Alamat Kantor",
    value: "Jl Syuhada, Jatisari, Kec. Jatiasih, Kota Bks, Jawa Barat 17426",
    desc: "Kunjungi peternakan modern kami.",
    color: "bg-blue-50 text-blue-600"
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Nama: ${formData.name}\nEmail: ${formData.email}\nPesan: ${formData.message}`;
    window.open(`https://wa.me/6285819051216?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen font-primary">
      <Navbar activePage="contact" />

      <PageHeader
        title="Hubungi Kami"
        description="Punya pertanyaan atau tertarik menjalin kemitraan? Tim ahli kami siap membantu Anda mewujudkan visi peternakan modern."
      />

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="group p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className={`w-16 h-16 rounded-[24px] ${info.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {info.icon}
              </div>
              <h3 className="text-gray-900 font-black text-xl mb-2 tracking-tight">{info.title}</h3>
              <p className="text-gray-900 font-extrabold text-sm mb-2">{info.value}</p>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">{info.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form */}
          <div className="flex-1 bg-gray-50 rounded-[48px] p-10 md:p-16 border border-gray-100">
            <div className="mb-12">
              <h2 className="text-gray-900 font-black text-3xl lg:text-4xl tracking-tighter mb-4">
                Kirim <span className="text-[#1a8245]">Pesan</span>
              </h2>
              <p className="text-gray-500 font-medium">Lengkapi formulir di bawah ini dan kami akan segera menghubungi Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Alamat Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Pesan Anda</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                  className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold placeholder:text-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group w-full bg-[#1a8245] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-900/10 hover:-translate-y-1 transition-all active:scale-95"
              >
                <Icons.Send />
                Kirim Sekarang
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-[400px] flex flex-col gap-8">
            <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a8245] rounded-full blur-[80px] opacity-20"></div>
              <h3 className="text-2xl font-black mb-6 tracking-tight">Butuh Respon Cepat?</h3>
              <p className="text-gray-400 font-medium mb-8 leading-relaxed">Tim kami tersedia di WhatsApp untuk konsultasi langsung 24/7 mengenai investasi qurban dan pembelian hewan ternak.</p>

              <a
                href="https://wa.me/6285819051216"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#fbbf24] transition-all"
              >
                <Icons.WhatsApp />
                Hubungi Admin
              </a>
            </div>

            <div className="relative h-full min-h-[300px] rounded-[48px] overflow-hidden group">
              <Image src="/images/homepages/Sapi.png" alt="Farm" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a8245]/80 to-transparent flex items-end p-10">
                <div>
                  <p className="text-white font-black text-xl mb-2">PT Mazashi Semuda Farm</p>
                  <p className="text-green-50/80 text-sm font-medium">Partner peternakan modern Indonesia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
