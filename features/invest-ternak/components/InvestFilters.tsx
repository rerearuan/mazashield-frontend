"use client";

import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/button";

interface InvestFiltersProps {
    filters: any;
}

export default function InvestFilters({ filters }: InvestFiltersProps) {
    const formatCurrency = (value: string) => {
        if (!value) return "";
        const cleanValue = value.replace(/\D/g, "");
        if (!cleanValue) return "";
        return parseInt(cleanValue).toLocaleString("id-ID");
    };

    const handlePriceChange = (value: string, setter: (val: string) => void) => {
        const cleanValue = value.replace(/\D/g, "");
        setter(cleanValue);
    };

    const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["-", "+", "e", "E"].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="bg-white/85 backdrop-blur-xl rounded-[32px] shadow-lg shadow-green-900/5 border border-white/50 p-6 md:p-7 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Cari Invest</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icons.Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="ID atau Nama Paket..."
                            value={filters.searchTerm}
                            onChange={(e) => filters.setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Harga Sapi Range */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Harga Sapi</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a8245] text-[10px] font-bold pointer-events-none">
                                Rp
                            </span>
                            <input
                                type="text"
                                placeholder="1.000.000"
                                value={formatCurrency(filters.minHargaSapi)}
                                onChange={(e) => handlePriceChange(e.target.value, filters.setMinHargaSapi)}
                                className="w-full pl-10 pr-3.5 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm"
                            />
                        </div>
                        <span className="text-gray-300 self-center font-bold">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a8245] text-[10px] font-bold pointer-events-none">
                                Rp
                            </span>
                            <input
                                type="text"
                                placeholder="10.000.000"
                                value={formatCurrency(filters.maxHargaSapi)}
                                onChange={(e) => handlePriceChange(e.target.value, filters.setMaxHargaSapi)}
                                className="w-full pl-10 pr-3.5 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-sm text-gray-900 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Status</label>
                    <select
                        value={filters.statusFilter}
                        onChange={(e) => filters.setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] focus:bg-white focus:border-transparent outline-none font-semibold text-sm transition-all appearance-none text-gray-900 shadow-sm"
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
                        className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm"
                    >
                        Reset Filter
                    </Button>
                </div>
            </div>
        </div>
    );
}
