"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";

const images = {
  phone: "http://localhost:3845/assets/7547242e5cb036d16364b8570d7775ad1b88fc08.svg",
  email: "http://localhost:3845/assets/fcb5cd89f5ad5a7368bd6a31ee5bec8a19db827b.svg",
  location: "http://localhost:3845/assets/5d17da5873ebc1041ef14282e5f148bd99c6f05b.svg",
  clock: "http://localhost:3845/assets/ba23470d409dcba3792e212a0805bfd2e8a06895.svg",
  call: "http://localhost:3845/assets/626f9bf905d062dbc7117f0d119c189402dec962.svg",
  whatsapp: "http://localhost:3845/assets/ed613d59729c792f68dd95a3aa0f906ad0b350a6.svg",
  send: "http://localhost:3845/assets/7170ab43ad8d7a22fb9f896b557b2c23e53c2623.svg",
  map: "http://localhost:3845/assets/bfd8a893aaeea80953a04980f8c2bca1ccb6771e.svg",
  facebook: "http://localhost:3845/assets/a37d18317c4f6ea856cdbf820adcd9b4b3ef1a50.svg",
  instagram: "http://localhost:3845/assets/03f5ae245cb1c12d3188f646c67d410b75e0110d.svg",
  twitter: "http://localhost:3845/assets/f475e22ff3bea463feeb12d5550f324b7a2c4684.svg",
  linkedin: "http://localhost:3845/assets/40fa22e68102e5fd9d25f36555f20ec5af687a54.svg",
};

const contactInfo = [
  {
    icon: images.phone,
    title: "Telepon",
    items: ["+62 822-3054-9634"],
  },
  {
    icon: images.email,
    title: "Email",
    items: ["info@mazashi.com", "support@mazashi.com"],
  },
  {
    icon: images.location,
    title: "Alamat",
    items: ["Jl. Peternakan Modern No. 123", "Jakarta Selatan 12345"],
  },
  {
    icon: images.clock,
    title: "Jam Operasional",
    items: ["Senin - Jumat: 08:00 - 17:00", "Sabtu: 08:00 - 14:00"],
  },
];

const teamMembers = [
  {
    image: "http://localhost:3845/assets/db14c1101135922916e1f3362cfa156fac2e7e1a.png",
    name: "Ahmad Fauzi",
    position: "Sales Manager",
    department: "Penjualan Daging & Sapi",
    phone: "+62 812-3456-7890",
    email: "ahmad.fauzi@mazashi.com",
  },
  {
    image: "http://localhost:3845/assets/d45db1a48888194274512265a699f86711842455.png",
    name: "Siti Nurhaliza",
    position: "Investment Manager",
    department: "Program Investasi Qurban",
    phone: "+62 813-4567-8901",
    email: "siti.nurhaliza@mazashi.com",
  },
  {
    image: "http://localhost:3845/assets/cc16108790bf0efc2f8316d0c7e0e26e69988c04.png",
    name: "Budi Santoso",
    position: "Customer Service Manager",
    department: "Layanan Pelanggan",
    phone: "+62 814-5678-9012",
    email: "budi.santoso@mazashi.com",
  },
  {
    image: "http://localhost:3845/assets/7ec16e6da44a29f4ed105ea50a8b0fd0934727a7.png",
    name: "Dewi Lestari",
    position: "Marketing Manager",
    department: "Pemasaran & Partnership",
    phone: "+62 815-6789-0123",
    email: "dewi.lestari@mazashi.com",
  },
  {
    image: "http://localhost:3845/assets/684d2ce302ed8a91063e7c585e2a09b241155ef2.png",
    name: "Rizki Pratama",
    position: "Operations Manager",
    department: "Operasional Peternakan",
    phone: "+62 816-7890-1234",
    email: "rizki.pratama@mazashi.com",
  },
  {
    image: "http://localhost:3845/assets/2cebe2c4f760be5b04e17569d043c99a6ace1d5b.png",
    name: "Rina Wijaya",
    position: "Finance Manager",
    department: "Keuangan & Administrasi",
    phone: "+62 817-8901-2345",
    email: "rina.wijaya@mazashi.com",
  },
];

const locations = [
  {
    title: "Kantor Pusat",
    address: "Jl. Peternakan Modern No. 123, Jakarta Selatan 12345",
  },
  {
    title: "Peternakan Utama",
    address: "Jl. Agro Bisnis Km. 45, Bogor, Jawa Barat",
  },
  {
    title: "Cabang Bandung",
    address: "Jl. Soreang Raya No. 88, Bandung, Jawa Barat",
  },
];

const socialMedia = [
  { icon: images.facebook, name: "Facebook" },
  { icon: images.instagram, name: "Instagram" },
  { icon: images.twitter, name: "Twitter" },
  { icon: images.linkedin, name: "LinkedIn" },
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
    // Handle form submission
    const message = `Nama: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubjek: ${formData.subject}\nPesan: ${formData.message}`;
    window.open(`https://wa.me/6282230549634?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="contact" />
      
      <PageHeader
        title="Hubungi Kami"
        description="Kami siap membantu Anda dengan pertanyaan, konsultasi, atau informasi lebih lanjut mengenai produk dan layanan kami. Jangan ragu untuk menghubungi tim kami."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-8">
                <div className="bg-[#1a8245] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Image src={info.icon} alt="" width={28} height={28} />
                </div>
                <h3 className="text-black font-semibold text-lg mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.items.map((item, i) => (
                    <p key={i} className="text-[#4a5565] text-sm">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-4">
              Tim Kami Siap Membantu
            </h2>
            <p className="text-black text-base mb-8">
              Hubungi langsung contact person sesuai dengan kebutuhan Anda untuk mendapatkan respon yang lebih cepat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                  <div className="bg-[#f3f4f6] h-[240px] relative">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-black font-semibold text-xl mb-1">{member.name}</h3>
                      <p className="text-[#1a8245] font-medium text-sm mb-2">{member.position}</p>
                      <span className="bg-[#e8f5e9] text-[#1a8245] text-xs font-medium px-3 py-1 rounded">
                        {member.department}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Image src={images.call} alt="Phone" width={16} height={16} />
                        <span className="text-[#364153] text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Image src={images.email} alt="Email" width={16} height={16} />
                        <span className="text-[#364153] text-sm">{member.email}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${member.phone.replace(/\s/g, "")}`}
                        className="bg-[#1a8245] text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Image src={images.call} alt="Call" width={14} height={14} />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25d366] text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Image src={images.whatsapp} alt="WhatsApp" width={14} height={14} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-4">
                Kirim Pesan
              </h2>
              <p className="text-[#4a5565] text-base mb-6">
                Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 1x24 jam.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-black font-medium text-sm mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#d1d5dc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8245]"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#d1d5dc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8245]"
                    placeholder="contoh@email.com"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium text-sm mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#d1d5dc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8245]"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium text-sm mb-2">Subjek</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-[#d1d5dc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8245]"
                    placeholder="Topik yang ingin ditanyakan"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium text-sm mb-2">Pesan *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-[#d1d5dc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a8245] resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1a8245] text-white py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Image src={images.send} alt="" width={18} height={18} />
                  Kirim Pesan
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-4">
                Lokasi Kami
              </h2>
              <p className="text-[#4a5565] text-base mb-6">
                Kunjungi kantor dan peternakan kami untuk melihat langsung fasilitas dan operasional kami.
              </p>
              <div className="bg-[#e5e7eb] h-[400px] rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <Image src={images.map} alt="Map" width={48} height={48} className="mx-auto mb-4" />
                  <p className="text-[#6a7282] text-base mb-2">Map Integration</p>
                  <p className="text-[#99a1af] text-sm">Jl. Peternakan Modern No. 123</p>
                  <p className="text-[#99a1af] text-sm">Jakarta Selatan 12345</p>
                </div>
              </div>
              <div className="space-y-4">
                {locations.map((location, idx) => (
                  <div key={idx} className="bg-[#e8f5e9] p-5 rounded-lg">
                    <h4 className="text-[#1a8245] font-semibold text-base mb-2">{location.title}</h4>
                    <p className="text-[#364153] text-sm">{location.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="bg-[#f9fafb] py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-[#008236] font-semibold text-3xl lg:text-[32px] mb-4">
                Ikuti Kami di Media Sosial
              </h2>
              <p className="text-[#4a5565] text-base mb-8 max-w-2xl mx-auto">
                Dapatkan update terbaru, tips peternakan, dan penawaran khusus melalui media sosial kami.
              </p>
              <div className="flex gap-4 justify-center">
                {socialMedia.map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="bg-white border border-[#d1d5dc] w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Image src={social.icon} alt={social.name} width={24} height={24} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
}
