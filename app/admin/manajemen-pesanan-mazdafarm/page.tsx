"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Icons } from "@/components/common/Icons";
import { orderService } from "@/services/order.service";
import OrderModal from "@/features/order-mazdafarm/components/OrderModal";
import OrderDetailsModal from "@/features/order-mazdafarm/components/OrderDetailsModal";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";


export default function ManajemenPesananMazdafarmPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();


  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
      };
      if (statusFilter !== "all") params.status_pesanan = statusFilter;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await orderService.getMazdafarmOrders(params);
      // DRF with pagination returns { results: [], count: n }
      const response = res as any;
      if (response.results) {
        setOrders(response.results);
        setTotalPages(Math.ceil(response.count / 10)); 
      } else {
        setOrders(Array.isArray(res) ? res : []);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, startDate, endDate]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    if (role === "Finance") {
      router.push("/admin");
    }
    fetchOrders();
  }, [fetchOrders, router]);


  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="p-4 md:p-10 relative font-primary bg-[#f8fafc]">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Manajemen Penjualan
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 text-[#1a8245]">
            Pesanan Ternak
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Monitor dan proses transaksi Pesanan Ternak.
          </p>



        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="lg"
            className="rounded-2xl shadow-xl shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 font-black uppercase text-[10px] tracking-widest px-8 h-14"
          >
            + Buat Pesanan Baru
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 mb-8">
        <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0">
          {[
            { 
              label: "Total Sisa Tagihan", 
              value: `Rp ${orders.filter(o => o.status_pesanan !== 'Cancelled').reduce((sum, o) => sum + Number(o.tagihan), 0).toLocaleString('id-ID')}`, 
              color: "text-gray-900" 
            },
            { 
              label: "Processed", 
              value: orders.filter(o => o.status_pesanan === 'Processed').length, 
              color: "text-amber-500" 
            },
            { 
              label: "Completed", 
              value: orders.filter(o => o.status_pesanan === 'Completed').length, 
              color: "text-[#1a8245]" 
            },
            { 
              label: "Cancelled", 
              value: orders.filter(o => o.status_pesanan === 'Cancelled').length, 
              color: "text-red-500" 
            },
          ].map((stat, idx) => (
            <div key={idx} className="min-w-[160px] md:min-w-0 bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 md:p-6 flex-shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-base md:text-xl font-black ${stat.color}`}>{stat.value}</p>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm transition-all text-gray-900 shadow-sm"
            >
              <option value="all">Semua Status</option>
              <option value="Processed">Processed</option>
                            <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1a8245] mb-2 block">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl outline-none font-semibold text-sm text-gray-900 shadow-sm"
            />

          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setStatusFilter("all");
              }}
              className="rounded-xl h-[42px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-black text-[10px] uppercase tracking-[0.16em] shadow-sm"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-xl shadow-gray-200/50 border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Ternak</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">SISA TAGIHAN</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Dibayar</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Dibuat</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Memuat pesanan...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-bold text-lg">Tidak ada pesanan ditemukan.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr 
                    key={order.id_pesanan} 
                    onClick={() => handleOpenDetail(order)}
                    className="hover:bg-green-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-[#1a8245] group-hover:text-white transition-all text-xs">
                        #{order.id_pesanan}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 group-hover:text-[#1a8245] transition-colors text-sm">{order.data_customer?.nama}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{order.data_customer?.email || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <span className="text-xs font-bold text-gray-700">{order.total_item} Ternak</span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status_pesanan === 'Completed' ? 'bg-green-100 text-green-600' :
                        order.status_pesanan === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status_pesanan}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <p className="text-xs font-black text-gray-900 whitespace-nowrap">Rp {parseFloat(order.tagihan).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <p className="text-xs font-black text-green-600 whitespace-nowrap">Rp {parseFloat(order.sudah_dibayar).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <p className="text-xs text-gray-500 font-semibold whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`min-w-[40px] h-10 rounded-xl font-black text-xs transition-all ${
                    page === i + 1
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
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={fetchOrders} 
      />

      {selectedOrder && (
        <OrderDetailsModal 
          isOpen={showDetailModal} 
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }} 
          order={selectedOrder} 
          onSuccess={fetchOrders} 
        />
      )}
    </div>
  );
}
