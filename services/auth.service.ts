import { apiFetch } from "@/lib/api-client";

export const authService = {
    login: (credentials: any) =>
        apiFetch("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),

    register: (data: any) =>
        apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),

    logout: (refreshToken: string) =>
        apiFetch("/auth/logout", { method: "POST", body: JSON.stringify({ refresh: refreshToken }) }),

    forgotPassword: (data: { email: string }) =>
        apiFetch("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),

    resetPassword: (data: any) =>
        apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
};
