"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/button/Button";
import { useInvestOrder, PesananInvest } from "@/features/invest-order/useInvestOrder";
import { catalogService } from "@/services/catalog.service";
import { userService } from "@/services/user.service";
import OrderDetailsModal from "@/features/order-invest-ternak/components/OrderDetailsModal";

// ── helpers ──────────────────────────────────────────────────────────────────
const formatRupiah = (val: string | number) =>
    `Rp ${Number(val).toLocaleString("id-ID")}`;

const statusColor: Record<string, string> = {
    Diproses: "bg-yellow-100 text-yellow-800",
    Selesai: "bg-blue-100 text-blue-800",
    Dibatalkan: "bg-red-100 text-red-800",
};

function Badge({ status }: { status: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[status] ?? "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}

// ── Create Order Modal ────────────────────────────────────────────────────────
function CreateOrderModal({
    isOpen,
    onClose,
    onSuccess,
    createOrder,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    createOrder: (payload: { id_customer: number; items: string[]; catatan?: string }) => Promise<any>;
}) {
    const [customers, setCustomers] = useState<any[]>([]);
    const [investList, setInvestList] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [catatan, setCatatan] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const load = async () => {
            try {
                const [custData, invData]: [any, any] = await Promise.all([
                    userService.getUsers("external"),
                    catalogService.getInvestInternal({ status_investernak: "Open", page: "1" }),
                ]);
                setCustomers(Array.isArray(custData) ? custData : custData.results ?? []);
                const items = invData.results ?? (Array.isArray(invData) ? invData : []);
                setInvestList(items);
            } catch {
                toast.error("Gagal memuat data");
            }
        };
        load();
        setSelectedCustomer("");
        setSelectedItems([]);
        setCatatan("");
    }, [isOpen]);

    const toggleItem = (id_invest: string) => {
        setSelectedItems((prev) =>
            prev.includes(id_invest) ? prev.filter((x) => x !== id_invest) : [...prev, id_invest]
        );
    };

    const totalTagihan = investList
        .filter((i) => selectedItems.includes(i.id_invest))
        .reduce((sum, i) => sum + Number(i.harga_sapi), 0);

    const handleSubmit = async () => {
        if (!selectedCustomer) return toast.error("Pilih customer terlebih dahulu");
        if (selectedItems.length === 0) return toast.error("Pilih minimal 1 investasi");
        try {
            setSaving(true);
            await createOrder({ id_customer: Number(selectedCustomer), items: selectedItems, catatan });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Gagal membuat pesanan");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Buat Pesanan Invest" size="xl"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={saving}>Batal</Button>
                    <Button variant="primary" onClick={handleSubmit} isLoading={saving}>Simpan Pesanan</Button>
                </>
            }
        >
            <div className="space-y-5">
                {/* Customer */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer</label>
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none"
                    >
                        <option value="">-- Pilih Customer --</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.nama} ({c.email})</option>
                        ))}
                    </select>
                </div>

                {/* Invest Items */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Pilih Investasi <span className="text-gray-400 font-normal">(status Open)</span>
                    </label>
                    {investList.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Tidak ada investasi yang tersedia saat ini.</p>
                    ) : (
                        <div className="border border-gray-200 rounded-xl divide-y max-h-64 overflow-y-auto">
                            {investList.map((item) => (
                                <label key={item.id_invest} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id_invest)}
                                        onChange={() => toggleItem(item.id_invest)}
                                        className="w-4 h-4 accent-[#1a8245]"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{item.nama_paket}</p>
                                        <p className="text-xs text-gray-500">{item.id_invest} · {item.jenis}</p>
                                    </div>
                                    <span className="text-sm font-bold text-[#1a8245] whitespace-nowrap">
                                        {formatRupiah(item.harga_sapi)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Total */}
                {selectedItems.length > 0 && (
                    <div className="bg-[#f0faf4] border border-[#1a8245]/20 rounded-xl px-4 py-3 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                            Total Tagihan ({selectedItems.length} item)
                        </span>
                        <span className="text-lg font-black text-[#1a8245]">{formatRupiah(totalTagihan)}</span>
                    </div>
                )}

                {/* Catatan */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan (opsional)</label>
                    <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        rows={2}
                        placeholder="Tambahkan catatan..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none resize-none"
                    />
                </div>
            </div>
        </Modal>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
        createOrder,
    } = useInvestOrder();

    const [userRole, setUserRole] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selected, setSelected] = useState<PesananInvest | null>(null);

    useEffect(() => {
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    const canManage = userRole === "SuperAdmin" || userRole === "Marketing";

    const countByStatus = (s: string) => orders.filter((o) => o.status_pesanan === s).length;
    const totalTagihan = orders.reduce((sum, o) => sum + Number(o.tagihan), 0);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] block mb-1">
                        Manajemen Pesanan
                    </span>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                        Invest <span className="text-[#1a8245]">Ternak</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola pesanan investasi ternak dari customer.</p>
                </div>
                {canManage && (
                    <Button variant="primary" onClick={() => setShowCreate(true)}
                        className="rounded-2xl font-black uppercase text-xs tracking-widest px-8 h-12">
                        + Tambah Pesanan
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Tagihan", value: formatRupiah(totalTagihan), color: "text-gray-900" },
                    { label: "Diproses", value: countByStatus("Diproses"), color: "text-yellow-600" },
                    { label: "Selesai", value: countByStatus("Selesai"), color: "text-blue-600" },
                    { label: "Dibatalkan", value: countByStatus("Dibatalkan"), color: "text-red-500" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={filters.statusFilter}
                        onChange={(e) => { filters.setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1a8245] outline-none"
                    >
                        <option value="all">Semua Status</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => { filters.setStartDate(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1a8245] outline-none"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => { filters.setEndDate(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1a8245] outline-none"
                    />
                    {(filters.statusFilter !== "all" || filters.startDate || filters.endDate) && (
                        <button
                            onClick={() => { filters.setStatusFilter("all"); filters.setStartDate(""); filters.setEndDate(""); setCurrentPage(1); }}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {["ID Pesanan", "Customer", "Jumlah Investasi", "Total Tagihan", "Sudah Dibayar", "Status", "Tanggal", "Aksi"].map((h) => (
                                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                                            Belum ada pesanan investasi.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id_pesanan} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-mono font-semibold text-gray-800">
                                                #{order.id_pesanan}
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-gray-800">{order.data_customer.nama}</p>
                                                <p className="text-xs text-gray-400">{order.data_customer.email}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 font-semibold">
                                                {order.total_item} item
                                            </td>
                                            <td className="px-5 py-4 text-sm font-bold text-gray-900">
                                                {formatRupiah(order.tagihan)}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1a8245]">
                                                {formatRupiah(order.sudah_dibayar)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge status={order.status_pesanan} />
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => { setSelected(order); setShowDetail(true); }}
                                                    className="px-4 py-2 bg-[#1a8245]/10 text-[#1a8245] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a8245] hover:text-white transition-all shadow-sm"
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total {totalCount} pesanan</p>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all ${
                                        currentPage === i + 1
                                            ? "bg-[#1a8245] text-white shadow"
                                            : "text-gray-400 hover:bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateOrderModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchOrders}
                createOrder={createOrder}
            />
            
            <OrderDetailsModal
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                order={selected}
                onSuccess={fetchOrders}
            />
        </div>
    );
}
