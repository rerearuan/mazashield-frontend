"use client";

import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border border-[#e5e7eb] rounded-lg w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <Image
          src="http://localhost:3845/assets/a38d45c39367a147d813ca9866612d5c91cdd7cb.svg"
          alt="Previous"
          width={20}
          height={20}
        />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm transition-colors ${
            currentPage === page
              ? "bg-[#1a8245] text-white border border-[#1a8245]"
              : "border border-[#e5e7eb] text-[#4a5565] hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border border-[#e5e7eb] rounded-lg w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <Image
          src="http://localhost:3845/assets/08c7c25241e7666c6e48cbc644df116dbfef6c85.svg"
          alt="Next"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
