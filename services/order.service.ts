import { apiFetch } from "@/lib/api-client";

export const orderService = {
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
};
