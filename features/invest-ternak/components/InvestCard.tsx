"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/button";
import { Icons } from "@/components/common/Icons";
import { InvestTernak } from "../useInvestCatalog";
import { getRandomCowImage } from "@/lib/image-utils";

interface InvestCardProps {
    item: InvestTernak;
    userRole: string | null;
    onEdit: (item: InvestTernak) => void;
    onDelete: (id: number) => void;
}

function DescriptionToggle({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = text.length > 80;

    if (!isLong) return <p className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">{text}</p>;

    return (
        <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-[#1a8245]/20 transition-all duration-300 overflow-hidden">
            <p className={`break-words ${!isExpanded ? 'line-clamp-2' : ''} transition-all duration-300 text-gray-600`}>
                {text}
            </p>

            <button

                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[#1a8245] font-black uppercase text-[8px] tracking-widest hover:underline flex items-center gap-1"
            >
                {isExpanded ? (
                    <>Show Less <Icons.ChevronUp className="w-2.5 h-2.5" /></>
                ) : (
                    <>Read More <Icons.ChevronDown className="w-2.5 h-2.5" /></>
                )}
            </button>
        </div>
    );
}

export default function InvestCard({ item, userRole, onEdit, onDelete }: InvestCardProps) {

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
                        alt={item.nama_paket}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <Image
                        src={getRandomCowImage(item.id_invest)}
                        alt={item.nama_paket}
                        fill
                        className="object-cover opacity-80"
                        unoptimized
                    />
                )}
                <div className="absolute top-4 right-4">
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${item.status_investernak === "Open"
                                ? "bg-green-500 text-white"
                                : item.status_investernak === "Ongoing"
                                    ? "bg-amber-500 text-white"
                                    : "bg-gray-500 text-white"
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
                <h3 className="font-black text-xl text-gray-900 mb-4 line-clamp-1">{item.nama_paket}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Jenis & Berat</span>
                        <span className="font-bold text-gray-900">{item.jenis} · {item.berat}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Durasi</span>
                        <span className="font-bold text-gray-900">{item.durasi_hari} Hari</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Harga Sapi</span>
                        <span className="font-bold text-gray-900 italic">Rp {Number(item.harga_sapi).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest">Harga Jual</span>
                        <span className="font-bold text-[#1a8245] leading-none">Rp {Number(item.harga_jual).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200/50 mt-2 pt-2">
                        <span className="text-[#1a8245] font-black uppercase text-[10px] tracking-widest">📊 ROI Paket</span>
                        <span className="text-[#1a8245] font-black text-lg">{item.roi_persen}%</span>
                    </div>
                </div>

                {/* Description - Progressive Disclosure Implementation */}
                <div className="mb-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a8245] mb-2 opacity-70">Deskripsi Paket</p>
                    <div className="text-xs text-gray-600 font-medium leading-relaxed">
                        {item.deskripsi ? (
                            <DescriptionToggle text={item.deskripsi} />
                        ) : (
                            <p className="text-gray-400 italic">Tidak ada deskripsi paket.</p>
                        )}
                    </div>
                </div>



                {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onEdit(item)}
                            variant="primary"
                            className="flex-1 rounded-[20px] font-black uppercase text-[10px] tracking-[0.15em] h-12 shadow-lg shadow-green-100/50"
                        >
                            Edit Paket
                        </Button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="w-12 h-12 rounded-[20px] bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-all shadow-sm"
                            title="Hapus Paket"
                        >
                            <Icons.Trash className="w-5 h-5" />
                        </button>


                    </div>
                )}

            </div>
        </div>
    );
}
