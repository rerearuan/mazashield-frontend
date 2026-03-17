"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/button/Button";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { InvestTernak } from "../useInvestCatalog";

interface InvestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isEditing: boolean;
    selectedItem: InvestTernak | null;
}

export default function InvestModal({
    isOpen,
    onClose,
    onSuccess,
    isEditing,
    selectedItem,
}: InvestModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_invest: "",
        nama_paket: "",
        jenis: "Sapi",
        berat: "",
        durasi_hari: "120",
        harga_sapi: "",
        biaya_pemeliharaan: "",
        vaksin_vitamin: "",
        fee_marketing: "",
        total_modal: "",
        harga_jual: "",
        keuntungan: "",
        hasil_investor: "",
        roi_persen: "",
        deskripsi: "",
        status_investernak: "Open" as "Open" | "Ongoing" | "Closed",
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEditing && selectedItem) {
            setFormData({
                id_invest: selectedItem.id_invest,
                nama_paket: selectedItem.nama_paket,
                jenis: selectedItem.jenis || "Sapi",
                berat: selectedItem.berat,
                durasi_hari: selectedItem.durasi_hari?.toString() || "120",
                harga_sapi: selectedItem.harga_sapi,
                biaya_pemeliharaan: selectedItem.biaya_pemeliharaan,
                vaksin_vitamin: selectedItem.vaksin_vitamin,
                fee_marketing: selectedItem.fee_marketing,
                total_modal: selectedItem.total_modal,
                harga_jual: selectedItem.harga_jual,
                keuntungan: selectedItem.keuntungan,
                hasil_investor: selectedItem.hasil_investor,
                roi_persen: selectedItem.roi_persen,
                deskripsi: selectedItem.deskripsi,
                status_investernak: selectedItem.status_investernak,
            });
        } else {
            setFormData({
                id_invest: "",
                nama_paket: "",
                jenis: "Sapi",
                berat: "",
                durasi_hari: "120",
                harga_sapi: "",
                biaya_pemeliharaan: "",
                vaksin_vitamin: "",
                fee_marketing: "",
                total_modal: "",
                harga_jual: "",
                keuntungan: "",
                hasil_investor: "",
                roi_persen: "",
                deskripsi: "",
                status_investernak: "Open",
            });
        }
        setUploadFile(null);
    }, [isEditing, selectedItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading(isEditing ? "Memperbarui data..." : "Menambahkan data...");

        try {
            const formDataToSend = new FormData();

            if (!isEditing) {
                formDataToSend.append("id_invest", formData.id_invest);
            }
            formDataToSend.append("nama_paket", formData.nama_paket);
            formDataToSend.append("jenis", formData.jenis);
            formDataToSend.append("berat", formData.berat);
            formDataToSend.append("durasi_hari", formData.durasi_hari);
            formDataToSend.append("harga_sapi", formData.harga_sapi);
            formDataToSend.append("biaya_pemeliharaan", formData.biaya_pemeliharaan);
            formDataToSend.append("vaksin_vitamin", formData.vaksin_vitamin);
            formDataToSend.append("fee_marketing", formData.fee_marketing);
            formDataToSend.append("total_modal", formData.total_modal);
            formDataToSend.append("harga_jual", formData.harga_jual);
            formDataToSend.append("keuntungan", formData.keuntungan);
            formDataToSend.append("hasil_investor", formData.hasil_investor);
            formDataToSend.append("roi_persen", formData.roi_persen);
            formDataToSend.append("deskripsi", formData.deskripsi);
            formDataToSend.append("status_investernak", formData.status_investernak);

            if (uploadFile) {
                formDataToSend.append("foto", uploadFile);
            }

            if (isEditing && selectedItem) {
                await catalogService.updateInvest(selectedItem.id, formDataToSend);
                toast.success("Invest ternak berhasil diperbarui", { id: loadingToast });
            } else {
                await catalogService.createInvest(formDataToSend);
                toast.success("Invest ternak berhasil ditambahkan", { id: loadingToast });
            }

            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Gagal menyimpan data", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Invest Ternak" : "Tambah Invest Baru"}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID Invest (Unik)</label>
                        <input
                            type="text"
                            required
                            disabled={isEditing}
                            value={formData.id_invest}
                            onChange={(e) => setFormData({ ...formData, id_invest: e.target.value })}
                            placeholder="INV-00X"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Paket</label>
                        <input
                            type="text"
                            required
                            value={formData.nama_paket}
                            onChange={(e) => setFormData({ ...formData, nama_paket: e.target.value })}
                            placeholder="Contoh: Paket Sapi Bali B..."
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Jenis</label>
                        <input
                            type="text"
                            required
                            value={formData.jenis}
                            onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Berat (kg)</label>
                        <input
                            type="text"
                            value={formData.berat}
                            onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Durasi (Hari)</label>
                        <input
                            type="number"
                            required
                            value={formData.durasi_hari}
                            onChange={(e) => setFormData({ ...formData, durasi_hari: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Harga Sapi (Rp)</label>
                        <input
                            type="number"
                            required
                            value={formData.harga_sapi}
                            onChange={(e) => setFormData({ ...formData, harga_sapi: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] border-green-200 focus:ring-2 focus:ring-[#1a8245]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pemeliharaan (Rp)</label>
                        <input
                            type="number"
                            value={formData.biaya_pemeliharaan}
                            onChange={(e) => setFormData({ ...formData, biaya_pemeliharaan: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vaksin/Vit (Rp)</label>
                        <input
                            type="number"
                            value={formData.vaksin_vitamin}
                            onChange={(e) => setFormData({ ...formData, vaksin_vitamin: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fee Marketing (Rp)</label>
                        <input
                            type="number"
                            value={formData.fee_marketing}
                            onChange={(e) => setFormData({ ...formData, fee_marketing: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Modal (Rp)</label>
                        <input
                            type="number"
                            value={formData.total_modal}
                            onChange={(e) => setFormData({ ...formData, total_modal: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] font-black text-[#1a8245]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Harga Jual (Rp)</label>
                        <input
                            type="number"
                            value={formData.harga_jual}
                            onChange={(e) => setFormData({ ...formData, harga_jual: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Keuntungan (Rp)</label>
                        <input
                            type="number"
                            value={formData.keuntungan}
                            onChange={(e) => setFormData({ ...formData, keuntungan: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hasil Investor (50%)</label>
                        <input
                            type="number"
                            value={formData.hasil_investor}
                            onChange={(e) => setFormData({ ...formData, hasil_investor: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] font-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ROI (%)</label>
                        <input
                            type="text"
                            value={formData.roi_persen}
                            onChange={(e) => setFormData({ ...formData, roi_persen: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] font-black text-amber-600"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Invest</label>
                        <select
                            required
                            value={formData.status_investernak}
                            onChange={(e) => setFormData({ ...formData, status_investernak: e.target.value as any })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="Open">Open</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="w-full text-xs text-gray-400 bg-gray-50/50 p-3 rounded-[20px] border border-gray-100"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi Paket</label>
                        <textarea
                            rows={2}
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-50">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        size="lg"
                        className="flex-1 rounded-[24px]"
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-[2] rounded-[24px]"
                        isLoading={loading}
                    >
                        {isEditing ? "Simpan Perubahan" : "Konfirmasi & Tambahkan"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
