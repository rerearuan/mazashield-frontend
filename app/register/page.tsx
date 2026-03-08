"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authService } from "@/lib/api-client";

const logo = "/images/logoPrimer 1.png";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        nomor_telepon: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok");
            return;
        }

        setIsLoading(true);
        try {
            await authService.register({
                nama: formData.nama,
                email: formData.email,
                nomor_telepon: formData.nomor_telepon,
                password: formData.password,
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.message || "Gagal melakukan registrasi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a8245] to-[#22ad5c] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                        unoptimized
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Buat Akun Baru</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Daftar untuk mulai berinvestasi dan memesan di Mazashi
                    </p>
                </div>

                {isSuccess ? (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                        <p className="text-green-800 font-semibold text-lg">Registrasi Berhasil!</p>
                        <p className="text-green-700 text-sm mt-1">Anda akan dialihkan ke halaman login sejenak...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1a8245] focus:border-[#1a8245] focus:z-10 sm:text-sm"
                                    placeholder="Nama Lengkap"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1a8245] focus:border-[#1a8245] focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1a8245] focus:border-[#1a8245] focus:z-10 sm:text-sm"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.nomor_telepon}
                                    onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1a8245] focus:border-[#1a8245] focus:z-10 sm:text-sm"
                                    placeholder="Password (min. 8 karakter)"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1a8245] focus:border-[#1a8245] focus:z-10 sm:text-sm"
                                    placeholder="Ulangi Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1a8245] hover:bg-[#22ad5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a8245] disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? "Mendaftar..." : "Daftar"}
                        </button>

                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-600">Sudah punya akun? </span>
                            <Link href="/login" className="text-sm font-medium text-[#1a8245] hover:underline">
                                Login Sekarang
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
