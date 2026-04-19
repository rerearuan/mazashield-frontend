


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
      await orderService.updateMazdafarmOrder(order.id_pesanan, {
        status_pesanan: statusPesanan,
        catatan: catatan
      });
      toast.success("Pesanan Ternak berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui Pesanan Ternak.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} title={`Detail Pesanan Ternak #${order.id_pesanan}`}>




      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-1">Customer</label>
              <p className="font-bold text-gray-900">{order.data_customer?.nama}</p>
              <p className="text-xs text-gray-500">{order.data_customer?.email}</p>
              <p className="text-xs text-gray-500">{order.data_customer?.no_telp}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-1">Tanggal Pesanan</label>
              <p className="font-bold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('id-ID', { 
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-1">Ringkasan Pembayaran</label>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Tagihan:</span>
                  <span className="font-black text-gray-900">Rp {parseFloat(order.tagihan).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Menunggu:</span>
                  <span className="font-black text-amber-600">Rp {parseFloat(order.menunggu_persetujuan).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Dibayar:</span>
                  <span className="font-black text-green-600">Rp {parseFloat(order.sudah_dibayar).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              {(role === 'Marketing' || role === 'SuperAdmin' || role === 'CEO') && !isCompletedOrCancelled && parseFloat(order.tagihan) > 0 && (
                <div className="mt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsPaymentModalOpen(true)} className="w-full text-xs py-2">
                    + Input Pembayaran
                  </Button>
                </div>
              )}

              {order.log_pembayaran && order.log_pembayaran.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 max-h-48 overflow-y-auto pr-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Log Pembayaran</label>
                  {order.log_pembayaran.map((log: any) => (
                    <div key={log.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black text-gray-900">Rp {parseFloat(log.nominal_pembayaran).toLocaleString('id-ID')}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">via {log.bank_pengirim}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                          log.status === 'Diterima' ? 'bg-green-100 text-green-700' : 
                          log.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {log.status === 'Menunggu Verifikasi' ? 'WAITING' : log.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-medium italic">{new Date(log.created_at).toLocaleDateString('id-ID')} - {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                      {log.catatan_verifikasi && (
                        <div className="pt-2 border-t border-gray-50">
                          <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1 italic">Finance Feedback:</p>
                          <p className="text-[10px] text-gray-600 italic leading-relaxed">"{log.catatan_verifikasi}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Item Ternak</label>
          <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
            {order.daftar_ternak?.map((t: any) => (
              <div key={t.id_ternak} className="flex justify-between items-center bg-white p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-sm text-gray-900">{t.nama}</p>
                  <p className="text-[10px] text-gray-400 font-medium italic">{t.id_ternak} — {t.berat}kg (Berat Pesanan: 1kg)</p>
                </div>
                <p className="font-black text-sm text-gray-900">Rp {parseFloat(t.harga).toLocaleString('id-ID')}</p>
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
        orderType="pesananternak"



        onSuccess={() => {
          onSuccess();
          setIsPaymentModalOpen(false);
          onClose(); // Optional: Close detail modal as well to refresh the list easily
        }}
      />
    </Modal>
  );
}
