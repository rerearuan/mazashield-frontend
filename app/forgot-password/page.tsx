"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/button";
import toast from "react-hot-toast";

const logo = "/images/logoPrimer 1.png";

function ForgotPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Request, 2: New Password
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get("email");
        const tokenParam = searchParams.get("token");
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
        if (tokenParam) {
            setToken(tokenParam);
            setStep(2);
        }
    }, [searchParams]);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            toast.success("Link reset password telah dikirim ke email Anda!");
        } catch (err: any) {
            toast.error(err.message || "Gagal mengirim permintaan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Alamat email wajib diisi.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                email,
                token,
                new_password: newPassword
            });
            toast.success("Password baru Anda berhasil disimpan!");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            toast.error(err.message || "Gagal mereset password.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#1a8245] focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block";

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-primary">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1a8245]/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-[480px] relative z-10">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white p-10 md:p-14">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-4 rounded-3xl bg-gray-50 mb-6 group hover:scale-105 transition-transform duration-300">
                            <Image src={logo} alt="Logo" width={64} height={64} className="object-contain" unoptimized />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
                            {step === 1 ? "Lupa" : "Atur"} <span className="text-[#1a8245]">Password</span>
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {step === 1
                                ? "Tenang, kami akan membantu memulihkan akses akun Anda."
                                : "Silakan masukkan kata sandi baru untuk akun Anda."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className={inputClasses}
                                />
                            </div>
                            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} className="rounded-[22px] py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-green-100">
                                Kirim Link Reset
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Konfirmasi Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className={`${inputClasses} bg-gray-100/50`}
                                />
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1">PASTIKAN EMAIL SESUAI DENGAN AKUN ANDA</p>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Konfirmasi Baru</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClasses}
                                />
                            </div>
                            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} className="rounded-[22px] py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-green-100 mt-4">
                                Simpan Password Baru
                            </Button>
                        </form>
                    )}

                    <div className="mt-10 text-center">
                        <Link href="/login" className="text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-[#1a8245] transition-colors">
                            &larr; Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
