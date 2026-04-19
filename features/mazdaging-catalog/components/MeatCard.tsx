"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/button";
import { Icons } from "@/components/common/Icons";
import { Meat } from "../useMeatCatalog";
import { getRandomMeatImage } from "@/lib/image-utils";

interface MeatCardProps {
    item: Meat;
    userRole: string | null;
    onEdit: (item: Meat) => void;
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

export default function MeatCard({ item, userRole, onEdit, onDelete }: MeatCardProps) {

    const getImageUrl = (foto: string | null) => {
        if (!foto) return null;
        if (foto.startsWith("http")) return foto;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
        return `${apiUrl}${foto}`;
    };

    const imageUrl = getImageUrl(item.foto);

    return (
        <div className="group bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
                    <Image
                        src={getRandomMeatImage(item.id_daging)}
                        alt={item.nama}
                        fill
                        className="object-cover opacity-80"
                        unoptimized
                    />
                )}
                <div className="absolute top-4 right-4">
                    <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${item.status_daging === "Tersedia"
                                ? "bg-green-500 text-white"
                                : item.status_daging === "Terjual"
                                    ? "bg-red-500 text-white"
                                    : "bg-blue-500 text-white"
                            }`}
                    >
                        {item.status_daging}
                    </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-gray-800 shadow-lg border border-white/20 uppercase">
                        {item.id_daging}
                    </span>
                </div>
            </div>

            <div className="p-5 md:p-8">
                <div className="mb-4">
                    <h3 className="font-black text-2xl text-gray-900 tracking-tight leading-none mb-1">{item.nama}</h3>
                    <p className="text-[#1a8245] font-black text-[10px] uppercase tracking-[0.2em]">{item.bagian}</p>
                </div>

                {/* Description - Progressive Disclosure Implementation */}
                <div className="mb-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a8245] mb-2 opacity-70">Deskripsi Produk</p>
                    <div className="text-xs text-gray-600 font-medium leading-relaxed">
                        {item.deskripsi ? (
                            <DescriptionToggle text={item.deskripsi} />
                        ) : (
                            <p className="text-gray-400 italic">Tidak ada deskripsi produk.</p>
                        )}
                    </div>
                </div>


                {/* Price Section - Premium Design */}
                <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm mb-6 group-hover:shadow-md group-hover:border-[#1a8245]/30 transition-all duration-300">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Harga Per Kg</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-[#1a8245] leading-none mb-0.5">Rp</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                                    {Number(item.harga_per_kg).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-[10px] font-black text-[#1a8245] bg-[#1a8245]/10 px-3 py-1 rounded-full uppercase tracking-wider">/ KG</span>
                        </div>
                    </div>
                </div>

                {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onEdit(item)}
                            variant="primary"
                            className="flex-1 rounded-[20px] font-black uppercase text-[10px] tracking-[0.15em] h-12 shadow-lg shadow-green-100/50"
                        >
                            Edit Item
                        </Button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="w-12 h-12 rounded-[20px] bg-red-50 text-red-600 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-all shadow-sm"
                            title="Hapus Item"
                        >
                            <Icons.Trash className="w-5 h-5" />
                        </button>


                    </div>
                )}

            </div>
        </div>
    );
}
