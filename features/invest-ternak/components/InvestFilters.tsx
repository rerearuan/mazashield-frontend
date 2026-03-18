"use client";

import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/button";

interface InvestFiltersProps {
    filters: any;
}

export default function InvestFilters({ filters }: InvestFiltersProps) {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Cari Invest</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icons.Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="ID atau Nama Paket..."
                            value={filters.searchTerm}
                            onChange={(e) => filters.setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                        />
                    </div>
                </div>

                {/* Harga Sapi Range */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Harga Sapi (Rp)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minHargaSapi}
                            onChange={(e) => filters.setMinHargaSapi(e.target.value)}
                            className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
                        />
                        <span className="text-gray-300 self-center font-bold">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxHargaSapi}
                            onChange={(e) => filters.setMaxHargaSapi(e.target.value)}
                            className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold text-xs text-gray-900"
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-2 block">Status</label>
                    <select
                        value={filters.statusFilter}
                        onChange={(e) => filters.setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none font-bold text-sm transition-all appearance-none text-gray-900"
                    >
                        <option value="all">Semua Status</option>
                        <option value="Open">Open</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                    <Button
                        onClick={filters.resetFilters}
                        variant="secondary"
                        size="md"
                        fullWidth
                        className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-[46px] shadow-sm"
                    >
                        Reset Filter
                    </Button>
                </div>
            </div>
        </div>
    );
}
