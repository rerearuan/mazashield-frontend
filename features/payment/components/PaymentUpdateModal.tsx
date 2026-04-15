"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";

interface PaymentUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  orderType: "pesanan" | "pesanandaging" | "pesananinvest";
  onSuccess: () => void;
}

export default function PaymentUpdateModal({ isOpen, onClose, order, orderType, onSuccess }: PaymentUpdateModalProps) {
  const [formData, setFormData] = useState({
    nominal_pembayaran: "",
    bank_pengirim: "",
    nomor_rekening_pengirim: "",
    tanggal_transfer: "",
    waktu_transfer: "",
    catatan: "",
    order_type: orderType,
  });
  const [submitting, setSubmitting] = useState(false);


  if (!order) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (order.status_pesanan === 'Dibatalkan') {
      toast.error("Pesanan sudah dibatalkan, tidak dapat menerima pembayaran.");
      return;
    }

    const nominal = parseFloat(formData.nominal_pembayaran);
    if (!nominal || nominal <= 0) {
      toast.error("Nominal pembayaran harus lebih besar dari 0");
      return;
    }

    if (nominal > parseFloat(order.tagihan)) {
      toast.error("Nominal tidak boleh melebihi sisa tagihan");
      return;
    }

    if (!formData.bank_pengirim || !formData.nomor_rekening_pengirim || !formData.tanggal_transfer || !formData.waktu_transfer) {
      toast.error("Semua field wajib diisi, kecuali catatan.");
      return;
    }

    setSubmitting(true);
    try {
      await orderService.updatePayment(order.id_pesanan, formData);
      toast.success("Pembayaran berhasil diinput dan menunggu persetujuan.");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        nominal_pembayaran: "",
        bank_pengirim: "",
        nomor_rekening_pengirim: "",
        tanggal_transfer: "",
        waktu_transfer: "",
        catatan: "",
        order_type: orderType,
      });

    } catch (error: any) {
      toast.error(error.message || "Gagal menginput pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Input Pembayaran #${order.id_pesanan || order.id}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <span className="block text-[10px] uppercase font-black text-gray-500 tracking-wider">Sisa Tagihan</span>
            <span className="text-lg font-black text-gray-900">Rp {parseFloat(order.tagihan).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex-1">
            <span className="block text-[10px] uppercase font-black text-gray-500 tracking-wider">Sudah Dibayar</span>
            <span className="text-lg font-black text-[#1a8245]">Rp {parseFloat(order.sudah_dibayar).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex-1">
            <span className="block text-[10px] uppercase font-black text-gray-500 tracking-wider">Menunggu Persetujuan</span>
            <span className="text-lg font-black text-amber-500">Rp {parseFloat(order.menunggu_persetujuan).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Nominal Pembayaran</label>
            <input
              type="number"
              name="nominal_pembayaran"
              value={formData.nominal_pembayaran}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm transition-all"
              placeholder="0"
              required
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Bank Pengirim</label>
            <input
              type="text"
              name="bank_pengirim"
              value={formData.bank_pengirim}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm transition-all"
              placeholder="Contoh: BCA, Mandiri"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">No. Rekening Pengirim</label>
            <input
              type="text"
              name="nomor_rekening_pengirim"
              value={formData.nomor_rekening_pengirim}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm transition-all"
              placeholder="Contoh: 1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Tanggal Transfer</label>
            <input
              type="date"
              name="tanggal_transfer"
              value={formData.tanggal_transfer}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Waktu Transfer</label>
            <input
              type="time"
              name="waktu_transfer"
              value={formData.waktu_transfer}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm transition-all"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-[#1a8245] uppercase tracking-[0.2em] mb-2">Catatan (Opsional)</label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245] font-semibold text-sm h-20 resize-none transition-all"
              placeholder="Catatan tambahan pembayaran..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Memproses..." : "Ajukan Pembayaran"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
