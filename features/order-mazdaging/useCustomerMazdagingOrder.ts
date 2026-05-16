"use client";

import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/order.service";
import toast from "react-hot-toast";

export interface DagingItem {
    kode_produk: string;
    nama: string;
    berat_pesanan_kg: string;
    harga_per_kg: string;
    subtotal_item: string;
}

export interface CustomerPesananMazdaging {
    id_pesanan: number;
    daftar_item: DagingItem[];
    total_item: number;
    total_harga: string;
    sudah_dibayar: string;
    menunggu_persetujuan: string;
    order_status: "Diproses" | "Selesai" | "Dibatalkan";
    created_at: string;
}

export function useCustomerMazdagingOrder() {
    const [orders, setOrders] = useState<CustomerPesananMazdaging[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchOrders = useCallback(async (page = 1, status = "") => {
        setLoading(true);
        try {
            const params: any = { page: page.toString() };
            if (status) params.status = status;

            const data: any = await orderService.getCustomerMazdagingOrders(params);
            if (data.results) {
                setOrders(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10));
            } else {
                setOrders(Array.isArray(data) ? data : []);
                setTotalPages(1);
            }
        } catch (err: any) {
            if (err?.status === 401) {
                toast.error("Sesi habis, silakan login kembali.");
            } else {
                toast.error("Gagal memuat order.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const [statusFilter, setStatusFilter] = useState<string>("");

    useEffect(() => {
        fetchOrders(currentPage, statusFilter);
    }, [currentPage, statusFilter, fetchOrders]);

    return {
        orders,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalCount,
        statusFilter,
        setStatusFilter,
        refetch: () => fetchOrders(currentPage, statusFilter),
    };
}
