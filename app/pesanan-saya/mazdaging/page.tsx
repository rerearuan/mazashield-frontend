"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";
import {
    useCustomerMazdagingOrder,
    CustomerPesananMazdaging,
    DagingItem,
} from "@/features/order-mazdaging/useCustomerMazdagingOrder";

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
        Diproses: {
            label: "Diproses",
            className: "bg-amber-100 text-amber-700 border border-amber-200",
        },
        Selesai: {
            label: "Selesai",
            className: "bg-green-100 text-green-700 border border-green-200",
        },
        Dibatalkan: {
            label: "Dibatalkan",
            className: "bg-red-100 text-red-700 border border-red-200",
        },
    };
    const style = map[status] ?? {
        label: status,
        className: "bg-gray-100 text-gray-600 border border-gray-200",
    };
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${style.className}`}
        >
            {style.label}
        </span>
    );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
    order,
    onClose,
}: {
    order: CustomerPesananMazdaging;
    onClose: () => void;
}) {
    const fmt = (val: string | number) =>
        `Rp ${Number(val).toLocaleString("id-ID")}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">
                            Detail Order #{order.id_pesanan}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.order_status} />
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
                            aria-label="Tutup"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Daftar Item */}
                <div className="p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-4">
                        Daftar Produk ({order.total_item} item)
                    </h3>
                    <div className="space-y-3">
                        {order.daftar_item.map((item: DagingItem, idx: number) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                            >
                                <div>
                                    <p className="font-bold text-gray-900">{item.nama}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Kode: {item.kode_produk}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {Number(item.berat_pesanan_kg).toLocaleString()} kg ×{" "}
                                        {fmt(item.harga_per_kg)}/kg
                                    </p>
                                </div>
                                <p className="font-black text-red-700 text-sm">
                                    {fmt(item.subtotal_item)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Ringkasan Pembayaran */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 mb-3">
                            Ringkasan Pembayaran
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Tagihan</span>
                                <span className="font-bold text-gray-900">{fmt(order.total_harga)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sudah Dibayar</span>
                                <span className="font-bold text-gray-900">{fmt(order.sudah_dibayar)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Menunggu Persetujuan</span>
                                <span className="font-bold text-amber-600">
                                    {fmt(order.menunggu_persetujuan)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-700 font-semibold">Sisa Tagihan</span>
                                <span className="font-black text-red-700">
                                    {fmt(Number(order.total_harga) - Number(order.sudah_dibayar))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({
    order,
    onDetail,
}: {
    order: CustomerPesananMazdaging;
    onDetail: (order: CustomerPesananMazdaging) => void;
}) {
    const fmt = (val: string | number) =>
        `Rp ${Number(val).toLocaleString("id-ID")}`;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <p className="text-xs text-gray-400 font-medium">Order #{order.id_pesanan}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <StatusBadge status={order.order_status} />
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Jumlah Item
                    </p>
                    <p className="text-lg font-black text-gray-900">{order.total_item} item</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Sudah Dibayar
                    </p>
                    <p className="text-sm font-black text-gray-900">{fmt(order.sudah_dibayar)}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-1">
                        Sisa Tagihan
                    </p>
                    <p className="text-sm font-black text-red-700">{fmt(Number(order.total_harga) - Number(order.sudah_dibayar))}</p>
                </div>
            </div>

            {/* Action */}
            <button
                onClick={() => onDetail(order)}
                className="w-full py-2.5 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800 transition-colors"
            >
                Lihat Detail
            </button>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PesananSayaMazdagingPage() {
    const router = useRouter();
    const { orders, loading, currentPage, setCurrentPage, totalPages, totalCount, statusFilter, setStatusFilter } =
        useCustomerMazdagingOrder();
    const [selectedOrder, setSelectedOrder] = useState<CustomerPesananMazdaging | null>(null);

    return (
        <div className="bg-white min-h-screen">
            <Navbar activePage="mazdaging" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-400 hover:text-gray-600 font-medium mb-4 flex items-center gap-1"
                    >
                        ← Kembali
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Order Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Mazdaging — {totalCount} order ditemukan
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {["Semua", "Diproses", "Selesai", "Dibatalkan"].map(status => {
                        const isActive = (!statusFilter && status === "Semua") || statusFilter === status;
                        return (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status === "Semua" ? "" : status);
                                    setCurrentPage(1);
                                }}
                                className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                                    isActive
                                        ? "bg-red-700 text-white shadow-lg shadow-red-100"
                                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-red-700 hover:text-red-700"
                                }`}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-4xl mb-3">🥩</p>
                        <p className="text-gray-500 font-medium">Belum ada order Mazdaging.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id_pesanan}
                                    order={order}
                                    onDetail={setSelectedOrder}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>

            {selectedOrder && (
                <DetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <Footer />
        </div>
    );
}
