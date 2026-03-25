"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/features/profile/useProfile";
import { Button } from "@/components/button";

export default function AdminProfilePage() {
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
        } catch (err) { }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            const { toast } = await import("react-hot-toast");
            toast.error("Konfirmasi password tidak cocok");
            return;
        }
        try {
            await changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) { }
    };

    const inputClasses = "w-full px-6 py-4 bg-white border border-gray-300 text-gray-900 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none transition-all font-bold placeholder:text-gray-400 shadow-sm hover:border-gray-400";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-[#1a8245] ml-1 mb-2 block";

    if (loading) {
        return (
            <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#1a8245]/20 border-t-[#1a8245] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Memuat Profil...</p>
            </div>
        );
    }

    return (
        <div className="p-10 relative font-primary">
            <div className="mb-12 relative z-10">
                <span className="text-[#1a8245] font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">
                    Pengaturan Akun
                </span>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                    Profil <span className="text-[#1a8245]">Saya</span>
                </h1>
                <p className="text-gray-500 font-medium">
                    Kelola informasi pribadi dan keamanan akun Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Profile Info */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-xl shadow-gray-200/50 border border-white/20 p-10 md:p-14">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#1a8245] rounded-full"></span>
                            Informasi Pribadi
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Alamat Email</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={formData.email}
                                        className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Nomor Telepon</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nomor_telepon}
                                        onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Hak Akses Sistem</label>
                                    <div className="px-6 py-4 bg-green-50/50 border border-green-100 rounded-[20px] text-[#1a8245] font-black text-xs uppercase tracking-widest">
                                        {profile?.role || "User"}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={isUpdating}
                                    className="rounded-2xl px-12 font-black uppercase text-xs tracking-widest shadow-lg shadow-green-100"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security */}
                <div className="space-y-10">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-xl shadow-gray-200/50 border border-white/20 p-10">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
                            Ganti Password
                        </h2>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Password Lama</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.old_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-2">
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
                                Ubah Password
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
