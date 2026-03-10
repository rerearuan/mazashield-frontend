const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const headers = new Headers(init.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (response.status === 204) {
        return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || data.error || data.detail || "Terjadi kesalahan pada server",
            errors: data,
        };
    }

    return data;
}

export const authService = {
    login: (credentials: any) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    register: (data: any) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    logout: (refreshToken: string) => apiFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refresh: refreshToken }) }),
    forgotPassword: (data: { email: string }) => apiFetch("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),
    resetPassword: (data: any) => apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
};

export const userService = {
    getProfile: () => apiFetch("/profile"),
    updateProfile: (data: any) => apiFetch("/profile", { method: "PUT", body: JSON.stringify(data) }),
    changePassword: (data: any) => apiFetch("/profile/change-password", { method: "PUT", body: JSON.stringify(data) }),

    // Admin only
    getUsers: () => apiFetch("/admin/users/list"),
    getUserDetail: (id: string | number) => apiFetch(`/admin/users/${id}`),
    adminCreateUser: (data: any) => apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data) }),
    updateUser: (id: string | number, data: any) => apiFetch(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteUser: (id: string | number) => apiFetch(`/admin/users/${id}/delete`, { method: "DELETE" }),
    exportUsers: (type: string) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        return fetch(`${API_BASE_URL}/admin/users/export?type=${type}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    },
};
