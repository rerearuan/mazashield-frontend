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

    // Invest Orders
    getInvestOrders: (params?: any) =>
        apiFetch("/sales/order/invest/", { method: "GET", params }),

    createInvestOrder: (data: any) =>
        apiFetch("/sales/order/invest/", { method: "POST", body: JSON.stringify(data) }),

    updateInvestOrder: (id: number | string, data: any) =>
        apiFetch(`/sales/order/invest/${id}/`, { method: "PUT", body: JSON.stringify(data) }),

    deleteInvestOrder: (id: number | string) =>
        apiFetch(`/sales/order/invest/${id}/`, { method: "DELETE" }),

    // ── Customer External (Read-Only) ─────────────────────────────────────────
    // PBI-External-1: Read Order Mazdafarm untuk Customer yang login
    getCustomerMazdafarmOrders: (params?: Record<string, string>) =>
        apiFetch("/order/mazdafarm/", { method: "GET", params }),

    getCustomerMazdafarmOrderDetail: (id: number | string) =>
        apiFetch(`/order/mazdafarm/${id}/`, { method: "GET" }),

    // PBI-External-2: Read Order Mazdaging untuk Customer yang login
    getCustomerMazdagingOrders: (params?: Record<string, string>) =>
        apiFetch("/order/mazdaging/", { method: "GET", params }),

    getCustomerMazdagingOrderDetail: (id: number | string) =>
        apiFetch(`/order/mazdaging/${id}/`, { method: "GET" }),

    // Payment (PBI-35)
    updatePayment: (id_pesanan: number | string, data: any) =>
        apiFetch(`/sales/payment/${id_pesanan}/update`, { method: "PUT", body: JSON.stringify(data) }),

    // Finance / Verification (PBI-36)
    verifyPayment: (payment_id: number | string, data: any) =>
        apiFetch(`/finance/payment/${payment_id}/verify`, { method: "PUT", body: JSON.stringify(data) }),

    getPaymentHistory: (params?: any) =>
        apiFetch("/sales/payment/history/", { method: "GET", params }),

};

