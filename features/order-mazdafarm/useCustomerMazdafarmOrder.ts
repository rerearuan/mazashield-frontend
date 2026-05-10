"use client";

import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/order.service";
import toast from "react-hot-toast";

export interface TernakItem {
    nama: string;
    berat: string;
    umur: number;
    harga: string;
    foto: string | null;
}

export interface CustomerPesananMazdafarm {
    id_pesanan: number;
    daftar_ternak: TernakItem[];
    total_item: number;
    tagihan: string;
    menunggu_persetujuan: string;
    sudah_dibayar: string;
    status_pesanan: "Diproses" | "Selesai" | "Dibatalkan";
    created_at: string;
}

export function useCustomerMazdafarmOrder() {
    const [orders, setOrders] = useState<CustomerPesananMazdafarm[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchOrders = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const data: any = await orderService.getCustomerMazdafarmOrders({
                page: page.toString(),
            });
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
                toast.error("Gagal memuat pesanan.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, fetchOrders]);

    return {
        orders,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalCount,
        refetch: () => fetchOrders(currentPage),
    };
}
