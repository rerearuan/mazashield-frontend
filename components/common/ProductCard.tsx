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
  buttonColor = "#25d366",
  onButtonClick,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden">
      <div className="bg-[#f3f4f6] h-[240px] relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-black font-semibold text-lg mb-2">{title}</h3>
          <p className="text-[#4a5565] text-sm leading-5">{description}</p>
        </div>
        
        {(weight || age) && (
          <div className="bg-[#f9fafb] p-3 rounded-lg grid grid-cols-2 gap-3">
            {weight && (
              <div>
                <p className="text-[#6a7282] text-xs mb-1">Berat</p>
                <p className="text-black font-semibold text-sm">{weight}</p>
              </div>
            )}
            {age && (
              <div>
                <p className="text-[#6a7282] text-xs mb-1">Usia</p>
                <p className="text-black font-semibold text-sm">{age}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          {stock && (
            <div>
              <p className="text-[#6a7282] text-xs mb-1">Stok Tersedia</p>
              <p className="text-[#1a8245] font-semibold text-sm">{stock}</p>
            </div>
          )}
          {price && (
            <div className="text-right">
              <p className="text-[#6a7282] text-xs mb-1">Harga{price.includes("kg") ? " / kg" : ""}</p>
              <p className="text-[#008236] font-bold text-lg">{price}</p>
            </div>
          )}
        </div>

        <button
          onClick={onButtonClick}
          className="w-full py-2.5 rounded-lg font-medium text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
          <Image
            src="http://localhost:3845/assets/0159145aa2021d567703c5ee86269a8d94ac8a9a.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
}
