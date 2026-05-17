"use client";

import React, { useState } from "react";

import SafeImage from "./SafeImage";
import { Icons } from "./Icons";

function DescriptionModal({ text, title }: { text: string, title: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const isLong = text.length > 80;

    return (
        <div className="overflow-hidden">
            <p className={`text-gray-500 text-sm leading-relaxed font-medium break-words ${isLong ? 'line-clamp-2' : ''}`}>
                {text}
            </p>

            {isLong && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    className="mt-2 text-[#1a8245] font-black uppercase text-[9px] tracking-widest hover:underline flex items-center gap-1"
                >
                    Baca Selengkapnya <Icons.ChevronDown className="w-3 h-3 -rotate-90" />
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={(e) => {e.stopPropagation(); setIsOpen(false);}}>
                    <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-1 block">Detail Informasi</span>
                                <h3 className="font-black text-2xl text-gray-900 tracking-tight leading-none">{title}</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-gray-600 leading-relaxed font-medium text-sm whitespace-pre-line">
                                {text}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  stock?: string;
  price?: string;
  weight?: string;
  age?: string;
  code?: string;
  fallbackType?: "cow" | "meat" | "general";
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
  code,
  fallbackType = "cow",
  buttonText = "Pesan Sekarang",
  buttonColor = "#1a8245",
  onButtonClick,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="bg-gray-50 h-[260px] relative overflow-hidden">
        <SafeImage 
           src={image} 
           alt={title} 
           fill 
           className="object-cover group-hover:scale-110 transition-transform duration-700" 
           id={code} 
           fallbackType={fallbackType}
        />
        {code && (
            <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-gray-800 shadow-lg border border-white/20 uppercase">
                    {code}
                </span>
            </div>
        )}
      </div>
      <div className="p-8 space-y-7">
        <div className="min-h-[100px]">
          <h3 className="text-gray-900 font-black text-2xl mb-2 tracking-tight line-clamp-1">{title}</h3>
          <DescriptionModal text={description} title={title} />
        </div>


        {(weight || age) && (
          <div className="bg-gray-50/80 p-5 rounded-[24px] grid grid-cols-2 gap-4 border border-gray-100/50 shadow-inner">
            {weight && (
              <div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] mb-1.5 opacity-70">Berat</p>
                <div className="flex items-end gap-1">
                  <p className="text-gray-900 font-black text-base">{weight.split(' ')[0]}</p>
                  <span className="text-[10px] font-bold text-gray-400 mb-0.5">{weight.split(' ')[1]}</span>
                </div>
              </div>
            )}
            {age && (
              <div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] mb-1.5 opacity-70">Usia</p>
                <p className="text-gray-900 font-black text-base">{age}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          {stock && (
            <div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] mb-2 opacity-70">Stock Status</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <p className="text-[#1a8245] font-black uppercase tracking-widest text-[9px]">{stock}</p>
              </div>
            </div>
          )}
          {price && (
            <div className="text-right">
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] mb-1 opacity-70">Investment Price</p>
              <p className="text-[#1a8245] font-black text-2xl tracking-tighter">{price}</p>
            </div>
          )}
        </div>

        <button
          onClick={onButtonClick}
          className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 hover:opacity-90 shadow-lg shadow-green-900/10 transition-all active:scale-95"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
