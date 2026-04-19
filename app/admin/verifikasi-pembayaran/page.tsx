"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";
import { Button } from "@/components/button";
import { Icons } from "@/components/common/Icons";

interface Payment {
    id: string;
    order_id: string;
    order_type: string;
    customer_name: string;
    nominal_pembayaran: string | number;
    bank_pengirim: string;
    nomor_rekening_pengirim: string;
    nama_pengirim: string;
    tanggal_transfer: string;
    waktu_transfer: string;
    catatan: string;
    status: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
    created_by_name?: string;
}

const formatRupiah = (val: string | number) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const STATUS_COLORS: Record<string, string> = {
    "Menunggu Verifikasi": "bg-amber-100 text-amber-800",
    "Diterima": "bg-[#1a8245]/10 text-[#1a8245]",
    "Ditolak": "bg-red-100 text-red-800",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
    "pesananternak": "Pesanan Ternak",
    "pesananinvest": "Pesanan Invest",
    "pesanandaging": "Pesanan Daging",
    "pesanan": "Pesanan Ternak",
};






export default function VerifikasiPembayaranPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "Menunggu Verifikasi" | "Diterima" | "Ditolak">("all");
    const [filterOrderType, setFilterOrderType] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [catatanVerifikasi, setCatatanVerifikasi] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        fetchPayments();
    }, [filterStatus]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filterStatus !== "all") {
                params.status = filterStatus;
            }

            const response = await orderService.getPaymentHistory(params);
            const data = response.results ? response.results : response;
            setPayments(Array.isArray(data) ? data : []);
        } catch (error: any) {
            toast.error(error.message || "Gagal mengambil daftar pembayaran");
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = useCallback(() => {
        setFilterStatus("all");
        setFilterOrderType("all");
        setSearchTerm("");
        setCurrentPage(1);
    }, []);

    const filteredPayments = payments.filter((payment) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            payment.id.toString().includes(term) ||
            payment.order_id.toString().includes(term) ||
            (payment.customer_name || "").toLowerCase().includes(term);
        const matchesOrderType = filterOrderType === "all" || 
            (filterOrderType === "pesananternak" 
                ? (payment.order_type === "pesananternak" || payment.order_type === "pesanan") 
                : payment.order_type === filterOrderType);
        return matchesSearch && matchesOrderType;

    });

    const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const handleVerify = async (paymentId: string, approved: boolean) => {
        setVerifying(true);
        try {
            await orderService.verifyPayment(paymentId, {
                keputusan: approved ? "Diterima" : "Ditolak",
                catatan_verifikasi: catatanVerifikasi
            });
            toast.success(`Pembayaran berhasil ${approved ? "Diterima" : "Ditolak"}!`);
            setSelectedPayment(null);
            setCatatanVerifikasi("");
            fetchPayments();
        } catch (error: any) {
            toast.error(error.message || "Gagal memverifikasi pembayaran");
        } finally {
            setVerifying(false);
        }
    };

    // Stats
    const totalPembayaran = payments
        .filter(p => p.status === 'Diterima')
        .reduce((acc, p) => acc + parseFloat(p.nominal_pembayaran as string), 0);
    const totalPending = payments.filter((p) => p.status === "Menunggu Verifikasi").length;

    return (
        <div className="p-4 md:p-10 relative font-primary bg-[#f8fafc] min-h-screen">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <div>
                    <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
                        Keuangan & Verifikasi
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                        Verifikasi <span className="text-[#1a8245]">Pembayaran</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Proses bukti transfer dan verifikasi dana masuk dari customer.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 mb-8">
                <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0">
                    {[
                        { label: "Total Dana Masuk", value: formatRupiah(totalPembayaran), color: "text-[#1a8245]" },
                        { label: "Menunggu Verifikasi", value: totalPending, color: "text-amber-500" },
                        { label: "Diterima", value: payments.filter(p => p.status === 'Diterima').length, color: "text-[#1a8245]" },
                        { label: "Ditolak", value: payments.filter(p => p.status === 'Ditolak').length, color: "text-red-500" },
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
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Status Verifikasi</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                        >
                            <option value="all">Semua Status</option>
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Diterima">Diterima</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Tipe Pesanan</label>
                        <select
                            value={filterOrderType}
                            onChange={(e) => { setFilterOrderType(e.target.value); setCurrentPage(1); }}
                            className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                        >
                            <option value="all">Semua Tipe</option>
                            <option value="pesananternak">Pesanan Ternak</option>
                            <option value="pesananinvest">Pesanan Invest</option>
                            <option value="pesanandaging">Pesanan Daging</option>


                        </select>

                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Cari Pembayaran</label>
                        <div className="relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari ID, Nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
                            />
                        </div>
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
                        <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="bg-[#fcfdfc] border-b border-gray-100">
                                    {["ID", "Tipe / Order", "Customer", "Jumlah / Bank", "Status", "Aksi"].map((h) => (
                                        <th key={h} className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {currentPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-24 text-center text-gray-400 text-sm font-medium italic">
                                            Belum ada data pembayaran.
                                        </td>
                                    </tr>
                                ) : (
                                    currentPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-green-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedPayment(payment)}>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-[#1a8245] group-hover:text-white transition-all text-xs">
                                                    #{payment.id}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 group-hover:text-[#1a8245] transition-colors text-sm">{ORDER_TYPE_LABELS[payment.order_type] || payment.order_type}</span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">#{payment.order_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className="font-black text-gray-900 text-sm">{payment.customer_name || "-"}</span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[#1a8245] whitespace-nowrap">{formatRupiah(payment.nominal_pembayaran)}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium uppercase">{payment.bank_pengirim}</span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{payment.tanggal_transfer}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${STATUS_COLORS[payment.status]}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedPayment(payment); }}
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
                    <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-white">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total {filteredPayments.length} Pembayaran</p>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                                    className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all ${
                                        currentPage === i + 1 ? "bg-[#1a8245] text-white shadow" : "text-gray-400 hover:bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Proof Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Detail Pembayaran #{selectedPayment.id}</h2>
                            <button
                                onClick={() => { setSelectedPayment(null); setCatatanVerifikasi(""); }}
                                className="text-gray-400 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200 rounded-full p-2 transition-all w-10 h-10 flex items-center justify-center"
                                disabled={verifying}
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-5 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                    <p className="font-bold text-gray-900">{selectedPayment.customer_name || "-"}</p>
                                </div>
                                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipe / Order</p>
                                    <p className="font-bold text-gray-900">{ORDER_TYPE_LABELS[selectedPayment.order_type] || selectedPayment.order_type} #{selectedPayment.order_id}</p>
                                </div>
                            </div>
                            
                            <div className="bg-[#1a8245]/5 p-5 rounded-2xl border border-[#1a8245]/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-[#1a8245] uppercase tracking-widest mb-1">Nominal Pembayaran</p>
                                    <p className="text-3xl font-black text-[#1a8245]">{formatRupiah(selectedPayment.nominal_pembayaran)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank Pengirim</p>
                                    <p className="font-bold text-gray-900">{selectedPayment.bank_pengirim}</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">No. Rekening</p>
                                    <p className="font-bold text-gray-900">{selectedPayment.nomor_rekening_pengirim}</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Pengirim</p>
                                    <p className="font-bold text-gray-900">{selectedPayment.nama_pengirim || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal & Waktu Transfer</p>
                                    <p className="font-bold text-gray-900 text-xs">{selectedPayment.tanggal_transfer} {selectedPayment.waktu_transfer}</p>
                                </div>
                                <div className="p-4 border border-green-100 rounded-2xl bg-green-50/20">
                                    <p className="text-[10px] font-black text-[#1a8245] uppercase tracking-widest mb-1">Input Oleh</p>
                                    <p className="font-bold text-[#1a8245]">{selectedPayment.created_by_name || "Sistem"}</p>
                                </div>
                            </div>

                            {selectedPayment.catatan && (
                                <div className="p-4 border border-amber-100 rounded-2xl bg-amber-50/30">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Catatan Customer</p>
                                    <p className="text-sm text-gray-700 italic font-medium">"{selectedPayment.catatan}"</p>
                                </div>
                            )}

                            {selectedPayment.status === "Menunggu Verifikasi" && (
                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-[#1a8245] uppercase tracking-widest mb-2 block">Catatan Verifikasi (Feedback)</label>
                                    <textarea
                                        value={catatanVerifikasi}
                                        onChange={(e) => setCatatanVerifikasi(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-sm transition-all h-20 resize-none focus:ring-2 focus:ring-[#1a8245]/20 focus:border-[#1a8245]"
                                        placeholder="Berikan alasan jika ditolak atau catatan tambahan..."
                                    />
                                </div>
                            )}
                        </div>

                        {selectedPayment.status === "Menunggu Verifikasi" ? (
                            <div className="flex gap-4">
                                <button
                                    disabled={verifying}
                                    onClick={() => handleVerify(selectedPayment.id, true)}
                                    className="flex-1 h-14 bg-[#1a8245] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#146636] transition-all shadow-xl shadow-green-100 disabled:opacity-50"
                                >
                                    {verifying ? "Memproses..." : "Terima Pembayaran"}
                                </button>
                                <button
                                    disabled={verifying}
                                    onClick={() => handleVerify(selectedPayment.id, false)}
                                    className="flex-1 h-14 bg-white text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all border border-red-100 disabled:opacity-50"
                                >
                                    Tolak
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 flex justify-center">
                                <span className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${STATUS_COLORS[selectedPayment.status]}`}>
                                    {selectedPayment.status}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
