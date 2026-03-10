"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/lib/api-client";

const logo = "/images/logoPrimer 1.png";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Request, 2: New Password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Auto-fill from URL if coming from Direct Reset Link
    useEffect(() => {
        const emailParam = searchParams.get("email");
        const tokenParam = searchParams.get("token");
        if (emailParam) setEmail(emailParam);
        if (tokenParam) {
            setToken(tokenParam);
            setStep(2); // Goes directly to New Password step
        }
    }, [searchParams]);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            await authService.forgotPassword({ email });
            setMessage("Link reset password telah dikirim ke email Anda. Silakan cek kotak masuk Anda.");
        } catch (err: any) {
            setError(err.message || "Gagal mengirim permintaan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            await authService.resetPassword({ email, token, new_password: newPassword });
            setMessage("Password berhasil diperbarui. Mengalihkan ke halaman login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Gagal mereset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a8245] to-[#22ad5c] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={logo}
                                alt="PT Mazashi Semuda Farm Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 1 ? "Lupa Password?" : "Atur Password Baru"}
                        </h1>
                        <p className="text-gray-600">
                            {step === 1
                                ? "Masukkan email Anda untuk menerima link reset password."
                                : "Silakan masukkan password baru untuk akun Anda."
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{message}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none transition"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1a8245] text-white py-3 rounded-lg font-semibold hover:bg-[#22ad5c] disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? "Mengirim..." : "Kirim Link Ke Email"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* Hidden Token & Email (Internal processing) */}
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a8245] focus:border-transparent outline-none transition"
                                    placeholder="Minimal 8 karakter"
                                    required
                                    minLength={8}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1a8245] text-white py-3 rounded-lg font-semibold hover:bg-[#22ad5c] disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? "Memproses..." : "Simpan Password Baru"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center pt-6 border-top border-gray-100">
                        <Link href="/login" className="text-sm text-[#1a8245] hover:underline font-medium">
                            &larr; Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
