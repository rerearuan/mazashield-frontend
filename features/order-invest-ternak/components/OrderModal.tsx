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
import { generateInvestInvoice } from "@/lib/invoice";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({ isOpen, onClose, onSuccess }: OrderModalProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [availableInvest, setAvailableInvest] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedInvestIds, setSelectedInvestIds] = useState<string[]>([]);
  const [catatan, setCatatan] = useState("");
  const [investSearch, setInvestSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, investRes] = await Promise.all([
        userService.getUsers("external"),
        catalogService.getInvestInternal({ status_investernak: "Open" })
      ]);
      setCustomers((userRes as any).results || (Array.isArray(userRes) ? userRes : []));
      
      const investList = (investRes as any).results || (Array.isArray(investRes) ? investRes : []);
      setAvailableInvest(investList.filter((i: any) => i.status_investernak === 'Open' && !i.deleted_at));
    } catch (error) {
      toast.error("Gagal mengambil data pendukung.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvest = availableInvest.filter(i => 
    i.nama_paket.toLowerCase().includes(investSearch.toLowerCase()) || 
    i.id_invest.toLowerCase().includes(investSearch.toLowerCase())
  );

  const totalTagihan = selectedInvestIds.reduce((sum, id) => {
    const invest = availableInvest.find(i => i.id_invest === id);
    return sum + (invest ? parseFloat(invest.harga_sapi) : 0);
  }, 0);

  const toggleInvest = (id: string) => {
    setSelectedInvestIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedInvestIds.length === 0) {
      toast.error("Harap pilih customer dan minimal satu investasi.");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = await orderService.createInvestOrder({
        id_customer: parseInt(selectedCustomerId),
        items: selectedInvestIds,
        catatan: catatan
      });
      
      const customerInfo = customers.find(c => c.id.toString() === selectedCustomerId);
      const originalInvests = availableInvest.filter(i => selectedInvestIds.includes(i.id_invest));

      try {
          generateInvestInvoice(orderData, customerInfo, originalInvests);
      } catch (err) {
          console.error("Gagal membuat PDF invoice Invest:", err);
          toast.error("Pesanan berhasil, tetapi gagal mengunduh invoice.");
      }

      toast.success("Pesanan Invest berhasil dibuat!");
      onSuccess();
      onClose();
      // Reset form
      setSelectedCustomerId("");
      setSelectedInvestIds([]);
      setCatatan("");
      setInvestSearch("");
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat Pesanan Invest.");

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} title="Buat Pesanan Invest Baru">




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
                <label className="block text-xs font-black text-[#1a8245] uppercase tracking-widest mb-3">Pilih Investasi (Status Open) <span className="text-red-500">*</span></label>
              
              <div className="relative mb-3">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                      type="text"
                      placeholder="Cari nama paket atau ID invest..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1a8245]/20 font-semibold transition-all"
                      value={investSearch}
                      onChange={(e) => setInvestSearch(e.target.value)}
                  />
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50 mb-4 transition-all">
                {filteredInvest.length === 0 ? (
                  <p className="text-center py-6 text-gray-400 text-sm font-medium italic">Paket investasi tidak ditemukan.</p>
                ) : (
                  filteredInvest.map(item => {
                    const isSelected = selectedInvestIds.includes(item.id_invest);
                    return (
                        <div 
                          key={item.id_invest}
                          onClick={() => toggleInvest(item.id_invest)}
                          className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all ${
                            isSelected 
                            ? 'bg-[#1a8245] text-white shadow-lg scale-[1.01]' 
                            : 'bg-white hover:bg-gray-100 border border-transparent shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-green-500'}`} />
                              <div>
                                <p className="font-black text-sm">{item.nama_paket}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                  {item.id_invest} — {item.jenis}
                                </p>
                              </div>
                          </div>
                          <p className="font-black text-xs">Rp {parseFloat(item.harga_sapi).toLocaleString('id-ID')}</p>
                        </div>
                    );
                  })
                )}
              </div>
            </div>

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
                   <span className="font-black text-green-900 text-sm tracking-tight">{selectedInvestIds.length} Paket</span>
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
