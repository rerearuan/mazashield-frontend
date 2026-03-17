"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";
import { catalogService } from "@/services/catalog.service";
import toast from "react-hot-toast";
import { Cattle } from "../useCattleCatalog";

interface CattleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isEditing: boolean;
    selectedItem: Cattle | null;
}

export default function CattleModal({
    isOpen,
    onClose,
    onSuccess,
    isEditing,
    selectedItem,
}: CattleModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_ternak: "",
        nama: "",
        jenis: "Sapi",
        kelas: "A",
        berat: "",
        umur: "",
        harga: "",
        deskripsi: "",
        status_ternak: "Tersedia",
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEditing && selectedItem) {
            setFormData({
                id_ternak: selectedItem.id_ternak,
                nama: selectedItem.nama,
                jenis: selectedItem.jenis,
                kelas: selectedItem.kelas,
                berat: selectedItem.berat.toString(),
                umur: selectedItem.umur.toString(),
                harga: selectedItem.harga.toString(),
                deskripsi: selectedItem.deskripsi,
                status_ternak: selectedItem.status_ternak,
            });
        } else {
            setFormData({
                id_ternak: "",
                nama: "",
                jenis: "Sapi",
                kelas: "A",
                berat: "",
                umur: "",
                harga: "",
                deskripsi: "",
                status_ternak: "Tersedia",
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
                // Backend might not allow updating id_ternak
                if (isEditing && key === "id_ternak") return;
                data.append(key, value);
            });

            if (uploadFile) {
                data.append("foto", uploadFile);
            }

            if (isEditing && selectedItem) {
                await catalogService.updateTernak(selectedItem.id, data);
                toast.success("Ternak berhasil diperbarui", { id: loadingToast });
            } else {
                await catalogService.createTernak(data);
                toast.success("Ternak berhasil ditambahkan", { id: loadingToast });
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
            title={isEditing ? "Edit Data Ternak" : "Tambah Unit Ternak Baru"}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID Ternak (Unik)</label>
                        <input
                            type="text"
                            required
                            disabled={isEditing}
                            value={formData.id_ternak}
                            onChange={(e) => setFormData({ ...formData, id_ternak: e.target.value })}
                            placeholder="TR-XXX"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Ternak</label>
                        <input
                            type="text"
                            required
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            placeholder="Contoh: Sapi Limousin Jumbo"
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Jenis</label>
                        <select
                            value={formData.jenis}
                            onChange={(e) => setFormData({ ...formData, jenis: e.target.value as any })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="Sapi">Sapi</option>
                            <option value="Kambing">Kambing</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kelas</label>
                        <select
                            value={formData.kelas}
                            onChange={(e) => setFormData({ ...formData, kelas: e.target.value as any })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="A">Kelas A</option>
                            <option value="B">Kelas B</option>
                            <option value="C">Kelas C</option>
                            <option value="D">Kelas D</option>
                            <option value="E">Kelas E</option>
                            <option value="Patungan">Patungan</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Berat (Kg)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.berat}
                            onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Umur (Bulan)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.umur}
                            onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Harga (Rp)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.harga}
                            onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
                        <select
                            value={formData.status_ternak}
                            onChange={(e) => setFormData({ ...formData, status_ternak: e.target.value as any })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] outline-none transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="Tersedia">Tersedia</option>
                            <option value="Dipesan">Dipesan</option>
                            <option value="Terjual">Terjual</option>
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto Unit</label>
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
