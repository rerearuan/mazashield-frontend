import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Icons } from "@/components/common/Icons";
import { getRandomCowImage } from "@/lib/image-utils";

const images = {
  logo: "/images/logoPrimer 1.png",
  background: "/images/homepages/Sapi.png",
  product1: "/images/homepages/Daging.png",
  product2: "/images/homepages/Sapi.png",
  product3: "/images/homepages/image 8.png",
  about1: "/images/homepages/image 10.png",
  about2: "/images/homepages/image 13.png",
  about3: "/images/homepages/image 16.png",
  about4: "/images/homepages/image 14.png",
  ceo: "/images/ceo.png",
};

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-primary">
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section id="home" className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={images.background}
            alt="Farm background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left">
          <div className="max-w-[800px] space-y-6">
            <span className="text-[#22ad5c] font-black uppercase tracking-[0.3em] text-xs sm:text-sm">PT Mazashi Semuda Farm</span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
              Qurban Syariah, <br />
              <span className="text-[#96f7bb]">Cicil Dari Sekarang</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-medium leading-relaxed">
              Hewan terjamin, dirawat profesional, gratis ongkir JABODETABEK. Sudah dipercaya 40+ shohibul qurban
            </p>
            <div className="pt-4 flex flex-wrap justify-center sm:justify-start items-center gap-4">
              <a
                href="https://wa.me/6285819051216"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a8245] text-white px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-green-900/40 hover:-translate-y-1 transition-all duration-300"
              >
                <Icons.WhatsApp className="w-7 h-7" />
                Hubungi Admin
              </a>
              <Link
                href="/mazdafarm"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center"
              >
                Jelajahi Produk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[#fbbf24] font-black uppercase tracking-[0.2em] text-[10px] block mb-3">Tentang Kami</span>
                <h2 className="text-gray-900 font-black text-3xl lg:text-5xl tracking-tighter">
                  Kenali Lebih Dekat <span className="text-[#1a8245]">PT Mazashi</span>
                </h2>
              </div>
              <div className="space-y-6 text-gray-500 font-medium text-base sm:text-lg leading-relaxed">
                <p>
                  PT Mazashi Semuda Farm adalah perusahaan yang bergerak di bidang peternakan, pengelolaan daging, dan layanan qurban. Kami berkomitmen menghadirkan produk ternak berkualitas melalui proses yang terkelola dengan baik.
                </p>
                <div className="grid grid-cols-2 gap-8 py-4">
                  <div>
                    <p className="text-3xl font-black text-[#1a8245]">100%</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Higienis & Profesional</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#fbbf24]">50+</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Target Qurban 2026</p>
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest">Tujuan Utama Kami:</h4>
                  <ul className="space-y-3">
                    {[
                      "Menyediakan sapi & kambing terbaik untuk instansi & shohibul qurban.",
                      "Membantu umat muslim menunaikan ibadah qurban dengan mudah.",
                      "Menyediakan sarana penggemukan sapi yang aman bagi investor."
                    ].map((goal, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-gray-500">
                        <span className="text-[#1a8245] font-black">{i + 1}.</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6 w-full relative">
              <div className="absolute inset-0 bg-[#1a8245]/5 rounded-[40px] -rotate-3 scale-105"></div>
              <div className="relative h-[240px] sm:h-[300px] mt-12">
                <SafeImage src={images.about1} alt="Farm 1" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[240px] sm:h-[300px]">
                <SafeImage src={images.about2} alt="Farm 2" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[240px] sm:h-[300px] -mt-12">
                <SafeImage src={images.about3} alt="Farm 3" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
              <div className="relative h-[240px] sm:h-[300px]">
                <SafeImage src={images.about4} alt="Farm 4" fill className="object-cover rounded-[32px] shadow-2xl shadow-green-900/10" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f2e28]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a8245]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#fbbf24] font-black uppercase tracking-[0.2em] text-[10px]">Produk Unggulan</span>
            <h2 className="text-white font-black text-3xl lg:text-5xl tracking-tighter">
              Solusi Terpercaya dari <span className="text-[#fbbf24]">Mazashi</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Mazdaging */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-6 sm:p-8 hover:bg-white/10 transition-all duration-500">
              <div className="relative h-[200px] sm:h-[240px] rounded-[30px] overflow-hidden mb-6 sm:mb-8">
                <SafeImage src={getRandomCowImage("mazdaging")} alt="Mazdaging" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-[9px] uppercase tracking-[0.3em] mb-2 block">Premium Meat</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Mazdaging</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium text-sm sm:text-base mb-8">Daging sapi premium pilihan dengan standar kebersihan tertinggi untuk keluarga Anda.</p>
              <Link href="/mazdaging" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[10px] bg-[#fbbf24] px-6 py-4 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Lihat Katalog
                <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mazdafarm */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-6 sm:p-8 hover:bg-white/10 transition-all duration-500 transform lg:-translate-y-8">
              <div className="relative h-[200px] sm:h-[240px] rounded-[30px] overflow-hidden mb-6 sm:mb-8">
                <SafeImage src={getRandomCowImage("mazdafarm")} alt="Mazdafarm" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-[9px] uppercase tracking-[0.3em] mb-2 block">Marketplace</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Mazdafarm</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium text-sm sm:text-base mb-8">Jual beli sapi berkualitas tinggi untuk penggemukan dan investasi peternakan masa depan.</p>
              <Link href="/mazdafarm" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[10px] bg-[#fbbf24] px-6 py-4 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Katalog Sapi
                <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Qurban */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-6 sm:p-8 hover:bg-white/10 transition-all duration-500">
              <div className="relative h-[200px] sm:h-[240px] rounded-[30px] overflow-hidden mb-6 sm:mb-8">
                <SafeImage src={getRandomCowImage("qurban")} alt="Qurban" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[#fbbf24] font-black text-[9px] uppercase tracking-[0.3em] mb-2 block">Syariah Invest</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Invest Qurban</h3>
                </div>
              </div>
              <p className="text-gray-400 font-medium text-sm sm:text-base mb-8">Investasi sapi qurban dengan skema syariah yang transparan dan amanah.</p>
              <Link href="/invest-qurban" className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-[10px] bg-[#fbbf24] px-6 py-4 rounded-2xl w-full justify-center group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all">
                Paket Investasi
                <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl group">
              <SafeImage
                src={images.ceo}
                alt="CEO Mazashi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-x-6 bottom-6 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 shadow-xl">
                <p className="text-gray-900 font-black text-2xl tracking-tight">Shidqi Muhammad Naufal, S.Pt., M.Si</p>
                <p className="text-[#1a8245] font-black uppercase tracking-widest text-[10px] mt-1">Direktur Mazdafarm | Genetika Peternakan IPB</p>
              </div>
            </div>
            <div className="flex-1 space-y-10">
              <span className="text-[#fbbf24] font-black uppercase tracking-[0.3em] text-[10px]">Prakata Direktur</span>
              <h2 className="text-gray-900 font-black text-4xl lg:text-6xl tracking-tighter leading-tight italic">
                "Qurban merupakan ibadah yang paling dicintai Allah SWT di Hari Nahr."
              </h2>
              <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed">
                <p>
                  Alhamdulillah Mazdafarm memasuki tahun ketiga dalam berkontribusi menyediakan hewan Qurban terbaik. Berawal dari 11 ekor di 2024, naik menjadi 29 ekor di 2025, dan target kami minimal 50 ekor di 2026.
                </p>
                <p>
                  Kami berkomitmen menyediakan sarana penggemukan yang proporsional bagi investor serta membantu shohibul qurban menunaikan ibadah dengan hewan yang sehat, layak, dan terawat secara profesional.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-[1px] w-12 bg-gray-200"></div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">PT Mazashi Semuda Farm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
