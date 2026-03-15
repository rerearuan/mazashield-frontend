"use client";

import Image from "next/image";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  stock?: string;
  price?: string;
  weight?: string;
  age?: string;
  buttonText?: string;
  buttonColor?: string;
  onButtonClick?: () => void;
}

export default function ProductCard({
  image,
  title,
  description,
  stock,
  price,
  weight,
  age,
  buttonText = "Pesan Sekarang",
  buttonColor = "#1a8245",
  onButtonClick,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="bg-gray-50 h-[260px] relative overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
      </div>
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-gray-900 font-black text-xl mb-2 tracking-tight">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>

        {(weight || age) && (
          <div className="bg-gray-50/80 p-4 rounded-2xl grid grid-cols-2 gap-4 border border-gray-100">
            {weight && (
              <div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-1">Berat</p>
                <p className="text-gray-900 font-black text-sm">{weight}</p>
              </div>
            )}
            {age && (
              <div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-1">Usia</p>
                <p className="text-gray-900 font-black text-sm">{age}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {stock && (
            <div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <p className="text-[#1a8245] font-black uppercase tracking-widest text-[10px]">{stock}</p>
              </div>
            </div>
          )}
          {price && (
            <div className="text-right">
              <p className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-1">Harga{price.includes("kg") ? " / kg" : ""}</p>
              <p className="text-[#1a8245] font-black text-xl tracking-tight">{price}</p>
            </div>
          )}
        </div>

        <button
          onClick={onButtonClick}
          className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 hover:opacity-90 shadow-lg shadow-green-900/10 transition-all active:scale-95"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
