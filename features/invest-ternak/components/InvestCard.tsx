"use client";

import Image from "next/image";
import { Button } from "@/components/button";
import { InvestTernak } from "../useInvestCatalog";

interface InvestCardProps {
    item: InvestTernak;
    onEdit: (item: InvestTernak) => void;
    onDelete: (id: number) => void;
}

export default function InvestCard({ item, onEdit, onDelete }: InvestCardProps) {
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
        return "0";
    };

    const getImageUrl = (foto: string | null) => {
        if (!foto) return null;
        if (foto.startsWith("http")) return foto;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
        return `${apiUrl}${foto}`;
    };

    const imageUrl = getImageUrl(item.foto);

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-56 bg-gray-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.nama}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-5xl">🐄</span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${item.status_investernak === "Tersedia"
                                ? "bg-green-500 text-white"
                                : item.status_investernak === "Dipesan"
                                    ? "bg-amber-500 text-white"
                                    : "bg-red-500 text-white"
                            }`}
                    >
                        {item.status_investernak}
                    </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-gray-800 shadow-lg border border-white/20 uppercase">
                        {item.id_invest}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="font-black text-xl text-gray-900 mb-4 line-clamp-1">{item.nama}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Jenis</span>
                        <span className="font-bold text-gray-900">{item.jenis}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Berat</span>
                        <span className="font-bold text-gray-900">{Number(item.berat).toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Umur</span>
                        <span className="font-bold text-gray-900">{item.umur} Bulan</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Beli</span>
                        <span className="font-bold text-gray-900 leading-none">Rp {Number(item.harga_beli).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200/50 mt-2 pt-2">
                        <span className="text-[#1a8245] font-black uppercase text-[10px] tracking-widest">📈 Est. ROI</span>
                        <span className="text-[#1a8245] font-black text-lg">{calculateReturn(item.harga_beli, item.harga_jual_per_kg, item.berat)}%</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => onEdit(item)}
                        variant="primary"
                        size="sm"
                        className="flex-1 rounded-2xl font-bold"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(item.id)}
                        variant="danger"
                        size="sm"
                        className="flex-none rounded-2xl p-2.5"
                    >
                        🗑️
                    </Button>
                </div>
            </div>
        </div>
    );
}
