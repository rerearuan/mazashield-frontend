"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/button";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<string | void>;
    isEditing: boolean;
    selectedUser?: any;
    type: "internal" | "external";
    currentUserRole: string | null;
}

export default function UserModal({
    isOpen,
    onClose,
    onSubmit,
    isEditing,
    selectedUser,
    type,
    currentUserRole
}: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        nomor_telepon: "",
        role: type === "internal" ? "Marketing" : "Customer",
    });
    const [generatedPassword, setGeneratedPassword] = useState("");

    useEffect(() => {
        if (isEditing && selectedUser) {
            setFormData({
                nama: selectedUser.nama,
                email: selectedUser.email,
                nomor_telepon: selectedUser.nomor_telepon || "",
                role: selectedUser.role,
            });
        } else {
            setFormData({
                nama: "",
                email: "",
                nomor_telepon: "",
                role: type === "internal" ? "Marketing" : "Customer",
            });
        }
        setGeneratedPassword("");
    }, [isEditing, selectedUser, isOpen]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await onSubmit(formData);
            if (result && typeof result === "string") {
                setGeneratedPassword(result);
            } else if (!isEditing) {
                // Fallback or if password handled elsewhere
            } else {
                onClose();
            }
        } catch (err) {
            // Error handled in parent/hook
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block";

    if (generatedPassword) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Akun Berhasil Dibuat" size="md">
                <div className="space-y-6 text-center py-4">
                    <div className="p-8 bg-green-50 rounded-[32px] border border-green-100">
                        <p className="text-green-800 font-bold mb-4">Berikan password ini kepada pengguna:</p>
                        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-green-200 text-3xl font-black tracking-[0.2em] text-gray-900 select-all">
                            {generatedPassword}
                        </div>
                    </div>
                    <Button variant="primary" fullWidth size="lg" onClick={onClose} className="rounded-2xl">
                        Selesai
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Profil Pengguna" : "Tambah Pengguna Baru"}
            size="lg"
        >
            <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            placeholder="Masukkan nama lengkap"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Alamat Email</label>
                        <input
                            type="email"
                            required
                            disabled={isEditing}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@perusahaan.com"
                            className={`${inputClasses} disabled:opacity-50`}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Nomor Telepon</label>
                        <input
                            type="text"
                            required
                            value={formData.nomor_telepon}
                            onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                            placeholder="08xxxxxxxxxx"
                            className={inputClasses}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Hak Akses (Role)</label>
                        <select
                            value={formData.role}
                            disabled={currentUserRole !== "SuperAdmin" && isEditing}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className={`${inputClasses} appearance-none cursor-pointer disabled:opacity-50`}
                        >
                            {type === "internal" ? (
                                <>
                                    <option value="SuperAdmin">SuperAdmin</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Komisaris">Komisaris</option>
                                </>
                            ) : (
                                <>
                                    <option value="Customer">Customer</option>
                                    <option value="Investor">Investor</option>
                                </>
                            )}
                        </select>
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
                        {isEditing ? "Simpan Perubahan" : "Konfirmasi & Buat Akun"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
