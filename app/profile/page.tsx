"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PageHeader from "@/components/common/PageHeader";
import { useProfile } from "@/features/profile/useProfile";
import { Button } from "@/components/button";
import toast from "react-hot-toast";

export default function PublicProfilePage() {
    const { profile, loading, isUpdating, updateProfile, changePassword } = useProfile();

    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        nomor_telepon: "",
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                nama: profile.nama || "",
                email: profile.email || "",
                nomor_telepon: profile.nomor_telepon || "",
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            toast.success("Profil berhasil diperbarui!");
        } catch (err) {
            // Error managed by hook toast
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }
        try {
            await changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            toast.success("Password berhasil diubah!");
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            // Error managed by hook toast
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none transition-all font-bold placeholder:text-gray-400 shadow-sm hover:border-gray-400";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-[#1a8245] ml-1 mb-2 block";

    return (
        <div className="bg-white min-h-screen font-primary">
            <Navbar />

            <PageHeader
                title="Profil Saya"
                description="Kelola informasi akun dan amankan data Anda di Mazashi."
            />

            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f9fafb]">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Memuat data...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 md:p-12">
                                    <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-[#1a8245] pl-6">Detail Kontak</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className={labelClasses}>Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.nama}
                                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Email</label>
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={formData.email}
                                                    className={`${inputClasses} bg-gray-100/50 grayscale-[0.5] opacity-60 cursor-not-allowed`}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Nomor Telepon</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.nomor_telepon}
                                                    onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4 flex justify-end">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                size="lg"
                                                isLoading={isUpdating}
                                                className="rounded-2xl px-12 font-black uppercase text-xs tracking-widest"
                                            >
                                                Update Profil
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
                                    <h2 className="text-xl font-black text-gray-900 mb-8 border-l-4 border-amber-400 pl-6">Keamanan</h2>
                                    <form onSubmit={handleChangePassword} className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Password Lama</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.old_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Password Baru</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Konfirmasi Baru</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            isLoading={isUpdating}
                                            className="rounded-2xl font-black uppercase text-[10px] tracking-widest"
                                        >
                                            Ganti Password
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
