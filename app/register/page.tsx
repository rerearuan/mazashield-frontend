"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/button";

const logo = "/images/logoPrimer 1.png";

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        nomor_telepon: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        let newErrors: { [key: string]: string } = {};

        // Validation for frontend
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }
        
        if (formData.password.length < 8) {
            newErrors.password = "Password minimal 8 karakter";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password tidak cocok";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const success = await register({
                nama: formData.nama,
                email: formData.email,
                nomor_telepon: formData.nomor_telepon,
                password: formData.password,
            });
            
            if (success) {
                const { toast } = await import("react-hot-toast");
                toast.success("Registrasi berhasil");
                router.push("/login");
            }
        } catch (err: any) {
            const apiErrors: any = {};
            if (err.status === 409 || err.errors?.email?.some((e: string) => e.includes('sudah terdaftar'))) {
                apiErrors.email = "Email sudah terdaftar";
            } else if (err.errors) {
                for (const key in err.errors) {
                    if (Array.isArray(err.errors[key])) {
                        apiErrors[key] = err.errors[key][0];
                    } else {
                        apiErrors[key] = err.errors[key];
                    }
                }
            } else {
                const { toast } = await import("react-hot-toast");
                toast.error(err.message || "Gagal registrasi");
            }
            if (Object.keys(apiErrors).length > 0) {
                setErrors(apiErrors);
            }
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-gray-50/50 border border-gray-100 text-gray-900 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block";
    
    const isFormFilled = formData.nama && formData.email && formData.nomor_telepon && formData.password && formData.confirmPassword;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-primary">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#1a8245]/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#22ad5c]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-[540px] relative z-10 py-10">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white p-10 md:p-14">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-3xl bg-gray-50 mb-6 group hover:scale-105 transition-transform duration-300">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={56}
                                height={56}
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
                            Buat <span className="text-[#1a8245]">Akun</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Mulai langkah investasi Anda bersama Mazashi hari ini.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    placeholder="Masukkan nama lengkap"
                                    className={`${inputClasses} ${errors.nama ? 'border-red-500 bg-red-50/30 ring-red-200' : ''}`}
                                />
                                {errors.nama && <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 block">{errors.nama}</span>}
                            </div>
                            <div>
                                <label className={labelClasses}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@email.com"
                                    className={`${inputClasses} ${errors.email ? 'border-red-500 bg-red-50/30 ring-red-200' : ''}`}
                                />
                                {errors.email && <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 block">{errors.email}</span>}
                            </div>
                            <div>
                                <label className={labelClasses}>Telepon</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nomor_telepon}
                                    onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                                    placeholder="0812xxxx"
                                    className={`${inputClasses} ${errors.nomor_telepon ? 'border-red-500 bg-red-50/30 ring-red-200' : ''}`}
                                />
                                {errors.nomor_telepon && <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 block">{errors.nomor_telepon}</span>}
                            </div>
                            <div>
                                <label className={labelClasses}>Kata Sandi</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className={`${inputClasses} ${errors.password ? 'border-red-500 bg-red-50/30 ring-red-200' : ''}`}
                                />
                                {errors.password && <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 block">{errors.password}</span>}
                            </div>
                            <div>
                                <label className={labelClasses}>Ulangi Sandi</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className={`${inputClasses} ${errors.confirmPassword ? 'border-red-500 bg-red-50/30 ring-red-200' : ''}`}
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 block">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={!isFormFilled || loading}
                            isLoading={loading}
                            className="rounded-[22px] py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-green-100 mt-6 disabled:opacity-50"
                        >
                            Daftar Sekarang
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Sudah memiliki akun?{" "}
                            <Link href="/login" className="text-[#1a8245] font-black hover:opacity-70 transition-opacity">
                                Masuk Disini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
