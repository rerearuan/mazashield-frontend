"use client";

import Image from "next/image";
import { InvestTernak } from "../useInvestPublic";

interface PublicInvestCardProps {
    pkg: InvestTernak;
    onInvest: (title: string) => void;
}

export default function PublicInvestCard({ pkg, onInvest }: PublicInvestCardProps) {
    const calculateReturn = (hargaBeli: string, hargaJualPerKg: string, berat: string) => {
        const beli = parseFloat(hargaBeli);
        const jual = parseFloat(hargaJualPerKg);
        const beratNum = parseFloat(berat);
        if (beli > 0 && jual > 0 && beratNum > 0) {
            const totalJual = jual * beratNum;
            const profit = totalJual - beli;
            const returnPercent = (profit / beli) * 100;
            return returnPercent > 0 ? returnPercent.toFixed(1) : "0";
        }
        return "15"; // Base fallback
    };

    const getImageUrl = (foto: string | null) => {
        if (!foto) return "/images/homepages/Sapi.png";
        if (foto.startsWith("http")) return foto;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
        return `${apiUrl}${foto}`;
    };

    const returnPercent = calculateReturn(pkg.harga_beli, pkg.harga_jual_per_kg, pkg.berat);

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gray-100 h-[240px] relative">
                <Image
                    src={getImageUrl(pkg.foto)}
                    alt={pkg.nama}
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#1a8245] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                        {pkg.jenis}
                    </span>
                </div>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <h3 className="text-gray-900 font-black text-2xl mb-3 tracking-tight line-clamp-1">{pkg.nama}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
                        {pkg.deskripsi}
                    </p>
                </div>

                <div className="space-y-3 border-y border-gray-100 py-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Berat Ternak</span>
                        <span className="text-gray-900 font-extrabold">{pkg.berat} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Umur Ternak</span>
                        <span className="text-gray-900 font-extrabold">{pkg.umur} bulan</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">Est. Return</span>
                        <span className="text-[#1a8245] font-black text-xl">{returnPercent}%</span>
                    </div>
                </div>

                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Nilai Investasi</p>
                    <p className="text-[#1a8245] font-black text-3xl tracking-tighter">
                        <span className="text-lg mr-1 font-bold">Rp</span>
                        {parseFloat(pkg.harga_beli).toLocaleString("id-ID")}
                    </p>
                </div>

                <button
                    onClick={() => onInvest(pkg.nama)}
                    className="w-full bg-[#1a8245] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                >
                    Mulai Investasi
                </button>
            </div>
        </div>
    );
}
