"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";

interface Payment {
  id: string;
  order_id: string;
  order_type: string;
  customer_name: string;
  nominal_pembayaran: string | number;
  bank_pengirim: string;
  nomor_rekening_pengirim: string;
  tanggal_transfer: string;
  waktu_transfer: string;
  catatan: string;
  status: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
}

export default function VerifikasiPembayaranPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Menunggu Verifikasi" | "Diterima" | "Ditolak">("all");
  const [filterOrderType, setFilterOrderType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
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
      // Handle Django Rest Framework pagination format if any
      const data = response.results ? response.results : response;
      setPayments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil daftar pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      payment.id.toString().includes(term) ||
      payment.order_id.toString().includes(term) ||
      (payment.customer_name || "").toLowerCase().includes(term);
    const matchesOrderType = filterOrderType === "all" || payment.order_type === filterOrderType;
    return matchesSearch && matchesOrderType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diterima":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleVerify = async (paymentId: string, approved: boolean) => {
    setVerifying(true);
    try {
      await orderService.verifyPayment(paymentId, {
        keputusan: approved ? "Diterima" : "Ditolak",
        catatan_verifikasi: "" // Optional
      });
      toast.success(`Pembayaran berhasil ${approved ? "Diterima" : "Ditolak"}!`);
      setSelectedPayment(null);
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
  const totalDiverifikasi = payments.filter((p) => p.status === "Diterima").length;
  const totalDitolak = payments.filter((p) => p.status === "Ditolak").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verifikasi Pembayaran</h1>
        <p className="text-gray-600">Verifikasi bukti pembayaran dari customer</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Pembayaran Diterima</p>
          <p className="text-2xl font-bold text-gray-900">Rp {totalPembayaran.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Menunggu Verifikasi</p>
          <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Diterima</p>
          <p className="text-2xl font-bold text-green-600">{totalDiverifikasi}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Ditolak</p>
          <p className="text-2xl font-bold text-red-600">{totalDitolak}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari ID pembayaran, ID pesanan, atau nama customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterOrderType}
            onChange={(e) => setFilterOrderType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Tipe Form</option>
            <option value="pesanan">Pesanan (Mazdafarm)</option>
            <option value="pesanandaging">Pesanan Daging (Mazdaging)</option>
            <option value="pesananinvest">Pesanan Invest</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID Pemb.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipe / Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Jumlah / Bank / Tgl
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 capitalize">{payment.order_type}</div>
                      <div className="text-xs text-gray-500">Order ID: {payment.order_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.customer_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-700">Rp {parseFloat(payment.nominal_pembayaran as string).toLocaleString("id-ID")}</div>
                      <div className="text-xs text-gray-500">{payment.bank_pengirim} - {payment.nomor_rekening_pengirim}</div>
                      <div className="text-xs text-gray-400">{payment.tanggal_transfer} {payment.waktu_transfer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-semibold text-xs"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPayments.length)} dari {filteredPayments.length} pembayaran
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Detail Pembayaran #{selectedPayment.id}</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                disabled={verifying}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.customer_name || "-"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.order_type} #{selectedPayment.order_id}</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Nominal Pembayaran</p>
                  <p className="text-2xl font-black text-green-700">Rp {parseFloat(selectedPayment.nominal_pembayaran as string).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bank Pengirim</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.bank_pengirim}</p>
                </div>
                <div className="p-3 border border-gray-100 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">No. Rekening</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.nomor_rekening_pengirim}</p>
                </div>
              </div>

              <div className="p-3 border border-gray-100 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Waktu Transfer</p>
                  <p className="font-semibold text-gray-900">{selectedPayment.tanggal_transfer} {selectedPayment.waktu_transfer}</p>
              </div>

              {selectedPayment.catatan && (
                <div className="p-3 border border-gray-100 rounded-xl bg-yellow-50/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Catatan</p>
                  <p className="text-sm text-gray-700 italic">{selectedPayment.catatan}</p>
                </div>
              )}
            </div>

            {selectedPayment.status === "Menunggu Verifikasi" ? (
              <div className="flex gap-3 mt-8">
                <button
                  disabled={verifying}
                  onClick={() => handleVerify(selectedPayment.id, true)}
                  className="flex-1 px-4 py-3 bg-[#1a8245] text-white rounded-xl font-bold hover:bg-[#146636] transition-all disabled:opacity-50"
                >
                  {verifying ? "Memproses..." : "Terima Pembayaran"}
                </button>
                <button
                  disabled={verifying}
                  onClick={() => handleVerify(selectedPayment.id, false)}
                  className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50"
                >
                  Tolak Pembayaran
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${getStatusColor(selectedPayment.status)}`}>
                  Status: {selectedPayment.status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
