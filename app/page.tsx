import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// Images from /public/images/ folder
const images = {
  logo: "/images/logoPrimer 1.png",
  background: "/images/homepages/Sapi.png",
  whatsapp: "http://localhost:3845/assets/68c094810b4c0fbb6a4e6e978ed7359a3c5eb4ed.svg",
  // Tiga Solusi - menggunakan gambar dari internet
  product1: "https://images.unsplash.com/photo-1603048297172-c925447447b6?w=800&q=80", // Daging sapi premium - Fresh beef cuts
  product2: "/images/homepages/Sapi.png", // Ternak sapi - Cattle farm
  product3: "/images/homepages/image 8.png", // Qurban sapi - Cattle for sacrifice
  about1: "/images/homepages/image 10.png",
  about2: "/images/homepages/image 13.png",
  about3: "/images/homepages/image 16.png",
  about4: "/images/homepages/image 14.png",
  processImage: "/images/homepages/image 14.png",
  wheat: "http://localhost:3845/assets/25f30a45bf2b4503b9db22fb440ea37ab795d6b4.svg",
  commitment: "http://localhost:3845/assets/2ef050906b81cdaecc87deeba046c837f1306689.svg",
  innovation: "http://localhost:3845/assets/9868ac2bbe3fa193a818e10afa12e6fcf94d104a.svg",
  ctaBg: "http://localhost:3845/assets/508df08318c9f54fe171c9b83535bafc6f383393.svg",
  checkIcon: "http://localhost:3845/assets/1dbdcf19e94baabdca70c6db0be90e4e2dbff3bc.svg",
  arrowIcon: "http://localhost:3845/assets/116146a7a7f8a38ae7e8db23d8bee6d34c65416a.svg",
  phone: "http://localhost:3845/assets/45e4af6ea2c65bf0a51b9ee3249273f57227b9ed.svg",
  email: "http://localhost:3845/assets/16d34c06888333b15db5a099603cf7a98cef842d.svg",
};

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section id="home" className="relative h-[814px] flex items-center justify-center overflow-hidden mt-[58px]">
        <div className="absolute inset-0">
          <Image
            src={images.background}
            alt="Farm background"
            fill
            className="object-cover"
            priority
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/48 via-black/20 to-black/48" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[992px] space-y-5">
            <p className="text-white font-semibold text-2xl">PT Mazashi Semuda Farm</p>
            <h1 className="text-white font-bold text-4xl sm:text-5xl lg:text-[64px] leading-tight">
              Membangun <span className="text-[#22ad5c]">Masa Depan</span>{" "}
              <span className="text-[#22ad5c]">Peternakan</span> yang Lebih Modern
            </h1>
            <p className="text-white text-base max-w-[975px]">
              Kami menghubungkan peternak, investor, dan pelanggan untuk menghadirkan produk ternak berkualitas dengan cara yang lebih mudah dan terpercaya.
            </p>
            <a 
              href="https://wa.me/6282230549634" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-[#153b34] px-6 py-3 rounded-[50px] font-semibold text-sm flex items-center gap-2 shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] hover:bg-gray-100 transition-colors inline-block"
            >
              <Image src={images.whatsapp} alt="WhatsApp" width={20} height={20} />
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-[77px] items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-[#fbbf24] font-bold text-3xl lg:text-[32px]">
                Kenali Lebih Dekat PT Mazashi
              </h2>
              <div className="space-y-4 text-justify">
                <p className="text-black text-lg lg:text-[20px] leading-relaxed">
                  PT Mazashi Semuda Farm adalah perusahaan yang bergerak di bidang peternakan, pengelolaan daging, dan layanan qurban. Kami berkomitmen menghadirkan produk ternak berkualitas melalui proses yang terkelola dengan baik, transparan, dan berorientasi pada kepuasan pelanggan.
                </p>
                <p className="text-black text-lg lg:text-[20px] leading-relaxed">
                  Dengan fokus pada pengelolaan ternak yang sehat dan berkelanjutan, kami menjembatani peternak lokal dengan pasar yang lebih luas. Kami menjaga standar kualitas di setiap tahap, mulai dari perawatan ternak, pengolahan, hingga distribusi, untuk memastikan kebutuhan pelanggan terpenuhi dengan baik.
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-[554px]">
              <div className="relative h-[276px]">
                <Image src={images.about1} alt="Farm image 1" fill className="object-cover rounded-lg" unoptimized />
              </div>
              <div className="relative h-[276px]">
                <Image src={images.about2} alt="Farm image 2" fill className="object-cover rounded-lg" unoptimized />
              </div>
              <div className="relative h-[276px]">
                <Image src={images.about3} alt="Farm image 3" fill className="object-cover rounded-lg" unoptimized />
              </div>
              <div className="relative h-[276px]">
                <Image src={images.about4} alt="Farm image 4" fill className="object-cover rounded-lg" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a8245] via-[#0f5746] to-[#173f3a]" />
        <div className="absolute top-[-60px] right-0 w-[300px] h-[300px] bg-[rgba(34,173,92,0.25)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[-40px] w-[250px] h-[250px] bg-[rgba(251,191,36,0.12)] rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[rgba(251,191,36,0.15)] px-4 py-2 rounded-full">
              <Image src={images.checkIcon} alt="Icon" width={14} height={14} />
              <p className="text-[#fbbf24] font-semibold text-xs uppercase tracking-wider">Produk Unggulan Kami</p>
            </div>
            <h2 className="text-white font-bold text-3xl lg:text-[32px]">
              Tiga Solusi dari <span className="text-[#fbbf24]">Mazashi</span>
            </h2>
            <p className="text-white text-base max-w-2xl mx-auto opacity-80">
              Dari peternakan, distribusi daging, hingga investasi qurban — semua dalam satu ekosistem terpercaya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Product Card 1 - Mazdaging */}
            <div className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] rounded-[20px] overflow-hidden">
              <div className="relative h-[180px]">
                <Image 
                  src={images.product2} 
                  alt="Mazdaging - Premium Beef Products" 
                  fill 
                  className="object-cover" 
                  unoptimized={false}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute top-4 left-4 bg-[#e74c3c] w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">01</span>
                </div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">Mazdaging</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[rgba(231,76,60,0.13)] px-3 py-1 rounded-full inline-block">
                  <p className="text-[#e74c3c] font-medium text-xs uppercase tracking-wider">Premium Beef Products</p>
                </div>
                <p className="text-white text-xs opacity-80 leading-5">
                  Produk daging sapi berkualitas premium langsung dari peternakan kami dengan standar kebersihan tertinggi.
                </p>
                <div className="border-t border-white/12 pt-4 space-y-2.5">
                  {["Daging segar & berkualitas premium", "Proses higienis standar ekspor", "Pengiriman cepat & aman"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="bg-[#1a8245] w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image src={images.checkIcon} alt="Check" width={12} height={12} />
                      </div>
                      <p className="text-white text-xs opacity-90">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link href="/mazdaging" className="w-full bg-[#e74c3c] text-white py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Lihat Katalog Daging
                  <Image src={images.arrowIcon} alt="Arrow" width={14} height={14} />
                </Link>
              </div>
            </div>

            {/* Product Card 2 - Mazdafarm */}
            <div className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] rounded-[20px] overflow-hidden">
              <div className="relative h-[180px]">
                <Image 
                  src={images.product2} 
                  alt="Mazdafarm - Cattle Marketplace" 
                  fill 
                  className="object-cover" 
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute top-4 left-4 bg-[#fbbf24] w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">02</span>
                </div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">Mazdafarm</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[rgba(251,191,36,0.13)] px-3 py-1 rounded-full inline-block">
                  <p className="text-[#fbbf24] font-medium text-xs uppercase tracking-wider">Cattle Marketplace</p>
                </div>
                <p className="text-white text-xs opacity-80 leading-5">
                  Jual beli sapi berkualitas tinggi untuk penggemukan, breeding, dan investasi peternakan yang menguntungkan.
                </p>
                <div className="border-t border-white/12 pt-4 space-y-2.5">
                  {["Sapi sehat & terseleksi ketat", "Sertifikat kesehatan resmi", "Konsultasi pemeliharaan gratis"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="bg-[#1a8245] w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image src={images.checkIcon} alt="Check" width={12} height={12} />
                      </div>
                      <p className="text-white text-xs opacity-90">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link href="/mazdafarm" className="w-full bg-[#fbbf24] text-white py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Lihat Katalog Sapi
                  <Image src={images.arrowIcon} alt="Arrow" width={14} height={14} />
                </Link>
              </div>
            </div>

            {/* Product Card 3 - Invest Qurban */}
            <div className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] rounded-[20px] overflow-hidden">
              <div className="relative h-[180px]">
                <Image 
                  src={images.product2} 
                  alt="Invest Qurban - Syariah Investment" 
                  fill 
                  className="object-cover" 
                  unoptimized={false}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute top-4 left-4 bg-[#22ad5c] w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">03</span>
                </div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">Invest Qurban</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[rgba(34,173,92,0.13)] px-3 py-1 rounded-full inline-block">
                  <p className="text-[#22ad5c] font-medium text-xs uppercase tracking-wider">Syariah Investment</p>
                </div>
                <p className="text-white text-xs opacity-80 leading-5">
                  Investasi sapi qurban dengan skema syariah, return menarik, dan penyaluran yang transparan serta terpercaya.
                </p>
                <div className="border-t border-white/12 pt-4 space-y-2.5">
                  {["Skema investasi 100% syariah", "Return menarik & transparan", "Penyaluran qurban terpercaya"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="bg-[#1a8245] w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image src={images.checkIcon} alt="Check" width={12} height={12} />
                      </div>
                      <p className="text-white text-xs opacity-90">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link href="/invest-qurban" className="w-full bg-[#22ad5c] text-white py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Lihat Paket Investasi
                  <Image src={images.arrowIcon} alt="Arrow" width={14} height={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 relative">
              <div className="relative h-[400px] lg:h-[625px] rounded-[45px] overflow-hidden">
                <Image src={images.product3} alt="Work process" fill className="object-cover" unoptimized />
              </div>
            </div>
            <div className="flex-1 space-y-8">
              <h2 className="text-[#fbbf24] font-bold text-3xl lg:text-[32px]">
                Our Work Process Make<br />Your Dream True
              </h2>
              <div className="space-y-6 relative pl-2">
                {[
                  { title: "Concept", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies praesent vel" },
                  { title: "Plan", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies praesent vel" },
                  { title: "Design", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies praesent vel" },
                  { title: "Build", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies praesent vel" },
                  { title: "Launch", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies praesent vel" },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center relative z-10">
                      <div className="w-4 h-4 bg-[#1a8245] rounded-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-black font-bold text-xl mb-1">{step.title}</h3>
                      <p className="text-[#666] text-[15px] leading-[17px]">{step.desc}</p>
                    </div>
                    {idx < 4 && (
                      <div className="absolute left-4 top-8 w-0.5 h-16 border-l-2 border-dashed border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#fbbf24] font-bold text-3xl lg:text-[32px] mb-2">Vision & Mission</h2>
            <p className="text-gray-600 text-lg">Membangun peternakan modern yang berkelanjutan</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-[#0f5746] to-[#1a8245] rounded-[20px] p-8 lg:p-10 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0f5746]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-[#fbbf24] font-extrabold text-3xl">VISION</h3>
              </div>
              <p className="text-white text-lg lg:text-xl leading-relaxed">
                Menjadi perusahaan peternakan terdepan di Indonesia yang menghubungkan peternak, investor, dan konsumen melalui teknologi modern dan praktik berkelanjutan untuk menciptakan ekosistem peternakan yang inovatif dan terpercaya.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-[#1a8245] to-[#0f5746] rounded-[20px] p-8 lg:p-10 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0f5746]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-[#fbbf24] font-extrabold text-3xl">MISSION</h3>
              </div>
              <ul className="space-y-4 text-white text-base lg:text-lg leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#fbbf24] font-bold mt-1">•</span>
                  <span>Menyediakan produk ternak berkualitas tinggi dengan standar kebersihan dan keamanan pangan terbaik</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#fbbf24] font-bold mt-1">•</span>
                  <span>Membangun platform digital yang memudahkan transaksi jual beli sapi dan investasi qurban</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#fbbf24] font-bold mt-1">•</span>
                  <span>Mendukung peternak lokal dengan teknologi dan konsultasi untuk meningkatkan produktivitas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#fbbf24] font-bold mt-1">•</span>
                  <span>Mengembangkan praktik peternakan berkelanjutan yang ramah lingkungan</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#fbbf24] font-bold mt-1">•</span>
                  <span>Menyediakan layanan investasi qurban yang transparan dan sesuai syariah</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-[#fbbf24] font-bold text-3xl lg:text-[32px]">Why Choose Mazashi</h2>
            <h3 className="text-[#1a8245] font-extrabold text-3xl lg:text-[40px]">PT MAZASHI SAMUDRA FARM</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="space-y-3">
              <Image src={images.wheat} alt="Quality" width={70} height={70} />
              <h4 className="text-black font-semibold text-xl capitalize">Quality</h4>
              <p className="text-black text-sm leading-relaxed">
                We uphold the highest standards of quality at every stage — from selecting the finest ginger, to hygienic packaging processes, and timely international delivery. Our commitment is to provide products that meet global standards and ensure customer satisfaction.
              </p>
            </div>
            <div className="space-y-3">
              <Image src={images.commitment} alt="Commitment" width={81} height={69} />
              <h4 className="text-black font-semibold text-xl capitalize">Commitment</h4>
              <p className="text-black text-sm leading-relaxed">
                We are dedicated to bringing Indonesia's finest spices to the world. Every partnership is a responsibility we take seriously, and every shipment reflects our integrity and reliability.
              </p>
            </div>
            <div className="space-y-3">
              <Image src={images.innovation} alt="Innovation" width={72} height={72} />
              <h4 className="text-black font-semibold text-xl capitalize">Innovation</h4>
              <p className="text-black text-sm leading-relaxed">
                We continuously innovate our cultivation, processing, and packaging methods to ensure our ginger and spices not only meet the highest quality but also adapt to global standards and dynamic market demands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative rounded-[20px] overflow-hidden">
            <Image src={images.ctaBg} alt="CTA Background" fill className="object-cover" />
            <div className="relative z-10 p-12 lg:p-16 text-center space-y-5">
              <h2 className="text-white font-extrabold text-3xl lg:text-[32px]">
                Ready to Have Your Own Cows?
              </h2>
              <p className="text-white text-lg lg:text-[20px] max-w-4xl mx-auto leading-[30px]">
                Partner with PT. Mazashi with consistent quality, sustainable practices, and reliable delivery. Let's grow together globally.
              </p>
              <button className="border border-white text-white px-8 py-2.5 rounded-full font-medium text-sm hover:bg-white hover:text-[#0f5746] transition-colors">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
