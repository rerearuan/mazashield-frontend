

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

export default function OrderModal({ isOpen, onClose, onSuccess }: OrderModalProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [availableCattle, setAvailableCattle] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedCattleIds, setSelectedCattleIds] = useState<string[]>([]);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, cattleRes] = await Promise.all([
        userService.getUsers("external"),
        catalogService.getTernakInternal()
      ]);
      setCustomers((userRes as any).results || (Array.isArray(userRes) ? userRes : []));
      // Filter cattle that are 'Tersedia' and not deleted
      const cattleList = (cattleRes as any).results || (Array.isArray(cattleRes) ? cattleRes : []);
      setAvailableCattle(cattleList.filter((c: any) => c.status_ternak === 'Tersedia' && !c.deleted_at));
    } catch (error) {
      toast.error("Gagal mengambil data pendukung.");
    } finally {
      setLoading(false);
    }
  };

  const totalTagihan = selectedCattleIds.reduce((sum, id) => {
    const cattle = availableCattle.find(c => c.id_ternak === id);
    return sum + (cattle ? parseFloat(cattle.harga) : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedCattleIds.length === 0) {
      toast.error("Harap pilih customer dan minimal satu ternak.");
      return;
    }

    setSubmitting(true);
    try {
      await orderService.createMazdafarmOrder({
        id_customer: parseInt(selectedCustomerId),
        daftar_id_ternak: selectedCattleIds,
        catatan: catatan
      });
      toast.success("Pesanan berhasil dibuat!");
      onSuccess();
      onClose();
      // Reset form
      setSelectedCustomerId("");
      setSelectedCattleIds([]);
      setCatatan("");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCattle = (id: string) => {
    setSelectedCattleIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Pesanan Mazdafarm Baru">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Pilih Ternak (Multi-select)</label>
              <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-2 space-y-2 bg-gray-50/50">
                {availableCattle.length === 0 ? (
                  <p className="text-center py-4 text-gray-400 text-sm font-medium">Tidak ada ternak yang tersedia.</p>
                ) : (
                  availableCattle.map(c => (
                    <div 
                      key={c.id_ternak}
                      onClick={() => toggleCattle(c.id_ternak)}
                      className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCattleIds.includes(c.id_ternak) 
                        ? 'bg-[#1a8245] text-white shadow-md' 
                        : 'bg-white hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm">{c.nama}</p>
                        <p className={`text-[10px] ${selectedCattleIds.includes(c.id_ternak) ? 'text-white/80' : 'text-gray-400'}`}>
                          {c.id_ternak} — {c.jenis} — {c.berat}kg
                        </p>
                      </div>
                      <p className="font-black text-xs">Rp {parseFloat(c.harga).toLocaleString('id-ID')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

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
                <span className="text-xs font-black text-green-800 uppercase tracking-widest">Total Ternak</span>
                <span className="font-black text-green-900">{selectedCattleIds.length} Ekor</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-green-800 uppercase tracking-widest">Total Tagihan</span>
                <span className="text-lg font-black text-green-900">Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-[10px] text-green-600 mt-2 italic">* Berat otomatis dihitung 1 kg per ekor</p>
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
