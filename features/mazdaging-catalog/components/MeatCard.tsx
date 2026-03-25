"use client";

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

            <div className="p-8">
                <div className="mb-4">
                    <h3 className="font-black text-2xl text-gray-900 tracking-tight leading-none mb-1">{item.nama}</h3>
                    <p className="text-[#1a8245] font-black text-[10px] uppercase tracking-[0.2em]">{item.bagian}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-[20px] border border-gray-200/80 shadow-sm transition-colors group-hover:border-[#1a8245]/20 group-hover:shadow-md">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Harga per Kg</p>
                    <p className="text-gray-900 font-black text-xl tracking-tight flex items-end">
                        <span className="text-[10px] mr-1 font-bold text-[#1a8245] uppercase tracking-widest mb-1">Rp</span>
                        {Number(item.harga_per_kg).toLocaleString("id-ID")}
                        <span className="text-[10px] font-bold text-gray-400 ml-1.5 mb-1">/ KG</span>
                    </p>
                </div>

                {(userRole === "SuperAdmin" || userRole === "CEO" || userRole === "Marketing" || userRole === "Komisaris") && (
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
                            <Icons.Trash className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
