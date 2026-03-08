"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/api-client";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function CustomerProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [errorProfile, setErrorProfile] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [successProfile, setSuccessProfile] = useState("");
    const [successPassword, setSuccessPassword] = useState("");

    const [formData, setFormData] = useState({
        nama: "",
        nomor_telepon: "",
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data: any = await userService.getProfile();
            setProfile(data);
            setFormData({
                nama: data.nama,
                nomor_telepon: data.nomor_telepon,
            });
        } catch (err: any) {
            setErrorProfile("Gagal memuat profil. Silakan login kembali.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdateLoading(true);
        setErrorProfile("");
        setSuccessProfile("");
        try {
            await userService.updateProfile(formData);
            setSuccessProfile("Profil berhasil diperbarui");
            fetchProfile();
        } catch (err: any) {
            setErrorProfile(err.message || "Gagal memperbarui profil");
        } finally {
            setIsUpdateLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrorPassword("Password baru dan konfirmasi tidak cocok");
            return;
        }
        setIsPasswordLoading(true);
        setErrorPassword("");
        setSuccessPassword("");
        try {
            await userService.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            setSuccessPassword("Password berhasil diubah");
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err: any) {
            setErrorPassword(err.message || "Gagal mengubah password");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Saya</h1>
                        <p className="text-gray-600">Kelola informasi data diri dan keamanan akun Anda</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a8245] mx-auto"></div>
                            <p className="mt-4 text-gray-500">Memuat data profil...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Informasi Pribadi</h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-5">
                                    {errorProfile && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{errorProfile}</div>}
                                    {successProfile && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{successProfile}</div>}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                                            value={profile?.email || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                                            value={formData.nomor_telepon}
                                            onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isUpdateLoading}
                                        className="w-full bg-[#1a8245] text-white py-3 rounded-xl font-bold hover:bg-[#156a38] disabled:opacity-50 transition-all shadow-md shadow-green-100"
                                    >
                                        {isUpdateLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Keamanan Akun</h2>
                                <form onSubmit={handleChangePassword} className="space-y-5">
                                    {errorPassword && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{errorPassword}</div>}
                                    {successPassword && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{successPassword}</div>}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password Lama</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a8245] outline-none transition-all"
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading}
                                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:opacity-50 transition-all shadow-md shadow-gray-200"
                                    >
                                        {isPasswordLoading ? "Memproses..." : "Ganti Password"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
