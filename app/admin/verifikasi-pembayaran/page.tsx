"use client";

import { useState } from "react";

interface Payment {
  id: string;
  orderId: string;
  orderType: "Invest Ternak" | "Qurban" | "Daging Potong";
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  proofImage: string;
  status: "Pending" | "Diverifikasi" | "Ditolak";
}

export default function VerifikasiPembayaranPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Pending" | "Diverifikasi" | "Ditolak">("all");
  const [filterOrderType, setFilterOrderType] = useState<"all" | "Invest Ternak" | "Qurban" | "Daging Potong">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const itemsPerPage = 10;

  // Mock data
  const [payments] = useState<Payment[]>([
    {
      id: "PAY-001",
      orderId: "INV-001",
      orderType: "Invest Ternak",
      customerName: "John Doe",
      amount: 10000000,
      paymentMethod: "Bank Transfer",
      paymentDate: "2024-03-15",
      proofImage: "/images/payment-proof.jpg",
      status: "Pending",
    },
    {
      id: "PAY-002",
      orderId: "QUR-001",
      orderType: "Qurban",
      customerName: "Ahmad Hidayat",
      amount: 25000000,
      paymentMethod: "Bank Transfer",
      paymentDate: "2024-03-14",
      proofImage: "/images/payment-proof.jpg",
      status: "Pending",
    },
  ]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesOrderType = filterOrderType === "all" || payment.orderType === filterOrderType;
    return matchesSearch && matchesStatus && matchesOrderType;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diverifikasi":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleVerify = (paymentId: string, approved: boolean) => {
    // TODO: Implement verification logic
    console.log(`Verifying payment ${paymentId}: ${approved ? "Approved" : "Rejected"}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verifikasi Pembayaran</h1>
        <p className="text-gray-600">Verifikasi bukti pembayaran dari customer</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
          <p className="text-2xl font-bold text-gray-900">Rp 125.000.000</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">18</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Diverifikasi</p>
          <p className="text-2xl font-bold text-green-600">42</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Ditolak</p>
          <p className="text-2xl font-bold text-red-600">5</p>
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
            onChange={(e) => setFilterOrderType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="Invest Ternak">Invest Ternak</option>
            <option value="Qurban">Qurban</option>
            <option value="Daging Potong">Daging Potong</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diverifikasi">Diverifikasi</option>
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
                  ID Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipe Pesanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tanggal
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
              {currentPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.orderType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.paymentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-[#1a8245] hover:text-[#22ad5c] font-medium"
                        >
                          Lihat Bukti
                        </button>
                        {payment.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleVerify(payment.id, true)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              Terima
                            </button>
                            <button
                              onClick={() => handleVerify(payment.id, false)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Tolak
                            </button>
                          </>
                        )}
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

      {/* Proof Image Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Bukti Pembayaran</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>ID Pembayaran:</strong> {selectedPayment.id}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Customer:</strong> {selectedPayment.customerName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Jumlah:</strong> Rp {selectedPayment.amount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
              <p className="text-sm text-gray-500 text-center">Preview Bukti Transfer</p>
              <p className="text-xs text-gray-400 text-center mt-2">(Gambar akan ditampilkan di sini)</p>
            </div>
            {selectedPayment.status === "Pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleVerify(selectedPayment.id, true);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  Terima Pembayaran
                </button>
                <button
                  onClick={() => {
                    handleVerify(selectedPayment.id, false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Tolak Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
