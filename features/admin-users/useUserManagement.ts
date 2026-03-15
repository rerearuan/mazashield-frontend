import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

export function useUserManagement(type: "internal" | "external") {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response: any = await userService.getUsers();
            const data = Array.isArray(response) ? response : (response.results || []);

            const internalRoles = ["SuperAdmin", "Marketing", "Finance", "CEO", "Komisaris"];
            const externalRoles = ["Customer", "Investor"];

            const filteredByType = data.filter((u: any) =>
                type === "internal" ? internalRoles.includes(u.role) : externalRoles.includes(u.role)
            );

            setUsers(filteredByType);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data user");
            toast.error("Gagal mengambil data user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    const createUser = async (formData: any) => {
        try {
            const res: any = await userService.adminCreateUser(formData);
            toast.success("Akun berhasil dibuat!");
            fetchUsers();
            return res.data?.generated_password || res.generated_password;
        } catch (err: any) {
            toast.error(err.message || "Gagal membuat akun");
            throw err;
        }
    };

    const updateUser = async (id: number | string, data: any) => {
        try {
            await userService.updateUser(id, data);
            toast.success("Akun berhasil diperbarui");
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message || "Gagal memperbarui akun");
            throw err;
        }
    };

    const toggleStatus = async (user: any) => {
        try {
            if (user.is_active) {
                await userService.deleteUser(user.id);
                toast.success("Akun dinonaktifkan");
            } else {
                await userService.updateUser(user.id, { is_active: true });
                toast.success("Akun diaktifkan");
            }
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message || "Gagal mengubah status akun");
        }
    };

    const exportData = async () => {
        try {
            const response = await userService.exportUsers(type);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `akun_${type}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            toast.success("Data berhasil diekspor");
        } catch (err) {
            toast.error("Gagal mengekspor data");
        }
    };

    const filteredUsers = users.filter((u: any) => {
        const matchesSearch =
            u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || u.role === filterRole;
        const matchesStatus = filterStatus === "all" || (u.is_active ? "Aktif" : "Nonaktif") === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return {
        users: filteredUsers,
        loading,
        error,
        userRole,
        filters: {
            searchTerm, setSearchTerm,
            filterRole, setFilterRole,
            filterStatus, setFilterStatus,
            currentPage, setCurrentPage
        },
        actions: {
            fetchUsers,
            createUser,
            updateUser,
            toggleStatus,
            exportData
        }
    };
}
