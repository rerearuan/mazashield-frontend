import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// Inline SVG Icons for reliability
const Icons = {
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.105 2.156-.566c.946.515 1.944.787 3.143.788h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.77-5.767zm3.387 8.213c-.147.416-.745.764-1.029.811-.283.047-.536.074-1.516-.312-.98-.387-2.551-1.397-3.41-2.256-.859-.859-1.328-1.503-1.408-2.245-.08-.742.313-1.127.467-1.282.154-.154.333-.194.444-.194h.333c.111 0 .259-.04.407.319.148.359.518 1.261.555 1.341.037.08.062.174.012.273-.05.1-.074.162-.148.25-.074.088-.155.197-.222.266-.074.077-.151.16-.065.307.086.147.387.64.833 1.038.578.514 1.07.674 1.22.75.15.074.235.062.321-.038.086-.1.371-.434.47-.583.099-.15.197-.124.333-.074.136.05.865.407 1.013.482.148.074.247.112.284.174.037.062.037.359-.111.775z" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
};

const images = {
  logo: "/images/logoPrimer 1.png",
  background: "/images/homepages/Sapi.png",
  product1: "https://images.unsplash.com/photo-1558039909-67ca9afdfc8e?w=800&q=80",
  product2: "/images/homepages/Sapi.png",
  product3: "/images/homepages/image 8.png",
  about1: "/images/homepages/image 10.png",
  about2: "/images/homepages/image 13.png",
  about3: "/images/homepages/image 16.png",
  about4: "/images/homepages/image 14.png",
};

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-primary">
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section id="home" className="relative h-[814px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.background}
            alt="Farm background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[800px] space-y-6">
            <span className="text-[#22ad5c] font-black uppercase tracking-[0.3em] text-sm">PT Mazashi Semuda Farm</span>
            <h1 className="text-white font-black text-5xl sm:text-7xl lg:text-[84px] leading-[0.9] tracking-tighter">
              Membangun <span className="text-[#22ad5c]">Masa Depan</span><br />
              Peternakan Modern
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl font-medium leading-relaxed">
              Kami menghubungkan peternak, investor, dan pelanggan untuk menghadirkan produk ternak berkualitas dengan transparansi penuh.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="https://wa.me/6282230549634"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a8245] text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-green-900/40 hover:-translate-y-1 transition-all duration-300"
              >
                <Icons.WhatsApp />
                Hubungi Kami
              </a>
              <Link
                href="/mazdafarm"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                Jelajahi Produk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[#fbbf24] font-black uppercase tracking-[0.2em] text-xs block mb-4">Tentang Kami</span>
                <h2 className="text-gray-900 font-black text-4xl lg:text-5xl tracking-tighter">
                  Kenali Lebih Dekat <span className="text-[#1a8245]">PT Mazashi</span>
                </h2>
              </div>
              <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed">
                <p>
                  PT Mazashi Semuda Farm adalah perusahaan yang bergerak di bidang peternakan, pengelolaan daging, dan layanan qurban. Kami berkomitmen menghadirkan produk ternak berkualitas melalui proses yang terkelola dengan baik.
                </p>
                <div className="grid grid-cols-2 gap-8 py-4">
                  <div>
                    <p className="text-3xl font-black text-[#1a8245]">100%</p>
                    <p className="text-xs uppercase font-black tracking-widest text-gray-400">Higienis</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#fbbf24]">500+</p>
                    <p className="text-xs uppercase font-black tracking-widest text-gray-400">Mitra Peternak</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6 w-full relative">
              <div className="absolute inset-0 bg-[#1a8245]/5 rounded-[40px] -rotate-3 scale-105"></div>
              <div className="relative h-[300px] mt-12">
                <Image src={images.about1} alt="Farm 1" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[300px]">
                <Image src={images.about2} alt="Farm 2" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[300px] -mt-12">
                <Image src={images.about3} alt="Farm 3" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[300px]">
                <Image src={images.about4} alt="Farm 4" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f2e28]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a8245]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#fbbf24] font-black uppercase tracking-[0.2em] text-xs">Produk Unggulan</span>
            <h2 className="text-white font-black text-4xl lg:text-6xl tracking-tighter">
              Solusi Terpercaya dari <span className="text-[#fbbf24]">Mazashi</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Mazdaging */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-8 hover:bg-white/10 transition-all duration-500">
              <div className="relative h-[240px] rounded-[30px] overflow-hidden mb-8">
                <Image src={images.product1} alt="Mazdaging" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-xs uppercase tracking-[0.3em] mb-2 block tracking-widest">Premium Meat</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Mazdaging</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium mb-8">Daging sapi premium pilihan dengan standar kebersihan tertinggi untuk keluarga Anda.</p>
              <Link href="/mazdaging" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[11px] bg-[#fbbf24] px-6 py-5 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Lihat Katalog
                <Icons.ArrowRight />
              </Link>
            </div>

            {/* Mazdafarm */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-8 hover:bg-white/10 transition-all duration-500 transform lg:-translate-y-8">
              <div className="relative h-[240px] rounded-[30px] overflow-hidden mb-8">
                <Image src={images.product2} alt="Mazdafarm" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-xs uppercase tracking-[0.3em] mb-2 block tracking-widest">Marketplace</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Mazdafarm</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium mb-8">Jual beli sapi berkualitas tinggi untuk penggemukan dan investasi peternakan masa depan.</p>
              <Link href="/mazdafarm" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[11px] bg-[#fbbf24] px-6 py-5 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Katalog Sapi
                <Icons.ArrowRight />
              </Link>
            </div>

            {/* Qurban */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-8 hover:bg-white/10 transition-all duration-500">
              <div className="relative h-[240px] rounded-[30px] overflow-hidden mb-8">
                <Image src={images.product3} alt="Qurban" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-xs uppercase tracking-[0.3em] mb-2 block tracking-widest">Syariah Invest</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Invest Qurban</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium mb-8">Investasi sapi qurban dengan skema syariah yang transparan dan amanah.</p>
              <Link href="/invest-qurban" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[11px] bg-[#fbbf24] px-6 py-5 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Paket Investasi
                <Icons.ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <span className="w-16 h-1 bg-[#fbbf24] inline-block"></span>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter italic">
            "Kualitas adalah janji kami, kepercayaan adalah pondasi kami."
          </h2>
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">PT Mazashi Semuda Farm</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
