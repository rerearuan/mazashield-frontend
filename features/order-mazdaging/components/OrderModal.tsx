"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { userService } from "@/services/user.service";
import { catalogService } from "@/services/catalog.service";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectedItem {
  id_daging: string;
  nama: string;
  harga_per_kg: string;
  berat_pesanan_kg: string;
}

export default function OrderModal({ isOpen, onClose, onSuccess }: OrderModalProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [availableMeat, setAvailableMeat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, meatRes] = await Promise.all([
        userService.getUsers("external"),
        catalogService.getDagingInternal()
      ]);
      setCustomers((userRes as any).results || (Array.isArray(userRes) ? userRes : []));
      // Filter meat that are 'Tersedia' or 'Pre Order' and not deleted
      const meatList = (meatRes as any).results || (Array.isArray(meatRes) ? meatRes : []);
      setAvailableMeat(meatList.filter((m: any) => 
        (m.status_daging === 'Tersedia' || m.status_daging === 'Pre Order') && !m.deleted_at
      ));
    } catch (error) {
      toast.error("Gagal mengambil data pendukung.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMeat = (meat: any) => {
    const exists = selectedItems.find(item => item.id_daging === meat.id_daging);
    if (exists) {
      setSelectedItems(selectedItems.filter(item => item.id_daging !== meat.id_daging));
    } else {
      setSelectedItems([...selectedItems, {
        id_daging: meat.id_daging,
        nama: meat.nama,
        harga_per_kg: meat.harga_per_kg,
        berat_pesanan_kg: "1.0",
      }]);
    }
  };

  const updateWeight = (id_daging: string, weight: string) => {
    setSelectedItems(selectedItems.map(item => 
      item.id_daging === id_daging ? { ...item, berat_pesanan_kg: weight } : item
    ));
  };

  const totalTagihan = selectedItems.reduce((sum, item) => {
    const weight = parseFloat(item.berat_pesanan_kg) || 0;
    const price = parseFloat(item.harga_per_kg) || 0;
    return sum + (weight * price);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedItems.length === 0) {
      toast.error("Harap pilih customer dan minimal satu item daging.");
      return;
    }

    // Validate weights
    for (const item of selectedItems) {
        if (parseFloat(item.berat_pesanan_kg) <= 0) {
            toast.error(`Berat untuk ${item.nama} harus lebih dari 0.`);
            return;
        }
    }

    setSubmitting(true);
    try {
      await orderService.createMazdagingOrder({
        id_customer: parseInt(selectedCustomerId),
        items: selectedItems.map(item => ({
            id_daging: item.id_daging,
            berat_pesanan_kg: parseFloat(item.berat_pesanan_kg)
        })),
        catatan: catatan
      });
      toast.success("Pesanan daging berhasil dibuat!");
      onSuccess();
      onClose();
      // Reset form
      setSelectedCustomerId("");
      setSelectedItems([]);
      setCatatan("");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Pesanan Mazdaging Baru">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none font-semibold text-sm transition-all"
                required
              >
                <option value="">Pilih Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.nama} ({c.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Pilih Item Daging</label>
              <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-2 space-y-2 bg-gray-50/50 mb-4">
                {availableMeat.length === 0 ? (
                  <p className="text-center py-4 text-gray-400 text-sm font-medium">Tidak ada daging yang tersedia.</p>
                ) : (
                  availableMeat.map(m => {
                    const isSelected = selectedItems.some(item => item.id_daging === m.id_daging);
                    return (
                        <div 
                          key={m.id_daging}
                          onClick={() => toggleMeat(m)}
                          className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected 
                            ? 'bg-[#1a8245] text-white shadow-md' 
                            : 'bg-white hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm">{m.nama}</p>
                            <p className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                              {m.id_daging} — {m.bagian} — {m.status_daging}
                            </p>
                          </div>
                          <p className="font-black text-xs">Rp {parseFloat(m.harga_per_kg).toLocaleString('id-ID')}/kg</p>
                        </div>
                    );
                  })
                )}
              </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="space-y-3">
                    <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Atur Berat Pesanan (kg)</label>
                    {selectedItems.map(item => (
                        <div key={item.id_daging} className="flex items-center gap-4 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                            <div className="flex-1">
                                <p className="font-bold text-sm text-gray-900">{item.nama}</p>
                                <p className="text-[10px] text-gray-400">Rp {parseFloat(item.harga_per_kg).toLocaleString('id-ID')}/kg</p>
                            </div>
                            <div className="w-32">
                                <input 
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={item.berat_pesanan_kg}
                                    onChange={(e) => updateWeight(item.id_daging, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-[#1a8245]"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Catatan (Opsional)</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none font-semibold text-sm transition-all h-24 resize-none"
                placeholder="Tambahkan catatan jika ada..."
              />
            </div>

            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-black text-green-800 uppercase tracking-widest">Total Item</span>
                 <span className="font-black text-green-900">{selectedItems.length} Produk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-green-800 uppercase tracking-widest">Total Tagihan</span>
                <span className="text-lg font-black text-green-900">Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

