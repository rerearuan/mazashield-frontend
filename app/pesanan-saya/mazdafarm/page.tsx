"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";
import SafeImage from "@/components/common/SafeImage";
import {
    useCustomerMazdafarmOrder,
    CustomerPesananMazdafarm,
    TernakItem,
} from "@/features/order-mazdafarm/useCustomerMazdafarmOrder";

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
    order: CustomerPesananMazdafarm;
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
                            Detail Pesanan #{order.id_pesanan}
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
                        <StatusBadge status={order.status_pesanan} />
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
                            aria-label="Tutup"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Daftar Ternak */}
                <div className="p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1a8245] mb-4">
                        Daftar Ternak ({order.total_item} ekor)
                    </h3>
                    <div className="space-y-4">
                        {order.daftar_ternak.map((item: TernakItem, idx: number) => (
                            <div
                                key={idx}
                                className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                            >
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                                    {item.foto ? (
                                        <SafeImage
                                            src={item.foto}
                                            alt={item.nama}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                            🐄
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{item.nama}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                        <span>Berat: {Number(item.berat).toLocaleString()} kg</span>
                                        <span>Umur: {item.umur} bulan</span>
                                    </div>
                                    <p className="text-[#1a8245] font-black text-sm mt-1">
                                        {fmt(item.harga)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ringkasan Pembayaran */}
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#1a8245] mb-3">
                            Ringkasan Pembayaran
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sisa Tagihan</span>
                                <span className="font-bold text-red-600">{fmt(order.tagihan)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Menunggu Persetujuan</span>
                                <span className="font-bold text-amber-600">
                                    {fmt(order.menunggu_persetujuan)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                                <span className="text-gray-700 font-semibold">Sudah Dibayar</span>
                                <span className="font-black text-[#1a8245]">
                                    {fmt(order.sudah_dibayar)}
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
    order: CustomerPesananMazdafarm;
    onDetail: (order: CustomerPesananMazdafarm) => void;
}) {
    const fmt = (val: string | number) =>
        `Rp ${Number(val).toLocaleString("id-ID")}`;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <p className="text-xs text-gray-400 font-medium">
                        Pesanan #{order.id_pesanan}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <StatusBadge status={order.status_pesanan} />
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Jumlah Ternak
                    </p>
                    <p className="text-lg font-black text-gray-900">{order.total_item} ekor</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Sisa Tagihan
                    </p>
                    <p className="text-sm font-black text-red-600">{fmt(order.tagihan)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1a8245] mb-1">
                        Sudah Dibayar
                    </p>
                    <p className="text-sm font-black text-[#1a8245]">{fmt(order.sudah_dibayar)}</p>
                </div>
            </div>

            {/* Action */}
            <button
                onClick={() => onDetail(order)}
                className="w-full py-2.5 bg-[#1a8245] text-white rounded-xl text-sm font-bold hover:bg-[#166b38] transition-colors"
            >
                Lihat Detail
            </button>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PesananSayaMazdafarmPage() {
    const router = useRouter();
    const { orders, loading, currentPage, setCurrentPage, totalPages, totalCount } =
        useCustomerMazdafarmOrder();
    const [selectedOrder, setSelectedOrder] = useState<CustomerPesananMazdafarm | null>(null);

    return (
        <div className="bg-white min-h-screen">
            <Navbar activePage="mazdafarm" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-400 hover:text-gray-600 font-medium mb-4 flex items-center gap-1"
                    >
                        ← Kembali
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Pesanan Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Mazdafarm — {totalCount} pesanan ditemukan
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245]" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-4xl mb-3">🐄</p>
                        <p className="text-gray-500 font-medium">Belum ada pesanan Mazdafarm.</p>
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
