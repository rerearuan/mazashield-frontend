"use client";

import SafeImage from "@/components/common/SafeImage";
import { InvestTernak } from "../useInvestPublic";

interface PublicInvestCardProps {
    pkg: InvestTernak;
    onInvest: (title: string) => void;
}

export default function PublicInvestCard({ pkg, onInvest }: PublicInvestCardProps) {
    const getImageUrl = (foto: string | null) => {
        if (!foto) return "/images/homepages/Sapi.png";
        if (foto.startsWith("http")) return foto;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
        return `${apiUrl}${foto}`;
    };

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gray-100 h-[240px] relative">
                <SafeImage
                    src={getImageUrl(pkg.foto)}
                    alt={pkg.nama_paket}
                    fill
                    className="object-cover"
                    id={pkg.id_invest}
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#1a8245] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                        {pkg.jenis}
                    </span>
                </div>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <h3 className="text-gray-900 font-black text-2xl mb-3 tracking-tight line-clamp-1">{pkg.nama_paket}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium italic">
                       {pkg.deskripsi || "Tidak ada deskripsi paket."}
                    </p>
                </div>

                <div className="space-y-3 border-y border-gray-100 py-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Berat Sapi</span>
                        <span className="text-gray-900 font-extrabold">{pkg.berat} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Durasi</span>
                        <span className="text-gray-900 font-extrabold">{pkg.durasi_hari} hari</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">📊 ROI Paket</span>
                        <span className="text-[#1a8245] font-black text-xl">{pkg.roi_persen}%</span>
                    </div>
                </div>

                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Nilai Investasi (Modal)</p>
                    <p className="text-[#1a8245] font-black text-3xl tracking-tighter">
                        <span className="text-lg mr-1 font-bold">Rp</span>
                        {Number(pkg.total_modal).toLocaleString("id-ID")}
                    </p>
                </div>

                <button
                    onClick={() => onInvest(pkg.nama_paket)}
                    className="w-full bg-[#1a8245] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                >
                    Join Invest Sekarang
                </button>
            </div>
        </div>
    );
}

