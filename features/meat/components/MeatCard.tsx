"use client";

import Image from "next/image";
import { Button } from "@/components/button";
import { Meat } from "../useMeatCatalog";

interface MeatCardProps {
    item: Meat;
    onEdit: (item: Meat) => void;
    onDelete: (id: number) => void;
}

export default function MeatCard({ item, onEdit, onDelete }: MeatCardProps) {
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
                        <span className="text-5xl">🥩</span>
                    </div>
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

            <div className="p-6">
                <h3 className="font-black text-xl text-gray-900 mb-1 truncate">{item.nama}</h3>
                <p className="text-[#1a8245] font-black text-sm mb-4 uppercase tracking-widest">{item.bagian}</p>

                <div className="bg-gray-50/50 p-4 rounded-2xl mb-6 border border-gray-100/50">
                    <p className="text-gray-900 font-black text-2xl tracking-tighter">
                        <span className="text-xs mr-1 font-bold text-gray-400">Rp</span>
                        {Number(item.harga_per_kg).toLocaleString("id-ID")}
                        <span className="text-[10px] font-bold text-gray-400 ml-1">/KG</span>
                    </p>
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
                        className="rounded-2xl p-2.5"
                    >
                        🗑️
                    </Button>
                </div>
            </div>
        </div>
    );
}
