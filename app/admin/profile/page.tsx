"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/api-client";

export default function ProfilePage() {
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
            setErrorProfile("Gagal memuat profil");
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

    if (isLoading) return <div className="p-8 text-center">Memuat profil...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi akun dan kata sandi Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Pribadi</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        {errorProfile && <p className="text-red-600 text-sm">{errorProfile}</p>}
                        {successProfile && <p className="text-green-600 text-sm">{successProfile}</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email (Read Only)</label>
                            <input
                                type="text"
                                disabled
                                className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                                value={profile?.email || ""}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role (Read Only)</label>
                            <input
                                type="text"
                                disabled
                                className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                                value={profile?.role || ""}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a8245] focus:border-[#1a8245]"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a8245] focus:border-[#1a8245]"
                                value={formData.nomor_telepon}
                                onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdateLoading}
                            className="w-full bg-[#1a8245] text-white py-2 rounded-lg font-semibold hover:bg-[#22ad5c] disabled:opacity-50 transition-colors"
                        >
                            {isUpdateLoading ? "Menyimpan..." : "Update Profil"}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Ubah Kata Sandi</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {errorPassword && <p className="text-red-600 text-sm">{errorPassword}</p>}
                        {successPassword && <p className="text-green-600 text-sm">{successPassword}</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password Lama</label>
                            <input
                                type="password"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a8245]"
                                value={passwordData.old_password}
                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a8245]"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1a8245]"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                            {isPasswordLoading ? "Mengubah..." : "Ubah Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
