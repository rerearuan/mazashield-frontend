import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/order.service";
import toast from "react-hot-toast";

export interface OrderItemInvest {
    id_invest: string;
    nama_paket: string;
    jenis: string;
    berat: string | null;
    harga_sapi: string;
    harga_jual: string;
    roi_persen: string;
    status_investernak: "Open" | "Ongoing" | "Closed";
}

export interface PesananInvest {
    id_pesanan: number;
    data_customer: {
        nama: string;
        no_telp: string;
        email: string;
    };
    daftar_invest: OrderItemInvest[];
    total_item: number;
    tagihan: string;
    menunggu_persetujuan: string;
    sudah_dibayar: string;
    status_pesanan: "Processed" | "Confirmed" | "Completed" | "Cancelled";
    catatan: string | null;
    created_at: string;
    updated_at: string | null;
}

export function useInvestOrder() {
    const [orders, setOrders] = useState<PesananInvest[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = { page: currentPage.toString() };
            if (statusFilter !== "all") params.status_pesanan = statusFilter;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const data: any = await orderService.getInvestOrders(params);
            if (data.results !== undefined) {
                setOrders(data.results);
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 10));
            } else {
                setOrders(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
                setTotalPages(1);
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal mengambil data pesanan");
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, startDate, endDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const createOrder = async (payload: { id_customer: number; items: string[]; catatan?: string }) => {
        const data: any = await orderService.createInvestOrder(payload);
        toast.success("Pesanan berhasil dibuat");
        fetchOrders();
        return data;
    };

    const updateOrder = async (id: number, payload: { status_pesanan?: string; catatan?: string }) => {
        const data: any = await orderService.updateInvestOrder(id, payload);
        toast.success("Status pesanan berhasil diperbarui");
        fetchOrders();
        return data;
    };

    return {
        orders,
        loading,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        filters: { statusFilter, setStatusFilter, startDate, setStartDate, endDate, setEndDate },
        fetchOrders,
        createOrder,
        updateOrder,
    };
}
