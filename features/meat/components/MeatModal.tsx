"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { Meat } from "../useMeatCatalog";

interface MeatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isEditing: boolean;
    selectedItem: Meat | null;
}

export default function MeatModal({
    isOpen,
    onClose,
    onSuccess,
    isEditing,
    selectedItem,
}: MeatModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_daging: "",
        nama: "",
        bagian: "",
        harga_per_kg: "",
        deskripsi: "",
        status_daging: "Tersedia",
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEditing && selectedItem) {
            setFormData({
                id_daging: selectedItem.id_daging,
                nama: selectedItem.nama,
                bagian: selectedItem.bagian,
                harga_per_kg: selectedItem.harga_per_kg.toString(),
                deskripsi: selectedItem.deskripsi,
                status_daging: selectedItem.status_daging,
            });
        } else {
            setFormData({
                id_daging: "",
                nama: "",
                bagian: "",
                harga_per_kg: "",
                deskripsi: "",
                status_daging: "Tersedia",
            });
        }
        setUploadFile(null);
    }, [isEditing, selectedItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading(isEditing ? "Memperbarui data..." : "Menambahkan data...");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (isEditing && key === "id_daging") return;
                data.append(key, value);
            });

            if (uploadFile) {
                data.append("foto", uploadFile);
            }

            if (isEditing && selectedItem) {
                await catalogService.updateDaging(selectedItem.id, data);
                toast.success("Produk berhasil diperbarui", { id: loadingToast });
            } else {
                await catalogService.createDaging(data);
                toast.success("Produk berhasil ditambahkan", { id: loadingToast });
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
            title={isEditing ? "Edit Data Daging" : "Tambah Daging Baru"}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID Daging (Unik)</label>
                        <input
                            type="text"
                            required
                            disabled={isEditing}
                            value={formData.id_daging}
                            onChange={(e) => setFormData({ ...formData, id_daging: e.target.value })}
                            placeholder="DG-00X"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Produk</label>
                        <input
                            type="text"
                            required
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            placeholder="Contoh: Has Dalam Premium"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bagian Daging</label>
                        <input
                            type="text"
                            required
                            value={formData.bagian}
                            onChange={(e) => setFormData({ ...formData, bagian: e.target.value })}
                            placeholder="Contoh: Has Dalam"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Harga Per Kg (Rp)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.harga_per_kg}
                            onChange={(e) => setFormData({ ...formData, harga_per_kg: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status Produk</label>
                        <select
                            required
                            value={formData.status_daging}
                            onChange={(e) => setFormData({ ...formData, status_daging: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="Tersedia">Tersedia</option>
                            <option value="Terjual">Terjual</option>
                            <option value="Pre Order">Pre Order</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi</label>
                        <textarea
                            rows={3}
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-medium resize-none"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto Produk</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#1a8245] file:text-white hover:file:opacity-90 cursor-pointer bg-gray-50/50 p-2 rounded-[22px] border border-gray-100/50"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
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
