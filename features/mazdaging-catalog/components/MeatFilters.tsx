"use client";

import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/button";

interface MeatFiltersProps {
    filters: any;
}

export default function MeatFilters({ filters }: MeatFiltersProps) {
    return (
        <div className="bg-white/85 backdrop-blur-xl rounded-[32px] shadow-lg shadow-green-900/5 border border-white/50 p-6 md:p-7 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <div className="flex-1 relative col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Cari Produk</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icons.Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="ID, Nama, atau Bagian..."
                            value={filters.searchTerm}
                            onChange={(e) => filters.setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Status</label>
                    <select
                        value={filters.filterStatus}
                        onChange={(e) => filters.setFilterStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none font-semibold text-sm transition-all appearance-none shadow-sm text-gray-900"
                    >
                        <option value="all">Semua Status</option>
                        <option value="Tersedia">Tersedia</option>
                        <option value="Terjual">Terjual</option>
                        <option value="Pre Order">Pre Order</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <Button
                        onClick={filters.resetFilters}
                        variant="secondary"
                        size="md"
                        fullWidth
                        className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm"
                    >
                        Reset Filter
                    </Button>
                </div>
            </div>
        </div>
    );
}
