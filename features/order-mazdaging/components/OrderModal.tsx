"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { userService } from "@/services/user.service";
import { catalogService } from "@/services/catalog.service";
import { orderService } from "@/services/order.service";
import { toast } from "react-hot-toast";
import SearchableSelect from "@/components/common/SearchableSelect";
import { Icons } from "@/components/common/Icons";

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
  const [meatSearch, setMeatSearch] = useState("");

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

  const totalTagihan = selectedItems.reduce((sum: number, item: any) => {
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
      toast.success("Pesanan Daging berhasil dibuat!");
      onSuccess();
      onClose();
      setSelectedCustomerId("");
      setSelectedItems([]);
      setCatatan("");
      setMeatSearch("");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat Pesanan Daging.");

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} title="Buat Pesanan Daging Baru">




      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <SearchableSelect
              label="Customer"
              placeholder="Cari nama atau email customer..."
              items={customers}
              selectedItem={customers.find(c => c.id.toString() === selectedCustomerId)}
              onSelect={(item: any) => setSelectedCustomerId(item.id.toString())}
              displayValue={(item: any) => `${item.nama} (${item.email})`}
              filterFn={(item: any, query: string) => 
                item.nama.toLowerCase().includes(query.toLowerCase()) || 
                item.email.toLowerCase().includes(query.toLowerCase())
              }
              renderItem={(item: any) => (
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{item.nama}</span>
                  <span className="text-[10px] text-gray-400">{item.email}</span>
                </div>
              )}
              required
            />

            <div>
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-3">Pilih Item Daging</label>
              
              <div className="relative mb-3">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                      type="text"
                      placeholder="Cari bagian atau ID daging..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245]/20 font-semibold transition-all"
                      value={meatSearch}
                      onChange={(e) => setMeatSearch(e.target.value)}
                  />
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50 mb-4 transition-all">
                {availableMeat.filter(m => 
                    m.nama.toLowerCase().includes(meatSearch.toLowerCase()) || 
                    m.id_daging.toLowerCase().includes(meatSearch.toLowerCase())
                ).length === 0 ? (
                  <p className="text-center py-6 text-gray-400 text-sm font-medium italic">Produk tidak ditemukan.</p>
                ) : (
                  availableMeat
                    .filter(m => 
                        m.nama.toLowerCase().includes(meatSearch.toLowerCase()) || 
                        m.id_daging.toLowerCase().includes(meatSearch.toLowerCase())
                    )
                    .map(m => {
                        const isSelected = selectedItems.some(item => item.id_daging === m.id_daging);
                        return (
                            <div 
                              key={m.id_daging}
                              onClick={() => toggleMeat(m)}
                              className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all ${
                                isSelected 
                                ? 'bg-[#1a8245] text-white shadow-lg scale-[1.01]' 
                                : 'bg-white hover:bg-gray-100 border border-transparent shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-green-500'}`} />
                                  <div>
                                    <p className="font-black text-sm">{m.nama}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                      {m.id_daging} — {m.bagian}
                                    </p>
                                  </div>
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
                    <div className="grid gap-3">
                        {selectedItems.map(item => (
                            <div key={item.id_daging} className="flex items-center gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex-1">
                                    <p className="font-black text-sm text-gray-900">{item.nama}</p>
                                    <p className="text-[10px] font-bold text-[#1a8245] uppercase tracking-tighter">Rp {parseFloat(item.harga_per_kg).toLocaleString('id-ID')}/kg</p>
                                </div>
                                <div className="relative w-32">
                                    <input 
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={item.berat_pesanan_kg}
                                        onChange={(e) => updateWeight(item.id_daging, e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-black text-sm focus:ring-2 focus:ring-[#1a8245] text-center"
                                        required
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400 uppercase">KG</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-2">Catatan (Opsional)</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1a8245] outline-none font-semibold text-sm transition-all h-28 resize-none shadow-inner"
                placeholder="Tambahkan catatan jika ada..."
              />
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-[#1a8245]/5 rounded-[24px] border border-green-100 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] font-black text-green-800 uppercase tracking-widest opacity-70">Total Item</span>
                   <span className="font-black text-green-900 text-sm tracking-tight">{selectedItems.length} Produk</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#1a8245]/10">
                  <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Total Tagihan</span>
                  <span className="text-2xl font-black text-green-900 tracking-tighter leading-none">
                    <span className="text-xs mr-1">Rp</span>
                    {totalTagihan.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="secondary" onClick={onClose} disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8">
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 shadow-lg shadow-green-100">
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
