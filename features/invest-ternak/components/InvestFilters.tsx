"use client";

import { Button } from "@/components/button";

interface InvestFiltersProps {
    filters: any;
}

export default function InvestFilters({ filters }: InvestFiltersProps) {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-[32px] shadow-sm border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex-1 relative col-span-1 md:col-span-2 lg:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Cari Invest</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="ID atau Nama Ternak..."
                            value={filters.searchTerm}
                            onChange={(e) => filters.setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Harga Beli (Min-Max)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minHargaBeli}
                            onChange={(e) => filters.setMinHargaBeli(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none text-sm font-medium transition-all"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxHargaBeli}
                            onChange={(e) => filters.setMaxHargaBeli(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Berat Ternak (Min-Max)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minBerat}
                            onChange={(e) => filters.setMinBerat(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none text-sm font-medium transition-all"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxBerat}
                            onChange={(e) => filters.setMaxBerat(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Status</label>
                        <select
                            value={filters.statusFilter}
                            onChange={(e) => filters.setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none font-bold text-sm transition-all appearance-none"
                        >
                            <option value="all">Semua</option>
                            <option value="Tersedia">Tersedia</option>
                            <option value="Dipesan">Dipesan</option>
                            <option value="Terjual">Terjual</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Jenis</label>
                        <input
                            type="text"
                            placeholder="Sapi..."
                            value={filters.jenisFilter}
                            onChange={(e) => filters.setJenisFilter(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none text-sm font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="col-span-full md:col-start-4 flex items-end">
                    <Button
                        onClick={filters.resetFilters}
                        variant="secondary"
                        size="md"
                        fullWidth
                        className="rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                        Bersihkan Filter
                    </Button>
                </div>
            </div>
        </div>
    );
}
