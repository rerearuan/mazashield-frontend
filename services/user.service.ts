import { apiFetch } from "@/lib/api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const userService = {
    getProfile: () =>
        apiFetch("/profile"),

    updateProfile: (data: any) =>
        apiFetch("/profile", { method: "PUT", body: JSON.stringify(data) }),

    changePassword: (data: any) =>
        apiFetch("/profile/change-password", { method: "PUT", body: JSON.stringify(data) }),

    // Admin only
    getUsers: (type?: string) =>
        apiFetch(`/admin/users/list${type ? `?type=${type}` : ''}`),

    getUserDetail: (id: string | number) =>
        apiFetch(`/admin/users/${id}`),

    adminCreateUser: (data: any) =>
        apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data) }),

    updateUser: (id: string | number, data: any) =>
        apiFetch(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    deleteUser: (id: string | number) =>
        apiFetch(`/admin/users/${id}/delete`, { method: "DELETE" }),

    exportUsers: (type: string) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        return fetch(`${API_BASE_URL}/admin/users/export?type=${type}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    },
};
