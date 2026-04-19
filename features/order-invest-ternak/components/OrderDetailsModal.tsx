"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";
import PaymentUpdateModal from "@/features/payment/components/PaymentUpdateModal";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSuccess: () => void;
}

export default function OrderDetailsModal({ isOpen, onClose, order, onSuccess }: OrderDetailsModalProps) {
  if (!order) return null;

  const [statusPesanan, setStatusPesanan] = useState(order.status_pesanan);
  const [catatan, setCatatan] = useState(order.catatan || "");
  const [submitting, setSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
    setStatusPesanan(order.status_pesanan);
    setCatatan(order.catatan || "");
  }, [order]);

  const isCompletedOrCancelled = order.status_pesanan === 'Selesai' || order.status_pesanan === 'Dibatalkan';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompletedOrCancelled) {
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      await orderService.updateInvestOrder(order.id_pesanan, {
        status_pesanan: statusPesanan,
        catatan: catatan
      });
      toast.success("Pesanan Invest berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui Pesanan Invest.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} title={`Detail Pesanan Invest #${order.id_pesanan}`}>




      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer + Tanggal */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-1">Customer</label>
            <p className="font-bold text-gray-900">{order.data_customer?.nama}</p>
            <p className="text-xs text-gray-500">{order.data_customer?.email}</p>
            <p className="text-xs text-gray-500">{order.data_customer?.no_telp}</p>
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-1">Tanggal Pesanan</label>
            <p className="font-bold text-gray-900">
              {new Date(order.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {/* Ringkasan Pembayaran — full width, below tanggal */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
          <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em]">Ringkasan Pembayaran</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tagihan</p>
              <p className="text-sm font-black text-gray-900">Rp {parseFloat(order.tagihan).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Menunggu</p>
              <p className="text-sm font-black text-amber-600">Rp {parseFloat(order.menunggu_persetujuan).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dibayar</p>
              <p className="text-sm font-black text-green-600">Rp {parseFloat(order.sudah_dibayar).toLocaleString('id-ID')}</p>
            </div>
          </div>

          {(role === 'Marketing' || role === 'SuperAdmin' || role === 'CEO') && !isCompletedOrCancelled && parseFloat(order.tagihan) > 0 && (
            <Button type="button" variant="secondary" onClick={() => setIsPaymentModalOpen(true)} className="w-full text-xs py-2">
              + Input Pembayaran
            </Button>
          )}

          {order.log_pembayaran && order.log_pembayaran.length > 0 && (
            <div className="pt-3 border-t border-gray-200 space-y-2 max-h-48 overflow-y-auto pr-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Log Pembayaran</label>
              {order.log_pembayaran.map((log: any) => (
                <div key={log.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-900">Rp {parseFloat(log.nominal_pembayaran).toLocaleString('id-ID')}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">via {log.bank_pengirim} ({log.nama_pengirim || '-'})</p>
                      <p className="text-[8px] text-gray-400 font-semibold italic">Input oleh: {log.created_by_name || 'Sistem'}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                      log.status === 'Diterima' ? 'bg-green-100 text-green-700' : 
                      log.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {log.status === 'Menunggu Verifikasi' ? 'WAITING' : log.status}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium italic">
                    {new Date(log.created_at).toLocaleDateString('id-ID')} — {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {log.status !== 'Menunggu Verifikasi' && (
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">
                        {log.status === 'Diterima' ? 'Verified by:' : 'Rejected by:'} 
                        <span className="text-[#1a8245] ml-1">{log.verified_by_name || 'Staff Finance'}</span>
                      </p>
                      {log.catatan_verifikasi && (
                        <p className="text-[10px] text-gray-600 italic leading-relaxed">"{log.catatan_verifikasi}"</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Item Investasi</label>
          <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
            {order.daftar_invest?.map((item: any) => (
              <div key={item.id_invest} className="flex justify-between items-center bg-white p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-sm text-gray-900">{item.nama_paket}</p>
                  <p className="text-[10px] text-gray-400 font-medium italic">
                    {item.id_invest} — {item.jenis} — {item.berat}kg @ Rp {parseFloat(item.harga_sapi).toLocaleString('id-ID')}
                  </p>
                  <p className="text-[9px] text-[#1a8245] font-bold">ROI: {item.roi_persen}% — Est. Return: Rp {parseFloat(item.harga_jual).toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-gray-900">Rp {parseFloat(item.harga_sapi).toLocaleString('id-ID')}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    item.status_investernak === 'Ongoing' ? 'bg-amber-100 text-amber-700' : 
                    item.status_investernak === 'Open' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status_investernak}
                  </span>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Status Pesanan</label>
          <select
            value={statusPesanan}
            onChange={(e) => setStatusPesanan(e.target.value)}
            disabled={isCompletedOrCancelled || role === 'Finance'}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-bold text-sm transition-all ${
              (isCompletedOrCancelled || role === 'Finance') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-[#1a8245]'
            }`}
          >
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          {statusPesanan === 'Selesai' && order.status_pesanan !== 'Selesai' && (
            <p className="text-[10px] text-amber-600 mt-2 font-bold uppercase tracking-wider">
              * Validasi: Tagihan harus 0 dan tidak ada pembayaran tertunda.
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Catatan</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            disabled={isCompletedOrCancelled || role === 'Finance'}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-semibold text-sm transition-all h-24 resize-none ${
              (isCompletedOrCancelled || role === 'Finance') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-[#1a8245]'
            }`}
            placeholder="Catatan pesanan..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {isCompletedOrCancelled || role === 'Finance' ? "Tutup" : "Batal"}
          </Button>
          {(role === 'Marketing' || role === 'SuperAdmin' || role === 'CEO') && !isCompletedOrCancelled && (
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Update Status"}
            </Button>
          )}
        </div>
      </form>

      <PaymentUpdateModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={order}
        orderType="pesananinvest"



        onSuccess={() => {
          onSuccess();
          setIsPaymentModalOpen(false);
          onClose(); // Optional: Close detail modal as well to refresh the list easily
        }}
      />
    </Modal>
  );
}
