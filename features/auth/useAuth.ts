import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const login = async (credentials: any) => {
        setLoading(true);
        try {
            const data: any = await authService.login(credentials);

            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.nama);

            toast.success(`Selamat datang, ${data.nama}!`);

            if (["SuperAdmin", "Marketing", "Finance", "CEO", "Komisaris"].includes(data.role)) {
                router.push("/admin/manajemen-akun-internal");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            const message = err.status === 401
                ? "Email atau password salah"
                : err.status === 403
                    ? "Akun Anda tidak aktif"
                    : err.message || "Gagal login";
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any) => {
        setLoading(true);
        try {
            await authService.register(userData);
            toast.success("Registrasi berhasil! Silakan login.");
            router.push("/login");
        } catch (err: any) {
            toast.error(err.message || "Gagal registrasi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            try {
                await authService.logout(refreshToken);
            } catch (e) {
                console.error("Logout API error", e);
            }
        }
        localStorage.clear();
        router.push("/login");
        toast.success("Berhasil keluar");
    };

    return {
        loading,
        login,
        register,
        logout,
    };
}
