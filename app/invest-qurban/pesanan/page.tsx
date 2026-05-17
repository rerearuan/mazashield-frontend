"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";
import SafeImage from "@/components/common/SafeImage";
import { apiFetch } from "@/lib/api-client";
import LaporanModal from "@/features/invest-order/components/LaporanModal";

// ── Interfaces ──────────────────────────────────────────────────────────────
export interface InvestItem {
    id_invest: string;
    nama: string;
    berat: string | null;
    umur: number;
    harga_sapi: string;
    status_investernak: string;
    foto: string | null;
}

export interface PesananInvest {
    id_pesanan: number;
    status_pesanan: "Processed" | "Confirmed" | "Completed" | "Cancelled";
    created_at: string;
    daftar_invest: InvestItem[];
    total_item: number;
    tagihan: string;
    sudah_dibayar: string;
    menunggu_persetujuan: string;
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
        Processed: {
            label: "Processed",
            className: "bg-amber-100 text-amber-700 border border-amber-200",
        },
        Confirmed: {
            label: "Confirmed",
            className: "bg-purple-100 text-purple-700 border border-purple-200",
        },
        Completed: {
            label: "Completed",
            className: "bg-blue-100 text-blue-700 border border-blue-200",
        },
        Cancelled: {
            label: "Cancelled",
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
    order: PesananInvest;
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

                {/* Daftar Invest */}
                <div className="p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-700 mb-4">
                        Daftar Paket ({order.total_item} paket)
                    </h3>
                    <div className="space-y-4">
                        {order.daftar_invest.map((item: InvestItem, idx: number) => (
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
                                            📈
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{item.nama}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                        <span>Berat: {item.berat ? `${Number(item.berat).toLocaleString()} kg` : "-"}</span>
                                        <span>Umur: {item.umur} hari</span>
                                        <span className="font-semibold text-blue-600">Status: {item.status_investernak}</span>
                                    </div>
                                    <p className="text-blue-700 font-black text-sm mt-1">
                                        {fmt(item.harga_sapi)}
                                    </p>
                                </div>
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
                                <span className="font-bold text-gray-900">{fmt(order.tagihan)}</span>
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
                                <span className="font-black text-red-600">
                                    {fmt(Number(order.tagihan) - Number(order.sudah_dibayar))}
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
    onLaporanClick,
}: {
    order: PesananInvest;
    onDetail: (order: PesananInvest) => void;
    onLaporanClick: (orderId: number) => void;
}) {
    const router = useRouter();
    const fmt = (val: string | number) =>
        `Rp ${Number(val).toLocaleString("id-ID")}`;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
            <div>
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
                            Jumlah Paket
                        </p>
                        <p className="text-lg font-black text-gray-900">{order.total_item} paket</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                            Sudah Dibayar
                        </p>
                        <p className="text-sm font-black text-gray-900">{fmt(order.sudah_dibayar)}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">
                            Sisa Tagihan
                        </p>
                        <p className="text-sm font-black text-red-700">{fmt(Number(order.tagihan) - Number(order.sudah_dibayar))}</p>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="space-y-2 mt-4">
                <button
                    onClick={() => onDetail(order)}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                    Lihat Detail
                </button>
                
                {order.status_pesanan !== "Cancelled" && (
                    <button
                        onClick={() => onLaporanClick(order.id_pesanan)}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                        Lihat Laporan Perkembangan →
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PesananInvestPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<PesananInvest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<PesananInvest | null>(null);
    const [laporanOrderId, setLaporanOrderId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("");
    
    // API pagination fallback (since invest orders don't have pagination yet)
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;

            const data: any = await apiFetch("/order/invest/", { method: "GET", params });
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.results) {
                setOrders(data.results);
            } else {
                setOrders([]);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const totalCount = orders.length;

    return (
        <div className="bg-white min-h-screen">
            <Navbar activePage="invest-qurban" />

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
                        Invest Qurban — {totalCount} pesanan ditemukan
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {["Semua", "Processed", "Confirmed", "Completed", "Cancelled"].map(status => {
                        const isActive = (!filterStatus && status === "Semua") || filterStatus === status;
                        return (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status === "Semua" ? "" : status);
                                    setCurrentPage(1);
                                }}
                                className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-blue-600 hover:text-blue-600"
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-4xl mb-3">📈</p>
                        <p className="text-gray-500 font-medium">Belum ada pesanan Invest Qurban.</p>
                        {!filterStatus && (
                            <button
                                onClick={() => router.push("/invest-qurban")}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest"
                            >
                                Lihat Katalog Invest Ternak
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id_pesanan}
                                    order={order}
                                    onDetail={setSelectedOrder}
                                    onLaporanClick={setLaporanOrderId}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {selectedOrder && (
                <DetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <LaporanModal
                orderId={laporanOrderId}
                isOpen={!!laporanOrderId}
                onClose={() => setLaporanOrderId(null)}
            />

            <Footer />
        </div>
    );
}
