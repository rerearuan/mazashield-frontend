"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { useInvestOrder, PesananInvest } from "@/features/invest-order/useInvestOrder";
import OrderDetailsModal from "@/features/order-invest-ternak/components/OrderDetailsModal";
import OrderModal from "@/features/order-invest-ternak/components/OrderModal";


const formatRupiah = (val: string | number) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const STATUS_COLORS: Record<string, string> = {
    Processed: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Completed: "bg-[#1a8245]/10 text-[#1a8245]",
    Cancelled: "bg-red-100 text-red-800",
};

const Badge = memo(({ status }: { status: string }) => (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}>
        {status}
    </span>
));
Badge.displayName = "StatusBadge";

export default function ManajemenInvestTernakPage() {
    const {
        orders,
        loading,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        filters,
        fetchOrders,
    } = useInvestOrder();

    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selected, setSelected] = useState<PesananInvest | null>(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        setUserRole(role);
        if (role === "Finance") {
            router.push("/admin");
        }
    }, [router]);


    const canManage = userRole === "SuperAdmin" || userRole === "Marketing";
    const countByStatus = (s: string) => orders.filter((o) => o.status_pesanan === s).length;
    const totalTagihanVal = orders.filter((o) => o.status_pesanan !== "Cancelled").reduce((sum, o) => sum + Number(o.tagihan), 0);

    const handleOpenDetail = useCallback((order: PesananInvest) => {
        setSelected(order);
        setShowDetail(true);
    }, []);

    const handleResetFilter = useCallback(() => {
        filters.setStatusFilter("all");
        filters.setStartDate("");
        filters.setEndDate("");
        setCurrentPage(1);
    }, [filters, setCurrentPage]);

    const handleCloseDetail = useCallback(() => {
        setShowDetail(false);
        setSelected(null);
    }, []);

    return (
        <div className="p-4 md:p-10 relative font-primary bg-[#f8fafc] min-h-screen">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <div>
                    <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
                        Manajemen Penjualan
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 text-[#1a8245]">
                        Pesanan Invest
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Kelola Pesanan Invest dari customer.
                    </p>



                </div>
                {canManage && (
                    <div className="flex gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setShowCreate(true)}
                            className="rounded-2xl shadow-xl shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-[10px] tracking-widest px-8 h-14"
                        >
                            + Buat Pesanan Baru
                        </Button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 mb-8">
                <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0">
                    {[
                        { label: "Total Sisa Tagihan", value: formatRupiah(totalTagihanVal), color: "text-gray-900" },
                        { label: "Processed", value: countByStatus("Processed"), color: "text-amber-500" },
                        { label: "Completed", value: countByStatus("Completed"), color: "text-[#1a8245]" },
                        { label: "Cancelled", value: countByStatus("Cancelled"), color: "text-red-500" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="min-w-[160px] md:min-w-0 bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 md:p-6 flex-shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                            <p className={`text-base md:text-xl font-black ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[32px] shadow-lg shadow-green-900/5 border border-white/50 p-6 md:p-7 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Status Pesanan</label>
                        <select
                            value={filters.statusFilter}
                            onChange={(e) => { filters.setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                        >
                            <option value="all">Semua Status</option>
                            <option value="Processed">Processed</option>
              <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Dari Tanggal</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => { filters.setStartDate(e.target.value); setCurrentPage(1); }}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => { filters.setEndDate(e.target.value); setCurrentPage(1); }}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                        />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                        <Button
                            variant="secondary"
                            size="md"
                            fullWidth
                            onClick={handleResetFilter}
                            className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm"
                        >
                            Reset Filter
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white/85 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl shadow-green-900/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mx-auto mb-4" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-[#fcfdfc] border-b border-gray-100">
                                    {["ID", "Customer", "Investasi", "Status", "SISA TAGIHAN", "Dibayar", "Dibuat", "Aksi"].map((h) => (
                                        <th key={h} className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-24 text-center text-gray-400 text-sm font-medium italic">
                                            Belum ada pesanan investasi.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id_pesanan} className="hover:bg-green-50/30 transition-colors group cursor-pointer" onClick={() => handleOpenDetail(order)}>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-[#1a8245] group-hover:text-white transition-all text-xs">
                                                    #{order.id_pesanan}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 group-hover:text-[#1a8245] transition-colors text-sm">{order.data_customer.nama}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">{order.data_customer.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className="text-xs font-bold text-gray-700">{order.total_item} Paket</span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <Badge status={order.status_pesanan} />
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <p className="text-xs font-black text-gray-900 whitespace-nowrap">{formatRupiah(order.tagihan)}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <p className="text-xs font-black text-[#1a8245] whitespace-nowrap">{formatRupiah(order.sudah_dibayar)}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6 font-semibold text-gray-500 text-xs whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(order); }}
                                                    className="bg-gray-100/50 hover:bg-[#1a8245] text-gray-500 hover:text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-gray-100 whitespace-nowrap"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                            Total {totalCount} pesanan
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentPage(i + 1);
                                    }}
                                    className={`min-w-[40px] h-10 rounded-xl font-black text-xs transition-all ${
                                        currentPage === i + 1
                                            ? "bg-[#1a8245] text-white shadow-lg shadow-green-200"
                                            : "text-gray-400 hover:bg-white hover:text-gray-900"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <OrderModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchOrders}
            />

            {showDetail && selected && (
                <OrderDetailsModal
                    isOpen={showDetail}
                    onClose={handleCloseDetail}
                    order={selected}
                    onSuccess={fetchOrders}
                />
            )}
        </div>
    );
}
