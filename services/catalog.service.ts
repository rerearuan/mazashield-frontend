import { apiFetch } from "@/lib/api-client";

export const catalogService = {
    // MAZDAFARM - Internal
    getTernakInternal: (params?: any) =>
        apiFetch("/sales/mazdafarm", { method: "GET", params }),

    createTernak: (formData: FormData) =>
        apiFetch("/sales/mazdafarm", { method: "POST", body: formData }),

    updateTernak: (id: number | string, formData: FormData) =>
        apiFetch(`/sales/mazdafarm/${id}`, { method: "PUT", body: formData }),

    deleteTernak: (id: number | string) =>
        apiFetch(`/sales/mazdafarm/${id}`, { method: "DELETE" }),

    // MAZDAGING - Internal
    getDagingInternal: (params?: any) =>
        apiFetch("/sales/mazdaging", { method: "GET", params }),

    createDaging: (formData: FormData) =>
        apiFetch("/sales/mazdaging", { method: "POST", body: formData }),

    updateDaging: (id: number | string, formData: FormData) =>
        apiFetch(`/sales/mazdaging/${id}`, { method: "PUT", body: formData }),

    deleteDaging: (id: number | string) =>
        apiFetch(`/sales/mazdaging/${id}`, { method: "DELETE" }),

    // INVEST TERNAK - Internal
    getInvestInternal: (params?: any) =>
        apiFetch("/sales/invest", { method: "GET", params }),

    createInvest: (formData: FormData) =>
        apiFetch("/sales/invest", { method: "POST", body: formData }),

    updateInvest: (id: number | string, formData: FormData) =>
        apiFetch(`/sales/invest/${id}`, { method: "PUT", body: formData }),

    deleteInvest: (id: number | string) =>
        apiFetch(`/sales/invest/${id}`, { method: "DELETE" }),

    // PUBLIC
    getTernakPublic: (params?: any) =>
        apiFetch("/mazdafarm", { method: "GET", params }),

    getDagingPublic: (params?: any) =>
        apiFetch("/mazdaging", { method: "GET", params }),

    getInvestPublic: (params?: any) =>
        apiFetch("/invest", { method: "GET", params }),
};
