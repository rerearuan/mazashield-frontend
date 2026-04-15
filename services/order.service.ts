import { apiFetch } from "@/lib/api-client";

export const orderService = {
<<<<<<< HEAD
    // ── Invest Orders ──────────────────────────────────────────────────────
    getInvestOrders: (params?: Record<string, string>) =>
        apiFetch("/sales/order/invest/", { method: "GET", params }),

    createInvestOrder: (data: { id_customer: number; items: string[]; catatan?: string }) =>
        apiFetch("/sales/order/invest/", { method: "POST", body: JSON.stringify(data) }),

    updateInvestOrder: (id: number, data: { status_pesanan?: string; catatan?: string }) =>
        apiFetch(`/sales/order/invest/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
=======
    // Mazdafarm Orders
    getMazdafarmOrders: (params?: any) =>
        apiFetch("/sales/order/mazdafarm/", { method: "GET", params }),

    createMazdafarmOrder: (data: any) =>
        apiFetch("/sales/order/mazdafarm/", { method: "POST", body: JSON.stringify(data) }),

    updateMazdafarmOrder: (id: number | string, data: any) =>
        apiFetch(`/sales/order/mazdafarm/${id}/`, { method: "PUT", body: JSON.stringify(data) }),

    deleteMazdafarmOrder: (id: number | string) =>
        apiFetch(`/sales/order/mazdafarm/${id}/`, { method: "DELETE" }),

    // Mazdaging Orders
    getMazdagingOrders: (params?: any) =>
        apiFetch("/sales/order/mazdaging/", { method: "GET", params }),

    createMazdagingOrder: (data: any) =>
        apiFetch("/sales/order/mazdaging/", { method: "POST", body: JSON.stringify(data) }),

    updateMazdagingOrder: (id: number | string, data: any) =>
        apiFetch(`/sales/order/mazdaging/${id}/`, { method: "PUT", body: JSON.stringify(data) }),

    deleteMazdagingOrder: (id: number | string) =>
        apiFetch(`/sales/order/mazdaging/${id}/`, { method: "DELETE" }),
>>>>>>> 2897cfe10f206950c5ffb74356ed6687fd216894
};
