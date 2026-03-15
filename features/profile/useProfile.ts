import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

export function useProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err: any) {
            toast.error(err.message || "Gagal mengambil profil");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (data: any) => {
        setIsUpdating(true);
        try {
            await userService.updateProfile(data);
            toast.success("Profil berhasil diperbarui");
            fetchProfile();
        } catch (err: any) {
            toast.error(err.message || "Gagal memperbarui profil");
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    const changePassword = async (data: any) => {
        setIsUpdating(true);
        try {
            await userService.changePassword(data);
            toast.success("Password berhasil diubah");
        } catch (err: any) {
            toast.error(err.message || "Gagal mengubah password");
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        profile,
        loading,
        isUpdating,
        updateProfile,
        changePassword,
        refresh: fetchProfile,
    };
}
