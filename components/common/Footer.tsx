import Link from "next/link";
import { Icons } from "./Icons";
import SafeImage from "./SafeImage";

export default function Footer() {
  const logo = "/images/logoPrimer 1.png";

  return (
    <footer className="bg-white border-t border-gray-100 py-24 px-4 sm:px-6 lg:px-8 font-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20 text-center sm:text-left">
          <div className="space-y-8 col-span-1 lg:col-span-1">
            <div className="inline-flex p-3 rounded-2xl bg-gray-50">
              <SafeImage src={logo} alt="Logo" width={48} height={48} className="object-contain" unoptimized />
            </div>
            <div>
              <h4 className="text-[#1a8245] font-black text-xl tracking-tighter mb-4">PT Mazashi Semuda Farm</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs mx-auto sm:mx-0">
                Pionir peternakan modern masa depan. Kami menghadirkan kualitas terbaik melalui integrasi teknologi dan kearifan lokal.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Navigasi Utama</h5>
            <ul className="space-y-4 text-gray-500 font-bold text-sm tracking-tight">
              <li><Link href="/" className="hover:text-[#1a8245] transition-colors">Beranda</Link></li>
              <li><Link href="/mazdaging" className="hover:text-[#1a8245] transition-colors">Katalog Mazdaging</Link></li>
              <li><Link href="/mazdafarm" className="hover:text-[#1a8245] transition-colors">Marketplace Mazdafarm</Link></li>
              <li><Link href="/invest-qurban" className="hover:text-[#1a8245] transition-colors">Invest Qurban</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Perusahaan</h5>
            <ul className="space-y-4 text-gray-500 font-bold text-sm tracking-tight">
              <li><Link href="/faq" className="hover:text-[#1a8245] transition-colors">Pusat Bantuan (FAQ)</Link></li>
              <li><Link href="/contact" className="hover:text-[#1a8245] transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/register" className="hover:text-[#1a8245] transition-colors">Menjadi Mitra</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Kontak & Alamat</h5>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mx-auto sm:mx-0">
                <div className="w-12 h-12 rounded-2xl bg-[#1a8245]/10 flex items-center justify-center text-[#1a8245] shrink-0">
                  <Icons.WhatsApp className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-sm text-center sm:text-left">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Kontak Admin</span>
                  <span className="text-gray-900 font-black">0858-1905-1216</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mx-auto sm:mx-0">
                <div className="w-12 h-12 rounded-2xl bg-[#1a8245]/10 flex items-center justify-center text-[#1a8245] shrink-0">
                  <Icons.MapPin className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-sm text-center sm:text-left">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Alamat Terdaftar</span>
                  <span className="text-gray-900 font-black max-w-[200px]">
                    Jl Syuhada, Jatisari, Kec. Jatiasih, Kota Bks, Jawa Barat 17426
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mx-auto sm:mx-0">
                <div className="w-12 h-12 rounded-2xl bg-[#1a8245]/10 flex items-center justify-center text-[#1a8245] shrink-0">
                  <Icons.Mail className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-sm text-center sm:text-left">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Email Dukungan</span>
                  <span className="text-gray-900 font-black">mazdafarmco@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; 2024 PT Mazashi Semuda Farm. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-8">
            <span className="text-gray-300 font-black uppercase tracking-widest text-[9px] hover:text-[#1a8245] cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="text-gray-300 font-black uppercase tracking-widest text-[9px] hover:text-[#1a8245] cursor-pointer transition-colors">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
